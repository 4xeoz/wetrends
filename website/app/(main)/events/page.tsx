import type { Metadata } from 'next';
import EventsPage from '@/app/_component/events/events-funnel-page';

export const metadata: Metadata = {
  title: 'Event Photography & Video London and Surrey | WeTrends',
  description:
    'Natural event photography and cinematic video for birthdays, private celebrations, launches, conferences and corporate events across Surrey and London.',
  alternates: {
    canonical: 'https://wetrends.co.uk/events/',
  },
  openGraph: {
    title: 'Event Photography & Video | WeTrends',
    description:
      'Thoughtful photography and film for celebrations and corporate events across Surrey and London.',
    url: 'https://wetrends.co.uk/events/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: '/images/events-hero.png',
        width: 1664,
        height: 936,
        alt: 'Guests celebrating together at an evening event',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Photography & Video | WeTrends',
    description:
      'Photography and film for birthdays, celebrations and corporate events across Surrey and London.',
    images: ['/images/events-hero.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'WeTrends Event Photography and Video',
  serviceType: 'Event photography and videography',
  description:
    'Photography and video coverage for private celebrations, birthdays, graduations, conferences, launches and corporate events.',
  url: 'https://wetrends.co.uk/events/',
  provider: {
    '@type': 'ProfessionalService',
    name: 'WeTrends',
    url: 'https://wetrends.co.uk/',
  },
  areaServed: [
    { '@type': 'City', name: 'London' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Event coverage options',
    itemListElement: [
      { '@type': 'Offer', name: 'Up to two hours of event coverage' },
      { '@type': 'Offer', name: 'Up to four hours of event coverage' },
      { '@type': 'Offer', name: 'Full-day event coverage' },
    ],
  },
};

export default function EventsRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <EventsPage />
    </>
  );
}
