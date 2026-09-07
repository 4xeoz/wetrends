import type { Metadata } from 'next';
import { EDDY_SOCIAL_IMAGE, EDDY_SOCIAL_IMAGE_PATH } from '@/lib/connect-profile';
import { ConnectCardPage } from './connect-card-page';

export const metadata: Metadata = {
  title: 'Connect with Eddy | WeTrends',
  description:
    'Connect with Eddy, Filmmaker and Creative Director at WeTrends. Explore our agency services, portfolio and event photography and film.',
  alternates: {
    canonical: 'https://wetrends.co.uk/connect/eddy/',
  },
  openGraph: {
    title: 'Eddy | Filmmaker & Creative Director at WeTrends',
    description:
      'Brand, digital, content and event production from WeTrends. Save Eddy’s details or start a project.',
    url: 'https://wetrends.co.uk/connect/eddy/',
    type: 'profile',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [EDDY_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect with Eddy | WeTrends',
    description: 'Creative direction, brand, digital and event production.',
    images: [EDDY_SOCIAL_IMAGE_PATH],
  },
};

export default function EddyConnectPage() {
  return <ConnectCardPage variant="business" />;
}
