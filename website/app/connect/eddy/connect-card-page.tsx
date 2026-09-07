import type { LucideIcon } from 'lucide-react';
import { BriefcaseBusiness, CalendarCheck, Layers3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { EDDY_PROFILE } from '@/lib/connect-profile';
import { ConnectActions } from './connect-actions';

type CardVariant = 'business' | 'events';

type Destination = {
  title: string;
  label: string;
  href: string;
  icon: LucideIcon;
  style: string;
  iconStyle: string;
};

const content: Record<
  CardVariant,
  {
    eyebrow: string;
    message: string;
    portrait: string;
    portraitClassName: string;
    portraitBackground: string;
  }
> = {
  business: {
    eyebrow: 'For business',
    message: 'I direct films and creative work that help businesses show who they are.',
    portrait: '/images/eddy-event-photographer-v2.png',
    portraitClassName: 'object-cover object-[center_34%] md:object-center',
    portraitBackground: 'bg-[#211416]',
  },
  events: {
    eyebrow: 'For personal celebrations',
    message: 'I photograph and film birthdays, celebrations and the people who make them special.',
    portrait: '/images/team-eddy-natural.png',
    portraitClassName: 'object-cover object-[center_38%] md:object-[center_28%]',
    portraitBackground: 'bg-[#ECB820]',
  },
};

const destinations: Destination[] = [
  {
    title: 'Agency',
    label: 'Business work',
    href: '/services/',
    icon: BriefcaseBusiness,
    style: 'bg-[#171214] text-white',
    iconStyle: 'bg-white/10 text-[#F08AAA]',
  },
  {
    title: 'Portfolio',
    label: 'Selected work',
    href: '/case-studies/',
    icon: Layers3,
    style:
      'bg-gradient-to-br from-[#8F1639] via-[#C72C5B] to-[#ED6F96] text-white shadow-[0_12px_28px_rgba(199,44,91,0.3)] ring-[#F4AFC4]',
    iconStyle: 'bg-white/15 text-white',
  },
  {
    title: 'Events',
    label: 'Personal celebrations',
    href: '/events/',
    icon: CalendarCheck,
    style: 'bg-white text-[#171214]',
    iconStyle: 'bg-[#F9E9EE] text-[#C72C5B]',
  },
];

export function ConnectCardPage({ variant }: { variant: CardVariant }) {
  const current = content[variant];
  const isBusiness = variant === 'business';
  const pageUrl = isBusiness ? EDDY_PROFILE.businessCardUrl : EDDY_PROFILE.eventsCardUrl;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: EDDY_PROFILE.name,
    jobTitle: EDDY_PROFILE.role,
    email: EDDY_PROFILE.email,
    telephone: EDDY_PROFILE.phoneE164,
    url: pageUrl,
    image: `https://wetrends.co.uk${current.portrait}`,
    worksFor: {
      '@type': 'ProfessionalService',
      name: EDDY_PROFILE.company,
      url: 'https://wetrends.co.uk/',
    },
  };

  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#F6F0F1] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/events-mesh-light.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/35" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col px-3 py-2 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <header className="flex h-10 flex-none items-center justify-between gap-3 sm:h-11">
          <Link
            href="/"
            aria-label="Visit WeTrends"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white/80 px-2 pr-3 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#171214]">
              <Image
                src="/images/logo-transparent.svg"
                alt=""
                width={20}
                height={20}
                className="h-4 w-auto brightness-0 invert"
              />
            </span>
            <span className="hidden text-xs font-black tracking-[-0.02em] min-[370px]:inline">WETRENDS</span>
          </Link>

          <nav
            aria-label="Choose card version"
            className="flex h-10 items-center rounded-full bg-white/75 p-1 text-[11px] font-bold shadow-sm ring-1 ring-black/5 backdrop-blur-md sm:text-xs"
          >
            <Link
              href="/connect/eddy/"
              aria-current={isBusiness ? 'page' : undefined}
              className={`grid h-8 place-items-center rounded-full px-3 transition sm:px-4 ${
                isBusiness ? 'bg-[#171214] text-white' : 'text-[#6D6064] hover:text-[#C72C5B]'
              }`}
            >
              Business
            </Link>
            <Link
              href="/connect/eddy/events/"
              aria-current={!isBusiness ? 'page' : undefined}
              className={`grid h-8 place-items-center rounded-full px-3 transition sm:px-4 ${
                !isBusiness ? 'bg-[#C72C5B] text-white' : 'text-[#6D6064] hover:text-[#C72C5B]'
              }`}
            >
              Personal
            </Link>
          </nav>
        </header>

        <section className="mt-2 grid min-h-0 flex-none grid-rows-[clamp(13rem,45svh,28rem)_auto] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/85 shadow-[0_24px_80px_rgba(91,24,48,0.16)] backdrop-blur-xl sm:mt-4 sm:rounded-[2.25rem] md:flex-1 md:grid-cols-[0.78fr_1.22fr] md:grid-rows-1">
          <div className={`relative min-h-0 overflow-hidden ${current.portraitBackground}`}>
            <Image
              src={current.portrait}
              alt="Eddy, Filmmaker and Creative Director at WeTrends"
              fill
              priority
              className={current.portraitClassName}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
          </div>

          <div className="flex min-h-0 flex-col justify-start px-4 py-3.5 sm:px-7 sm:py-6 md:justify-center md:px-9 md:py-7 lg:px-12 lg:py-9">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C72C5B] sm:text-xs">
                  {current.eyebrow}
                </p>
                <h1 className="mt-0.5 text-4xl font-black leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                  Eddy
                </h1>
              </div>
              <p className="max-w-[11rem] pt-1 text-right text-[10px] font-semibold leading-4 text-[#71666A] sm:max-w-none sm:text-xs">
                Filmmaker &amp; Creative Director
                <br />
                Serving London · Surrey
              </p>
            </div>

            <p className="mt-3 max-w-xl text-pretty text-lg font-bold leading-[1.18] tracking-[-0.035em] text-[#252022] sm:mt-4 sm:text-2xl lg:text-3xl">
              {current.message}
            </p>

            <ConnectActions variant={variant} />

            <nav aria-label="Explore WeTrends" className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              {destinations.map((destination) => (
                <Link
                  key={destination.title}
                  href={destination.href}
                  className={`group flex min-h-[76px] flex-col justify-between rounded-2xl p-2.5 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] sm:min-h-[96px] sm:rounded-[1.4rem] sm:p-3.5 ${destination.style}`}
                >
                  <span className={`grid h-7 w-7 place-items-center rounded-lg sm:h-8 sm:w-8 ${destination.iconStyle}`}>
                    <destination.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <span>
                    <span className="block text-[12px] font-bold leading-tight tracking-[-0.02em] sm:text-sm">
                      {destination.title}
                    </span>
                    <span className="mt-0.5 hidden text-[10px] opacity-60 sm:block">{destination.label}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}
