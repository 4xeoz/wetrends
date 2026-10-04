import 'server-only';
import { prisma } from '@/prisma/prisma';
import { getResend } from '@/lib/resend';
import EventEmail from '@/emails/event-email';

type SendEventEmailInput = ({ eventJobId: string; recoveryId?: never } | { recoveryId: string; eventJobId?: never }) & {
  recipient: string;
  clientName: string;
  kind: 'offer' | 'digital-confirmation' | 'gallery-ready' | 'print-confirmation' | 'print-dispatched' | 'recovery-ready' | 'recovery-paid';
  subject: string;
  preview: string;
  eyebrow: string;
  heading: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  detailLines?: string[];
  guidanceTitle?: string;
  guidanceSteps?: Array<{
    title: string;
    description: string;
  }>;
  actionNote?: string;
  idempotencyKey: string;
};

async function logEmail(input: SendEventEmailInput, result: { status: string; providerId?: string; errorMessage?: string }) {
  const data = { kind: input.kind, recipient: input.recipient, ...result };
  if (input.recoveryId) {
    await prisma.recoveryEmailLog.create({ data: { recoveryId: input.recoveryId, ...data } });
  } else if (input.eventJobId) {
    await prisma.eventEmailLog.create({ data: { eventJobId: input.eventJobId, ...data } });
  } else {
    throw new Error('Email requires an event or recovery reference');
  }
}

export async function sendEventEmail(input: SendEventEmailInput) {
  const from = process.env.RESEND_FROM_EMAIL || 'WeTrends <events@wetrends.co.uk>';
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL || 'events@wetrends.co.uk';
  const text = [
    input.eyebrow,
    input.heading,
    `Hi ${input.clientName},`,
    input.body,
    ...(input.detailLines ?? []),
    ...(input.guidanceSteps?.length
      ? [
          input.guidanceTitle || 'What happens next',
          ...input.guidanceSteps.map((step, index) => `${index + 1}. ${step.title} — ${step.description}`),
        ]
      : []),
    input.buttonLabel && input.buttonUrl ? `${input.buttonLabel}: ${input.buttonUrl}` : null,
    input.actionNote,
    'Questions? Reply to this email and we’ll help.',
    input.kind === 'offer'
      ? 'Event photography across Surrey and London.\nWeTrends'
      : 'WeTrends',
  ]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join('\n\n');

  try {
    const { data, error } = await getResend().emails.send(
      {
        from,
        to: input.recipient,
        replyTo,
        subject: input.subject,
        text,
        react: EventEmail({
          variant: input.kind === 'offer' ? 'offer' : 'transactional',
          preview: input.preview,
          eyebrow: input.eyebrow,
          heading: input.heading,
          greeting: `Hi ${input.clientName},`,
          body: input.body,
          buttonLabel: input.buttonLabel,
          buttonUrl: input.buttonUrl,
          detailLines: input.detailLines,
          guidanceTitle: input.guidanceTitle,
          guidanceSteps: input.guidanceSteps,
          actionNote: input.actionNote,
        }),
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (error) throw new Error(error.message);

    await logEmail(input, { providerId: data?.id, status: 'sent' });

    return { success: true as const, providerId: data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    await logEmail(input, { status: 'failed', errorMessage: message.slice(0, 500) });
    return { success: false as const, message };
  }
}
