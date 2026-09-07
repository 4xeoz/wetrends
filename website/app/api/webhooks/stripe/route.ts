import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/prisma/prisma';
import { fulfillCheckoutSession } from '@/lib/events/fulfillment';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return Response.json({ error: 'Stripe webhook is not configured.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Stripe signature';
    return Response.json({ error: message }, { status: 400 });
  }

  const existing = await prisma.stripeWebhookEvent.findUnique({ where: { stripeEventId: event.id } });
  if (existing) return Response.json({ received: true, duplicate: true });

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await fulfillCheckoutSession(event.data.object.id);
    } else if (event.type === 'checkout.session.async_payment_failed') {
      const orderId = event.data.object.metadata?.orderId || event.data.object.client_reference_id;
      if (orderId) await prisma.eventOrder.updateMany({ where: { id: orderId, status: 'CHECKOUT_PENDING' }, data: { status: 'FAILED' } });
    } else if (event.type === 'checkout.session.expired') {
      const orderId = event.data.object.metadata?.orderId || event.data.object.client_reference_id;
      if (orderId) await prisma.eventOrder.updateMany({ where: { id: orderId, status: 'CHECKOUT_PENDING' }, data: { status: 'CANCELLED' } });
    }

    await prisma.stripeWebhookEvent.create({
      data: { stripeEventId: event.id, type: event.type },
    });
    return Response.json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook]', error);
    return Response.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
