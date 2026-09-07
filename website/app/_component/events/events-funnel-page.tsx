'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Heart,
  Images,
  Loader2,
  MapPin,
  Plus,
  Printer,
  Send,
  Sparkles,
  Video,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { submitEventEnquiry } from '@/actions/events';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/posthog';

export type EventPlan = {
  eventType: string;
  duration: string;
  media: string;
  addOns: string[];
};

type EnquiryForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
  location: string;
  details: string;
};

const initialPlan: EventPlan = {
  eventType: 'Birthday or celebration',
  duration: 'Up to 4 hours',
  media: 'Photography',
  addOns: [],
};

const emptyForm: EnquiryForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  location: '',
  details: '',
};

const rotatingImages = [
  {
    src: '/images/events-birthday.png',
    label: 'Birthdays',
    alt: 'A guest reacting to a birthday cake surrounded by friends',
  },
  {
    src: '/images/events-graduation.png',
    label: 'Graduations',
    alt: 'Graduates celebrating together outside a university',
  },
  {
    src: '/images/events-speaker.png',
    label: 'Conferences',
    alt: 'A speaker addressing guests at a corporate event',
  },
  {
    src: '/images/events-anniversary.png',
    label: 'Milestones',
    alt: 'A couple dancing at an anniversary celebration',
  },
  {
    src: '/images/events-awards.png',
    label: 'Awards',
    alt: 'An award recipient surrounded by applauding colleagues',
  },
  {
    src: '/images/events-launch.png',
    label: 'Launches',
    alt: 'Guests talking at a product launch reception',
  },
];

const eventChoices = [
  {
    label: 'Birthday',
    value: 'Birthday or celebration',
    image: '/images/events-birthday.png',
    icon: Heart,
  },
  {
    label: 'Graduation',
    value: 'Graduation',
    image: '/images/events-graduation.png',
    icon: GraduationCap,
  },
  {
    label: 'Corporate',
    value: 'Corporate event',
    image: '/images/events-speaker.png',
    icon: Briefcase,
  },
  {
    label: 'Other event',
    value: 'Other event',
    image: '/images/events-anniversary.png',
    icon: Sparkles,
  },
];

const durationChoices = [
  { label: '2 hours', value: 'Up to 2 hours' },
  { label: '4 hours', value: 'Up to 4 hours', recommended: true },
  { label: '8 hours', value: 'Up to 8 hours' },
];

const mediaChoices = [
  { label: 'Photography', value: 'Photography', icon: Camera },
  { label: 'Photo + film', value: 'Photography and video', icon: Images },
  { label: 'Film only', value: 'Video', icon: Video },
];

const addOnChoices = [
  { label: 'Fast previews', icon: Clock },
  { label: 'Highlight film', icon: Video },
  { label: 'Portrait retouching', icon: Sparkles },
  { label: 'Prints', icon: Printer },
];

const proofImages = [
  {
    src: '/images/events-birthday.png',
    label: 'Birthday',
    className: 'col-span-2 row-span-2 lg:col-span-5 lg:row-span-2',
  },
  {
    src: '/images/events-speaker.png',
    label: 'Conference',
    className: 'lg:col-span-4',
  },
  {
    src: '/images/events-graduation.png',
    label: 'Graduation',
    className: 'lg:col-span-3',
  },
  {
    src: '/images/events-anniversary.png',
    label: 'Milestone',
    className: 'lg:col-span-3',
  },
  {
    src: '/images/events-launch.png',
    label: 'Launch',
    className: 'lg:col-span-4',
  },
];

const faqs = [
  {
    question: 'What if the event runs late?',
    answer: 'Extra time is agreed with you first in clear 30-minute blocks.',
  },
  {
    question: 'Can I book photo and film together?',
    answer: 'Yes. We shape one small team around the room and the content you need.',
  },
  {
    question: 'What will I receive?',
    answer: 'A private gallery with your edited, high-resolution and sharing-ready files.',
  },
];

const eventSectionLinks = [
  { href: '/events/', label: 'Events' },
  { href: '/events/celebrations/', label: 'Celebrations' },
  { href: '/events/corporate/', label: 'Corporate' },
  { href: '/events/work/', label: 'Work' },
];

function EventsSectionNav() {
  return (
    <nav aria-label="Event pages" className="scrollbar-hide flex max-w-full gap-1.5 overflow-x-auto pb-2 sm:gap-2">
      {eventSectionLinks.map((item) => {
        const isActive = item.href === '/events/';
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-[11px] font-bold transition-colors sm:px-4 sm:text-xs ${
              isActive
                ? 'border-[#C72C5B] bg-[#C72C5B] text-white'
                : 'border-black/10 bg-white/65 text-black/50 hover:border-[#C72C5B]/40 hover:text-[#C72C5B]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function RotatingPhotoStack() {
  const [activeImage, setActiveImage] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % rotatingImages.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const cards = [
    {
      item: rotatingImages[(activeImage + 1) % rotatingImages.length],
      className:
        'left-[2%] top-[15%] z-10 w-[48%] -rotate-[9deg] sm:left-[3%] sm:w-[47%]',
      isFront: false,
    },
    {
      item: rotatingImages[(activeImage + 2) % rotatingImages.length],
      className:
        'right-[2%] top-[8%] z-20 w-[48%] rotate-[8deg] sm:right-[3%] sm:w-[47%]',
      isFront: false,
    },
    {
      item: rotatingImages[activeImage],
      className:
        'left-1/2 top-1/2 z-30 w-[56%] -translate-x-1/2 -translate-y-1/2 -rotate-[1.5deg] sm:w-[54%]',
      isFront: true,
    },
  ];

  return (
    <div className="relative mx-auto h-[310px] w-full max-w-[620px] sm:h-[480px] lg:h-[650px]">
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: [5, 7, 5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 h-[70%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-[#C72C5B] sm:rounded-[3.5rem]"
      />

      {cards.map(({ item, className, isFront }) => (
        <figure
          key={`${isFront ? 'front' : className}`}
          className={`absolute aspect-[4/5] overflow-hidden rounded-[1.6rem] border-[7px] border-white bg-[#EEE9E5] shadow-[0_30px_80px_rgba(34,20,24,0.2)] sm:rounded-[2.2rem] sm:border-[10px] ${className}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={item.src}
                alt={isFront ? item.alt : ''}
                fill
                priority={isFront}
                sizes={isFront ? '(max-width: 1024px) 54vw, 340px' : '(max-width: 1024px) 47vw, 300px'}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {isFront && (
            <figcaption className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 text-white sm:p-5">
              <span className="text-sm font-bold sm:text-base">{item.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                {String(activeImage + 1).padStart(2, '0')} / {String(rotatingImages.length).padStart(2, '0')}
              </span>
            </figcaption>
          )}
        </figure>
      ))}

      <div className="absolute bottom-[4%] right-[2%] z-40 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border-4 border-white bg-[#0F0F0F] text-center text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-white shadow-xl sm:h-24 sm:w-24 sm:text-xs">
        Photo<br />+ film
      </div>
    </div>
  );
}

function CoverageBuilder({
  plan,
  updatePlan,
  toggleAddOn,
  continueToBooking,
}: {
  plan: EventPlan;
  updatePlan: <K extends keyof EventPlan>(key: K, value: EventPlan[K]) => void;
  toggleAddOn: (addOn: string) => void;
  continueToBooking: () => void;
}) {
  return (
    <section id="build" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="vertical" distance={35} duration={0.8}>
          <div className="mb-12 flex flex-col gap-4 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Build your coverage</span>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] text-[#0F0F0F] sm:text-5xl lg:text-6xl">
                Three choices. Done.
              </h2>
            </div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-black/50">
              <Clock className="h-4 w-4 text-[#C72C5B]" /> About 30 seconds
            </p>
          </div>
        </AnimatedContent>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:gap-12">
          <div className="space-y-12">
            <fieldset>
              <legend className="mb-5 text-sm font-bold text-[#0F0F0F]">
                <span className="mr-3 font-mono text-[#C72C5B]">01</span> What is it?
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {eventChoices.map((choice) => {
                  const Icon = choice.icon;
                  const selected = plan.eventType === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updatePlan('eventType', choice.value)}
                      className={`group relative aspect-[4/5] overflow-hidden rounded-2xl border-2 text-left transition-all ${selected ? 'border-[#C72C5B] shadow-lg shadow-[#C72C5B]/15' : 'border-transparent hover:border-black/20'}`}
                    >
                      <Image src={choice.image} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <span className="absolute bottom-0 left-0 flex items-center gap-2 p-4 text-sm font-bold text-white">
                        <Icon className="h-4 w-4 text-[#F08BAB]" /> {choice.label}
                      </span>
                      {selected && (
                        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-10 md:grid-cols-2">
              <fieldset>
                <legend className="mb-5 text-sm font-bold text-[#0F0F0F]">
                  <span className="mr-3 font-mono text-[#C72C5B]">02</span> How long?
                </legend>
                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#F5F2EF] p-2">
                  {durationChoices.map((choice) => {
                    const selected = plan.duration === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => updatePlan('duration', choice.value)}
                        className={`relative rounded-xl px-3 py-5 text-sm font-bold transition-all ${selected ? 'bg-white text-[#0F0F0F] shadow-sm' : 'text-black/45 hover:text-black'}`}
                      >
                        {choice.label}
                        {choice.recommended && (
                          <span className="absolute inset-x-1 -bottom-2 mx-auto w-fit rounded-full bg-[#C72C5B] px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-white">
                            Recommended
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-5 text-sm font-bold text-[#0F0F0F]">
                  <span className="mr-3 font-mono text-[#C72C5B]">03</span> What should we capture?
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {mediaChoices.map((choice) => {
                    const Icon = choice.icon;
                    const selected = plan.media === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => updatePlan('media', choice.value)}
                        className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 text-center text-xs font-bold transition-all ${selected ? 'border-[#C72C5B] bg-[#FFF4F7] text-[#C72C5B]' : 'border-black/10 text-black/55 hover:border-black/30 hover:text-black'}`}
                      >
                        <Icon className="h-5 w-5" /> {choice.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <fieldset>
              <legend className="mb-5 text-sm font-bold text-[#0F0F0F]">
                <span className="mr-3 font-mono text-[#C72C5B]">+</span> Add more value <span className="ml-2 font-normal text-black/35">Optional</span>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {addOnChoices.map((choice) => {
                  const Icon = choice.icon;
                  const selected = plan.addOns.includes(choice.label);
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAddOn(choice.label)}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-bold transition-all ${selected ? 'border-[#C72C5B] bg-[#FFF4F7] text-[#C72C5B]' : 'border-black/10 text-[#0F0F0F] hover:border-black/30'}`}
                    >
                      <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {choice.label}</span>
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${selected ? 'bg-[#C72C5B] text-white' : 'bg-black/[0.06] text-black/50'}`}>
                        {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="rounded-3xl bg-[#0F0F0F] p-6 text-white shadow-2xl shadow-black/15 lg:sticky lg:top-28 sm:p-7">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F08BAB]">Your coverage</span>
            <div className="mt-7 space-y-4 border-b border-white/10 pb-7">
              <p className="text-xl font-bold">{plan.eventType}</p>
              <p className="text-sm text-white/60">{plan.duration} · {plan.media}</p>
              {plan.addOns.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {plan.addOns.map((addOn) => (
                    <span key={addOn} className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/75">+ {addOn}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 py-7 text-sm text-white/65">
              <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#F08BAB]" /> Planning included</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#F08BAB]" /> Edited private gallery</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#F08BAB]" /> High-resolution files</p>
            </div>

            <button
              type="button"
              onClick={continueToBooking}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#0F0F0F]"
            >
              Check this plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-center text-[11px] text-white/35">Clear quote first. No payment today.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ProofGallery() {
  return (
    <section className="bg-[#F7F5F3] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="vertical" distance={35} duration={0.8}>
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="max-w-2xl text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-[#0F0F0F] sm:text-5xl lg:text-6xl">
              How the room <span className="font-serif font-normal italic text-[#C72C5B]">felt.</span>
            </h2>
            <Link href="#book" className="group hidden items-center gap-2 text-sm font-bold text-[#0F0F0F] sm:inline-flex">
              Check your date <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </AnimatedContent>

        <div className="grid auto-rows-[210px] grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-[270px_270px]">
          {proofImages.map((image, index) => (
            <AnimatedContent key={image.src} direction="vertical" distance={30} duration={0.75} delay={index * 0.04} className={image.className}>
              <figure className="group relative h-full min-h-0 overflow-hidden rounded-2xl bg-black sm:rounded-3xl">
                <Image src={image.src} alt={`${image.label} event photographed by WeTrends`} fill priority={index === 0} sizes="(max-width: 1024px) 50vw, 40vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-sm font-bold text-white sm:p-6">{image.label}</figcaption>
              </figure>
            </AnimatedContent>
          ))}
        </div>

        <Link href="#book" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F0F0F] px-6 py-4 text-sm font-bold text-white sm:hidden">
          Check your date <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function EventsEnquiry({
  plan,
  changeHref = '#build',
}: {
  plan: EventPlan;
  changeHref?: string;
}) {
  const [form, setForm] = useState<EnquiryForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  function update<K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent(ANALYTICS_EVENTS.contactFormStarted, { source: 'events' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const required = [form.name, form.email, form.phone, form.date, form.location];
    if (required.some((value) => !value.trim())) {
      setError('Please complete all five booking details.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError('Please enter a valid phone number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await submitEventEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        eventDate: form.date,
        location: form.location,
        eventType: plan.eventType,
        duration: plan.duration,
        media: plan.media,
        addOns: plan.addOns,
        details: form.details,
      });

      if (result.success) {
        trackEvent(ANALYTICS_EVENTS.contactFormSubmitted, {
          service: 'event_coverage',
          event_type: plan.eventType,
          duration: plan.duration,
          media: plan.media,
          add_ons: plan.addOns.length,
        });
        setSubmitted(true);
        setForm(emptyForm);
      } else {
        setError('We could not send this. Please try again or email us directly.');
      }
    } catch {
      setError('We could not send this. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-xl shadow-black/[0.06]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C72C5B] text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-6 text-3xl font-bold text-[#0F0F0F]">Date check sent.</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">We&apos;ll reply within 24 hours with availability and a clear quote.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-7 text-sm font-bold text-[#C72C5B] underline-offset-4 hover:underline">
          Send another
        </button>
      </div>
    );
  }

  const fieldClass =
    'w-full rounded-xl border border-black/10 bg-[#FAF9F7] px-4 py-3.5 text-sm text-[#0F0F0F] outline-none transition placeholder:text-black/30 focus:border-[#C72C5B] focus:ring-2 focus:ring-[#C72C5B]/15';

  return (
    <form onSubmit={handleSubmit} onFocusCapture={markStarted} noValidate className="rounded-3xl bg-white p-6 shadow-xl shadow-black/[0.06] sm:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF3F6] px-4 py-4">
        <div>
          <p className="text-sm font-bold text-[#0F0F0F]">{plan.eventType}</p>
          <p className="mt-1 text-xs text-black/45">{plan.duration} · {plan.media}</p>
        </div>
        <Link href={changeHref} className="text-xs font-bold text-[#C72C5B] underline-offset-4 hover:underline">Change</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-black/55">Name</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} className={fieldClass} placeholder="Alex Morgan" autoComplete="name" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-black/55">Email</span>
          <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={fieldClass} placeholder="alex@example.com" autoComplete="email" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-black/55">Phone number</span>
          <input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className={fieldClass} placeholder="+44 7700 000 000" autoComplete="tel" inputMode="tel" maxLength={24} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-black/55">Event date</span>
          <input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} className={fieldClass} required />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs font-bold text-black/55">Venue or area</span>
          <input value={form.location} onChange={(event) => update('location', event.target.value)} className={fieldClass} placeholder="Guildford or London" autoComplete="off" required />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs font-bold text-black/55">Anything else? <span className="font-normal text-black/30">Optional</span></span>
          <textarea value={form.details} onChange={(event) => update('details', event.target.value)} className={`${fieldClass} min-h-24 resize-none`} placeholder="Guest count or one must-have moment…" />
        </label>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={submitting} className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0F0F0F] disabled:cursor-wait disabled:opacity-60">
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Check availability <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
      </button>
      <p className="mt-4 text-center text-[11px] text-black/35">No payment. We confirm availability and price first.</p>
    </form>
  );
}

export default function EventsFunnelPage() {
  const [plan, setPlan] = useState<EventPlan>(initialPlan);

  function updatePlan<K extends keyof EventPlan>(key: K, value: EventPlan[K]) {
    setPlan((current) => ({ ...current, [key]: value }));
  }

  function toggleAddOn(addOn: string) {
    setPlan((current) => ({
      ...current,
      addOns: current.addOns.includes(addOn)
        ? current.addOns.filter((item) => item !== addOn)
        : [...current.addOns, addOn],
    }));
  }

  function continueToBooking() {
    trackEvent(ANALYTICS_EVENTS.ctaClicked, {
      cta: 'events_plan_continue',
      event_type: plan.eventType,
      add_ons: plan.addOns.length,
    });
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="overflow-hidden bg-white pt-[72px]">
      <section className="relative isolate overflow-hidden bg-[#FBFAF8]">
        <Image
          src="/images/events-mesh-light.png?v=brand-magenta"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover object-center"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <EventsSectionNav />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-142px)] max-w-7xl items-center gap-4 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-2 lg:px-8 lg:pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="relative z-40 lg:py-16">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" /> Event photography + film
            </span>
            <h1 className="mt-6 text-[clamp(4rem,8.2vw,7.4rem)] font-bold leading-[0.82] tracking-[-0.06em] text-[#0F0F0F]">
              Your event.
              <span className="mt-2 block whitespace-nowrap font-serif text-[0.9em] font-normal italic tracking-[-0.04em] text-[#C72C5B]">All of it.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-black/55 sm:text-lg">
              Birthdays, graduations and company events across Surrey and London.
            </p>
            <div className="mt-8 flex flex-nowrap gap-2 sm:gap-3">
              <Link
                href="#book"
                onClick={() => trackEvent(ANALYTICS_EVENTS.ctaClicked, { cta: 'events_hero_check_date' })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-4 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0F0F0F] sm:px-7 sm:py-4 sm:text-sm"
              >
                Check your date <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#build" className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-3.5 text-[13px] font-bold text-[#0F0F0F] transition-colors hover:border-black hover:bg-[#0F0F0F] hover:text-white sm:px-7 sm:py-4 sm:text-sm">
                Build coverage
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-black/40">
              <CheckCircle2 className="h-4 w-4 text-[#C72C5B]" /> No payment today · clear quote first
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="-mt-6 sm:mt-0">
            <RotatingPhotoStack />
          </motion.div>
        </div>

        <div className="border-y border-black/[0.08] bg-white/75 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-xs font-semibold text-black/45 sm:px-6 lg:px-8">
            <span className="flex items-center gap-2"><Camera className="h-4 w-4 text-[#C72C5B]" /> Photo</span>
            <span className="flex items-center gap-2"><Video className="h-4 w-4 text-[#C72C5B]" /> Film</span>
            <span className="flex items-center gap-2"><Images className="h-4 w-4 text-[#C72C5B]" /> Private gallery</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#C72C5B]" /> Surrey + London</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#C72C5B]" /> Date checked first</span>
          </div>
        </div>
      </section>

      <CoverageBuilder plan={plan} updatePlan={updatePlan} toggleAddOn={toggleAddOn} continueToBooking={continueToBooking} />
      <ProofGallery />

      <section id="book" className="relative isolate scroll-mt-20 overflow-hidden bg-[#10090D] py-20 md:py-28">
        <Image
          src="/images/events-mesh-dark.png?v=brand-magenta"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover object-center"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/20" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-x-20 lg:gap-y-10 lg:px-8">
          <AnimatedContent direction="horizontal" distance={35} duration={0.8} className="lg:col-start-1 lg:row-start-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Final step</span>
              <h2 className="mt-4 text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Check the date.
              </h2>
              <p className="mt-5 max-w-md text-base text-white/55">Five details. We&apos;ll take it from there.</p>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={35} duration={0.8} delay={0.08} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <EventsEnquiry plan={plan} />
          </AnimatedContent>

          <AnimatedContent direction="horizontal" distance={25} duration={0.7} delay={0.12} className="lg:col-start-1 lg:row-start-2">
            <div className="border-t border-white/15">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-white/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-bold text-white marker:content-none">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 flex-none transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-white/55">{faq.answer}</p>
                </details>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
