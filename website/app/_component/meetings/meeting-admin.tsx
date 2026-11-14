"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Clipboard, Loader2, UserRound } from "lucide-react";
import { createMeetingInvitation, revokeMeetingInvitation, saveMeetingAvailability, setMeetingSlotOpen } from "@/actions/meetings";
import { defaultWeeklyHours, formatMeetingDay, formatMeetingTime, MEETING_DURATIONS, WEEK_DAYS, type WeeklyHoursDay } from "@/lib/meetings/time";

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
  bookedSlotStartsAt: string | null;
  url: string | null;
};

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-[#211B1D] outline-none transition focus:border-[#A52249] focus:ring-2 focus:ring-[#A52249]/15";

export default function MeetingAdmin({ slots, invitations, hasOpenSlots, availability, view }: {
  slots: Slot[];
  invitations: Invitation[];
  hasOpenSlots: boolean;
  availability: { weeklyHours: WeeklyHoursDay[] | null; durationMinutes: number } | null;
  view: "upcoming" | "past";
}) {
  const router = useRouter();
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursDay[]>(() => availability?.weeklyHours ?? defaultWeeklyHours());
  const [durationMinutes, setDurationMinutes] = useState<number>(() => availability?.durationMinutes ?? 30);
  const [savingHours, setSavingHours] = useState(false);
  const [changingId, setChangingId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [createdUrl, setCreatedUrl] = useState("");
  const [revokingId, setRevokingId] = useState("");
  const [armedId, setArmedId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  async function changeSlot(id: string, open: boolean) {
    if (changingId) return;
    setChangingId(id);
    setError("");
    setNotice("");
    try {
      const result = await setMeetingSlotOpen(id, open);
      if (!result.success) setError(result.message);
      else { setNotice(open ? "Time restored." : "Time marked unavailable."); router.refresh(); }
    } catch { setError("Could not change this time. Try again."); }
    finally { setChangingId(""); }
  }

  async function inviteClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inviting) return;
    setInviting(true);
    setError("");
    setNotice("");
    setCreatedUrl("");
    try {
      const result = await createMeetingInvitation({ clientName, clientEmail, context: "" });
      if (!result.success) setError(result.message);
      else {
        setCreatedUrl(result.url);
        setNotice(`Private invitation ready for ${clientName.trim()}. Copy and share it with this client.`);
        setClientName(""); setClientEmail("");
        router.refresh();
      }
    } catch { setError("Could not create the invitation. Try again."); }
    finally { setInviting(false); }
  }

  async function revokeInvitation(id: string) {
    if (revokingId) return;
    setRevokingId(id);
    setError("");
    setNotice("");
    try {
      const result = await revokeMeetingInvitation(id);
      if (!result.success) setError(result.message);
      else { setNotice("Private invitation revoked."); setCreatedUrl(""); router.refresh(); }
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

    {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{notice}</p>}
    {createdUrl && <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#A52249]/20 bg-white p-4"><p className="min-w-0 flex-1 break-all text-xs text-black/65">{createdUrl}</p><button type="button" onClick={() => copyLink(createdUrl, "new")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#211B1D] px-5 text-sm font-bold text-white hover:bg-[#A52249]">{copiedId === "new" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copiedId === "new" ? "Copied" : "Copy link"}</button></div>}

    <section className="mt-10">
      <div><h2 className="text-2xl font-bold tracking-tight">Client invitations</h2></div>
      {!invitations.length ? <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white px-6 py-12 text-center"><UserRound className="mx-auto h-8 w-8 text-[#A52249]" /><p className="mt-4 font-bold">No invitations yet</p></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">
        {invitations.map((invitation) => <article key={invitation.id} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-lg font-bold">{invitation.clientName}</h3><p className="mt-1 break-all text-sm text-black/55">{invitation.clientEmail}</p></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${invitation.status === "BOOKED" ? "bg-emerald-50 text-emerald-800" : invitation.status === "OPEN" ? "bg-[#FFF0F4] text-[#8B2040]" : "bg-slate-100 text-slate-600"}`}>{invitation.status === "BOOKED" ? "Booked" : invitation.status === "OPEN" ? "Open" : "Revoked"}</span></div>
          {invitation.bookedSlotStartsAt && <p className="mt-3 text-sm font-semibold text-emerald-800">{formatMeetingDay(new Date(invitation.bookedSlotStartsAt))} · {formatMeetingTime(new Date(invitation.bookedSlotStartsAt))}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
            {invitation.status === "OPEN" && invitation.url && <button type="button" onClick={() => copyLink(invitation.url || "", invitation.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-[#A52249]">{copiedId === invitation.id ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copiedId === invitation.id ? "Copied" : "Copy private link"}</button>}
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
          {slot.status === "BOOKED" ? <div className="mt-5 border-t border-black/10 pt-4 text-sm"><p className="font-bold">{slot.clientName}</p><a href={`mailto:${slot.clientEmail}`} className="mt-1 block break-all text-[#A52249] underline underline-offset-2">{slot.clientEmail}</a>{slot.clientMessage && <p className="mt-3 whitespace-pre-wrap text-black/60">{slot.clientMessage}</p>}<p className="mt-4 text-xs text-black/45">{slot.confirmationEmailSentAt ? "Client confirmation email sent. Send the call link separately." : "Confirmation email was not sent. Contact the client directly with call details."}</p></div> : view === "upcoming" && <div className="mt-5 border-t border-black/10 pt-4"><button type="button" disabled={!!changingId} onClick={() => changeSlot(slot.id, slot.status === "CLOSED")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-[#A52249] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">{changingId === slot.id && <Loader2 className="h-4 w-4 animate-spin" />}{slot.status === "OPEN" ? "Mark unavailable" : "Restore time"}</button></div>}
        </article>)}
      </div>}
    </section>
  </>;
}
