import 'server-only';
import { prisma } from '@/prisma/prisma';
import { getResend } from '@/lib/resend';
import EventEmail from '@/emails/event-email';

type SendEventEmailInput = {
  eventJobId: string;
  recipient: string;
  clientName: string;
  kind: 'offer' | 'digital-confirmation' | 'gallery-ready' | 'print-confirmation' | 'print-dispatched';
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

    await prisma.eventEmailLog.create({
      data: {
        eventJobId: input.eventJobId,
        kind: input.kind,
        recipient: input.recipient,
        providerId: data?.id,
        status: 'sent',
      },
    });

    return { success: true as const, providerId: data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    await prisma.eventEmailLog.create({
      data: {
        eventJobId: input.eventJobId,
        kind: input.kind,
        recipient: input.recipient,
        status: 'failed',
        errorMessage: message.slice(0, 500),
      },
    });
    return { success: false as const, message };
  }
}
