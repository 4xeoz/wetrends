"use server";

import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getClientPaymentUrl } from "@/lib/client-payments/access";
import {
  normalisePaymentItems,
  paymentIdPattern,
  type PaymentItemInput,
} from "@/lib/client-payments/policy";
import { fulfillClientPaymentSession } from "@/lib/client-payments/fulfillment";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Please sign in to manage payments.");
}

const details = z.object({
  clientName: z.string().trim().min(1).max(100),
  clientEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  projectTitle: z.string().trim().min(1).max(160),
  note: z.string().trim().max(1000),
  items: z.array(z.object({
    name: z.string(),
    description: z.string(),
    quantity: z.string(),
    unitPrice: z.string(),
  })).min(1).max(12),
});

export type ClientPaymentFormInput = {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  note: string;
  items: PaymentItemInput[];
};

export async function saveClientPayment(input: ClientPaymentFormInput, paymentId?: string) {
  await requireAdmin();
  const parsed = details.safeParse(input);
  const normalised = parsed.success ? normalisePaymentItems(parsed.data.items) : null;
  if (!parsed.success || !normalised) return {
    error: "Check the client details and 1–12 items. Use GBP amounts with up to two decimal places; the total must be £0.50–£100,000.",
  };
  const data = {
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    projectTitle: parsed.data.projectTitle,
    note: parsed.data.note || null,
    items: normalised.items,
    total: normalised.total,
  };
  if (paymentId) {
    if (!paymentIdPattern.test(paymentId)) return { error: "Payment request not found." };
    const updated = await prisma.clientPaymentRequest.updateMany({
      where: { id: paymentId, status: "DRAFT" }, data,
    });
    if (!updated.count) return { error: "Only drafts can be edited. Create a new request for changed terms." };
  } else {
    const payment = await prisma.clientPaymentRequest.create({ data });
    paymentId = payment.id;
  }
  revalidatePath("/me/payments");
  revalidatePath(`/me/payments/${paymentId}`);
  return { paymentId };
}

export async function publishClientPayment(paymentId: string) {
  await requireAdmin();
  if (!paymentIdPattern.test(paymentId)) return { error: "Payment request not found." };
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    return { error: "Stripe keys are not configured for this environment." };
  if (!process.env.EVENT_LINK_SECRET || process.env.EVENT_LINK_SECRET.length < 32)
    return { error: "Private payment links are not configured for this environment." };
  const updated = await prisma.clientPaymentRequest.updateMany({
    where: { id: paymentId, status: "DRAFT" },
    data: { status: "OPEN", publishedAt: new Date() },
  });
  if (!updated.count) return { error: "Only drafts can be published." };
  const payment = await prisma.clientPaymentRequest.findUniqueOrThrow({ where: { id: paymentId } });
  revalidatePath("/me/payments");
  revalidatePath(`/me/payments/${paymentId}`);
  return { url: getClientPaymentUrl(payment.id, payment.accessVersion) };
}

export async function voidClientPayment(paymentId: string) {
  await requireAdmin();
  if (!paymentIdPattern.test(paymentId)) return { error: "Payment request not found." };
  const payment = await prisma.clientPaymentRequest.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status !== "OPEN") return { error: "Only unpaid, published requests can be voided." };
  if (payment.stripeCheckoutSessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(payment.stripeCheckoutSessionId);
      if (session.payment_status === "paid") {
        await fulfillClientPaymentSession(session);
        return { error: "Payment has already completed. This request cannot be voided." };
      }
      if (session.status === "open") await stripe.checkout.sessions.expire(session.id);
      else if (session.status !== "expired")
        return { error: "Payment is still processing. Check Stripe before voiding." };
    } catch {
      return { error: "Could not verify or close the active Stripe payment. Try again." };
    }
  }
  const updated = await prisma.clientPaymentRequest.updateMany({
    where: { id: paymentId, status: "OPEN" }, data: { status: "VOID" },
  });
  if (!updated.count) return { error: "The payment changed while voiding. Refresh and check its status." };
  revalidatePath("/me/payments");
  revalidatePath(`/me/payments/${paymentId}`);
  return { message: "Payment request voided. The client link now shows that it is unavailable." };
}
