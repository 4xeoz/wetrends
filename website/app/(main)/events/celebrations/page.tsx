import type { Metadata } from 'next';
import EventSpecialistPage from '@/app/_component/events/event-specialist-page';

export const metadata: Metadata = {
  title: 'Celebration Photography & Video London and Surrey | WeTrends',
  description:
    'Natural photography and film for birthdays, graduations, anniversaries and milestone celebrations across Surrey and London.',
  alternates: {
    canonical: 'https://wetrends.co.uk/events/celebrations/',
  },
  openGraph: {
    title: 'Celebration Photography & Film | WeTrends',
    description: 'Candid coverage for birthdays, graduations and milestone celebrations.',
    url: 'https://wetrends.co.uk/events/celebrations/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: '/images/events-celebration-toast.png',
        width: 1672,
        height: 941,
        alt: 'Friends and family raising glasses at a celebration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celebration Photography & Film | WeTrends',
    description: 'Candid coverage for birthdays, graduations and milestone celebrations.',
    images: ['/images/events-celebration-toast.png'],
  },
};

export default function CelebrationsRoute() {
  return <EventSpecialistPage kind="celebrations" />;
}
