import type { Metadata } from 'next';
import CinematographyHero from '@/app/_component/cinematography/hero';
import CinematographyPackages from '@/app/_component/cinematography/packages';
import CinematographyPortfolio from '@/app/_component/cinematography/portfolio';
import CinematographyHowItWorks from '@/app/_component/cinematography/how-it-works';
import CinematographyBookingForm from '@/app/_component/cinematography/booking-form';
import CinematographyTrust from '@/app/_component/cinematography/trust';

export const metadata: Metadata = {
  title:
    'Graduation Photography & Cinematography Surrey | University of Surrey Guildford | WeTrends',
  description:
    'Professional graduation photography and cinematography for University of Surrey and Guildford students. 8 stunning photos from £35 or 10 photos + cinematic video from £45. 48-hour delivery. Book your graduation shoot today.',
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
    'University of Surrey graduation 2025',
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
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Graduation Photography Surrey by WeTrends',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graduation Photography & Cinematography Surrey | WeTrends',
    description:
      'Professional graduation photography for University of Surrey students. From £35 with 48h delivery.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'WeTrends Graduation Photography',
  description:
    'Professional graduation photography and cinematography services for University of Surrey and Guildford students.',
  url: 'https://wetrends.co.uk/cinematography/',
  telephone: '+44-7700-000000',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Guildford',
    addressRegion: 'Surrey',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '51.2362',
    longitude: '-0.5704',
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
        name: 'Essentials Package – 8 Photos',
        price: '35',
        priceCurrency: 'GBP',
        description:
          '8 professionally edited graduation photos of your choice, delivered within 48 hours.',
      },
      {
        '@type': 'Offer',
        name: 'Premium Package – 10 Photos + Cinematic Video',
        price: '45',
        priceCurrency: 'GBP',
        description:
          '10 professionally edited graduation photos plus a short cinematic video optimised for social media and LinkedIn, delivered within 48 hours.',
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
      <div className="min-h-screen bg-[#0a0a0a]">
        <CinematographyHero />
        <CinematographyTrust />
        <CinematographyPackages />
        <CinematographyPortfolio />
        <CinematographyHowItWorks />
        <CinematographyBookingForm />
      </div>
    </>
  );
}
