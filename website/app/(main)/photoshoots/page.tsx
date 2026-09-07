import type { Metadata } from 'next';
import PhotoshootsPage from '@/app/_component/photoshoots/photoshoots-page';

export const metadata: Metadata = {
  title: 'London Photoshoots for People, Teams & Brands | WeTrends',
  description:
    'Planned, directed photoshoots for portraits, personal brands, teams, products and graduations across London and Surrey.',
  keywords: [
    'London photoshoot',
    'personal brand photographer London',
    'corporate headshots London',
    'team photography London',
    'product photography London',
    'graduation photography Surrey',
  ],
  alternates: { canonical: 'https://wetrends.co.uk/photoshoots/' },
  openGraph: {
    title: 'London Photoshoots for People, Teams & Brands | WeTrends',
    description: 'Portrait, team, product, personal-brand and graduation photography with clear direction and useful deliverables.',
    url: 'https://wetrends.co.uk/photoshoots/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Photoshoots for people, teams and brands',
  description:
    'Portrait, personal-brand, team, product and graduation photoshoots serving London, Surrey and UK clients.',
  url: 'https://wetrends.co.uk/photoshoots/',
  provider: {
    '@type': 'ProfessionalService',
    '@id': 'https://wetrends.co.uk/#organisation',
    name: 'WeTrends',
  },
  areaServed: [
    { '@type': 'City', name: 'London' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What kinds of photoshoots do WeTrends offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WeTrends plans portraits, personal-brand shoots, team headshots, product and campaign photography, and graduation sessions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work across London?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We serve clients across London and Surrey and confirm the location, access and travel requirements in the quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you help with shot lists and direction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every commercial shoot starts with the intended use, audience and required formats so the shot list supports the campaign.',
      },
    },
  ],
};

export default function PhotoshootsRoute() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PhotoshootsPage />
    </>
  );
}
