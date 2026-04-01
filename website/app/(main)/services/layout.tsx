import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Creative Digital Agency Guildford',
  description: 'Explore our full range of creative services: video production, brand identity, web design, social media management, animation, and content strategy.',
  alternates: {
    canonical: 'https://wetrends.co.uk/services/',
  },
  openGraph: {
    title: 'Our Services | WeTrends Creative Agency',
    description: 'Full-service creative agency offering video production, branding, web design, and digital marketing in Guildford, Surrey.',
    url: 'https://wetrends.co.uk/services/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
