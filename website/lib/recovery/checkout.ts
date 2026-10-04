import "server-only";
import { prisma } from "@/prisma/prisma";
import { getStripe } from "@/lib/stripe";
import { getRecoveryFromToken, getRecoveryUrl } from "./access";
import { fulfillRecoverySession } from "./fulfillment";

export async function createRecoveryCheckout(token: string) {
  const recovery = await getRecoveryFromToken(token);
  if (!recovery || !recovery._count.assets)
    throw new Error("Recovery unavailable");
  if (recovery.status === "PAID")
    return { url: getRecoveryUrl(recovery.id, recovery.accessVersion) };
  if (recovery.status !== "READY") throw new Error("Recovery is not ready");
  let order;
  try {
    order = await prisma.recoveryOrder.upsert({
      where: { recoveryId: recovery.id },
      update: {},
      create: {
        recoveryId: recovery.id,
        total: recovery.feeAmount,
        currency: recovery.currency,
        customerEmail: recovery.clientEmail,
      },
    });
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "P2002"
    )
      throw error;
    order = await prisma.recoveryOrder.findUniqueOrThrow({
      where: { recoveryId: recovery.id },
    });
  }
  const stripe = getStripe();
  if (order.stripeCheckoutSessionId) {
    const previous = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId,
    );
    if (previous.payment_status === "paid") {
      await fulfillRecoverySession(previous);
      return { url: getRecoveryUrl(recovery.id, recovery.accessVersion) };
    }
    if (previous.status === "open" && previous.url)
      return { url: previous.url };
    if (previous.status !== "expired")
      throw new Error("Payment is still processing");
    await prisma.recoveryOrder.updateMany({
      where: {
        id: order.id,
        stripeCheckoutSessionId: previous.id,
        checkoutAttempt: order.checkoutAttempt,
        status: { in: ["CHECKOUT_PENDING", "CANCELLED", "FAILED"] },
      },
      data: {
        status: "CREATED",
        stripeCheckoutSessionId: null,
        checkoutAttempt: { increment: 1 },
      },
    });
    order = await prisma.recoveryOrder.findUniqueOrThrow({
      where: { id: order.id },
    });
  }
  // Another request may already have opened the replacement while we retried expiry.
  if (order.status === "CHECKOUT_PENDING" && order.stripeCheckoutSessionId) {
    const active = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId,
    );
    if (active.status === "open" && active.url) return { url: active.url };
    throw new Error("Payment is still processing");
  }
  if (order.status !== "CREATED") throw new Error("Payment is not available");
  const url = getRecoveryUrl(recovery.id, recovery.accessVersion);
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      metadata: {
        orderType: "RECOVERY",
        recoveryOrderId: order.id,
        recoveryId: recovery.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: order.currency,
            unit_amount: order.total,
            product_data: {
              name: `Gallery recovery — ${recovery.eventTitle}`,
              description: `Recovery and re-upload, with ${recovery.accessDays} days of download access after payment.`,
            },
          },
        },
      ],
      success_url: `${url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}?cancelled=1`,
    },
    {
      idempotencyKey: `recovery-checkout-${order.id}-${order.checkoutAttempt}`,
    },
  );
  if (!session.url) throw new Error("Stripe returned no checkout URL");
  await prisma.recoveryOrder.updateMany({
    where: {
      id: order.id,
      status: "CREATED",
      checkoutAttempt: order.checkoutAttempt,
    },
    data: { status: "CHECKOUT_PENDING", stripeCheckoutSessionId: session.id },
  });
  return { url: session.url };
}
