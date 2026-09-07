import type { Metadata } from 'next';
import EventSpecialistPage from '@/app/_component/events/event-specialist-page';

export const metadata: Metadata = {
  title: 'Event Photography & Video Portfolio | WeTrends',
  description:
    'Selected WeTrends photography and film work from celebrations, conferences, launches and milestone events across Surrey and London.',
  alternates: {
    canonical: 'https://wetrends.co.uk/events/work/',
  },
  openGraph: {
    title: 'Selected Event Work | WeTrends',
    description: 'Celebrations, conferences, launches and milestones photographed without stopping the flow.',
    url: 'https://wetrends.co.uk/events/work/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: '/images/events-celebration-toast.png',
        width: 1672,
        height: 941,
        alt: 'A collection of event photography by WeTrends',
      },
    ],
  },
};

export default function EventWorkRoute() {
  return <EventSpecialistPage kind="work" />;
}
