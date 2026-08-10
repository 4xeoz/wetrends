import type { Metadata } from 'next';
import { caseStudies } from '@/lib/case-studies-data';
import { reels } from '@/lib/reels-data';
import { foodShoots } from '@/lib/food-photography-data';
import WorkHero from './_components/work-hero';
import CaseCards from './_components/case-cards';
import FoodSection from './_components/food-section';
import ReelWall from '@/components/reels/reel-wall';

export const metadata: Metadata = {
  title: 'Case Studies | WeTrends Creative Agency Guildford',
  description:
    'Explore real projects and results. See how WeTrends has helped businesses transform their brands and grow through web design, video production, and digital marketing.',
  alternates: {
    canonical: 'https://wetrends.co.uk/case-studies/',
  },
  openGraph: {
    title: 'Case Studies | WeTrends Creative Agency',
    description:
      'Real projects, real results. See how WeTrends helps businesses grow through creative digital solutions in Guildford, Surrey, and beyond.',
    url: 'https://wetrends.co.uk/case-studies/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

export default function CaseStudiesPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Work',
    description: 'Case studies showcasing real projects and results from WeTrends.',
    url: 'https://wetrends.co.uk/case-studies/',
  };

  return (
    <main className="bg-[#e9e9e9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <WorkHero />
      <ReelWall reels={reels} />
      <CaseCards studies={caseStudies} />
      <FoodSection shoots={foodShoots} />

    </main>
  );
}
