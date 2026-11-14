import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma";
import { getMeetingInvitationFromToken } from "@/lib/meetings/access";
import { MIN_BOOKING_NOTICE_MS } from "@/lib/meetings/time";
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
  const slots = invitation.status === "OPEN" ? await prisma.meetingSlot.findMany({
    where: {
      status: "OPEN",
      startsAt: { gt: new Date(Date.now() + MIN_BOOKING_NOTICE_MS) },
    },
    orderBy: { startsAt: "asc" },
    take: 120,
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
