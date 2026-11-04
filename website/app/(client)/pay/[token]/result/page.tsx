import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { fulfillClientPaymentSession } from "@/lib/client-payments/fulfillment";
import { paymentReference } from "@/lib/client-payments/policy";
import ClientPaymentOutcome from "@/app/_component/client-payments/payment-outcome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment result | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ClientPaymentResultPage({ params, searchParams }: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { token } = await params;
  const { session_id: sessionId } = await searchParams;
  let payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  let outcome: "success" | "pending" | "failed" | "closed" = payment.status === "PAID" ? "success" : payment.status === "VOID" ? "closed" : "pending";

  if (payment.status === "OPEN" && sessionId) {
    if (sessionId === payment.lastFailedSessionId) outcome = "failed";
    else if (sessionId === payment.stripeCheckoutSessionId) {
      try {
        const session = await getStripe().checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          await fulfillClientPaymentSession(session);
          payment = await getClientPaymentFromToken(token);
          if (!payment) notFound();
          outcome = payment.status === "PAID" ? "success" : "pending";
        } else if (session.status === "expired") outcome = "failed";
      } catch {
        outcome = "pending";
      }
    }
  }

  if (!payment) notFound();
  return <ClientPaymentOutcome token={token} outcome={outcome} title={payment.projectTitle} total={payment.total} reference={paymentReference(payment.id)} />;
}
