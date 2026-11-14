"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Clipboard, Loader2, Mail, UserRound } from "lucide-react";
import { createMeetingInvitation, revokeMeetingInvitation, saveMeetingAvailability, sendMeetingInvitationEmail, setMeetingInvitationBookingDates, setMeetingSlotOpen, setMeetingSlotsUnavailable } from "@/actions/meetings";
import { addLondonCalendarMonths, defaultWeeklyHours, formatMeetingDay, formatMeetingTime, londonDateKey, MEETING_DURATIONS, WEEK_DAYS, type WeeklyHoursDay } from "@/lib/meetings/time";

type Slot = {
  id: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  status: "OPEN" | "BOOKED" | "CLOSED";
  manualUnavailable: boolean;
  clientName: string | null;
  clientEmail: string | null;
  clientMessage: string | null;
  bookedAt: string | null;
  confirmationEmailSentAt: string | null;
};
type Invitation = {
  id: string;
  clientName: string;
  clientEmail: string;
  status: "OPEN" | "BOOKED" | "VOID";
  createdAt: string;
  allowedBookingDates: string[] | null;
  invitationEmailSentAt: string | null;
  bookedSlotStartsAt: string | null;
  url: string | null;
};
type BlockableSlot = { id: string; startsAt: string; durationMinutes: number };

const CALENDAR_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCalendarMonth(dateKey: string) {
  const [year, month] = dateKey.split("-").map(Number);
  const monthDate = new Date(Date.UTC(year, month - 1, 1, 12));
  const leadingCells = (monthDate.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: Array<string | null> = Array(leadingCells).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return {
    title: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(monthDate),
    days,
  };
}

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-[#211B1D] outline-none transition focus:border-[#A52249] focus:ring-2 focus:ring-[#A52249]/15";

export default function MeetingAdmin({ slots, invitations, hasOpenSlots, availability, view, blockDateRange, unavailabilitySlots }: {
  slots: Slot[];
  invitations: Invitation[];
  hasOpenSlots: boolean;
  availability: { weeklyHours: WeeklyHoursDay[] | null; durationMinutes: number } | null;
  view: "upcoming" | "past";
  blockDateRange: { start: string; end: string };
  unavailabilitySlots: BlockableSlot[];
}) {
  const router = useRouter();
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursDay[]>(() => availability?.weeklyHours ?? defaultWeeklyHours());
  const [durationMinutes, setDurationMinutes] = useState<number>(() => availability?.durationMinutes ?? 30);
  const [savingHours, setSavingHours] = useState(false);
  const [changingId, setChangingId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [createdInvitation, setCreatedInvitation] = useState<{ id: string; url: string; clientName: string; clientEmail: string; emailSentAt: string | null } | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState("");
  const [revokingId, setRevokingId] = useState("");
  const [editingBookingDatesId, setEditingBookingDatesId] = useState("");
  const [bookingDateDrafts, setBookingDateDrafts] = useState<Record<string, string[]>>({});
  const [savingBookingDatesId, setSavingBookingDatesId] = useState("");
  const [armedId, setArmedId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [unavailabilityStep, setUnavailabilityStep] = useState<"dates" | "times">("dates");
  const [selectedUnavailableDates, setSelectedUnavailableDates] = useState<string[]>([]);
  const [selectedUnavailableSlotIds, setSelectedUnavailableSlotIds] = useState<string[]>([]);
  const [savingUnavailable, setSavingUnavailable] = useState(false);
  const openSlotsByDate = new Map<string, BlockableSlot[]>();
  for (const slot of unavailabilitySlots) {
    const dateKey = londonDateKey(new Date(slot.startsAt));
    if (dateKey >= blockDateRange.start && dateKey <= blockDateRange.end) {
      openSlotsByDate.set(dateKey, [...(openSlotsByDate.get(dateKey) ?? []), slot]);
    }
  }
  const firstCalendarMonth = `${blockDateRange.start.slice(0, 7)}-01`;
  const visibleCalendarMonths = [firstCalendarMonth];
  if (blockDateRange.end.slice(0, 7) !== blockDateRange.start.slice(0, 7)) {
    visibleCalendarMonths.push(addLondonCalendarMonths(firstCalendarMonth, 1));
  }
  const selectedUnavailableSlotSet = new Set(selectedUnavailableSlotIds);
  const bookingDateOptions = new Set(openSlotsByDate.keys());

  async function saveHours(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingHours) return;
    setSavingHours(true);
    setError("");
    setNotice("");
    try {
      const result = await saveMeetingAvailability({ weeklyHours, durationMinutes });
      if (!result.success) setError(result.message);
      else { setNotice("Weekly hours saved."); router.refresh(); }
    } catch { setError("Could not save weekly hours. Try again."); }
    finally { setSavingHours(false); }
  }

  function updateDay(dayOfWeek: number, changes: Partial<WeeklyHoursDay>) {
    setWeeklyHours((current) => current.map((day) => day.dayOfWeek === dayOfWeek ? { ...day, ...changes } : day));
  }

  async function changeSlot(id: string) {
    if (changingId) return;
    setChangingId(id);
    setError("");
    setNotice("");
    try {
      const result = await setMeetingSlotOpen(id, true);
      if (!result.success) setError(result.message);
      else { setNotice("Time restored."); router.refresh(); }
    } catch { setError("Could not change this time. Try again."); }
    finally { setChangingId(""); }
  }

  function toggleUnavailableDate(dateKey: string) {
    const dateSlotIds = new Set((openSlotsByDate.get(dateKey) ?? []).map((slot) => slot.id));
    if (selectedUnavailableDates.includes(dateKey)) {
      setSelectedUnavailableDates((current) => current.filter((date) => date !== dateKey));
      setSelectedUnavailableSlotIds((current) => current.filter((id) => !dateSlotIds.has(id)));
    } else {
      setSelectedUnavailableDates((current) => [...current, dateKey].sort());
    }
  }

  function toggleUnavailableSlot(slotId: string) {
    setSelectedUnavailableSlotIds((current) => current.includes(slotId)
      ? current.filter((id) => id !== slotId)
      : [...current, slotId]);
  }

  function selectAllTimesForDate(dateKey: string, select: boolean) {
    const dateSlotIds = (openSlotsByDate.get(dateKey) ?? []).map((slot) => slot.id);
    setSelectedUnavailableSlotIds((current) => {
      const remaining = current.filter((id) => !dateSlotIds.includes(id));
      return select ? [...remaining, ...dateSlotIds] : remaining;
    });
  }

  async function saveUnavailableTimes() {
    if (savingUnavailable || !selectedUnavailableSlotIds.length) return;
    setSavingUnavailable(true);
    setError("");
    setNotice("");
    try {
      const result = await setMeetingSlotsUnavailable(selectedUnavailableSlotIds);
      if (!result.success) setError(result.message);
      else {
        setNotice(`${selectedUnavailableSlotIds.length} ${selectedUnavailableSlotIds.length === 1 ? "time" : "times"} marked unavailable.`);
        setSelectedUnavailableDates([]);
        setSelectedUnavailableSlotIds([]);
        setUnavailabilityStep("dates");
        router.refresh();
      }
    } catch { setError("Could not save these unavailable times. Try again."); }
    finally { setSavingUnavailable(false); }
  }

  function editInvitationBookingDates(invitation: Invitation) {
    if (editingBookingDatesId === invitation.id) {
      setEditingBookingDatesId("");
      return;
    }
    setBookingDateDrafts((current) => ({ ...current, [invitation.id]: invitation.allowedBookingDates ?? [] }));
    setEditingBookingDatesId(invitation.id);
  }

  function toggleInvitationBookingDate(invitationId: string, dateKey: string) {
    setBookingDateDrafts((current) => {
      const dates = current[invitationId] ?? [];
      const nextDates = dates.includes(dateKey) ? dates.filter((date) => date !== dateKey) : [...dates, dateKey];
      return { ...current, [invitationId]: nextDates.sort() };
    });
  }

  async function saveInvitationBookingDates(invitationId: string) {
    if (savingBookingDatesId) return;
    const dateKeys = bookingDateDrafts[invitationId] ?? [];
    setSavingBookingDatesId(invitationId);
    setError("");
    setNotice("");
    try {
      const result = await setMeetingInvitationBookingDates(invitationId, dateKeys);
      if (!result.success) setError(result.message);
      else {
        setNotice(dateKeys.length ? "Booking dates saved for this link." : "This link can use all open dates.");
        setEditingBookingDatesId("");
        router.refresh();
      }
    } catch { setError("Could not save the booking dates. Try again."); }
    finally { setSavingBookingDatesId(""); }
  }

  async function inviteClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inviting) return;
    setInviting(true);
    setError("");
    setNotice("");
    setCreatedInvitation(null);
    try {
      const result = await createMeetingInvitation({ clientName, clientEmail, context: "" });
      if (!result.success) setError(result.message);
      else {
        setCreatedInvitation({ id: result.id, url: result.url, clientName: clientName.trim(), clientEmail: clientEmail.trim(), emailSentAt: null });
        setNotice(`Private link created for ${clientName.trim()}. Review the email preview, then send it when ready.`);
        setClientName(""); setClientEmail("");
        router.refresh();
      }
    } catch { setError("Could not create the invitation. Try again."); }
    finally { setInviting(false); }
  }

  async function sendInvitationEmail(id: string, name: string) {
    if (sendingEmailId) return;
    setSendingEmailId(id);
    setError("");
    setNotice("");
    try {
      const result = await sendMeetingInvitationEmail(id);
      if (!result.success) setError(result.message);
      else {
        setNotice(`Invitation email sent to ${name}.`);
        setCreatedInvitation((current) => current?.id === id ? { ...current, emailSentAt: result.sentAt } : current);
        router.refresh();
      }
    } catch {
      setError("Could not send the invitation email. Try again.");
    } finally {
      setSendingEmailId("");
    }
  }

  async function revokeInvitation(id: string) {
    if (revokingId) return;
    setRevokingId(id);
    setError("");
    setNotice("");
    try {
      const result = await revokeMeetingInvitation(id);
      if (!result.success) setError(result.message);
      else { setNotice("Private invitation revoked."); setCreatedInvitation(null); router.refresh(); }
    } catch { setError("Could not revoke this invitation. Try again."); }
    finally { setRevokingId(""); setArmedId(""); }
  }

  async function copyLink(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2500);
    } catch { setError("Could not copy the private link. Try again."); }
  }

  return <>
    <section className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,.6fr)]">
      <form onSubmit={saveHours} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF0F4] text-[#A52249]"><CalendarDays className="h-5 w-5" /></span><div><h2 className="text-xl font-bold tracking-tight">Weekly hours</h2><p className="text-xs text-black/50">Times repeat each week. Block exceptions below.</p></div></div>
        <div className="mt-6 space-y-2">
          {WEEK_DAYS.map(({ dayOfWeek, label }) => {
            const day = weeklyHours.find((entry) => entry.dayOfWeek === dayOfWeek) ?? { dayOfWeek, enabled: false, startTime: "09:00", endTime: "17:00" };
            return <div key={dayOfWeek} className="grid grid-cols-[minmax(5.5rem,.7fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={day.enabled} onChange={(event) => updateDay(dayOfWeek, { enabled: event.target.checked })} className="h-4 w-4 accent-[#A52249]" />{label}</label>
              <input aria-label={`${label} start time`} className={`${inputClass} mt-0 min-w-0 px-2 text-sm disabled:bg-slate-100 disabled:text-black/35`} type="time" disabled={!day.enabled} required={day.enabled} value={day.startTime} onChange={(event) => updateDay(dayOfWeek, { startTime: event.target.value })} />
              <input aria-label={`${label} end time`} className={`${inputClass} mt-0 min-w-0 px-2 text-sm disabled:bg-slate-100 disabled:text-black/35`} type="time" disabled={!day.enabled} required={day.enabled} value={day.endTime} onChange={(event) => updateDay(dayOfWeek, { endTime: event.target.value })} />
            </div>;
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <label className="w-full max-w-48 text-sm font-semibold">Call length<select className={inputClass} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))}>{MEETING_DURATIONS.map((minutes) => <option key={minutes} value={minutes}>{minutes} min</option>)}</select></label>
          <button type="submit" disabled={savingHours} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#A52249] px-6 text-sm font-bold text-white transition hover:bg-[#7E1736] disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{savingHours && <Loader2 className="h-4 w-4 animate-spin" />}{savingHours ? "Saving…" : "Save weekly hours"}</button>
        </div>
      </form>
      <form onSubmit={inviteClient} className="rounded-3xl bg-[#211B1D] p-6 text-white shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Create a booking link.</h2>
        <label className="mt-5 block text-sm font-semibold">Client name<input className={`${inputClass} text-[#211B1D]`} required minLength={2} maxLength={100} value={clientName} onChange={(event) => setClientName(event.target.value)} /></label>
        <label className="mt-4 block text-sm font-semibold">Client email<input className={`${inputClass} text-[#211B1D]`} type="email" required maxLength={254} value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} /></label>
        <button type="submit" disabled={inviting || !hasOpenSlots} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#211B1D] transition hover:bg-[#F4D7DF] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}{inviting ? "Creating…" : "Create private link"}</button>
        {!hasOpenSlots && <p className="mt-3 text-xs leading-5 text-white/60">Set weekly hours first.</p>}
      </form>
    </section>

    <section aria-labelledby="block-times-heading" className="mt-8 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="block-times-heading" className="text-2xl font-bold tracking-tight">Block unavailable times</h2>
          <p className="mt-1 text-sm text-black/55">Select calendar days, then choose the times to close.</p>
        </div>
        <ol aria-label="Unavailable time steps" className="flex items-center gap-2 text-sm font-semibold">
          <li aria-current={unavailabilityStep === "dates" ? "step" : undefined} className={`flex min-h-11 items-center gap-2 rounded-full px-3 ${unavailabilityStep === "dates" ? "bg-[#211B1D] text-white" : "bg-[#F7F4F2] text-black/50"}`}><span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-xs">1</span>Days</li>
          <li aria-hidden="true" className="h-px w-5 bg-black/15" />
          <li aria-current={unavailabilityStep === "times" ? "step" : undefined} className={`flex min-h-11 items-center gap-2 rounded-full px-3 ${unavailabilityStep === "times" ? "bg-[#211B1D] text-white" : "bg-[#F7F4F2] text-black/50"}`}><span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-xs">2</span>Times</li>
        </ol>
      </div>

      {unavailabilityStep === "dates" ? <div className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h3 className="font-bold">Choose calendar days</h3><p className="mt-1 text-sm text-black/50">Select up to {formatMeetingDay(new Date(`${blockDateRange.end}T12:00:00.000Z`))}.</p></div>
          <p className="text-sm font-semibold text-[#8B2040]">{selectedUnavailableDates.length} selected</p>
        </div>
        {!unavailabilitySlots.length ? <div className="mt-5 rounded-2xl border border-dashed border-black/15 bg-[#F7F4F2] px-5 py-8 text-center text-sm text-black/55">No open times in the next month.</div> : <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {visibleCalendarMonths.map((monthStart) => {
            const month = getCalendarMonth(monthStart);
            return <div key={monthStart} className="rounded-2xl border border-black/10 p-4 sm:p-5">
              <h4 className="text-lg font-bold">{month.title}</h4>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-black/45">{CALENDAR_WEEKDAYS.map((day) => <span key={day} className="py-2">{day}</span>)}</div>
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((dateKey, index) => {
                  if (!dateKey) return <span aria-hidden="true" key={`empty-${monthStart}-${index}`} />;
                  const times = openSlotsByDate.get(dateKey) ?? [];
                  const selected = selectedUnavailableDates.includes(dateKey);
                  const canSelect = dateKey >= blockDateRange.start && dateKey <= blockDateRange.end && times.length > 0;
                  const dayNumber = Number(dateKey.slice(-2));
                  return <button key={dateKey} type="button" disabled={!canSelect} aria-pressed={selected} aria-label={`${formatMeetingDay(new Date(`${dateKey}T12:00:00.000Z`))}, ${times.length} open ${times.length === 1 ? "time" : "times"}${selected ? ", selected" : ""}`} onClick={() => toggleUnavailableDate(dateKey)} className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-xl border px-1 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249] ${selected ? "border-[#A52249] bg-[#FFF0F4] text-[#8B2040] ring-1 ring-[#A52249]" : canSelect ? "border-black/10 bg-white text-[#211B1D] hover:border-[#A52249] hover:bg-[#FFF8FA]" : "cursor-not-allowed border-transparent bg-[#F7F4F2] text-black/25"}`}>
                    <span className="text-base font-bold">{dayNumber}</span><span className="mt-0.5 text-[10px] leading-3">{times.length ? `${times.length} ${times.length === 1 ? "time" : "times"}` : "—"}</span>
                  </button>;
                })}
              </div>
            </div>;
          })}
        </div>}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-black/50">Only days with open times can be selected.</p>
          <button type="button" disabled={!selectedUnavailableDates.length || !unavailabilitySlots.length} onClick={() => setUnavailabilityStep("times")} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#A52249] px-6 text-sm font-bold text-white transition hover:bg-[#7E1736] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Choose times</button>
        </div>
      </div> : <div className="mt-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h3 className="font-bold">Choose times on each day</h3><p className="mt-1 text-sm text-black/50">{selectedUnavailableDates.length} {selectedUnavailableDates.length === 1 ? "day" : "days"} selected · times shown in UK time</p></div>
          <button type="button" onClick={() => setUnavailabilityStep("dates")} className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 text-sm font-semibold transition hover:border-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Back to days</button>
        </div>
        <div className="mt-5 space-y-4">
          {selectedUnavailableDates.map((dateKey) => {
            const times = openSlotsByDate.get(dateKey) ?? [];
            const selectedCount = times.filter((slot) => selectedUnavailableSlotSet.has(slot.id)).length;
            return <section key={dateKey} aria-label={formatMeetingDay(new Date(`${dateKey}T12:00:00.000Z`))} className="rounded-2xl border border-black/10 bg-[#FCFBFA] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h4 className="font-bold">{formatMeetingDay(new Date(`${dateKey}T12:00:00.000Z`))}</h4><p className="mt-1 text-xs text-black/50">{selectedCount} of {times.length} selected</p></div>
                {times.length > 0 && <div className="flex gap-2"><button type="button" onClick={() => selectAllTimesForDate(dateKey, true)} className="min-h-11 rounded-full px-3 text-xs font-semibold text-[#8B2040] hover:bg-[#FFF0F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Select all</button><button type="button" onClick={() => selectAllTimesForDate(dateKey, false)} className="min-h-11 rounded-full px-3 text-xs font-semibold text-black/55 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Clear</button></div>}
              </div>
              {!times.length ? <p className="mt-4 rounded-xl bg-[#F7F4F2] px-4 py-5 text-sm text-black/55">No open times remain on this day. Go back and remove it.</p> : <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {times.map((slot) => {
                  const selected = selectedUnavailableSlotSet.has(slot.id);
                  return <label key={slot.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold transition ${selected ? "border-[#A52249] bg-[#FFF0F4] text-[#8B2040]" : "border-black/10 bg-white text-[#211B1D] hover:border-[#A52249]"}`}>
                    <input type="checkbox" checked={selected} onChange={() => toggleUnavailableSlot(slot.id)} className="h-5 w-5 shrink-0 accent-[#A52249]" />
                    <span>{formatMeetingTime(new Date(slot.startsAt))}</span><span className="ml-auto text-xs font-normal text-black/45">{slot.durationMinutes} min</span>
                  </label>;
                })}
              </div>}
            </section>;
          })}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => setUnavailabilityStep("dates")} className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-bold transition hover:border-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Back</button>
          <button type="button" disabled={!selectedUnavailableSlotIds.length || savingUnavailable} onClick={saveUnavailableTimes} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#A52249] px-6 text-sm font-bold text-white transition hover:bg-[#7E1736] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{savingUnavailable && <Loader2 className="h-4 w-4 animate-spin" />}{savingUnavailable ? "Saving…" : `Mark ${selectedUnavailableSlotIds.length} ${selectedUnavailableSlotIds.length === 1 ? "time" : "times"} unavailable`}</button>
        </div>
      </div>}
    </section>

    {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{notice}</p>}
    {createdInvitation && <section aria-label="New booking invitation" className="mt-4 rounded-3xl border border-[#A52249]/20 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">Private link for {createdInvitation.clientName}</h3>
          <p className="mt-1 break-all text-sm text-black/55">{createdInvitation.clientEmail}</p>
          <p className="mt-3 break-all rounded-xl bg-[#F7F4F2] p-3 text-xs text-black/65">{createdInvitation.url}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-44">
          <button type="button" onClick={() => copyLink(createdInvitation.url, "new")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-bold transition hover:border-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{copiedId === "new" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copiedId === "new" ? "Copied" : "Copy link"}</button>
          <button type="button" disabled={!!sendingEmailId} onClick={() => sendInvitationEmail(createdInvitation.id, createdInvitation.clientName)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#A52249] px-5 text-sm font-bold text-white transition hover:bg-[#7E1736] disabled:cursor-wait disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{sendingEmailId === createdInvitation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}{sendingEmailId === createdInvitation.id ? "Sending…" : createdInvitation.emailSentAt ? "Resend email" : "Send email"}</button>
        </div>
      </div>
      <details className="mt-5 border-t border-black/10 pt-4">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[#8B2040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Preview invitation email</summary>
        <div className="mt-2 rounded-2xl bg-[#F7F1F3] p-5 text-sm leading-6 text-[#342B30]">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-black/45">Subject</p>
          <p className="mt-1 font-semibold">Choose a time for your WeTrends call</p>
          <p className="mt-4">Hi {createdInvitation.clientName},</p>
          <p className="mt-2">We&apos;re looking forward to speaking with you. Choose the day and time that works best.</p>
          <span className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#A52249] px-5 font-bold text-white">Choose a time <span aria-hidden="true" className="ml-2">→</span></span>
          <p className="mt-3 text-xs text-black/55">Times are shown in UK time. Your private link can be used once to book the call.</p>
        </div>
      </details>
    </section>}

    <section className="mt-10">
      <div><h2 className="text-2xl font-bold tracking-tight">Client invitations</h2></div>
      {!invitations.length ? <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white px-6 py-12 text-center"><UserRound className="mx-auto h-8 w-8 text-[#A52249]" /><p className="mt-4 font-bold">No invitations yet</p></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">
        {invitations.map((invitation) => <article key={invitation.id} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-lg font-bold">{invitation.clientName}</h3><p className="mt-1 break-all text-sm text-black/55">{invitation.clientEmail}</p></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${invitation.status === "BOOKED" ? "bg-emerald-50 text-emerald-800" : invitation.status === "OPEN" ? "bg-[#FFF0F4] text-[#8B2040]" : "bg-slate-100 text-slate-600"}`}>{invitation.status === "BOOKED" ? "Booked" : invitation.status === "OPEN" ? "Open" : "Revoked"}</span></div>
          {invitation.bookedSlotStartsAt && <p className="mt-3 text-sm font-semibold text-emerald-800">{formatMeetingDay(new Date(invitation.bookedSlotStartsAt))} · {formatMeetingTime(new Date(invitation.bookedSlotStartsAt))}</p>}
          {invitation.invitationEmailSentAt && <p className="mt-2 text-xs font-medium text-black/50">Invitation email sent {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(new Date(invitation.invitationEmailSentAt))}</p>}
          {invitation.status === "OPEN" && <div className="mt-4 rounded-2xl border border-black/10 bg-[#FCFBFA] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-sm font-bold">Booking days</p><p className="mt-1 text-xs text-black/50">{invitation.allowedBookingDates === null ? "All open dates" : invitation.allowedBookingDates.length ? `Limited to ${invitation.allowedBookingDates.length} ${invitation.allowedBookingDates.length === 1 ? "date" : "dates"}` : "No valid dates configured"}</p></div>
              <button type="button" onClick={() => editInvitationBookingDates(invitation)} className="inline-flex min-h-11 items-center rounded-full border border-black/15 bg-white px-4 text-sm font-semibold transition hover:border-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{editingBookingDatesId === invitation.id ? "Close date settings" : invitation.allowedBookingDates === null ? "Limit dates" : "Edit dates"}</button>
            </div>
            {editingBookingDatesId === invitation.id && <div className="mt-4 border-t border-black/10 pt-4">
              <p className="text-sm text-black/55">Only selected days appear on this link. Select days through {formatMeetingDay(new Date(`${blockDateRange.end}T12:00:00.000Z`))}; an empty selection allows every open day.</p>
              {!bookingDateOptions.size && <p className="mt-3 rounded-xl bg-[#F7F4F2] px-3 py-3 text-sm text-black/55">No open dates are available in this period.</p>}
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {visibleCalendarMonths.map((monthStart) => {
                  const month = getCalendarMonth(monthStart);
                  return <div key={monthStart} className="rounded-xl border border-black/10 bg-white p-3">
                    <h4 className="font-bold">{month.title}</h4>
                    <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-black/45">{CALENDAR_WEEKDAYS.map((day) => <span key={day} className="py-1">{day}</span>)}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {month.days.map((dateKey, index) => {
                        if (!dateKey) return <span aria-hidden="true" key={`invite-empty-${monthStart}-${index}`} />;
                        const draft = bookingDateDrafts[invitation.id] ?? [];
                        const selected = draft.includes(dateKey);
                        const hasOpenTimes = bookingDateOptions.has(dateKey);
                        const canSelect = dateKey >= blockDateRange.start && dateKey <= blockDateRange.end
                          && (hasOpenTimes || (invitation.allowedBookingDates ?? []).includes(dateKey));
                        const times = openSlotsByDate.get(dateKey) ?? [];
                        return <button key={dateKey} type="button" disabled={!canSelect} aria-pressed={selected} aria-label={`${formatMeetingDay(new Date(`${dateKey}T12:00:00.000Z`))}, ${times.length} open ${times.length === 1 ? "time" : "times"}${selected ? ", allowed" : ""}`} onClick={() => toggleInvitationBookingDate(invitation.id, dateKey)} className={`flex min-h-12 flex-col items-center justify-center rounded-lg border px-0.5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249] ${selected ? "border-[#A52249] bg-[#FFF0F4] text-[#8B2040]" : canSelect ? "border-black/10 text-[#211B1D] hover:border-[#A52249]" : "cursor-not-allowed border-transparent bg-[#F7F4F2] text-black/25"}`}>
                          <span className="text-sm font-bold">{Number(dateKey.slice(-2))}</span><span className="text-[9px] leading-3">{times.length ? `${times.length} times` : "—"}</span>
                        </button>;
                      })}
                    </div>
                  </div>;
                })}
              </div>
              <div className="mt-4 flex flex-col-reverse gap-2 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setBookingDateDrafts((current) => ({ ...current, [invitation.id]: [] }))} className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-black/55 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Allow every open day</button>
                <button type="button" disabled={savingBookingDatesId === invitation.id} onClick={() => saveInvitationBookingDates(invitation.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#A52249] px-5 text-sm font-bold text-white transition hover:bg-[#7E1736] disabled:cursor-wait disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{savingBookingDatesId === invitation.id && <Loader2 className="h-4 w-4 animate-spin" />}{savingBookingDatesId === invitation.id ? "Saving…" : "Save dates"}</button>
              </div>
            </div>}
          </div>}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
            {invitation.status === "OPEN" && invitation.url && <button type="button" onClick={() => copyLink(invitation.url || "", invitation.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-[#A52249]">{copiedId === invitation.id ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copiedId === invitation.id ? "Copied" : "Copy private link"}</button>}
            {invitation.status === "OPEN" && <button type="button" disabled={!!sendingEmailId} onClick={() => sendInvitationEmail(invitation.id, invitation.clientName)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#A52249] px-4 text-sm font-semibold text-white transition hover:bg-[#7E1736] disabled:cursor-wait disabled:opacity-55">{sendingEmailId === invitation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}{sendingEmailId === invitation.id ? "Sending…" : invitation.invitationEmailSentAt ? "Resend email" : "Send email"}</button>}
            {invitation.status === "OPEN" && (armedId === invitation.id ? <><button type="button" disabled={!!revokingId} onClick={() => revokeInvitation(invitation.id)} className="min-h-10 rounded-full bg-red-700 px-4 text-sm font-semibold text-white disabled:opacity-50">{revokingId === invitation.id ? "Revoking…" : "Confirm revoke"}</button><button type="button" onClick={() => setArmedId("")} className="min-h-10 rounded-full px-3 text-sm font-semibold text-black/55">Cancel</button></> : <button type="button" onClick={() => setArmedId(invitation.id)} className="min-h-10 rounded-full px-3 text-sm font-semibold text-red-700 hover:bg-red-50">Revoke link</button>)}
          </div>
        </article>)}
      </div>}
    </section>

    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-2xl font-bold tracking-tight">{view === "past" ? "Past calls" : "Upcoming times"}</h2></div>
        <nav aria-label="Meeting views" className="flex rounded-full border border-black/10 bg-white p-1 text-sm font-semibold"><Link href="/me/meetings" className={`rounded-full px-4 py-2 ${view === "upcoming" ? "bg-[#211B1D] text-white" : "text-black/55 hover:text-black"}`}>Upcoming</Link><Link href="/me/meetings?view=past" className={`rounded-full px-4 py-2 ${view === "past" ? "bg-[#211B1D] text-white" : "text-black/55 hover:text-black"}`}>Past calls</Link></nav>
      </div>
      {!slots.length ? <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white px-6 py-14 text-center"><CalendarDays className="mx-auto h-8 w-8 text-[#A52249]" /><h3 className="mt-4 text-lg font-bold">{view === "past" ? "No past calls yet" : "No upcoming times yet"}</h3></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">
        {slots.map((slot) => <article key={slot.id} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#A52249]">{formatMeetingDay(new Date(slot.startsAt))}</p><h3 className="mt-2 text-2xl font-bold tracking-tight">{formatMeetingTime(new Date(slot.startsAt))} <span className="text-base font-normal text-black/45">· {slot.durationMinutes} min</span></h3></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${slot.status === "BOOKED" ? "bg-emerald-50 text-emerald-800" : slot.status === "OPEN" ? "bg-[#FFF0F4] text-[#8B2040]" : "bg-slate-100 text-slate-600"}`}>{slot.status === "BOOKED" ? "Booked" : slot.status === "OPEN" ? "Available" : "Unavailable"}</span></div>
          {slot.status === "BOOKED" ? <div className="mt-5 border-t border-black/10 pt-4 text-sm"><p className="font-bold">{slot.clientName}</p><a href={`mailto:${slot.clientEmail}`} className="mt-1 block break-all text-[#A52249] underline underline-offset-2">{slot.clientEmail}</a>{slot.clientMessage && <p className="mt-3 whitespace-pre-wrap text-black/60">{slot.clientMessage}</p>}<p className="mt-4 text-xs text-black/45">{slot.confirmationEmailSentAt ? "Client confirmation email sent. Send the call link separately." : "Confirmation email was not sent. Contact the client directly with call details."}</p></div> : view === "upcoming" && slot.status === "CLOSED" && <div className="mt-5 border-t border-black/10 pt-4"><button type="button" disabled={!!changingId} onClick={() => changeSlot(slot.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-[#A52249] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{changingId === slot.id && <Loader2 className="h-4 w-4 animate-spin" />}Restore time</button></div>}
        </article>)}
      </div>}
    </section>
  </>;
}
