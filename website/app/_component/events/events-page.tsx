'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Heart,
  Images,
  Loader2,
  MapPin,
  Printer,
  Send,
  Sparkles,
  Timer,
  Users,
  Video,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { submitContactForm } from '@/actions/contact';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/posthog';

const eventTypes = [
  {
    label: 'Celebrations',
    eyebrow: 'Birthdays · milestones · graduations',
    description:
      'The hugs, speeches, dance-floor chaos and quiet moments you did not see happening.',
    image: '/images/events-celebration.png',
    icon: Heart,
    value: 'Private celebration',
  },
  {
    label: 'Corporate events',
    eyebrow: 'Launches · awards · conferences',
    description:
      'Confident, brand-aware coverage that gives your team useful content while the room still feels alive.',
    image: '/images/events-corporate.png',
    icon: Briefcase,
    value: 'Corporate event',
  },
];

const heroGallery = [
  '/images/events-birthday.png',
  '/images/events-speaker.png',
  '/images/events-graduation.png',
  '/images/events-awards.png',
  '/images/events-celebration.png',
  '/images/events-anniversary.png',
  '/images/events-launch.png',
  '/images/events-corporate.png',
];

const packages = [
  {
    number: '01',
    name: 'The Short Story',
    duration: 'Up to 2 hours',
    description: 'For intimate dinners, birthday arrivals and focused brand moments.',
    features: [
      'One dedicated photographer',
      'Pre-event planning call',
      'Curated, professionally edited gallery',
      'High-resolution and sharing-ready files',
    ],
  },
  {
    number: '02',
    name: 'The Main Event',
    duration: 'Up to 4 hours',
    description: 'Enough room for arrivals, atmosphere, speeches, portraits and the party.',
    recommended: true,
    features: [
      'One dedicated photographer',
      'Coverage plan and key-shot list',
      'Curated, professionally edited gallery',
      'High-resolution and sharing-ready files',
    ],
  },
  {
    number: '03',
    name: 'The Full Story',
    duration: 'Up to 8 hours',
    description: 'For events that deserve the build-up, the main room and everything after.',
    features: [
      'Extended photography coverage',
      'Detailed schedule and planning call',
      'Curated, professionally edited gallery',
      'High-resolution and sharing-ready files',
    ],
  },
];

const addOns = [
  {
    icon: Video,
    title: 'Highlight film',
    description: 'A concise, cinematic edit built around the energy and voices of the event.',
  },
  {
    icon: Clock,
    title: 'Fast preview selects',
    description: 'A small set prepared first when you need images for guests, press or social.',
  },
  {
    icon: Sparkles,
    title: 'Detailed retouching',
    description: 'Extra finishing for chosen portraits, including small blemishes and distractions.',
  },
  {
    icon: Printer,
    title: 'Prints and keepsakes',
    description: 'Choose favourites after viewing your gallery, then order prints without sending files around.',
  },
];

const process = [
  {
    number: '01',
    title: 'Tell us what matters',
    description: 'Share the date, room, people and moments you care about most.',
  },
  {
    number: '02',
    title: 'Plan the coverage',
    description: 'We shape the timing, team and shot priorities around the event itself.',
  },
  {
    number: '03',
    title: 'Live the event',
    description: 'We work calmly in the background, stepping in only when direction helps.',
  },
  {
    number: '04',
    title: 'Relive the room',
    description: 'Your finished gallery arrives privately, ready to download, share and print.',
  },
];

const faqs = [
  {
    question: 'How much coverage do I need?',
    answer:
      'Two hours works well for a focused celebration or launch. Four hours usually covers arrivals, speeches, portraits and the main party. If the story begins with setup and ends late, full-day coverage gives the event room to breathe.',
  },
  {
    question: 'What happens if the event runs over?',
    answer:
      'Extra coverage is available in 30-minute blocks. We tell you the rate before the event and ask before staying longer, so there is no surprise charge afterwards.',
  },
  {
    question: 'Can you provide photography and video together?',
    answer:
      'Yes. Tell us what you want to use the content for and we will recommend the smallest team that can cover it properly without crowding the room.',
  },
  {
    question: 'Do you provide raw files?',
    answer:
      'We deliver a curated finished gallery rather than every test frame, duplicate or unfinished file. You receive high-resolution downloads and sharing-ready versions of the final selection.',
  },
  {
    question: 'Can guests order prints?',
    answer:
      'Yes. Once the gallery is ready, you can choose favourite photographs and order prints or keepsakes from the private gallery flow.',
  },
];

type EnquiryForm = {
  name: string;
  email: string;
  eventType: string;
  date: string;
  location: string;
  duration: string;
  media: string;
  details: string;
};

const emptyForm: EnquiryForm = {
  name: '',
  email: '',
  eventType: '',
  date: '',
  location: '',
  duration: '',
  media: '',
  details: '',
};

function HeroFilmstrip() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-5 z-10 h-[150px] overflow-hidden lg:inset-y-0 lg:left-[48%] lg:right-0 lg:top-0 lg:flex lg:h-auto lg:items-center"
    >
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: reduceMotion ? '0%' : '-50%' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 52, ease: 'linear', repeat: Infinity }}
        className="flex w-max"
      >
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex gap-3 pr-3 lg:gap-5 lg:pr-5">
            {heroGallery.map((src, index) => (
              <div
                key={`${copyIndex}-${src}`}
                className="relative h-[140px] w-[105px] flex-none overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-2xl shadow-black/40 lg:h-[min(64vh,640px)] lg:w-[clamp(230px,18vw,330px)] lg:rounded-[2rem] lg:odd:-translate-y-5 lg:even:translate-y-5"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={copyIndex === 0 && index < 3}
                  sizes="(max-width: 1023px) 105px, 330px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050505] to-transparent lg:w-52" />
      <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#050505]/80 to-transparent lg:w-24" />
      <div className="absolute inset-x-0 top-0 z-10 hidden h-24 bg-gradient-to-b from-[#050505] to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 z-10 hidden h-24 bg-gradient-to-t from-[#050505] to-transparent lg:block" />
    </div>
  );
}

function EventsEnquiry({ selectedType }: { selectedType: string }) {
  const [form, setForm] = useState<EnquiryForm>({ ...emptyForm, eventType: selectedType });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  function update<K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const required = [form.name, form.email, form.eventType, form.date, form.location, form.media];
    if (required.some((value) => !value.trim())) {
      setError('Please complete the essential event details so we can check availability.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    const message = [
      'Event coverage enquiry',
      `Event type: ${form.eventType}`,
      `Date: ${form.date}`,
      `Location: ${form.location}`,
      `Coverage length: ${form.duration || 'Not sure yet'}`,
      `Coverage requested: ${form.media}`,
      `Details: ${form.details || 'No additional details provided'}`,
    ].join('\n');

    try {
      const result = await submitContactForm({
        name: form.name,
        email: form.email,
        message,
      });

      if (result.success) {
        trackEvent(ANALYTICS_EVENTS.contactFormSubmitted, {
          service: 'event_coverage',
          event_type: form.eventType,
        });
        setSubmitted(true);
        setForm(emptyForm);
      } else {
        setError('We could not send your enquiry. Please try again or email us directly.');
      }
    } catch {
      setError('We could not send your enquiry. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent(ANALYTICS_EVENTS.contactFormStarted, { source: 'events' });
  }

  if (submitted) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-md">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C72C5B]">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-white">Your date is with us.</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-white/60">
          We&apos;ll check the details and reply within 24 hours with availability and the best coverage shape for your event.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 text-sm font-semibold text-[#E46B90] underline-offset-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const fieldClass =
    'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-2 focus:ring-[#C72C5B]/20';

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Your name
          </span>
          <input
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            className={fieldClass}
            placeholder="Alex Morgan"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Email
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            className={fieldClass}
            placeholder="alex@example.com"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Event type
          </span>
          <select
            value={form.eventType}
            onChange={(event) => update('eventType', event.target.value)}
            className={fieldClass}
          >
            <option value="" className="text-black">Choose one</option>
            <option value="Birthday" className="text-black">Birthday</option>
            <option value="Private celebration" className="text-black">Private celebration</option>
            <option value="Graduation" className="text-black">Graduation</option>
            <option value="Corporate event" className="text-black">Corporate event</option>
            <option value="Conference or launch" className="text-black">Conference or launch</option>
            <option value="Other" className="text-black">Something else</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Event date
          </span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Venue or area
          </span>
          <input
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
            className={fieldClass}
            placeholder="Venue name, Guildford or London"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Coverage length
          </span>
          <select
            value={form.duration}
            onChange={(event) => update('duration', event.target.value)}
            className={fieldClass}
          >
            <option value="" className="text-black">Not sure yet</option>
            <option value="Up to 2 hours" className="text-black">Up to 2 hours</option>
            <option value="Up to 4 hours" className="text-black">Up to 4 hours</option>
            <option value="Up to 8 hours" className="text-black">Up to 8 hours</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            What do you need?
          </span>
          <select
            value={form.media}
            onChange={(event) => update('media', event.target.value)}
            className={fieldClass}
          >
            <option value="" className="text-black">Choose one</option>
            <option value="Photography" className="text-black">Photography</option>
            <option value="Photography and video" className="text-black">Photography and video</option>
            <option value="Video" className="text-black">Video</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Anything we should know? <span className="normal-case tracking-normal text-white/30">Optional</span>
          </span>
          <textarea
            value={form.details}
            onChange={(event) => update('details', event.target.value)}
            className={`${fieldClass} min-h-28 resize-none`}
            placeholder="Guest count, important moments, timings or the feeling you want…"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#0F0F0F] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your details…
          </>
        ) : (
          <>
            Check my date
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-white/40">
        No payment today. We&apos;ll confirm availability and a clear quote first.
      </p>
    </form>
  );
}

export default function EventsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedType, setSelectedType] = useState('');

  function chooseEventType(value: string) {
    setSelectedType(value);
  }

  return (
    <main className="overflow-hidden bg-white pt-[72px]">
      <section className="relative flex min-h-[calc(100svh-72px)] items-end overflow-hidden bg-[#050505]">
        <Image
          src="/images/events-hero.png"
          alt="Guests laughing together at an evening celebration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center] opacity-80 lg:opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.84)_34%,rgba(5,5,5,0.26)_72%,rgba(5,5,5,0.14)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        <HeroFilmstrip />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 md:pb-16 lg:px-8 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#E46B90] sm:text-sm"
          >
            <span className="h-px w-8 bg-[#C72C5B]" />
            Event photography &amp; video
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-[clamp(3.4rem,8.8vw,8.4rem)] font-bold leading-[0.84] tracking-[-0.045em] text-white lg:max-w-[56%] lg:text-[clamp(5rem,7vw,7rem)]"
          >
            The night moves fast.
            <span className="mt-2 block whitespace-nowrap font-serif text-[clamp(2.8rem,12vw,5.75rem)] font-normal italic text-[#E46B90] lg:text-[0.82em]">
              We make it last.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Honest photography and cinematic video for birthdays, milestone celebrations and corporate events across Surrey and London.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="#enquire"
              className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#0F0F0F] sm:px-7"
            >
              Plan your coverage
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:rotate-45 group-hover:bg-[#C72C5B] group-hover:text-white">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="#stories"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 sm:px-7"
            >
              See the work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/55"
          >
            <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[#E46B90]" /> Photography</span>
            <span className="inline-flex items-center gap-2"><Video className="h-4 w-4 text-[#E46B90]" /> Event film</span>
            <span className="inline-flex items-center gap-2"><Images className="h-4 w-4 text-[#E46B90]" /> Private gallery</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#E46B90]" /> Surrey &amp; London</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="absolute bottom-8 right-4 hidden md:block lg:right-8"
          >
            <Link href="#coverage" className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/45 hover:text-white">
              Explore coverage
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-transform group-hover:translate-y-1">
                <ArrowDownRight className="h-4 w-4 rotate-45" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="coverage" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={50} duration={0.9} className="mb-12 md:mb-16">
            <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#C72C5B]">
                  <span className="h-px w-8 bg-[#C72C5B]" />
                  Coverage for real rooms
                </span>
                <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-[#0F0F0F] sm:text-5xl lg:text-7xl">
                  Different occasions.
                  <span className="block font-serif font-normal italic text-[#C72C5B]">The same careful eye.</span>
                </h2>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-gray-600 lg:pb-2 lg:text-lg">
                Private celebrations need warmth. Corporate events need useful, brand-aware content. The coverage changes with the room; the standard stays the same.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid gap-5 lg:grid-cols-2">
            {eventTypes.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedContent key={item.label} direction="vertical" distance={45} duration={0.85} delay={index * 0.08}>
                  <article className="group relative min-h-[480px] overflow-hidden rounded-3xl bg-[#0F0F0F] sm:min-h-[560px]">
                    <Image
                      src={item.image}
                      alt={`${item.label} event coverage by WeTrends`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/5" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{item.eyebrow}</span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white sm:text-4xl">{item.label}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">{item.description}</p>
                      <a
                        href="#enquire"
                        onClick={() => chooseEventType(item.value)}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#F08BAB]"
                      >
                        Check your date
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                      </a>
                    </div>
                  </article>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F3] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={50} duration={0.9} className="mb-12 md:mb-16">
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Coverage options
            </span>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-[#0F0F0F] sm:text-5xl lg:text-7xl">
                Choose the shape
                <span className="block font-serif font-normal italic text-[#C72C5B]">of the story.</span>
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-gray-600 lg:pb-2 lg:text-lg">
                Start with time, then add photography, film or both. We quote around the date, location and team your event actually needs.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((item, index) => (
              <AnimatedContent key={item.name} direction="vertical" distance={45} duration={0.85} delay={index * 0.08}>
                <article className={`relative flex h-full min-h-[510px] flex-col rounded-3xl border p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${item.recommended ? 'border-[#C72C5B] bg-[#0F0F0F] text-white shadow-2xl shadow-black/10' : 'border-black/10 bg-white text-[#0F0F0F]'}`}>
                  {item.recommended && (
                    <span className="absolute right-6 top-6 rounded-full bg-[#C72C5B] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      Recommended
                    </span>
                  )}
                  <span className={`font-mono text-sm ${item.recommended ? 'text-white/35' : 'text-gray-400'}`}>{item.number}</span>
                  <div className="mt-14">
                    <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${item.recommended ? 'text-[#E46B90]' : 'text-[#C72C5B]'}`}>{item.duration}</p>
                    <h3 className="mt-3 text-3xl font-bold">{item.name}</h3>
                    <p className={`mt-4 min-h-[72px] text-sm leading-relaxed ${item.recommended ? 'text-white/60' : 'text-gray-600'}`}>{item.description}</p>
                  </div>
                  <ul className="mt-8 flex-1 space-y-4">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${item.recommended ? 'bg-[#C72C5B]' : 'bg-[#C72C5B]/10'}`}>
                          <Check className={`h-3 w-3 ${item.recommended ? 'text-white' : 'text-[#C72C5B]'}`} />
                        </span>
                        <span className={item.recommended ? 'text-white/70' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#enquire"
                    className={`group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-colors ${item.recommended ? 'bg-white text-[#0F0F0F] hover:bg-[#C72C5B] hover:text-white' : 'bg-[#0F0F0F] text-white hover:bg-[#C72C5B]'}`}
                  >
                    Request a quote
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>
                </article>
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent direction="vertical" distance={25} duration={0.75} delay={0.15} className="mt-8">
            <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F0F0F]">
                <Timer className="h-4 w-4 text-[#C72C5B]" />
                Need more time on the day?
              </span>
              <span className="text-sm text-gray-500">Extra coverage is agreed with you first, in clear 30-minute blocks.</span>
            </div>
          </AnimatedContent>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <AnimatedContent direction="horizontal" distance={45} duration={0.9}>
              <div className="lg:sticky lg:top-28">
                <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#C72C5B]">
                  <span className="h-px w-8 bg-[#C72C5B]" />
                  Make it yours
                </span>
                <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-[#0F0F0F] sm:text-5xl lg:text-6xl">
                  Add what makes
                  <span className="block font-serif font-normal italic text-[#C72C5B]">the memory useful.</span>
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-gray-600">
                  The core coverage stays simple. Add finishing, fast selects or film only when it serves the event.
                </p>
              </div>
            </AnimatedContent>

            <div className="grid gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
              {addOns.map((item, index) => {
                const Icon = item.icon;
                return (
                  <AnimatedContent key={item.title} direction="vertical" distance={35} duration={0.8} delay={index * 0.06}>
                    <article className="group min-h-[260px] bg-white p-7 transition-colors duration-300 hover:bg-[#0F0F0F] sm:p-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C72C5B]/10 text-[#C72C5B] transition-colors group-hover:bg-[#C72C5B] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-8 text-xl font-bold text-[#0F0F0F] transition-colors group-hover:text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-500 transition-colors group-hover:text-white/60">{item.description}</p>
                    </article>
                  </AnimatedContent>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0F0F0F] py-24 text-white md:py-32">
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[#C72C5B]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={50} duration={0.9} className="mb-14 md:mb-20">
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#E46B90]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              From enquiry to gallery
            </span>
            <h2 className="max-w-4xl text-4xl font-bold leading-[0.94] tracking-tight sm:text-5xl lg:text-7xl">
              You enjoy the room.
              <span className="block font-serif font-normal italic text-[#E46B90]">We hold onto it.</span>
            </h2>
          </AnimatedContent>

          <div className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <AnimatedContent key={item.number} direction="vertical" distance={35} duration={0.8} delay={index * 0.08}>
                <article>
                  <span className="font-mono text-sm text-[#E46B90]">{item.number}</span>
                  <h3 className="mt-8 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{item.description}</p>
                </article>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={50} duration={0.9} className="mb-12 md:mb-16">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-[#0F0F0F] sm:text-5xl lg:text-7xl">
                The loud moments.
                <span className="block font-serif font-normal italic text-[#C72C5B]">The quiet ones.</span>
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-gray-600 lg:pb-2 lg:text-lg">
                A strong gallery does more than prove who attended. It brings back how the room felt.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[330px] lg:grid-cols-3">
            <AnimatedContent direction="vertical" distance={35} duration={0.8} className="sm:row-span-2">
              <figure className="group relative h-full min-h-[520px] overflow-hidden rounded-3xl bg-[#0F0F0F] lg:min-h-[676px]">
                <Image src="/images/events-celebration.png" alt="Friends dancing together at a celebration" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 p-6 text-sm font-semibold text-white">Celebrations that feel like themselves</figcaption>
              </figure>
            </AnimatedContent>
            <AnimatedContent direction="vertical" distance={35} duration={0.8} delay={0.08} className="lg:col-span-2">
              <figure className="group relative h-full overflow-hidden rounded-3xl bg-[#0F0F0F]">
                <Image src="/images/events-corporate.png" alt="Guests speaking at a corporate reception" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 p-6 text-sm font-semibold text-white">Corporate coverage with human energy</figcaption>
              </figure>
            </AnimatedContent>
            <AnimatedContent direction="vertical" distance={35} duration={0.8} delay={0.14} className="lg:col-span-2">
              <figure className="group relative h-full overflow-hidden rounded-3xl bg-[#0F0F0F]">
                <Image src="/images/events-hero.png" alt="Guests raising a glass at an evening event" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 p-6 text-sm font-semibold text-white">The room, the people and everything between</figcaption>
              </figure>
            </AnimatedContent>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F3] py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:px-8">
          <AnimatedContent direction="horizontal" distance={45} duration={0.9}>
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Before you book
              </span>
              <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-[#0F0F0F] sm:text-5xl lg:text-6xl">
                A few useful
                <span className="block font-serif font-normal italic text-[#C72C5B]">answers first.</span>
              </h2>
            </div>
          </AnimatedContent>

          <div className="border-t border-black/10">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="border-b border-black/10">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-base font-bold text-[#0F0F0F] sm:text-lg">{item.question}</span>
                    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all ${isOpen ? 'rotate-180 border-[#C72C5B] bg-[#C72C5B] text-white' : 'border-black/10 text-[#0F0F0F]'}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pr-12 text-sm leading-relaxed text-gray-600 sm:text-base">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="enquire" className="relative scroll-mt-20 overflow-hidden bg-[#090909] py-24 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/events-hero.png" alt="" fill sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,9,0.98)_0%,rgba(9,9,9,0.92)_50%,rgba(9,9,9,0.82)_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20 lg:px-8">
          <AnimatedContent direction="horizontal" distance={45} duration={0.9}>
            <div className="lg:sticky lg:top-28">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#E46B90]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Tell us about the room
              </span>
              <h2 className="text-4xl font-bold leading-[0.94] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let&apos;s make sure
                <span className="block font-serif font-normal italic text-[#E46B90]">your date is free.</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-white/60">
                Share the essentials. We&apos;ll return with availability, a clear recommendation and a quote shaped around your event.
              </p>
              <div className="mt-8 space-y-4 text-sm text-white/55">
                <p className="flex items-center gap-3"><Calendar className="h-4 w-4 text-[#E46B90]" /> Date checked before any payment</p>
                <p className="flex items-center gap-3"><Users className="h-4 w-4 text-[#E46B90]" /> Team sized around the room</p>
                <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#E46B90]" /> Clear coverage and overtime terms</p>
              </div>
              <a href="mailto:wetrends.uk@gmail.com" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#E46B90]">
                Prefer email? wetrends.uk@gmail.com
              </a>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={45} duration={0.9} delay={0.1}>
            <EventsEnquiry key={selectedType} selectedType={selectedType} />
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
