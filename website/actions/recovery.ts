"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ensureRecoveryDriveFolder,
  listRecoveryDriveImages,
} from "@/lib/google-drive";
import {
  sendRecoveryInvitation,
  sendRecoveryPaidEmail,
} from "@/lib/recovery/email";
import {
  objectIdPattern,
  parseRecoveryFee,
  RECOVERY_ACCESS_DAYS,
} from "@/lib/recovery/policy";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Please sign in to manage recoveries.");
}

const details = z.object({
  clientName: z.string().trim().min(1).max(100),
  clientEmail: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  eventTitle: z.string().trim().min(1).max(160),
  fee: z.string(),
});

export async function saveRecovery(
  input: z.input<typeof details>,
  recoveryId?: string,
  sourceEventJobId?: string,
) {
  await requireAdmin();
  const parsed = details.safeParse(input);
  const feeAmount = parsed.success ? parseRecoveryFee(parsed.data.fee) : null;
  if (!parsed.success || feeAmount === null)
    return {
      error:
        "Enter client details and a fee from £0.50 to £1,000 (up to two decimal places).",
    };
  const { clientName, clientEmail, eventTitle } = parsed.data;
  if (recoveryId) {
    if (!objectIdPattern.test(recoveryId))
      return { error: "Recovery not found." };
    const updated = await prisma.galleryRecovery.updateMany({
      where: { id: recoveryId, status: "DRAFT" },
      data: { clientName, clientEmail, eventTitle, feeAmount },
    });
    if (!updated.count)
      return {
        error:
          "Only drafts can be edited. Create a new recovery for changed terms.",
      };
  } else {
    if (
      sourceEventJobId &&
      (!objectIdPattern.test(sourceEventJobId) ||
        !(await prisma.eventJob.findUnique({
          where: { id: sourceEventJobId },
          select: { id: true },
        })))
    ) {
      return {
        error:
          "The source event was not found. Create a standalone recovery instead.",
      };
    }
    const recovery = await prisma.galleryRecovery.create({
      data: {
        clientName,
        clientEmail,
        eventTitle,
        feeAmount,
        accessDays: RECOVERY_ACCESS_DAYS,
        sourceEventJobId,
      },
    });
    recoveryId = recovery.id;
  }
  revalidatePath("/me/recoveries");
  revalidatePath(`/me/recoveries/${recoveryId}`);
  return { recoveryId };
}

export async function prepareRecoveryDrive(recoveryId: string) {
  await requireAdmin();
  if (!objectIdPattern.test(recoveryId))
    return { error: "Recovery not found." };
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id: recoveryId },
  });
  if (!recovery || recovery.status !== "DRAFT")
    return { error: "Only draft galleries accept uploads." };
  try {
    const folderId = await ensureRecoveryDriveFolder({
      recoveryId,
      eventTitle: recovery.eventTitle,
      existingFolderId: recovery.driveFolderId,
    });
    await prisma.galleryRecovery.update({
      where: { id: recoveryId },
      data: { driveFolderId: folderId },
    });
    revalidatePath(`/me/recoveries/${recoveryId}`);
    return { folderUrl: `https://drive.google.com/drive/folders/${folderId}` };
  } catch {
    return {
      error:
        "Could not prepare the Drive folder. Check the Drive connection and try again.",
    };
  }
}

export async function importRecoveryDrive(recoveryId: string) {
  await requireAdmin();
  if (!objectIdPattern.test(recoveryId))
    return { error: "Recovery not found." };
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id: recoveryId },
    include: { assets: true },
  });
  if (!recovery?.driveFolderId || recovery.status !== "DRAFT")
    return { error: "Prepare a draft Drive folder first." };
  try {
    const files = await listRecoveryDriveImages(recovery.driveFolderId);
    const known = new Set(recovery.assets.map((asset) => asset.driveFileId));
    const added = files.filter((file) => !known.has(file.id));
    // The state check and registrations commit together, so publish cannot race an import.
    await prisma.$transaction(async (tx) => {
      const draft = await tx.galleryRecovery.updateMany({
        where: { id: recoveryId, status: "DRAFT" },
        data: { updatedAt: new Date() },
      });
      if (!draft.count) throw new Error("Recovery is no longer a draft");
      if (added.length)
        await tx.recoveryAsset.createMany({
          data: added.map((file, index) => ({
            recoveryId,
            driveFileId: file.id,
            driveName: file.name || "photograph.jpg",
            driveMimeType: file.mimeType || "image/jpeg",
            title: (file.name || "").replace(/\.[^.]+$/, "") || "Photograph",
            sortOrder: recovery.assets.length + index,
          })),
        });
    });
    revalidatePath(`/me/recoveries/${recoveryId}`);
    return {
      message: `${added.length} ${added.length === 1 ? "photograph" : "photographs"} imported.`,
    };
  } catch {
    return { error: "Drive import failed. Check the folder and try again." };
  }
}

/**
 * Drive does not notify the gallery when an admin adds files manually. This
 * action registers those files for an already-sent recovery without changing
 * its agreed fee or (for paid galleries) its existing expiry.
 */
export async function syncRecoveryDrive(recoveryId: string) {
  await requireAdmin();
  if (!objectIdPattern.test(recoveryId))
    return { error: "Recovery not found." };
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id: recoveryId },
    include: { order: true },
  });
  if (!recovery?.driveFolderId)
    return { error: "Prepare the recovery Drive folder first." };
  if (recovery.status !== "READY" && recovery.status !== "PAID")
    return { error: "Only sent or active paid recoveries can be synced." };
  if (
    recovery.status === "PAID" &&
    (!recovery.expiresAt ||
      recovery.expiresAt <= new Date() ||
      recovery.order?.status !== "PAID")
  ) {
    return {
      error:
        "This recovery has expired or payment is unavailable. Create a new recovery instead.",
    };
  }

  try {
    // Read Drive before opening the transaction; provider calls must not be
    // held inside a database transaction.
    const files = await listRecoveryDriveImages(recovery.driveFolderId);
    let added = 0;

    // A concurrent sync may insert the same Drive IDs. Retry after the unique
    // constraint conflict so repeated or overlapping clicks stay harmless.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        added = await prisma.$transaction(async (tx) => {
          const current = await tx.galleryRecovery.findUnique({
            where: { id: recoveryId },
            include: { order: true },
          });
          if (
            !current ||
            current.driveFolderId !== recovery.driveFolderId ||
            (current.status !== "READY" && current.status !== "PAID")
          ) {
            throw new Error("Recovery is no longer available for syncing");
          }
          if (
            current.status === "PAID" &&
            (!current.expiresAt ||
              current.expiresAt <= new Date() ||
              current.order?.status !== "PAID")
          ) {
            throw new Error("Recovery access has expired");
          }

          const existing = await tx.recoveryAsset.findMany({
            where: { recoveryId },
            select: { driveFileId: true },
          });
          const known = new Set(existing.map((asset) => asset.driveFileId));
          const missing = files.filter((file) => !known.has(file.id));
          if (!missing.length) return 0;

          await tx.recoveryAsset.createMany({
            data: missing.map((file, index) => ({
              recoveryId,
              driveFileId: file.id,
              driveName: file.name || "photograph.jpg",
              driveMimeType: file.mimeType || "image/jpeg",
              title: (file.name || "").replace(/\.[^.]+$/, "") || "Photograph",
              sortOrder: existing.length + index,
            })),
          });
          return missing.length;
        });
        break;
      } catch (error) {
        const uniqueConflict =
          error && typeof error === "object" && "code" in error && error.code === "P2002";
        if (!uniqueConflict || attempt === 1) throw error;
      }
    }

    revalidatePath(`/me/recoveries/${recoveryId}`);
    revalidatePath("/recover/[token]", "page");
    return {
      message: added
        ? `${added} ${added === 1 ? "new photograph" : "new photographs"} added. The fee and access end date are unchanged. Refresh the client gallery to see them.`
        : "No new supported photographs found. Upload JPEG, PNG or WebP files directly into this ticket’s Photographs folder, then sync again.",
    };
  } catch {
    return {
      error:
        "Drive sync failed. Check that the files are JPEG, PNG or WebP images in this ticket’s Photographs folder, then try again.",
    };
  }
}

export async function emailRecovery(recoveryId: string) {
  await requireAdmin();
  if (!objectIdPattern.test(recoveryId))
    return { error: "Recovery not found." };
  let recovery = await prisma.galleryRecovery.findUnique({
    where: { id: recoveryId },
    include: { order: true, _count: { select: { assets: true } } },
  });
  if (!recovery || !recovery._count.assets)
    return {
      error: "Upload or import the recovered photographs before sending.",
    };
  if (
    recovery.status === "PAID" &&
    (!recovery.expiresAt ||
      recovery.expiresAt <= new Date() ||
      recovery.order?.status !== "PAID")
  ) {
    return {
      error:
        "This restored gallery has expired or payment is unavailable. Create a new recovery instead.",
    };
  }
  if (recovery.status === "DRAFT") {
    await prisma.galleryRecovery.updateMany({
      where: { id: recoveryId, status: "DRAFT" },
      data: { status: "READY" },
    });
    recovery = await prisma.galleryRecovery.findUniqueOrThrow({
      where: { id: recoveryId },
      include: { order: true, _count: { select: { assets: true } } },
    });
  }
  const result =
    recovery.status === "PAID"
      ? await sendRecoveryPaidEmail(recovery, true)
      : await sendRecoveryInvitation(recovery);
  if (result.success)
    await prisma.galleryRecovery.update({
      where: { id: recoveryId },
      data: { sentAt: new Date() },
    });
  revalidatePath(`/me/recoveries/${recoveryId}`);
  revalidatePath("/me/recoveries");
  return result.success
    ? {
        message:
          recovery.status === "PAID"
            ? "Gallery email confirmed sent."
            : "Recovery email sent.",
      }
    : {
        error:
          "Email could not be sent. Your photographs are safe; retry below.",
      };
}
