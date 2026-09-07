import type { Metadata } from 'next';
import CinematographyHero from '@/app/_component/cinematography/hero';
import CinematographyPackages from '@/app/_component/cinematography/packages';
import CinematographyPortfolio from '@/app/_component/cinematography/portfolio';
import CinematographyBookingForm from '@/app/_component/cinematography/booking-form';
import CinematographyStickyCta from '@/app/_component/cinematography/sticky-cta';

export const metadata: Metadata = {
  title:
    'Graduation Photography & Cinematography Surrey | University of Surrey Guildford | WeTrends',
  description:
    'Professional graduation photography and cinematography for University of Surrey and Guildford students. 20 pictures across 3 spots from £35 or 50 pictures + cinematic video from £45. 48-hour delivery guaranteed. Book your graduation shoot today.',
  keywords: [
    'graduation photography Surrey',
    'graduation photographer Guildford',
    'University of Surrey graduation photos',
    'graduation cinematography Surrey',
    'student graduation photographer Guildford',
    'graduation photo packages Surrey',
    'professional graduation photos Guildford',
    'graduation video Surrey',
    'graduation photography near me Surrey',
    'affordable graduation photographer Surrey',
    'University of Surrey graduation photography',
    'Guildford graduation photographer',
  ],
  alternates: {
    canonical: 'https://wetrends.co.uk/cinematography/',
  },
  openGraph: {
    title:
      'Graduation Photography & Cinematography | University of Surrey | WeTrends',
    description:
      'Capture your graduation day at the University of Surrey with professional photography and cinematic video. Packages from £35 with 48-hour delivery.',
    url: 'https://wetrends.co.uk/cinematography/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Graduation portrait in academic dress',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graduation Photography & Cinematography Surrey | WeTrends',
    description:
      'Professional graduation photography and cinematography for University of Surrey students. From £35 with 48h delivery.',
    images: ['/images/events-graduation.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'WeTrends Graduation Photography',
  description:
    'Professional graduation photography and cinematography services for University of Surrey and Guildford students.',
  url: 'https://wetrends.co.uk/cinematography/',
  provider: {
    '@type': 'ProfessionalService',
    '@id': 'https://wetrends.co.uk/#organisation',
    name: 'WeTrends',
  },
  areaServed: [
    { '@type': 'City', name: 'Guildford' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
  ],
  priceRange: '££',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Graduation Photography Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Essentials Package – 20 Pictures',
        price: '35',
        priceCurrency: 'GBP',
        description:
          '20 raw pictures across 3 spots with 8 professionally edited graduation photos, delivered within 48 hours.',
      },
      {
        '@type': 'Offer',
        name: 'Premium Package – 15 Pictures',
        price: '45',
        priceCurrency: 'GBP',
        description:
          '15 professionally edited graduation photos of your choice, delivered within 48 hours.'
      },
    ],
  },
};

export default function CinematographyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white">
        <CinematographyHero />
        <CinematographyPackages />
        <CinematographyPortfolio />
        <CinematographyBookingForm />
        <CinematographyStickyCta />
      </div>
    </>
  );
}
