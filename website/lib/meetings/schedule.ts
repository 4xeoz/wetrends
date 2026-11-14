import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import {
  generateWeeklyMeetingTimes,
  MAX_BOOKING_DAYS,
  readWeeklyHours,
} from "./time";

const BATCH_SIZE = 400;
const REFRESH_WITHIN_DAYS = 30;

const MEETING_INDEX_COMMANDS: Prisma.InputJsonObject[] = [
  {
    createIndexes: "MeetingSlot",
    indexes: [
      { key: { startsAt: 1 }, name: "MeetingSlot_startsAt_key", unique: true },
      { key: { status: 1, startsAt: 1 }, name: "MeetingSlot_status_startsAt_idx" },
      { key: { invitationId: 1 }, name: "MeetingSlot_invitationId_idx" },
    ],
  },
  {
    createIndexes: "MeetingInvitation",
    indexes: [
      { key: { status: 1, createdAt: 1 }, name: "MeetingInvitation_status_createdAt_idx" },
    ],
  },
];

export async function ensureMeetingIndexes() {
  for (const command of MEETING_INDEX_COMMANDS) {
    await prisma.$runCommandRaw(command);
  }
}

function chunks<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function insertMissingSlots(data: Array<{
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
  status: "OPEN";
}>) {
  for (const batch of chunks(data, BATCH_SIZE)) {
    let pending = batch;
    for (let attempt = 0; pending.length && attempt < 3; attempt++) {
      try {
        await prisma.meetingSlot.createMany({ data: pending });
        pending = [];
      } catch (error) {
        if (!isUniqueConflict(error)) throw error;
        const existing = await prisma.meetingSlot.findMany({
          where: { startsAt: { in: pending.map((slot) => slot.startsAt) } },
          select: { startsAt: true },
        });
        const existingTimes = new Set(existing.map((slot) => slot.startsAt.getTime()));
        pending = pending.filter((slot) => !existingTimes.has(slot.startsAt.getTime()));
      }
    }
    if (pending.length) throw new Error("Could not finish generating weekly meeting times.");
  }
}

export async function syncMeetingAvailabilitySlots(force = false) {
  const availability = await prisma.meetingAvailability.findUnique({ where: { id: "weekly" } });
  if (!availability) return;

  const now = new Date();
  const refreshThreshold = new Date(now.getTime() + (MAX_BOOKING_DAYS - REFRESH_WITHIN_DAYS) * 24 * 60 * 60 * 1000);
  if (!force && availability.generatedThrough && availability.generatedThrough > refreshThreshold) return;

  const weeklyHours = readWeeklyHours(availability.weeklyHours);
  if (!weeklyHours) throw new Error("Saved weekly meeting hours are invalid.");
  const desired = generateWeeklyMeetingTimes(weeklyHours, availability.durationMinutes, now);
  const horizonEnd = new Date(now.getTime() + (MAX_BOOKING_DAYS + 1) * 24 * 60 * 60 * 1000);
  const existing = await prisma.meetingSlot.findMany({
    where: { startsAt: { gte: now, lt: horizonEnd } },
    select: { id: true, startsAt: true, endsAt: true, durationMinutes: true, status: true, manualUnavailable: true },
  });
  const booked = existing.filter((slot) => slot.status === "BOOKED");
  const candidates = desired.filter((slot) => !booked.some((reserved) =>
    slot.startsAt < reserved.endsAt && slot.endsAt > reserved.startsAt));
  const candidatesByStart = new Map(candidates.map((slot) => [slot.startsAt.getTime(), slot]));
  const existingByStart = new Map(existing.map((slot) => [slot.startsAt.getTime(), slot]));
  const toCreate: Array<{ startsAt: Date; endsAt: Date; durationMinutes: number; status: "OPEN" }> = [];
  const toRefresh: Array<{ id: string; startsAt: Date; endsAt: Date; durationMinutes: number }> = [];
  const toClose: string[] = [];
  const toClearManualBlock: string[] = [];

  for (const slot of candidates) {
    const saved = existingByStart.get(slot.startsAt.getTime());
    if (!saved) {
      toCreate.push({ ...slot, status: "OPEN" });
    } else if (saved.status !== "BOOKED" && !saved.manualUnavailable
      && (saved.status !== "OPEN" || saved.endsAt.getTime() !== slot.endsAt.getTime()
        || saved.durationMinutes !== slot.durationMinutes)) {
      toRefresh.push({ id: saved.id, ...slot });
    }
  }

  for (const slot of existing) {
    if (candidatesByStart.has(slot.startsAt.getTime())) continue;
    if (slot.status === "OPEN") toClose.push(slot.id);
    else if (slot.status === "CLOSED" && slot.manualUnavailable) toClearManualBlock.push(slot.id);
  }

  for (const batch of chunks(toClose, BATCH_SIZE)) {
    await prisma.meetingSlot.updateMany({
      where: { id: { in: batch }, status: "OPEN" },
      data: { status: "CLOSED", manualUnavailable: false },
    });
  }
  for (const batch of chunks(toClearManualBlock, BATCH_SIZE)) {
    await prisma.meetingSlot.updateMany({
      where: { id: { in: batch }, status: "CLOSED", manualUnavailable: true },
      data: { manualUnavailable: false },
    });
  }
  for (const batch of chunks(toRefresh, 40)) {
    await Promise.all(batch.map((slot) => prisma.meetingSlot.updateMany({
      where: { id: slot.id, status: { in: ["OPEN", "CLOSED"] }, manualUnavailable: false },
      data: { status: "OPEN", endsAt: slot.endsAt, durationMinutes: slot.durationMinutes },
    })));
  }
  await insertMissingSlots(toCreate);
  await prisma.meetingAvailability.update({
    where: { id: "weekly" },
    data: { generatedThrough: horizonEnd },
  });
}
