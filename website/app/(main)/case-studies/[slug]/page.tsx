import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCaseStudyBySlug, getAllCaseStudySlugs } from '@/lib/case-studies-data';
import CaseStudyDetail from './case-study-detail';

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
  return {
    title: `${study.client} Case Study | WeTrends`,
    description: study.description,
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
  return <CaseStudyDetail study={study} />;
}
