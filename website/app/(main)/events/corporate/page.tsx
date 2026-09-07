import type { Metadata } from 'next';
import EventSpecialistPage from '@/app/_component/events/event-specialist-page';

export const metadata: Metadata = {
  title: 'Corporate Event Photography & Video London and Surrey | WeTrends',
  description:
    'Polished photography and video for conferences, launches, awards and company events across London and Surrey.',
  alternates: {
    canonical: 'https://wetrends.co.uk/events/corporate/',
  },
  openGraph: {
    title: 'Corporate Event Photography & Video | WeTrends',
    description: 'Fast, polished event content for press, teams and next-day social.',
    url: 'https://wetrends.co.uk/events/corporate/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: '/images/events-corporate-stage.png',
        width: 1672,
        height: 941,
        alt: 'A keynote speaker presenting to a professional audience in London',
      },
    ],
  },
};

export default function CorporateRoute() {
  return <EventSpecialistPage kind="corporate" />;
}
