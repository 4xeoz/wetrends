'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'react-intersection-observer';
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
    label: 'Essentials',
    desc: '8 photos · £35',
    icon: Camera,
  },
  {
    value: 'PHOTOS_10_VIDEO' as const,
    label: 'Premium',
    desc: '10 photos + video · £45',
    icon: Film,
    popular: true,
  },
];

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function CinematographyBookingForm() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
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
      notes: notesRef.current?.value ?? undefined,
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
    <section id="book" ref={ref} className="relative bg-[#111111] py-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#C72C5B]/5 blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#C72C5B]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Ready to Book?
          </p>
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Reserve Your Shoot
          </h2>
          <p className="mt-4 text-white/50">
            Fill in your details below — we'll confirm within 24 hours. Multiple
            students can book the same graduation date.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#C72C5B]/30 bg-[#C72C5B]/5 p-12 text-center"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C72C5B]/20">
                  <CheckCircle2 className="h-8 w-8 text-[#C72C5B]" />
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-black text-white">
                Booking Received!
              </h3>
              <p className="mb-6 text-white/60">
                Thank you! We've received your booking and will confirm within
                24 hours. Your photos will be delivered within 48 hours of your
                shoot.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedService(null);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Book Another Slot
              </Button>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Package selector */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-white/70">
                  Choose Your Package
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {packageOptions.map(({ value, label, desc, icon: Icon, popular }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedService(value);
                        setFieldErrors((prev) => ({ ...prev, service: undefined }));
                      }}
                      className={`relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedService === value
                          ? 'border-[#C72C5B] bg-[#C72C5B]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {popular && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#C72C5B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Popular
                        </span>
                      )}
                      <div
                        className={`mb-1 flex h-8 w-8 items-center justify-center rounded-lg ${
                          selectedService === value ? 'bg-[#C72C5B]' : 'bg-white/10'
                        }`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-white">{label}</span>
                      <span className="text-xs text-white/50">{desc}</span>
                    </button>
                  ))}
                </div>
                {fieldErrors.service && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.service}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-white/70"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="name"
                    ref={nameRef}
                    placeholder="Your full name"
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-white/70"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="phone"
                    type="tel"
                    ref={phoneRef}
                    placeholder="+44 7700 000000"
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20"
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-white/70"
                >
                  Graduation / Shoot Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="date"
                    type="date"
                    ref={dateRef}
                    min={getMinDate()}
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 [color-scheme:dark]"
                  />
                </div>
                {fieldErrors.date && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.date}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/30">
                  Multiple students can book the same graduation date — we shoot all day.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold text-white/70"
                >
                  Additional Notes{' '}
                  <span className="font-normal text-white/30">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  ref={notesRef}
                  rows={3}
                  placeholder="E.g. specific locations on campus, any special requests..."
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:outline-none focus:ring-1 focus:ring-[#C72C5B]/20"
                />
              </div>

              {/* Server error */}
              {serverError && (
                <p className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {serverError}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#C72C5B] py-6 text-base font-bold text-white shadow-lg shadow-[#C72C5B]/25 hover:bg-[#a8244d] disabled:opacity-60 transition-all duration-300"
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

              <p className="text-center text-xs text-white/20">
                We'll contact you within 24 hours to confirm your booking details.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
