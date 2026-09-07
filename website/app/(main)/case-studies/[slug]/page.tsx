import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
  getNextCaseStudy,
} from '@/lib/case-studies-data';
import CaseStudyDetail from './case-study-detail';
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/social-metadata';

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  const url = `https://wetrends.co.uk/case-studies/${study.slug}/`;
  const title = `${study.client} Case Study | WeTrends`;
  return {
    title,
    description: study.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: study.description,
      url,
      type: 'article',
      locale: 'en_GB',
      siteName: 'WeTrends',
      images: study.image
        ? [{ url: study.image, alt: `${study.client} case study by WeTrends` }]
        : [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: study.description,
      images: [study.image || DEFAULT_SOCIAL_IMAGE_PATH],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();
  const next = getNextCaseStudy(slug);
  return <CaseStudyDetail study={study} next={next} />;
}
