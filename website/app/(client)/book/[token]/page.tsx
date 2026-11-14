import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import { getMeetingInvitationFromToken } from "@/lib/meetings/access";
import { londonDayRange, MIN_BOOKING_NOTICE_MS, readAllowedBookingDates } from "@/lib/meetings/time";
import { syncMeetingAvailabilitySlots } from "@/lib/meetings/schedule";
import MeetingBookingPage from "@/app/_component/meetings/meeting-booking-page";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your call invitation | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function PrivateBookCallPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await getMeetingInvitationFromToken(token);
  if (!invitation) notFound();
  try { await syncMeetingAvailabilitySlots(); } catch (error) {
    console.error("[meeting booking page] availability refresh failed", error instanceof Error ? error.name : "unknown");
  }
  const allowedBookingDates = readAllowedBookingDates(invitation.allowedBookingDates);
  const dateFilter = allowedBookingDates === null ? {} : {
    OR: allowedBookingDates.map((dateKey) => {
      const { start, end } = londonDayRange(dateKey);
      return { startsAt: { gte: start, lt: end } };
    }),
  };
  const slots = invitation.status === "OPEN" ? await prisma.meetingSlot.findMany({
    where: {
      status: "OPEN",
      startsAt: { gt: new Date(Date.now() + MIN_BOOKING_NOTICE_MS) },
      ...dateFilter,
    },
    orderBy: { startsAt: "asc" },
    take: allowedBookingDates === null ? 120 : 3200,
    select: { id: true, startsAt: true, endsAt: true, durationMinutes: true },
  }) : [];

  return <MeetingBookingPage
    token={token}
    slots={slots.map((slot) => ({
      id: slot.id,
      startsAt: slot.startsAt.toISOString(),
      endsAt: slot.endsAt.toISOString(),
      durationMinutes: slot.durationMinutes,
    }))}
    booked={invitation.status === "BOOKED" ? {
      startsAt: invitation.slot?.startsAt.toISOString() ?? null,
      endsAt: invitation.slot?.endsAt.toISOString() ?? null,
      emailSent: Boolean(invitation.slot?.confirmationEmailSentAt),
    } : null}
  />;
}
