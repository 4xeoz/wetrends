import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllCaseStudySlugs, getCaseStudyBySlug } from '@/lib/case-studies-data';
import AnimatedContent from '@/components/ui/animated-content';

export const metadata: Metadata = {
  title: 'Case Studies | WeTrends Creative Agency Guildford',
  description: 'Explore real projects and results. See how WeTrends has helped businesses transform their brands and grow through web design, video production, and digital marketing.',
  alternates: {
    canonical: 'https://wetrends.co.uk/case-studies/',
  },
  openGraph: {
    title: 'Case Studies | WeTrends Creative Agency',
    description: 'Real projects, real results. See how WeTrends helps businesses grow through creative digital solutions in Guildford, Surrey, and beyond.',
    url: 'https://wetrends.co.uk/case-studies/',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

export default async function CaseStudiesPage() {
  const slugs = getAllCaseStudySlugs();
  const studies = slugs
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((study): study is NonNullable<typeof study> => study !== undefined);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Work',
    description: 'Case studies showcasing real projects and results from WeTrends.',
    url: 'https://wetrends.co.uk/case-studies/',
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F0F0F] py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#0F0F0F] to-[#C72C5B]/10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B]">
              Real Results
            </span>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.1} ease="power3.out">
            <h1 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Work We're
              <br />
              <span className="font-serif italic text-[#C72C5B]">Proud Of</span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.3} ease="power3.out">
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              See how we've helped businesses transform their brands and accelerate growth through strategic creative solutions.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {studies.map((study, index) => (
              <AnimatedContent
                key={study.slug}
                direction="vertical"
                distance={50}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <Link href={`/case-studies/${study.slug}/`} className="group block h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-[#C72C5B] hover:shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
                      {study.number} — {study.industry}
                    </span>
                    <h2 className="mt-4 text-2xl font-bold text-[#0F0F0F] transition-colors group-hover:text-[#C72C5B] md:text-3xl">
                      {study.client}
                    </h2>
                    <p className="mt-2 text-base text-gray-600">{study.tagline}</p>

                    <div className="mt-6 space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-500">Service</span>
                        <p className="text-base font-bold text-[#0F0F0F]">{study.service}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-500">Result</span>
                        <p className="text-2xl font-bold text-[#C72C5B]">
                          {study.metric}
                          <span className="ml-2 text-base font-semibold text-[#0F0F0F]">{study.metricLabel}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#C72C5B] transition-transform group-hover:translate-x-1">
                        View Case Study
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="text-3xl font-bold text-[#0F0F0F] md:text-4xl">
              Ready to Start Your <span className="font-serif italic text-[#C72C5B]">Story?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
              Let's talk about your project. We're ready to help you grow.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-all hover:bg-[#A3244A]"
            >
              Get in Touch
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
