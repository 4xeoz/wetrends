import "server-only";
import { prisma } from "@/prisma/prisma";
import { getAppUrl } from "@/lib/events/access";
import { createMeetingInvitationToken, verifyMeetingInvitationToken } from "./token";

function secret() {
  const value = process.env.EVENT_LINK_SECRET;
  if (!value || value.length < 32) throw new Error("EVENT_LINK_SECRET must contain at least 32 characters");
  return value;
}

export function getMeetingInvitationUrl(id: string, accessVersion: number) {
  return `${getAppUrl()}/book/${createMeetingInvitationToken(id, accessVersion, secret())}`;
}

export async function getMeetingInvitationFromToken(token: string) {
  const claim = verifyMeetingInvitationToken(token, secret());
  if (!claim) return null;
  const invitation = await prisma.meetingInvitation.findUnique({
    where: { id: claim.id },
    include: { slots: true },
  });
  if (!invitation || invitation.status === "VOID" || invitation.accessVersion !== claim.accessVersion) return null;
  return { ...invitation, slot: invitation.slots[0] ?? null };
}
