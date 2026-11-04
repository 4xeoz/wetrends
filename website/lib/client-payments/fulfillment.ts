import "server-only";
import type { ClientPaymentRequest } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/prisma/prisma";

export function clientPaymentSessionMatches(
  session: Stripe.Checkout.Session,
  payment: ClientPaymentRequest,
) {
  return session.client_reference_id === payment.id &&
    session.metadata?.clientPaymentRequestId === payment.id &&
    session.metadata?.orderType === "CLIENT_PAYMENT" &&
    session.amount_total === payment.total &&
    session.currency?.toLowerCase() === payment.currency &&
    session.customer_email?.toLowerCase() === payment.clientEmail.toLowerCase();
}

export async function fulfillClientPaymentSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid")
    return { fulfilled: false as const, reason: "payment_not_complete" };
  const requestId = session.metadata?.clientPaymentRequestId;
  if (!requestId || session.metadata?.orderType !== "CLIENT_PAYMENT")
    throw new Error("Client payment reference is missing");
  const payment = await prisma.clientPaymentRequest.findUnique({ where: { id: requestId } });
  if (!payment || session.id !== payment.stripeCheckoutSessionId ||
      !clientPaymentSessionMatches(session, payment))
    throw new Error("Client payment does not match the stored request");
  if (payment.status !== "OPEN" && payment.status !== "PAID")
    throw new Error("Client payment request is not open");

  if (payment.status === "OPEN") {
    await prisma.clientPaymentRequest.updateMany({
      where: {
        id: payment.id,
        status: "OPEN",
        stripeCheckoutSessionId: session.id,
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: typeof session.payment_intent === "string"
          ? session.payment_intent : session.payment_intent?.id,
      },
    });
  }
  const current = await prisma.clientPaymentRequest.findUniqueOrThrow({ where: { id: payment.id } });
  if (current.status !== "PAID") throw new Error("Client payment changed during fulfilment");
  return { fulfilled: true as const, paymentId: current.id };
}
