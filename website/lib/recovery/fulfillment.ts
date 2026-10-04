import "server-only";
import type Stripe from "stripe";
import { prisma } from "@/prisma/prisma";
import { recoveryExpiry } from "./policy";
import { sendRecoveryPaidEmail } from "./email";

export async function fulfillRecoverySession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid")
    return { fulfilled: false as const, reason: "payment_not_complete" };
  const orderId = session.metadata?.recoveryOrderId;
  if (!orderId)
    throw new Error("Recovery checkout is missing an order reference");
  const order = await prisma.recoveryOrder.findUnique({
    where: { id: orderId },
    include: { recovery: true },
  });
  if (
    !order ||
    session.id !== order.stripeCheckoutSessionId ||
    session.client_reference_id !== order.id ||
    session.metadata?.recoveryId !== order.recoveryId ||
    session.metadata?.orderType !== "RECOVERY"
  ) {
    throw new Error("Recovery checkout does not match the stored order");
  }
  if (
    session.amount_total !== order.total ||
    session.currency?.toLowerCase() !== order.currency ||
    session.customer_email?.toLowerCase() !== order.customerEmail.toLowerCase()
  ) {
    throw new Error("Recovery checkout terms do not match the stored order");
  }
  if (order.status !== "PAID" && order.status !== "CHECKOUT_PENDING")
    throw new Error("Recovery order cannot be fulfilled");

  // Compare-and-set and one transaction prevent duplicate webhooks extending access.
  // Mongo write conflicts are retried; no external requests happen inside the transaction.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await prisma.$transaction(async (tx) => {
        const paidAt = new Date();
        const updated = await tx.recoveryOrder.updateMany({
          where: {
            id: order.id,
            status: "CHECKOUT_PENDING",
            stripeCheckoutSessionId: session.id,
          },
          data: {
            status: "PAID",
            paidAt,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
          },
        });
        if (updated.count) {
          const unlocked = await tx.galleryRecovery.updateMany({
            where: { id: order.recoveryId, status: "READY" },
            data: {
              status: "PAID",
              paidAt,
              expiresAt: recoveryExpiry(paidAt, order.recovery.accessDays),
            },
          });
          if (!unlocked.count)
            throw new Error("Recovery is no longer awaiting payment");
        }
      });
      break;
    } catch (error) {
      if (
        attempt === 2 ||
        !error ||
        typeof error !== "object" ||
        !("code" in error) ||
        error.code !== "P2034"
      )
        throw error;
    }
  }
  const recovery = await prisma.galleryRecovery.findUniqueOrThrow({
    where: { id: order.recoveryId },
  });
  // A failed email remains retryable by webhook replay, return page or admin.
  const email = await sendRecoveryPaidEmail(recovery);
  if (!email.success)
    throw new Error(
      "Recovery payment recorded; confirmation email needs retry",
    );
  return { fulfilled: true as const, recoveryId: recovery.id };
}
