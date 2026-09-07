import type { Metadata } from 'next';
import { serviceSlugs } from '@/lib/services-data';

export const metadata: Metadata = {
  title: 'Creative Technology & Production Services London | WeTrends',
  description: 'Explore our full range of creative services: video production, brand identity, web design, social media management, animation, and content strategy.',
  alternates: {
    canonical: 'https://wetrends.co.uk/services/',
  },
  openGraph: {
    title: 'Our Services | WeTrends Creative Agency',
    description: 'Web, brand, production, social, animation and content services for London, Surrey and UK clients.',
    url: 'https://wetrends.co.uk/services/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Our Services',
  description: 'Web, brand, production, social, animation and content services for London, Surrey and UK clients.',
  url: 'https://wetrends.co.uk/services/',
  hasPart: serviceSlugs.map((slug) => ({
    '@type': 'Service',
    url: `https://wetrends.co.uk/services/${slug}/`,
  })),
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
