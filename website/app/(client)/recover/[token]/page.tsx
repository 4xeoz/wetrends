import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import { getStripe } from "@/lib/stripe";
import { getRecoveryFromToken } from "@/lib/recovery/access";
import { canDownloadRecovery } from "@/lib/recovery/policy";
import { fulfillRecoverySession } from "@/lib/recovery/fulfillment";
import { formatMoney } from "@/lib/events/catalog";
import RecoveryClient from "@/app/_component/recovery/recovery-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private gallery recovery | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};
export default async function RecoveryPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string; cancelled?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;
  let recovery = await getRecoveryFromToken(token);
  if (!recovery) notFound();
  let paymentNotice: string | undefined;
  if (query.session_id && recovery.status !== "PAID") {
    // Never fulfill a session belonging to a different private delivery.
    if (query.session_id === recovery.order?.stripeCheckoutSessionId) {
      try {
        const result = await fulfillRecoverySession(
          await getStripe().checkout.sessions.retrieve(query.session_id),
        );
        if (!result.fulfilled)
          paymentNotice =
            "Payment has not been confirmed yet. Refresh this page in a moment, or check your payment below.";
      } catch {
        paymentNotice =
          "We’re checking your payment. Refresh in a moment; please contact us before paying again if your card was charged.";
      }
      recovery = await getRecoveryFromToken(token);
      if (!recovery) notFound();
    } else
      paymentNotice =
        "This payment reference does not belong to your gallery. Use the payment button below.";
  } else if (query.cancelled)
    paymentNotice =
      "Payment was cancelled. Your photographs are still here when you’re ready.";
  const unlocked = canDownloadRecovery(recovery);
  const assets = unlocked
    ? await prisma.recoveryAsset.findMany({
        where: { recoveryId: recovery.id },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      })
    : [];
  return (
    <RecoveryClient
      token={token}
      title={recovery.eventTitle}
      clientName={recovery.clientName}
      price={formatMoney(recovery.feeAmount, recovery.currency)}
      count={recovery._count.assets}
      accessDays={recovery.accessDays}
      expiresAt={recovery.expiresAt?.toISOString() || null}
      expired={recovery.status === "PAID" && !unlocked}
      paymentNotice={paymentNotice}
      assets={assets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        url: `/api/recovery/${token}/assets/${asset.id}`,
      }))}
    />
  );
}
