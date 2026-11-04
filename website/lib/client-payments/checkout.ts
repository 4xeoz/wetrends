import "server-only";
import { prisma } from "@/prisma/prisma";
import { getStripe } from "@/lib/stripe";
import { getClientPaymentFromToken, getClientPaymentUrl } from "./access";
import { clientPaymentSessionMatches, fulfillClientPaymentSession } from "./fulfillment";
import { paymentItemsFromJson } from "./policy";

// Bump when Session creation parameters change; Stripe binds a key to its first parameter set.
const checkoutParametersVersion = 2;

export async function createClientPaymentCheckout(token: string) {
  let payment = await getClientPaymentFromToken(token);
  if (!payment || payment.status !== "OPEN") throw new Error("Payment request unavailable");
  const items = paymentItemsFromJson(payment.items);
  if (!items || items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0) !== payment.total)
    throw new Error("Payment request items do not match the total");
  const stripe = getStripe();
  if (payment.stripeCheckoutSessionId) {
    const previous = await stripe.checkout.sessions.retrieve(payment.stripeCheckoutSessionId);
    if (!clientPaymentSessionMatches(previous, payment))
      throw new Error("Stripe checkout does not match the payment request");
    if (previous.payment_status === "paid") {
      await fulfillClientPaymentSession(previous);
      return { paid: true as const };
    }
    if (previous.status === "open" && previous.client_secret)
      return { clientSecret: previous.client_secret };
    if (previous.status !== "expired") throw new Error("Payment is still processing");
    const reset = await prisma.clientPaymentRequest.updateMany({
      where: {
        id: payment.id,
        status: "OPEN",
        stripeCheckoutSessionId: previous.id,
        checkoutAttempt: payment.checkoutAttempt,
      },
      data: {
        stripeCheckoutSessionId: null,
        lastFailedSessionId: previous.id,
        checkoutAttempt: { increment: 1 },
      },
    });
    if (!reset.count) throw new Error("Payment changed. Refresh and try again");
    payment = await prisma.clientPaymentRequest.findUniqueOrThrow({ where: { id: payment.id } });
  }
  if (payment.status !== "OPEN" || payment.stripeCheckoutSessionId)
    throw new Error("Payment is not available");
  const paymentUrl = getClientPaymentUrl(payment.id, payment.accessVersion);
  const returnUrl = `${paymentUrl}/result?session_id={CHECKOUT_SESSION_ID}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded_page",
    redirect_on_completion: "always",
    adaptive_pricing: { enabled: false },
    payment_method_types: ["card"],
    branding_settings: {
      background_color: "#FFFFFF",
      border_style: "rounded",
      button_color: "#C72C5B",
      font_family: "inter",
    },
    customer_email: payment.clientEmail,
    client_reference_id: payment.id,
    metadata: {
      orderType: "CLIENT_PAYMENT",
      clientPaymentRequestId: payment.id,
    },
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: payment.currency,
        unit_amount: item.unitAmount,
        product_data: {
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
        },
      },
    })),
    return_url: returnUrl,
  }, { idempotencyKey: `client-payment-v${checkoutParametersVersion}-${payment.id}-${payment.checkoutAttempt}` });
  if (!clientPaymentSessionMatches(session, payment)) {
    try { await stripe.checkout.sessions.expire(session.id); } catch { /* The session was never shown to the client. */ }
    throw new Error("Stripe checkout does not match the payment request");
  }
  if (!session.client_secret) throw new Error("Stripe returned no embedded Checkout secret");
  const stored = await prisma.clientPaymentRequest.updateMany({
    where: {
      id: payment.id,
      status: "OPEN",
      stripeCheckoutSessionId: null,
      checkoutAttempt: payment.checkoutAttempt,
    },
    data: { stripeCheckoutSessionId: session.id },
  });
  if (!stored.count) {
    const latest = await prisma.clientPaymentRequest.findUnique({ where: { id: payment.id } });
    if (latest?.status !== "OPEN" || latest.stripeCheckoutSessionId !== session.id) {
      try { await stripe.checkout.sessions.expire(session.id); } catch { /* Stripe may have completed it. */ }
      throw new Error("Payment changed. Refresh before paying");
    }
  }
  return { clientSecret: session.client_secret };
}
