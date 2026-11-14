import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { getMeetingInvitationUrl } from "@/lib/meetings/access";
import { MIN_BOOKING_NOTICE_MS, readWeeklyHours } from "@/lib/meetings/time";
import { syncMeetingAvailabilitySlots } from "@/lib/meetings/schedule";
import MeetingAdmin from "@/app/_component/meetings/meeting-admin";

export const dynamic = "force-dynamic";

export default async function MeetingsAdminPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const view = (await searchParams).view === "past" ? "past" : "upcoming";
  const now = new Date();
  try { await syncMeetingAvailabilitySlots(); } catch (error) {
    console.error("[meetings page] availability refresh failed", error instanceof Error ? error.name : "unknown");
  }
  const [slots, invitations, openSlotCount, availability] = await Promise.all([prisma.meetingSlot.findMany({
    where: view === "past" ? { startsAt: { lt: now }, status: "BOOKED" } : {
      startsAt: { gte: now },
      OR: [{ status: { not: "CLOSED" } }, { manualUnavailable: true }],
    },
    orderBy: { startsAt: view === "past" ? "desc" : "asc" },
    take: 150,
    select: {
      id: true, startsAt: true, endsAt: true, durationMinutes: true, status: true,
      clientName: true, clientEmail: true, clientMessage: true, bookedAt: true, confirmationEmailSentAt: true, manualUnavailable: true,
    },
  }), prisma.meetingInvitation.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { slots: { select: { startsAt: true }, take: 1 } },
  }), prisma.meetingSlot.count({ where: { status: "OPEN", startsAt: { gt: new Date(Date.now() + MIN_BOOKING_NOTICE_MS) } } }),
  prisma.meetingAvailability.findUnique({ where: { id: "weekly" } })]);

  return <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#211B1D] sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold tracking-[-.055em] sm:text-5xl">Meeting times</h1>
        </div>
      </div>
      <MeetingAdmin slots={slots.map((slot) => ({
        ...slot,
        startsAt: slot.startsAt.toISOString(),
        endsAt: slot.endsAt.toISOString(),
        bookedAt: slot.bookedAt?.toISOString() ?? null,
        confirmationEmailSentAt: slot.confirmationEmailSentAt?.toISOString() ?? null,
      }))} hasOpenSlots={openSlotCount > 0} availability={availability ? {
        weeklyHours: readWeeklyHours(availability.weeklyHours),
        durationMinutes: availability.durationMinutes,
      } : null} invitations={invitations.map((invitation) => {
        let url: string | null = null;
        if (invitation.status !== "VOID") {
          try { url = getMeetingInvitationUrl(invitation.id, invitation.accessVersion); } catch { /* Keep the admin list visible if signing is misconfigured. */ }
        }
        return {
          id: invitation.id,
          clientName: invitation.clientName,
          clientEmail: invitation.clientEmail,
          status: invitation.status,
          createdAt: invitation.createdAt.toISOString(),
          invitationEmailSentAt: invitation.invitationEmailSentAt?.toISOString() ?? null,
          bookedSlotStartsAt: invitation.slots[0]?.startsAt.toISOString() ?? null,
          url,
        };
      })} view={view} />
    </div>
  </main>;
}
