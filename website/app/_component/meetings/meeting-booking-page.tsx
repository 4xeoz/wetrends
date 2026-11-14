"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Download, Loader2, Mail } from "lucide-react";
import { bookMeetingSlot } from "@/actions/meetings";
import { formatMeetingDay, formatMeetingTime, londonDateKey } from "@/lib/meetings/time";

type Slot = { id: string; startsAt: string; endsAt: string; durationMinutes: number };
type Confirmation = { startsAt: string; endsAt: string; emailSent: boolean };

function calendarStamp(iso: string) {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadCalendar(confirmation: Confirmation) {
  const contents = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WeTrends//Meeting booking//EN", "BEGIN:VEVENT",
    `UID:wetrends-meeting-${calendarStamp(confirmation.startsAt)}@wetrends.co.uk`,
    `DTSTAMP:${calendarStamp(new Date().toISOString())}`,
    `DTSTART:${calendarStamp(confirmation.startsAt)}`,
    `DTEND:${calendarStamp(confirmation.endsAt)}`,
    "SUMMARY:Call with WeTrends",
    "DESCRIPTION:WeTrends will send the call link separately.",
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "wetrends-call.ics";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MeetingBookingPage({ token, slots, booked }: {
  token: string;
  slots: Slot[];
  booked: { startsAt: string | null; endsAt: string | null; emailSent: boolean } | null;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const days = useMemo(() => Array.from(new Set(slots.map((slot) => londonDateKey(new Date(slot.startsAt))))), [slots]);
  const [selectedDay, setSelectedDay] = useState(days[0] ?? "");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(() => booked?.startsAt && booked.endsAt
    ? { startsAt: booked.startsAt, endsAt: booked.endsAt, emailSent: booked.emailSent }
    : null);

  useEffect(() => {
    if (!days.includes(selectedDay)) setSelectedDay(days[0] ?? "");
    if (selectedSlotId && !slots.some((slot) => slot.id === selectedSlotId)) {
      setSelectedSlotId("");
      setStep(2);
    }
  }, [days, selectedDay, selectedSlotId, slots]);

  useEffect(() => {
    if (booked?.startsAt && booked.endsAt) {
      setConfirmation({ startsAt: booked.startsAt, endsAt: booked.endsAt, emailSent: booked.emailSent });
    }
  }, [booked?.startsAt, booked?.endsAt, booked?.emailSent]);

  const visibleSlots = slots.filter((slot) => londonDateKey(new Date(slot.startsAt)) === selectedDay);
  const chosenSlot = slots.find((slot) => slot.id === selectedSlotId);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !chosenSlot) return;
    setBusy(true);
    setError("");
    try {
      const result = await bookMeetingSlot({ token, slotId: chosenSlot.id, message: "", website });
      if (!result.success) {
        setError(result.message);
        router.refresh();
        return;
      }
      setConfirmation({ startsAt: result.startsAt, endsAt: result.endsAt, emailSent: result.emailSent });
    } catch {
      setError("We could not reserve this time. Please try again.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const selectedDaySlot = slots.find((slot) => londonDateKey(new Date(slot.startsAt)) === selectedDay);
  const selectedDayDate = selectedDaySlot ? new Date(selectedDaySlot.startsAt) : null;
  const stepLabels = ["Day", "Time", "Confirm"] as const;

  return <main className="relative flex min-h-svh flex-col overflow-x-hidden bg-[#F8ECEF] bg-cover bg-center text-[#211B1D]" style={{ backgroundImage: "url('/images/events-mesh-light.png')" }}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/20" />
    <header className="relative z-10 mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8 sm:py-5">
      <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bc2a50]">
        <Image src="/images/logo-transparent.svg" alt="WeTrends" width={62} height={40} priority className="h-9 w-auto brightness-0" />
      </Link>
      <span className="text-xs font-semibold text-[#721c36] sm:text-sm">UK time</span>
    </header>

    <div className="relative z-10 flex flex-1 items-start justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:items-center sm:px-8 sm:py-8">
      <section aria-labelledby="booking-heading" className="w-full max-w-2xl rounded-[1.5rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_64px_rgba(64,11,26,.15)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-8 lg:p-10">
        {confirmation ? <div className="flex min-h-[360px] flex-col items-center justify-center py-8 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#fdf2f5] text-[#9e1f41]"><Check className="h-8 w-8" strokeWidth={2.5} /></div>
          <h1 id="booking-heading" className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Call booked</h1>
          <p className="mt-4 text-base font-semibold">{formatMeetingDay(new Date(confirmation.startsAt))} · {formatMeetingTime(new Date(confirmation.startsAt))}</p>
          <p className="mt-2 text-sm text-black/65">{confirmation.emailSent ? "Confirmation sent." : "Confirmation email could not be sent."}</p>
          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <button type="button" onClick={() => downloadCalendar(confirmation)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bc2a50] px-6 text-sm font-bold text-white transition hover:bg-[#851c39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36] sm:w-auto"><Download className="h-4 w-4" /> Add to calendar</button>
            <Link href="/" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#bc2a50]/25 px-6 text-sm font-bold text-[#721c36] transition hover:bg-[#fdf2f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36] sm:w-auto">Done</Link>
          </div>
        </div> : booked ? <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <CalendarDays className="h-9 w-9 text-[#bc2a50]" />
          <h1 id="booking-heading" className="mt-5 text-2xl font-semibold">Call booked</h1>
          <a href="mailto:eddy.c@wetrends.co.uk?subject=WeTrends%20call" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bc2a50] px-5 text-sm font-bold text-white hover:bg-[#851c39] sm:w-auto"><Mail className="h-4 w-4" /> Contact WeTrends</a>
        </div> : !slots.length ? <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <h1 id="booking-heading" className="text-2xl font-semibold">No times available</h1>
          <a href="mailto:eddy.c@wetrends.co.uk?subject=WeTrends%20call" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#bc2a50] px-5 text-sm font-bold text-white hover:bg-[#851c39] sm:w-auto"><Mail className="h-4 w-4" /> Contact WeTrends</a>
        </div> : <>
          <nav aria-label="Booking progress" className="mb-6 grid grid-cols-3 gap-2 sm:mb-8">
            {stepLabels.map((label, index) => {
              const number = (index + 1) as 1 | 2 | 3;
              const current = step === number;
              const complete = step > number;
              return <div key={label} aria-current={current ? "step" : undefined} className="flex items-center gap-2 border-b-2 border-[#bc2a50]/15 pb-3 aria-[current=step]:border-[#bc2a50]">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${current || complete ? "bg-[#bc2a50] text-white" : "bg-[#f5ccd8] text-[#721c36]"}`}>{complete ? <Check className="h-4 w-4" /> : number}</span>
                <span className={`text-xs font-bold sm:text-sm ${current || complete ? "text-[#721c36]" : "text-black/45"}`}>{label}</span>
              </div>;
            })}
          </nav>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduceMotion ? 0 : -8 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              {step === 1 && <div aria-live="polite">
                <h1 id="booking-heading" className="text-2xl font-semibold tracking-tight sm:text-4xl">Choose a day</h1>
                <div role="group" aria-label="Available days" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {days.map((day) => {
                    const daySlot = slots.find((slot) => londonDateKey(new Date(slot.startsAt)) === day);
                    if (!daySlot) return null;
                    const date = new Date(daySlot.startsAt);
                    const weekday = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short" }).format(date);
                    const dayAndMonth = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short" }).format(date);
                    return <button key={day} type="button" aria-label={`Choose ${weekday}, ${dayAndMonth}`} onClick={() => { setSelectedDay(day); setSelectedSlotId(""); setError(""); setStep(2); }} className="min-h-[80px] touch-manipulation rounded-2xl border border-[#bc2a50]/20 bg-white px-3 py-3 text-left transition duration-150 hover:border-[#bc2a50] hover:bg-[#fdf2f5] active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36] sm:px-4">
                      <span className="block text-xs font-bold uppercase tracking-[.12em] text-[#9e1f41]">{weekday}</span>
                      <span className="mt-1 block text-lg font-semibold">{dayAndMonth}</span>
                    </button>;
                  })}
                </div>
              </div>}

              {step === 2 && <div aria-live="polite">
                <div className="flex items-center justify-between gap-3">
                  <h1 id="booking-heading" className="text-2xl font-semibold tracking-tight sm:text-4xl">Choose a time</h1>
                  <button type="button" onClick={() => setStep(1)} aria-label="Change day" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#bc2a50]/20 px-3 text-xs font-bold text-[#721c36] transition hover:bg-[#fdf2f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36]"><ArrowLeft className="h-4 w-4" /><span>Back</span></button>
                </div>
                {selectedDayDate && <p className="mt-2 text-sm font-medium text-black/60">{formatMeetingDay(selectedDayDate)}</p>}
                <div role="group" aria-label="Available times" className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3">
                  {visibleSlots.map((slot) => <button key={slot.id} type="button" aria-label={`${formatMeetingTime(new Date(slot.startsAt))}, ${slot.durationMinutes} minutes`} onClick={() => { setSelectedSlotId(slot.id); setError(""); setStep(3); }} className="min-h-[68px] touch-manipulation rounded-2xl border border-[#bc2a50]/20 bg-white px-3 text-left transition duration-150 hover:border-[#bc2a50] hover:bg-[#fdf2f5] active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36] sm:px-4"><span className="block text-base font-bold">{formatMeetingTime(new Date(slot.startsAt))}</span><span className="mt-0.5 block text-xs text-black/55">{slot.durationMinutes} min</span></button>)}
                </div>
              </div>}

              {step === 3 && <form onSubmit={submit} aria-live="polite">
                <div className="flex items-center justify-between gap-3">
                  <h1 id="booking-heading" className="text-2xl font-semibold tracking-tight sm:text-4xl">Confirm this time</h1>
                  <button type="button" onClick={() => setStep(2)} aria-label="Change time" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#bc2a50]/20 px-3 text-xs font-bold text-[#721c36] transition hover:bg-[#fdf2f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36]"><ArrowLeft className="h-4 w-4" /><span>Back</span></button>
                </div>
                {chosenSlot && <div className="mt-6 rounded-2xl bg-[#fdf2f5] p-5">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-[#9e1f41]">{formatMeetingDay(new Date(chosenSlot.startsAt))}</p>
                  <p className="mt-2 text-2xl font-semibold">{formatMeetingTime(new Date(chosenSlot.startsAt))}</p>
                  <p className="mt-1 text-sm text-[#721c36]">{chosenSlot.durationMinutes} min</p>
                </div>}
                <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label></div>
                {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
                <button type="submit" disabled={!chosenSlot || busy} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#bc2a50] px-6 text-sm font-bold text-white transition hover:bg-[#851c39] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#721c36]">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : <>Confirm call <ArrowRight className="h-4 w-4" /></>}</button>
                <p className="mt-4 text-center text-xs"><Link href="/privacy" className="font-semibold text-[#721c36] underline underline-offset-2">Privacy</Link></p>
              </form>}
            </motion.div>
          </AnimatePresence>
        </>}
      </section>
    </div>
  </main>;
}
