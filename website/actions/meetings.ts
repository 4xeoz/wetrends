"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getResend } from "@/lib/resend";
import { getMeetingInvitationFromToken, getMeetingInvitationUrl } from "@/lib/meetings/access";
import { prisma } from "@/prisma/prisma";
import EventEmail from "@/emails/event-email";
import MeetingInvitationEmail from "@/emails/meeting-invitation";
import { Prisma } from "@prisma/client";
import { ensureMeetingIndexes, syncMeetingAvailabilitySlots } from "@/lib/meetings/schedule";
import {
  formatMeetingDay,
  formatMeetingTime,
  generateWeeklyMeetingTimes,
  MEETING_DURATIONS,
  MIN_BOOKING_NOTICE_MS,
  parseLondonSlot,
  readWeeklyHours,
} from "@/lib/meetings/time";
import { z } from "zod";

const slotIdPattern = /^[a-f\d]{24}$/i;
const newSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
  durationMinutes: z.number().int(),
});
const bookingSchema = z.object({
  token: z.string().min(1).max(256),
  slotId: z.string().regex(slotIdPattern),
  message: z.string().trim().max(500),
  website: z.string().max(200).optional(),
});
const invitationSchema = z.object({
  clientName: z.string().trim().min(2).max(100),
  clientEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  context: z.string().trim().max(300),
});
const weeklyHoursSchema = z.object({
  weeklyHours: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    enabled: z.boolean(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  })).length(7),
  durationMinutes: z.number().int(),
}).refine(({ weeklyHours }) => new Set(weeklyHours.map((day) => day.dayOfWeek)).size === 7)
  .refine(({ weeklyHours }) => weeklyHours.every((day) => day.startTime < day.endTime));

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Please sign in to manage meeting times.");
}

export async function createMeetingInvitation(input: z.infer<typeof invitationSchema>) {
  await requireAdmin();
  const parsed = invitationSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Enter a client name and valid email." };
  if (!process.env.EVENT_LINK_SECRET || process.env.EVENT_LINK_SECRET.length < 32) {
    return { success: false as const, message: "Private booking links are not configured for this environment." };
  }
  try {
    await syncMeetingAvailabilitySlots();
  } catch {
    return { success: false as const, message: "Could not refresh weekly availability. Please try again." };
  }
  const openCount = await prisma.meetingSlot.count({
    where: { status: "OPEN", startsAt: { gt: new Date(Date.now() + MIN_BOOKING_NOTICE_MS) } },
  });
  if (!openCount) return { success: false as const, message: "Open a meeting time before inviting a client." };
  const invitation = await prisma.meetingInvitation.create({
    data: {
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      context: parsed.data.context || null,
    },
  });
  revalidatePath("/me/meetings");
  return { success: true as const, id: invitation.id, url: getMeetingInvitationUrl(invitation.id, invitation.accessVersion) };
}

export async function sendMeetingInvitationEmail(invitationId: string) {
  await requireAdmin();
  if (!slotIdPattern.test(invitationId)) {
    return { success: false as const, message: "This invitation could not be found." };
  }

  const invitation = await prisma.meetingInvitation.findUnique({
    where: { id: invitationId },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      status: true,
      accessVersion: true,
      invitationEmailSentAt: true,
    },
  });
  if (!invitation || invitation.status !== "OPEN") {
    return { success: false as const, message: "This invitation is no longer open." };
  }

  let url: string;
  try {
    url = getMeetingInvitationUrl(invitation.id, invitation.accessVersion);
  } catch {
    return { success: false as const, message: "Private booking links are not configured for this environment." };
  }

  const from = process.env.RESEND_FROM_EMAIL || "WeTrends <events@wetrends.co.uk>";
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL || "events@wetrends.co.uk";
  const idempotencyKey = `meeting-invite-${invitation.id}-${invitation.accessVersion}-${invitation.invitationEmailSentAt?.getTime() ?? "first"}`;
  try {
    const result = await getResend().emails.send({
      from,
      to: invitation.clientEmail,
      replyTo,
      subject: "Choose a time for your WeTrends call",
      text: `Hi ${invitation.clientName},\n\nWe are looking forward to our call. Choose the day and time that works for you using your private link:\n${url}\n\nTimes are shown in UK time. If you need help, reply to this email.`,
      react: MeetingInvitationEmail({ clientName: invitation.clientName, bookingUrl: url }),
    }, { idempotencyKey });
    if (result.error) throw new Error(result.error.message);
  } catch (error) {
    console.error("[sendMeetingInvitationEmail] provider send failed", error instanceof Error ? error.name : "unknown");
    return { success: false as const, message: "The email could not be sent. Check the invitation and try again." };
  }

  const sentAt = new Date();
  try {
    const recorded = await prisma.meetingInvitation.updateMany({
      where: {
        id: invitation.id,
        status: "OPEN",
        accessVersion: invitation.accessVersion,
        OR: invitation.invitationEmailSentAt === null
          ? [
              { invitationEmailSentAt: null },
              { invitationEmailSentAt: { isSet: false } },
            ]
          : [{ invitationEmailSentAt: invitation.invitationEmailSentAt }],
      },
      data: { invitationEmailSentAt: sentAt },
    });
    if (!recorded.count) {
      const current = await prisma.meetingInvitation.findUnique({
        where: { id: invitation.id },
        select: { status: true, accessVersion: true, invitationEmailSentAt: true },
      });
      if (!current || current.status !== "OPEN" || current.accessVersion !== invitation.accessVersion || !current.invitationEmailSentAt) {
        return { success: false as const, message: "The email was accepted, but its status could not be confirmed. Refresh the page and check before retrying." };
      }
    }
    revalidatePath("/me/meetings");
    return { success: true as const, sentAt: sentAt.toISOString() };
  } catch (error) {
    console.error("[sendMeetingInvitationEmail] send status update failed", error instanceof Error ? error.name : "unknown");
    return { success: false as const, message: "The email was accepted, but its send status could not be saved. Refresh and check before retrying." };
  }
}

export async function saveMeetingAvailability(input: z.infer<typeof weeklyHoursSchema>) {
  await requireAdmin();
  const parsed = weeklyHoursSchema.safeParse(input);
  if (!parsed.success || !MEETING_DURATIONS.some((duration) => duration === parsed.data?.durationMinutes)
    || !readWeeklyHours(parsed.data.weeklyHours)) {
    return { success: false as const, message: "Check each day and time range." };
  }

  try {
    await ensureMeetingIndexes();
    await prisma.meetingAvailability.upsert({
      where: { id: "weekly" },
      create: {
        id: "weekly",
        weeklyHours: parsed.data.weeklyHours as Prisma.InputJsonValue,
        durationMinutes: parsed.data.durationMinutes,
        generatedThrough: null,
      },
      update: {
        weeklyHours: parsed.data.weeklyHours as Prisma.InputJsonValue,
        durationMinutes: parsed.data.durationMinutes,
        generatedThrough: null,
      },
    });
    await syncMeetingAvailabilitySlots(true);
  } catch (error) {
    console.error("[saveMeetingAvailability] schedule update failed", error instanceof Error ? error.name : "unknown");
    return { success: false as const, message: "Could not save the weekly hours. Please try again." };
  }
  revalidatePath("/book");
  revalidatePath("/me/meetings");
  return { success: true as const };
}

export async function revokeMeetingInvitation(invitationId: string) {
  await requireAdmin();
  if (!slotIdPattern.test(invitationId)) return { success: false as const, message: "Invitation not found." };
  const changed = await prisma.meetingInvitation.updateMany({
    where: { id: invitationId, status: "OPEN" },
    data: { status: "VOID", accessVersion: { increment: 1 } },
  });
  if (!changed.count) return { success: false as const, message: "Only unbooked invitations can be revoked." };
  revalidatePath("/me/meetings");
  return { success: true as const };
}

export async function createMeetingSlot(input: z.infer<typeof newSlotSchema>) {
  await requireAdmin();
  const validated = newSlotSchema.safeParse(input);
  if (!validated.success) return { success: false as const, message: "Choose a valid date and time." };
  const parsed = parseLondonSlot(validated.data.date, validated.data.time, validated.data.durationMinutes);
  if ("error" in parsed && parsed.error) return { success: false as const, message: parsed.error };

  const overlapping = await prisma.meetingSlot.findFirst({
    where: {
      status: { in: ["OPEN", "BOOKED"] },
      startsAt: { lt: parsed.endsAt },
      endsAt: { gt: parsed.startsAt },
    },
    select: { id: true },
  });
  if (overlapping) return { success: false as const, message: "This time overlaps another available or booked call." };

  try {
    await prisma.meetingSlot.create({
      data: {
        startsAt: parsed.startsAt,
        endsAt: parsed.endsAt,
        durationMinutes: validated.data.durationMinutes,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false as const, message: "This time already exists. Check the list below before trying again." };
    }
    console.error("[createMeetingSlot] database write failed", error instanceof Error ? error.name : "unknown");
    return { success: false as const, message: "Could not save this time. Please try again." };
  }
  revalidatePath("/book");
  revalidatePath("/me/meetings");
  return { success: true as const };
}

export async function setMeetingSlotOpen(slotId: string, open: boolean) {
  await requireAdmin();
  if (!slotIdPattern.test(slotId) || typeof open !== "boolean") return { success: false as const, message: "Meeting time not found." };
  const slot = await prisma.meetingSlot.findUnique({
    where: { id: slotId },
    select: { startsAt: true, endsAt: true, status: true },
  });
  if (!slot || slot.status === "BOOKED" || slot.startsAt <= new Date()) {
    return { success: false as const, message: "Only future, unbooked times can be changed." };
  }
  if (open) {
    const availability = await prisma.meetingAvailability.findUnique({ where: { id: "weekly" } });
    const weeklyHours = availability && readWeeklyHours(availability.weeklyHours);
    if (weeklyHours && !generateWeeklyMeetingTimes(weeklyHours, availability.durationMinutes).some((candidate) =>
      candidate.startsAt.getTime() === slot.startsAt.getTime())) {
      return { success: false as const, message: "This time is outside the current weekly hours." };
    }
    const overlapping = await prisma.meetingSlot.findFirst({
      where: {
        id: { not: slotId },
        status: { in: ["OPEN", "BOOKED"] },
        startsAt: { lt: slot.endsAt },
        endsAt: { gt: slot.startsAt },
      },
      select: { id: true },
    });
    if (overlapping) return { success: false as const, message: "This time overlaps another available or booked call." };
  }
  const changed = await prisma.meetingSlot.updateMany({
    where: { id: slotId, status: open ? "CLOSED" : "OPEN", startsAt: { gt: new Date() } },
    data: { status: open ? "OPEN" : "CLOSED", manualUnavailable: !open },
  });
  if (!changed.count) return { success: false as const, message: "This time changed. Refresh and try again." };
  revalidatePath("/book");
  revalidatePath("/me/meetings");
  return { success: true as const };
}

async function sendMeetingConfirmation(slot: {
  id: string;
  startsAt: Date;
  durationMinutes: number;
}, name: string, email: string) {
  const day = formatMeetingDay(slot.startsAt);
  const time = formatMeetingTime(slot.startsAt);
  const summary = `${day} at ${time} (UK time), ${slot.durationMinutes} minutes`;
  const from = process.env.RESEND_FROM_EMAIL || "WeTrends <events@wetrends.co.uk>";
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL || "events@wetrends.co.uk";
  const result = await getResend().emails.send({
    from,
    to: email,
    replyTo,
    subject: "Your WeTrends call is booked",
    text: `Hi ${name},\n\nYour call with WeTrends is booked for ${summary}.\n\nWe will send the call link separately. If you need to change the time, reply to this email.\n\nWeTrends`,
    react: EventEmail({
      variant: "transactional",
      preview: `Your WeTrends call is booked for ${day}`,
      eyebrow: "Your call is booked",
      heading: "See you soon.",
      greeting: `Hi ${name},`,
      body: "Your time with WeTrends is reserved. We will send the call link separately.",
      detailLines: [summary],
      actionNote: "Need to change the time? Reply to this email and we will help.",
    }),
  }, { idempotencyKey: `meeting-${slot.id}-confirmation-v1` });
  if (result.error) throw new Error(result.error.message);
  await prisma.meetingSlot.updateMany({
    where: { id: slot.id, status: "BOOKED", clientEmail: email },
    data: { confirmationEmailSentAt: new Date() },
  });
}

export async function bookMeetingSlot(input: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success || parsed.data.website) {
    return { success: false as const, message: "Check your selected time and message." };
  }
  const { token, slotId, message } = parsed.data;
  const invitation = await getMeetingInvitationFromToken(token);
  if (!invitation || invitation.status !== "OPEN") {
    return { success: false as const, message: "This invitation is no longer open for booking." };
  }

  let slot: { id: string; startsAt: Date; endsAt: Date; durationMinutes: number } | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      slot = await prisma.$transaction(async (tx) => {
        const claimedInvitation = await tx.meetingInvitation.updateMany({
          where: { id: invitation.id, status: "OPEN", accessVersion: invitation.accessVersion },
          data: { status: "BOOKED", bookedAt: new Date() },
        });
        if (!claimedInvitation.count) throw new Error("invitation-unavailable");

        const candidate = await tx.meetingSlot.findUnique({
          where: { id: slotId },
          select: { id: true, startsAt: true, endsAt: true, durationMinutes: true },
        });
        if (!candidate) throw new Error("slot-unavailable");
        const claimedSlot = await tx.meetingSlot.updateMany({
          where: {
            id: slotId,
            status: "OPEN",
            startsAt: { gt: new Date(Date.now() + MIN_BOOKING_NOTICE_MS) },
          },
          data: {
            status: "BOOKED",
            invitationId: invitation.id,
            clientName: invitation.clientName,
            clientEmail: invitation.clientEmail,
            clientMessage: message || null,
            bookedAt: new Date(),
          },
        });
        if (!claimedSlot.count) throw new Error("slot-unavailable");
        return candidate;
      });
      break;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt === 0) {
        continue;
      }
      if (error instanceof Error && error.message === "invitation-unavailable") {
        return { success: false as const, message: "This invitation has already been used or revoked." };
      }
      if (error instanceof Error && error.message === "slot-unavailable") {
        return { success: false as const, message: "This time is no longer available. Refresh and choose another." };
      }
      console.error("[bookMeetingSlot] booking transaction failed", error instanceof Error ? error.name : "unknown");
      return { success: false as const, message: "Could not reserve this time. Please try again." };
    }
  }
  if (!slot) return { success: false as const, message: "Could not reserve this time. Please try again." };

  revalidatePath(`/book/${token}`);
  revalidatePath("/me/meetings");
  let emailSent = false;
  try {
    await sendMeetingConfirmation(slot, invitation.clientName, invitation.clientEmail);
    emailSent = true;
  } catch (error) {
    console.error("[bookMeetingSlot] confirmation email failed", error instanceof Error ? error.name : "unknown");
  }
  return {
    success: true as const,
    startsAt: slot.startsAt.toISOString(),
    endsAt: slot.endsAt.toISOString(),
    emailSent,
  };
}
