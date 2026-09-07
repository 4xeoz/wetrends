import type { Metadata } from 'next';
import { EDDY_SOCIAL_IMAGE, EDDY_SOCIAL_IMAGE_PATH } from '@/lib/connect-profile';
import { ConnectCardPage } from '../connect-card-page';

export const metadata: Metadata = {
  title: 'Event Photography with Eddy | WeTrends',
  description:
    'Connect with Eddy for natural photography and film covering birthdays, celebrations and personal events across Surrey and London.',
  alternates: {
    canonical: 'https://wetrends.co.uk/connect/eddy/events/',
  },
  openGraph: {
    title: 'Your Event, Captured by WeTrends',
    description: 'Natural photography and film for the whole celebration.',
    url: 'https://wetrends.co.uk/connect/eddy/events/',
    type: 'profile',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [EDDY_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Photography with Eddy | WeTrends',
    description: 'Natural photography and film for the whole celebration.',
    images: [EDDY_SOCIAL_IMAGE_PATH],
  },
};

export default function EddyEventsConnectPage() {
  return <ConnectCardPage variant="events" />;
}
