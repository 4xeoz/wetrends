import type { Metadata } from 'next';
import EventSpecialistPage from '@/app/_component/events/event-specialist-page';

export const metadata: Metadata = {
  title: 'Event Coverage Visual Direction | WeTrends',
  description:
    'Illustrative coverage directions for celebrations, conferences, launches and milestone events across London and Surrey.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://wetrends.co.uk/events/work/',
  },
  openGraph: {
    title: 'Event Coverage Visual Direction | WeTrends',
    description: 'Illustrative directions for celebrations, conferences, launches and milestones.',
    url: 'https://wetrends.co.uk/events/work/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: '/images/events-celebration-toast.png',
        width: 1672,
        height: 941,
        alt: 'AI-assisted illustrative event coverage concept',
      },
    ],
  },
};

export default function EventWorkRoute() {
  return <EventSpecialistPage kind="work" />;
}
