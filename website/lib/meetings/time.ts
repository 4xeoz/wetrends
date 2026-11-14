export const MEETING_TIME_ZONE = "Europe/London";
export const MEETING_DURATIONS = [15, 30, 45, 60] as const;
export const MIN_BOOKING_NOTICE_MS = 60 * 60 * 1000;
export const MAX_BOOKING_DAYS = 180;

export const WEEK_DAYS = [
  { dayOfWeek: 1, label: "Monday" },
  { dayOfWeek: 2, label: "Tuesday" },
  { dayOfWeek: 3, label: "Wednesday" },
  { dayOfWeek: 4, label: "Thursday" },
  { dayOfWeek: 5, label: "Friday" },
  { dayOfWeek: 6, label: "Saturday" },
  { dayOfWeek: 0, label: "Sunday" },
] as const;

export type WeeklyHoursDay = {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export type GeneratedMeetingTime = {
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
};

export function defaultWeeklyHours(): WeeklyHoursDay[] {
  return WEEK_DAYS.map(({ dayOfWeek }) => ({ dayOfWeek, enabled: false, startTime: "09:00", endTime: "17:00" }));
}

export function readWeeklyHours(value: unknown): WeeklyHoursDay[] | null {
  if (!Array.isArray(value) || value.length !== WEEK_DAYS.length) return null;
  const seen = new Set<number>();
  const hours: WeeklyHoursDay[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const day = item as Record<string, unknown>;
    if (!Number.isInteger(day.dayOfWeek) || Number(day.dayOfWeek) < 0 || Number(day.dayOfWeek) > 6
      || typeof day.enabled !== "boolean"
      || typeof day.startTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(day.startTime)
      || typeof day.endTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(day.endTime)
      || day.startTime >= day.endTime) return null;
    const dayOfWeek = Number(day.dayOfWeek);
    if (seen.has(dayOfWeek)) return null;
    seen.add(dayOfWeek);
    hours.push({ dayOfWeek, enabled: day.enabled, startTime: day.startTime, endTime: day.endTime });
  }
  return seen.size === WEEK_DAYS.length ? hours.sort((a, b) => a.dayOfWeek - b.dayOfWeek) : null;
}

function addLondonCalendarDays(dateKey: string, offset: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function weekdayForLondonDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function generateWeeklyMeetingTimes(hours: WeeklyHoursDay[], durationMinutes: number, now = new Date()) {
  const schedule = readWeeklyHours(hours);
  if (!schedule || !MEETING_DURATIONS.some((duration) => duration === durationMinutes)) return [];
  const byDay = new Map(schedule.map((day) => [day.dayOfWeek, day]));
  const times: GeneratedMeetingTime[] = [];
  const firstDay = londonDateKey(now);
  const latestStart = now.getTime() + MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000;

  for (let offset = 0; offset <= MAX_BOOKING_DAYS; offset++) {
    const date = addLondonCalendarDays(firstDay, offset);
    const day = byDay.get(weekdayForLondonDate(date));
    if (!day?.enabled) continue;
    const [startHour, startMinute] = day.startTime.split(":").map(Number);
    const [endHour, endMinute] = day.endTime.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    for (let minute = start; minute + durationMinutes <= end; minute += durationMinutes) {
      const time = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
      const parsed = parseLondonSlot(date, time, durationMinutes, now);
      if ("error" in parsed && parsed.error) continue;
      if (parsed.startsAt.getTime() <= latestStart) times.push({ ...parsed, durationMinutes });
    }
  }
  return times;
}

const ukParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: MEETING_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function partsOf(date: Date) {
  return Object.fromEntries(ukParts.formatToParts(date).map(({ type, value }) => [type, value]));
}

export function londonDateKey(date: Date) {
  const parts = partsOf(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function isValidLondonDateKey(dateKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function readAllowedBookingDates(value: unknown): string[] | null {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value) || !value.every((dateKey) => typeof dateKey === "string" && isValidLondonDateKey(dateKey))) return [];
  return value.length ? value as string[] : null;
}

export function addLondonCalendarMonths(dateKey: string, months: number) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match || !isValidLondonDateKey(dateKey) || !Number.isInteger(months)) throw new Error("Choose a valid London calendar date.");
  const [, yearText, monthText, dayText] = match;
  const monthIndex = Number(yearText) * 12 + Number(monthText) - 1 + months;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonthIndex = ((monthIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(Number(dayText), lastDay);
  return `${targetYear}-${String(targetMonthIndex + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

export function londonDayRange(dateKey: string) {
  if (!isValidLondonDateKey(dateKey)) throw new Error("Choose a valid London calendar date.");
  const [yearText, monthText, dayText] = dateKey.split("-");
  const midnightAsUtc = Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText));
  const midnightCandidates = [0, 1].map((offsetHours) => new Date(midnightAsUtc - offsetHours * 60 * 60 * 1000));
  const start = midnightCandidates.find((candidate) => {
    const parts = partsOf(candidate);
    return parts.year === yearText && parts.month === monthText && parts.day === dayText
      && parts.hour === "00" && parts.minute === "00";
  });
  const nextDateKey = addLondonCalendarDays(dateKey, 1);
  const [nextYearText, nextMonthText, nextDayText] = nextDateKey.split("-");
  const nextMidnightAsUtc = Date.UTC(Number(nextYearText), Number(nextMonthText) - 1, Number(nextDayText));
  const end = [0, 1].map((offsetHours) => new Date(nextMidnightAsUtc - offsetHours * 60 * 60 * 1000)).find((candidate) => {
    const parts = partsOf(candidate);
    return parts.year === nextYearText && parts.month === nextMonthText && parts.day === nextDayText
      && parts.hour === "00" && parts.minute === "00";
  });
  if (!start || !end) throw new Error("Could not resolve this London calendar date.");
  return { start, end };
}

export function formatMeetingDay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MEETING_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMeetingTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MEETING_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function parseLondonSlot(date: string, time: string, durationMinutes: number, now = new Date()) {
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!dayMatch || !timeMatch || !MEETING_DURATIONS.some((value) => value === durationMinutes)) {
    return { error: "Choose a valid UK date, time and call length." } as const;
  }

  const [, year, month, day] = dayMatch;
  const [, hour, minute] = timeMatch;
  const localAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  const candidates = [0, 1].map((offsetHours) => new Date(localAsUtc - offsetHours * 60 * 60 * 1000));
  const matches = candidates.filter((candidate) => {
    const parts = partsOf(candidate);
    return parts.year === year && parts.month === month && parts.day === day
      && parts.hour === hour && parts.minute === minute;
  });
  if (matches.length !== 1) {
    return { error: "This time is invalid or repeats when UK clocks change. Choose another time." } as const;
  }

  const startsAt = matches[0];
  if (startsAt.getTime() <= now.getTime() + MIN_BOOKING_NOTICE_MS) {
    return { error: "Choose a time at least one hour from now." } as const;
  }
  if (startsAt.getTime() > now.getTime() + MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000) {
    return { error: "Choose a date within the next 180 days." } as const;
  }
  return { startsAt, endsAt: new Date(startsAt.getTime() + durationMinutes * 60 * 1000) } as const;
}
