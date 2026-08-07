import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/lib/case-studies-data';
import { reels } from '@/lib/reels-data';
import WorkHero from './_components/work-hero';
import CaseCards from './_components/case-cards';
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

      {/* Closing CTA */}
      <section className="border-t border-gray-200 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-gray-400">
            Your project, next
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-[0.95] tracking-tight text-[#0F0F0F] sm:text-4xl md:text-5xl">
            Ready to write{' '}
            <span className="font-serif font-normal italic text-[#C72C5B]">
              your story?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
            Let&apos;s talk about your project. We&apos;re ready to help you grow.
          </p>
          <Link
            href="/#contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-colors hover:bg-[#A3244A]"
          >
            Get in Touch
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
