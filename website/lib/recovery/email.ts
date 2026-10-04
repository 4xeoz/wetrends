import "server-only";
import type { GalleryRecovery } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { sendEventEmail } from "@/lib/events/email";
import { formatMoney } from "@/lib/events/catalog";
import { getRecoveryUrl } from "./access";

export async function sendRecoveryInvitation(recovery: GalleryRecovery) {
  // A new explicit resend gets a new key; retries of one failed send reuse it.
  const previous = await prisma.recoveryEmailLog.findFirst({
    where: { recoveryId: recovery.id, kind: "recovery-ready", status: "sent" },
    orderBy: { createdAt: "desc" },
  });
  return sendEventEmail({
    recoveryId: recovery.id,
    recipient: recovery.clientEmail,
    clientName: recovery.clientName,
    kind: "recovery-ready",
    subject: `Your ${recovery.eventTitle} photographs have been recovered`,
    preview:
      "Your photographs are ready to restore. Review the recovery fee and reopen your gallery.",
    eyebrow: "Gallery recovery",
    heading: "Your photographs are ready again.",
    body: "The original download period has ended. We have located and uploaded your photographs again. The one-time fee below covers this recovery work.",
    detailLines: [
      `Recovery fee: ${formatMoney(recovery.feeAmount, recovery.currency)}`,
      `Download access: ${recovery.accessDays} days from payment`,
    ],
    buttonLabel: "Reopen my gallery",
    buttonUrl: getRecoveryUrl(recovery.id, recovery.accessVersion),
    actionNote:
      "Review the fee before paying. Your photographs unlock after payment.",
    idempotencyKey: `recovery-ready-${recovery.id}-${previous?.id || "first"}`,
  });
}

export async function sendRecoveryPaidEmail(
  recovery: GalleryRecovery,
  resend = false,
) {
  const sent = await prisma.recoveryEmailLog.findFirst({
    where: { recoveryId: recovery.id, kind: "recovery-paid", status: "sent" },
    orderBy: { createdAt: "desc" },
  });
  if (sent && !resend) return { success: true as const };
  if (!recovery.paidAt || !recovery.expiresAt)
    throw new Error("Recovery is not paid");
  return sendEventEmail({
    recoveryId: recovery.id,
    recipient: recovery.clientEmail,
    clientName: recovery.clientName,
    kind: "recovery-paid",
    subject: `Your ${recovery.eventTitle} photographs are ready to download`,
    preview: "Payment received. Your restored photographs are ready.",
    eyebrow: "Gallery restored",
    heading: "Your photographs are yours to keep.",
    body: "Your recovery payment is confirmed. Open your gallery, select your photographs or select all, then download them to your device before the access period ends.",
    detailLines: [
      `Paid: ${formatMoney(recovery.feeAmount, recovery.currency)}`,
      `Available until: ${new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/London" }).format(recovery.expiresAt)} (UK time)`,
    ],
    buttonLabel: "Download my photographs",
    buttonUrl: getRecoveryUrl(recovery.id, recovery.accessVersion),
    actionNote:
      "Save a copy somewhere safe. Your downloaded files remain yours after the link expires.",
    idempotencyKey: `recovery-paid-${recovery.id}${resend && sent ? `-${sent.id}` : ""}`,
  });
}
