'use client';

import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <section id="book" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Book Your Shoot
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Reserve Your Spot
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Fill in your details — we'll confirm within 24 hours. Multiple students
            can book the same graduation date.
          </p>
        </div>

        {submitted ? (
          /* ── Success ── */
          <div className="rounded-2xl border border-green-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-black text-gray-900">Booking Received!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thanks! We'll confirm your booking within 24 hours. Your photos will
              be delivered within 48 hours of your shoot date.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedService(null);
              }}
              className="mt-6 text-sm font-semibold text-[#C72C5B] underline-offset-2 hover:underline"
            >
              Book another slot
            </button>
          </div>
        ) : (
          /* ── Form card ── */
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Package selector */}
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-gray-800">
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
                      className={`relative flex flex-col gap-1 rounded-xl border p-4 text-left transition-all duration-150 ${
                        selectedService === value
                          ? 'border-[#C72C5B] bg-[#C72C5B]/5 ring-1 ring-[#C72C5B]'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      {popular && (
                        <span className="absolute right-2 top-2 rounded-full bg-[#C72C5B] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Popular
                        </span>
                      )}
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                          selectedService === value ? 'bg-[#C72C5B]' : 'bg-gray-200'
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${selectedService === value ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">
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
                <label htmlFor="cin-name" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="cin-name"
                    ref={nameRef}
                    placeholder="e.g. Sarah Johnson"
                    className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 bg-white"
                  />
                </div>
                <FieldError msg={fieldErrors.name} />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="cin-phone" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="cin-phone"
                    type="tel"
                    ref={phoneRef}
                    placeholder="+44 7700 000 000"
                    className="pl-9 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 bg-white"
                  />
                </div>
                <FieldError msg={fieldErrors.phone} />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="cin-date" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Graduation / Shoot Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="cin-date"
                    type="date"
                    ref={dateRef}
                    min={getMinDate()}
                    className="pl-9 border-gray-300 text-gray-900 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 bg-white"
                  />
                </div>
                <FieldError msg={fieldErrors.date} />
                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  Multiple students can book the same date — we shoot all day.
                </p>
              </div>

              {/* Notes (optional) */}
              <div>
                <label htmlFor="cin-notes" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Notes{' '}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="cin-notes"
                  ref={notesRef}
                  rows={2}
                  placeholder="Preferred location, special requests…"
                  className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#C72C5B] focus:outline-none focus:ring-1 focus:ring-[#C72C5B]/20"
                />
              </div>

              {/* Server error */}
              {serverError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#C72C5B] py-5 text-sm font-bold text-white shadow-md shadow-[#C72C5B]/20 hover:bg-[#a8244d] disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                We'll contact you within 24 hours to confirm. No payment required yet.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
