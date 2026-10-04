import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import {
  ensureRecoveryDriveFolder,
  uploadGoogleDriveFile,
} from "@/lib/google-drive";
import {
  isRecoverySameOrigin,
  objectIdPattern,
  recoveryPrivateHeaders,
} from "@/lib/recovery/policy";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: recoveryPrivateHeaders },
    );
  if (!isRecoverySameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ error: "Invalid upload" }, { status: 400 });
  }
  const recoveryId = String(data.get("recoveryId") || "");
  const file = data.get("file");
  if (!objectIdPattern.test(recoveryId) || !(file instanceof File))
    return Response.json({ error: "Invalid upload" }, { status: 400 });
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size < 1 ||
    file.size > 4 * 1024 * 1024
  ) {
    return Response.json(
      {
        error:
          "Use a JPEG, PNG or WebP up to 4 MB, or upload larger originals directly to the recovery Drive folder.",
      },
      { status: 400 },
    );
  }
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id: recoveryId },
    include: { _count: { select: { assets: true } } },
  });
  if (!recovery || recovery.status !== "DRAFT")
    return Response.json(
      { error: "Only drafts accept uploads." },
      { status: 409 },
    );
  try {
    const folderId = await ensureRecoveryDriveFolder({
      recoveryId,
      eventTitle: recovery.eventTitle,
      existingFolderId: recovery.driveFolderId,
    });
    const name =
      file.name
        .replace(/[\\/\u0000-\u001f\u007f]+/g, "-")
        .trim()
        .slice(0, 180) || "photograph.jpg";
    const uploaded = await uploadGoogleDriveFile({
      name,
      mimeType: file.type,
      parentId: folderId,
      body: Buffer.from(await file.arrayBuffer()),
    });
    await prisma.$transaction(async (tx) => {
      const draft = await tx.galleryRecovery.updateMany({
        where: { id: recoveryId, status: "DRAFT" },
        data: { driveFolderId: folderId, updatedAt: new Date() },
      });
      if (!draft.count)
        throw new Error(
          "Recovery was published during upload. The file remains safe in Drive.",
        );
      await tx.recoveryAsset.create({
        data: {
          recoveryId,
          driveFileId: uploaded.id,
          driveMimeType: file.type,
          driveName: name,
          title: name.replace(/\.[^.]+$/, ""),
          sortOrder: recovery._count.assets,
        },
      });
    });
    return Response.json(
      { success: true },
      { headers: recoveryPrivateHeaders },
    );
  } catch {
    return Response.json(
      {
        error:
          "Upload could not be registered. Check the Drive folder and import any uploaded files before retrying.",
      },
      { status: 503 },
    );
  }
}
