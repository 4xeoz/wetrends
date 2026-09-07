'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Heart,
  Images,
  MapPin,
  Video,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { EventsEnquiry, type EventPlan } from './events-funnel-page';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/posthog';

export type EventSpecialistPageKind = 'celebrations' | 'corporate' | 'work';

type GalleryItem = {
  src: string;
  label: string;
  alt: string;
  className: string;
  objectPosition?: string;
};

type SpecialistPageConfig = {
  kind: EventSpecialistPageKind;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  hero: [GalleryItem, GalleryItem, GalleryItem];
  signals: [string, string, string];
  valueEyebrow: string;
  valueTitle: string;
  valueAccent: string;
  values: Array<{ title: string; copy: string }>;
  gallery: GalleryItem[];
  plan: EventPlan;
  bookingEyebrow: string;
  bookingTitle: string;
  bookingCopy: string;
  faqs: Array<{ question: string; answer: string }>;
};

const configs: Record<EventSpecialistPageKind, SpecialistPageConfig> = {
  celebrations: {
    kind: 'celebrations',
    eyebrow: 'Birthdays · graduations · milestones',
    title: 'Be there.',
    accent: 'We’ll keep it.',
    description: 'Natural photographs and films of the people, reactions and little moments you missed.',
    primaryCta: 'Check your date',
    secondaryCta: 'See celebration work',
    hero: [
      {
        src: '/images/events-celebration.png',
        label: 'Dance floor',
        alt: 'Friends dancing together at a celebration',
        className: '',
      },
      {
        src: '/images/events-birthday.png',
        label: 'Birthday',
        alt: 'A guest reacting to a birthday cake surrounded by friends',
        className: '',
      },
      {
        src: '/images/events-celebration-dance.png',
        label: 'Milestone',
        alt: 'A multigenerational family dancing at a milestone celebration',
        className: '',
      },
    ],
    signals: ['Relaxed direction', 'Private gallery', 'Surrey + London'],
    valueEyebrow: 'What we notice',
    valueTitle: 'The good bits.',
    valueAccent: 'And everything between.',
    values: [
      { title: 'Your people', copy: 'Candid moments and easy groups.' },
      { title: 'The feeling', copy: 'Room, details and dance floor.' },
      { title: 'Ready to share', copy: 'A polished private gallery.' },
    ],
    gallery: [
      {
        src: '/images/events-celebration-toast.png',
        label: 'The toast',
        alt: 'Friends and family raising glasses during a celebration toast',
        className: 'col-span-2 row-span-2 lg:col-span-7 lg:row-span-2',
      },
      {
        src: '/images/events-birthday.png',
        label: 'The surprise',
        alt: 'A guest reacting to a birthday cake surrounded by friends',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-graduation.png',
        label: 'The achievement',
        alt: 'Graduates celebrating together outside a university',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-celebration-dance.png',
        label: 'The dance floor',
        alt: 'A family dancing together at an evening celebration',
        className: 'col-span-2 lg:col-span-4',
      },
      {
        src: '/images/events-anniversary.png',
        label: 'The milestone',
        alt: 'A couple dancing at an anniversary celebration',
        className: 'lg:col-span-4',
      },
      {
        src: '/images/events-celebration.png',
        label: 'The energy',
        alt: 'Guests laughing together on a celebration dance floor',
        className: 'lg:col-span-4',
      },
    ],
    plan: {
      eventType: 'Birthday or celebration',
      duration: 'Up to 4 hours',
      media: 'Photography',
      addOns: [],
    },
    bookingEyebrow: 'Keep the date',
    bookingTitle: 'Check the date.',
    bookingCopy: 'Five details. Clear quote next.',
    faqs: [
      {
        question: 'Will you organise group photos?',
        answer: 'Yes. We keep them quick and relaxed so everyone can get back to the celebration.',
      },
      {
        question: 'What if the party runs late?',
        answer: 'Extra time is agreed with you first in clear 30-minute blocks.',
      },
      {
        question: 'Can guests download the gallery?',
        answer: 'Yes. Your private gallery includes high-resolution and sharing-ready files.',
      },
    ],
  },
  corporate: {
    kind: 'corporate',
    eyebrow: 'Conferences · launches · company events',
    title: 'Look as good',
    accent: 'as it felt.',
    description: 'Fast, polished event coverage built for press, teams and next-day social.',
    primaryCta: 'Check availability',
    secondaryCta: 'See corporate work',
    hero: [
      {
        src: '/images/events-corporate-stage.png',
        label: 'Keynotes',
        alt: 'A keynote speaker presenting to a professional audience in London',
        className: '',
      },
      {
        src: '/images/events-corporate.png',
        label: 'People',
        alt: 'Guests networking at a corporate reception',
        className: '',
      },
      {
        src: '/images/events-corporate-award.png',
        label: 'Awards',
        alt: 'A company team celebrating an award at an evening reception',
        className: '',
      },
    ],
    signals: ['Fast previews', 'Brand-aware coverage', 'Photo + film'],
    valueEyebrow: 'Built to work',
    valueTitle: 'One event.',
    valueAccent: 'More useful content.',
    values: [
      { title: 'Stage', copy: 'Speakers, panels and awards.' },
      { title: 'People', copy: 'Networking and team moments.' },
      { title: 'Brand', copy: 'Details, atmosphere and activations.' },
    ],
    gallery: [
      {
        src: '/images/events-corporate-stage.png',
        label: 'Keynote',
        alt: 'A keynote speaker presenting to a full professional audience',
        className: 'col-span-2 row-span-2 lg:col-span-7 lg:row-span-2',
      },
      {
        src: '/images/events-corporate.png',
        label: 'Networking',
        alt: 'Professionals talking at a corporate reception',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-speaker.png',
        label: 'Speaker',
        alt: 'A speaker addressing guests at a corporate event',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-corporate-award.png',
        label: 'Awards',
        alt: 'A company team applauding an award recipient',
        className: 'col-span-2 lg:col-span-4',
      },
      {
        src: '/images/events-launch.png',
        label: 'Launch',
        alt: 'Guests talking at a product launch reception',
        className: 'lg:col-span-4',
      },
      {
        src: '/images/events-awards.png',
        label: 'Team',
        alt: 'An award recipient surrounded by applauding colleagues',
        className: 'lg:col-span-4',
      },
    ],
    plan: {
      eventType: 'Corporate event',
      duration: 'Up to 4 hours',
      media: 'Photography and video',
      addOns: ['Fast previews'],
    },
    bookingEyebrow: 'Brief us once',
    bookingTitle: 'Is the date open?',
    bookingCopy: 'Five details. We build the coverage.',
    faqs: [
      {
        question: 'Can you deliver images during the event?',
        answer: 'Yes. Add fast previews and we can supply a curated set for press or social.',
      },
      {
        question: 'Can you cover more than one room?',
        answer: 'Yes. We shape the team around your schedule, rooms and priority moments.',
      },
      {
        question: 'Can our company use the files commercially?',
        answer: 'Yes. Usage is agreed clearly in your quote so your team knows where it can publish.',
      },
    ],
  },
  work: {
    kind: 'work',
    eyebrow: 'Selected event work',
    title: 'Real rooms.',
    accent: 'Real moments.',
    description: 'Celebrations, conferences, launches and milestones—photographed without stopping the flow.',
    primaryCta: 'Start a brief',
    secondaryCta: 'Explore the work',
    hero: [
      {
        src: '/images/events-celebration-toast.png',
        label: 'Celebrations',
        alt: 'Friends and family raising glasses at a celebration',
        className: '',
      },
      {
        src: '/images/events-corporate-stage.png',
        label: 'Corporate',
        alt: 'A keynote speaker presenting to a professional audience',
        className: '',
      },
      {
        src: '/images/events-graduation.png',
        label: 'Milestones',
        alt: 'Graduates celebrating together outside a university',
        className: '',
      },
    ],
    signals: ['Celebrations', 'Corporate', 'Photography + film'],
    valueEyebrow: 'Selected frames',
    valueTitle: 'Work that feels',
    valueAccent: 'lived in.',
    values: [
      { title: 'Celebrations', copy: 'Birthdays, graduations, milestones.' },
      { title: 'Corporate', copy: 'Conferences, launches and awards.' },
      { title: 'Photo + film', copy: 'One team. One visual language.' },
    ],
    gallery: [
      {
        src: '/images/events-celebration-toast.png',
        label: 'Celebration',
        alt: 'Friends and family raising glasses during a celebration toast',
        className: 'col-span-2 row-span-2 lg:col-span-7 lg:row-span-2',
      },
      {
        src: '/images/events-corporate-stage.png',
        label: 'Conference',
        alt: 'A keynote speaker presenting to a full professional audience',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-birthday.png',
        label: 'Birthday',
        alt: 'A guest reacting to a birthday cake',
        className: 'lg:col-span-5',
      },
      {
        src: '/images/events-corporate-award.png',
        label: 'Awards',
        alt: 'A company team celebrating an award',
        className: 'col-span-2 lg:col-span-4',
      },
      {
        src: '/images/events-graduation.png',
        label: 'Graduation',
        alt: 'Graduates celebrating together outside a university',
        className: 'lg:col-span-4',
      },
      {
        src: '/images/events-launch.png',
        label: 'Launch',
        alt: 'Guests talking at a product launch reception',
        className: 'lg:col-span-4',
      },
      {
        src: '/images/events-celebration-dance.png',
        label: 'Milestone',
        alt: 'A multigenerational family dancing at a celebration',
        className: 'col-span-2 lg:col-span-5',
      },
      {
        src: '/images/events-corporate.png',
        label: 'Reception',
        alt: 'Professionals networking at a corporate reception',
        className: 'col-span-2 lg:col-span-7',
      },
    ],
    plan: {
      eventType: 'Event coverage',
      duration: 'Up to 4 hours',
      media: 'Photography',
      addOns: [],
    },
    bookingEyebrow: 'Your turn',
    bookingTitle: 'Have a date?',
    bookingCopy: 'Five details. We’ll shape the rest.',
    faqs: [
      {
        question: 'Do you cover events outside this gallery?',
        answer: 'Yes. Tell us what is happening and we will shape the right coverage around it.',
      },
      {
        question: 'Can I combine photography and film?',
        answer: 'Yes. One joined-up team keeps the coverage consistent and unobtrusive.',
      },
      {
        question: 'Where do you work?',
        answer: 'We regularly cover Surrey and London, and can travel for the right event.',
      },
    ],
  },
};

const sectionLinks = [
  { href: '/events/', label: 'Events', key: 'events' },
  { href: '/events/celebrations/', label: 'Celebrations', key: 'celebrations' },
  { href: '/events/corporate/', label: 'Corporate', key: 'corporate' },
  { href: '/events/work/', label: 'Work', key: 'work' },
] as const;

function EventSectionNav({ active }: { active: EventSpecialistPageKind }) {
  return (
    <nav aria-label="Event pages" className="scrollbar-hide flex max-w-full gap-1.5 overflow-x-auto pb-2 sm:gap-2">
      {sectionLinks.map((item) => {
        const isActive = item.key === active;
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

function HeroStack({ items }: { items: [GalleryItem, GalleryItem, GalleryItem] }) {
  const placements = [
    'left-[3%] top-[13%] z-20 h-[70%] w-[57%] -rotate-[4deg]',
    'right-[2%] top-[4%] z-10 h-[54%] w-[45%] rotate-[6deg]',
    'bottom-[4%] right-[7%] z-30 h-[48%] w-[43%] -rotate-[1.5deg]',
  ];

  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[650px] sm:h-[560px] lg:h-[650px]">
      <div aria-hidden="true" className="absolute bottom-[3%] right-[2%] h-[65%] w-[56%] rotate-6 rounded-[2.8rem] bg-[#C72C5B] sm:rounded-[4rem]" />
      {items.map((item, index) => (
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, y: 24, rotate: index === 1 ? 2 : -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.75, delay: 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute overflow-hidden rounded-[1.8rem] border-[7px] border-white bg-[#EEE9E5] shadow-[0_28px_80px_rgba(38,20,26,0.2)] sm:rounded-[2.4rem] sm:border-[10px] ${placements[index]}`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 58vw, 380px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <figcaption className={`absolute left-0 p-4 text-xs font-bold text-white sm:p-5 sm:text-sm ${index === 0 ? 'bottom-[20%]' : 'bottom-0'}`}>
            {item.label}
          </figcaption>
        </motion.figure>
      ))}
      <div className="absolute bottom-[8%] left-[1%] z-40 flex h-20 w-20 -rotate-6 items-center justify-center rounded-full border-4 border-white bg-[#0F0F0F] text-center text-[9px] font-bold uppercase leading-tight tracking-[0.13em] text-white shadow-xl sm:h-24 sm:w-24 sm:text-[10px]">
        Real<br />moments
      </div>
    </div>
  );
}

function ProofGallery({ config }: { config: SpecialistPageConfig }) {
  return (
    <section id="work" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="vertical" distance={28} duration={0.75}>
          <div className="grid gap-7 border-b border-black/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">{config.valueEyebrow}</span>
              <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-[#0F0F0F] sm:text-5xl lg:text-7xl">
                {config.valueTitle}{' '}
                <span className="font-serif font-normal italic text-[#C72C5B]">{config.valueAccent}</span>
              </h2>
            </div>
            <Link href="#book" className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-[#C72C5B]">
              Check your date <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-3 border-b border-black/10">
          {config.values.map((item, index) => (
            <div key={item.title} className="border-r border-black/10 px-2 py-5 last:border-r-0 sm:px-7 sm:py-7 sm:first:pl-0 sm:last:pr-0">
              <span className="font-mono text-[10px] font-bold text-[#C72C5B]">0{index + 1}</span>
              <h3 className="mt-3 text-[13px] font-bold leading-tight text-[#0F0F0F] sm:text-lg">{item.title}</h3>
              <p className="mt-1 hidden text-sm text-black/45 sm:block">{item.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] lg:grid-cols-12 lg:auto-rows-[300px]">
          {config.gallery.map((item, index) => (
            <AnimatedContent key={`${item.src}-${index}`} direction="vertical" distance={20} duration={0.65} delay={Math.min(index * 0.04, 0.24)} className={item.className}>
              <figure className="group relative h-full overflow-hidden rounded-2xl bg-[#EEE9E5] sm:rounded-3xl">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 flex items-center gap-2 p-4 text-sm font-bold text-white sm:p-6">
                  {item.label} <ArrowUpRight className="h-4 w-4" />
                </figcaption>
              </figure>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingClose({ config }: { config: SpecialistPageConfig }) {
  return (
    <section id="book" className="relative isolate scroll-mt-20 overflow-hidden bg-[#10090D] py-20 md:py-28">
      <Image
        src="/images/events-mesh-dark.png?v=brand-magenta"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover object-center"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/25" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-x-20 lg:gap-y-10 lg:px-8">
        <AnimatedContent direction="horizontal" distance={35} duration={0.8} className="lg:col-start-1 lg:row-start-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E15A82]">{config.bookingEyebrow}</span>
            <h2 className="mt-4 text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              {config.bookingTitle}
            </h2>
            <p className="mt-5 max-w-md text-base text-white/55">{config.bookingCopy}</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={35} duration={0.8} delay={0.08} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <EventsEnquiry plan={config.plan} changeHref="/events/#build" />
        </AnimatedContent>

        <AnimatedContent direction="horizontal" distance={25} duration={0.7} delay={0.12} className="lg:col-start-1 lg:row-start-2">
          <div className="border-t border-white/15">
            {config.faqs.map((faq) => (
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
  );
}

export default function EventSpecialistPage({ kind }: { kind: EventSpecialistPageKind }) {
  const config = configs[kind];

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
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/12" />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
          <EventSectionNav active={kind} />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-142px)] max-w-7xl items-center gap-4 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-4 lg:px-8 lg:pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} className="relative z-40 lg:py-12">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" /> {config.eyebrow}
            </span>
            <h1 className="mt-6 text-[clamp(3.6rem,7.4vw,7rem)] font-bold leading-[0.84] tracking-[-0.06em] text-[#0F0F0F]">
              {config.title}
              <span className="mt-2 block font-serif text-[0.88em] font-normal italic tracking-[-0.04em] text-[#C72C5B]">{config.accent}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-black/55 sm:text-lg">{config.description}</p>
            <div className="mt-8 flex flex-nowrap gap-2 sm:gap-3">
              <Link
                href="#book"
                onClick={() => trackEvent(ANALYTICS_EVENTS.ctaClicked, { cta: `events_${kind}_hero_book` })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-4 py-3.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0F0F0F] sm:px-7 sm:py-4 sm:text-sm"
              >
                {config.primaryCta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#work" className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-3.5 text-[13px] font-bold text-[#0F0F0F] transition-colors hover:border-black hover:bg-[#0F0F0F] hover:text-white sm:px-7 sm:py-4 sm:text-sm">
                {config.secondaryCta}
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-black/40">
              <Check className="h-4 w-4 text-[#C72C5B]" /> Clear quote first · no payment today
            </p>
          </motion.div>

          <HeroStack items={config.hero} />
        </div>

        <div className="relative border-y border-black/[0.08] bg-white/75 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-black/[0.08] px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {config.signals.map((signal, index) => {
              const Icon = index === 0 ? (kind === 'celebrations' ? Heart : kind === 'corporate' ? Clock : Images) : index === 1 ? (kind === 'corporate' ? Briefcase : Camera) : kind === 'celebrations' ? MapPin : Video;
              return (
                <div key={signal} className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-black/50">
                  <Icon className="h-4 w-4 text-[#C72C5B]" /> {signal}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProofGallery config={config} />
      <BookingClose config={config} />
    </main>
  );
}
