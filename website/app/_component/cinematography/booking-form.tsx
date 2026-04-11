'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import {
  Camera,
  Film,
  Calendar,
  Phone,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { createCinemaBooking } from '@/actions/cinematography';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  date: z.string().min(1, 'Please select a date'),
  service: z.enum(['PHOTOS_8', 'PHOTOS_10_VIDEO'], {
    errorMap: () => ({ message: 'Please choose a package' }),
  }),
  notes: z.string().optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

const packageOptions = [
  {
    value: 'PHOTOS_8' as const,
    label: 'Essentials — £35',
    sub: '8 photos · 48h delivery',
    icon: Camera,
  },
  {
    value: 'PHOTOS_10_VIDEO' as const,
    label: 'Premium — £45',
    sub: '10 photos + video · 48h delivery',
    icon: Film,
    popular: true,
  },
];

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

const inputBase =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F0F0F] placeholder:text-gray-400 transition-colors focus:border-[#C72C5B] focus:outline-none focus:ring-2 focus:ring-[#C72C5B]/10';

export default function CinematographyBookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [selectedService, setSelectedService] = useState<
    'PHOTOS_8' | 'PHOTOS_10_VIDEO' | null
  >(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const raw = {
      name: nameRef.current?.value ?? '',
      phone: phoneRef.current?.value ?? '',
      date: dateRef.current?.value ?? '',
      service: (selectedService ?? '') as 'PHOTOS_8' | 'PHOTOS_10_VIDEO',
      notes: notesRef.current?.value || undefined,
    };

    const parsed = formSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: FormErrors = {};
      parsed.error.errors.forEach((e) => {
        const key = e.path[0] as keyof FormErrors;
        if (!errs[key]) errs[key] = e.message;
      });
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const result = await createCinemaBooking(parsed.data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="book" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Blob matching homepage */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#C72C5B]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — heading & reassurance */}
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out" threshold={0.1}>
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Book Your Shoot
            </span>
            <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl xl:text-7xl">
              Reserve
              <br />
              <span className="font-serif italic text-[#C72C5B]">Your Spot</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Fill in your details and we&apos;ll confirm within 24 hours.
              Multiple students can book the same graduation date — we shoot all
              day long.
            </p>

            {/* Guarantees */}
            <ul className="mt-8 space-y-4">
              {[
                { icon: Clock, text: '48-hour photo delivery — guaranteed' },
                { icon: CheckCircle2, text: 'No payment required to book' },
                { icon: CheckCircle2, text: 'Free adjustments if you are not happy' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C72C5B]/10">
                    <Icon className="h-4 w-4 text-[#C72C5B]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0F0F0F]">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F0F0F]">
                  Still have questions?
                </p>
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-1 text-xs text-[#C72C5B] font-medium hover:underline underline-offset-2"
                >
                  Message us directly
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </AnimatedContent>

          {/* Right — form */}
          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.15} ease="power3.out" threshold={0.1}>
            {submitted ? (
              /* Success */
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-green-100 bg-green-50 px-8 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-[#0F0F0F]">
                  Booking Received!
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  We&apos;ll confirm your booking within 24 hours. Your photos will
                  be delivered within 48 hours of your shoot date.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedService(null);
                  }}
                  className="mt-8 text-sm font-semibold text-[#C72C5B] underline-offset-2 hover:underline"
                >
                  Book another slot
                </button>
              </div>
            ) : (
              /* Form card */
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {/* Package selector */}
                  <div>
                    <label className="mb-3 block text-sm font-bold text-[#0F0F0F]">
                      Choose Your Package
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {packageOptions.map(({ value, label, sub, icon: Icon, popular }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSelectedService(value);
                            setFieldErrors((p) => ({ ...p, service: undefined }));
                          }}
                          className={`relative flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition-all duration-200 ${
                            selectedService === value
                              ? 'border-[#C72C5B] bg-[#C72C5B]/5 ring-1 ring-[#C72C5B]'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          {popular && (
                            <span className="absolute right-3 top-3 rounded-full bg-[#C72C5B] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                              Popular
                            </span>
                          )}
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                              selectedService === value ? 'bg-[#C72C5B]' : 'bg-gray-200'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                selectedService === value ? 'text-white' : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <span className="text-xs font-bold leading-tight text-[#0F0F0F]">
                            {label}
                          </span>
                          <span className="text-[11px] text-gray-500">{sub}</span>
                        </button>
                      ))}
                    </div>
                    <FieldError msg={fieldErrors.service} />
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="cin-name" className="mb-2 block text-sm font-bold text-[#0F0F0F]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id="cin-name"
                        ref={nameRef}
                        placeholder="e.g. Sarah Johnson"
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                    <FieldError msg={fieldErrors.name} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="cin-phone" className="mb-2 block text-sm font-bold text-[#0F0F0F]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id="cin-phone"
                        type="tel"
                        ref={phoneRef}
                        placeholder="+44 7700 000 000"
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                    <FieldError msg={fieldErrors.phone} />
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="cin-date" className="mb-2 block text-sm font-bold text-[#0F0F0F]">
                      Graduation / Shoot Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id="cin-date"
                        type="date"
                        ref={dateRef}
                        min={getMinDate()}
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                    <FieldError msg={fieldErrors.date} />
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      Multiple students can book the same date — we shoot all day.
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="cin-notes" className="mb-2 block text-sm font-bold text-[#0F0F0F]">
                      Notes{' '}
                      <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="cin-notes"
                      ref={notesRef}
                      rows={2}
                      placeholder="Preferred location, special requests…"
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F0F0F] placeholder:text-gray-400 transition-colors focus:border-[#C72C5B] focus:outline-none focus:ring-2 focus:ring-[#C72C5B]/10"
                    />
                  </div>

                  {/* Server error */}
                  {serverError && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {serverError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#C72C5B]/20 transition-all hover:bg-[#0F0F0F] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </span>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    No payment required yet — we&apos;ll contact you within 24 hours to confirm.
                  </p>
                </form>
              </div>
            )}
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
