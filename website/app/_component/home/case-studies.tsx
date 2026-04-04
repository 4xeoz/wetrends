'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const caseStudies = [
  {
    number: '01',
    client: 'Surrey Wellness',
    service: 'Web Design',
    metric: '+250%',
    metricLabel: 'Increase in online enquiries',
    description:
      'Rebuilt their digital presence with a conversion-first approach. The new site outranked 3 competitors and became their top lead source within 60 days.',
    href: '/case-studies/surrey-wellness/',
    accent: true,
  },
  {
    number: '02',
    client: 'Guildford Cafe Co',
    service: 'Social Media',
    metric: '500 → 50k',
    metricLabel: 'Followers in 6 months',
    description:
      'Built a content strategy rooted in local culture. Community engagement drove a 4.2× ROI on social spend and turned followers into regulars.',
    href: '/case-studies/guildford-cafe-co/',
    accent: false,
  },
  {
    number: '03',
    client: 'TechStart UK',
    service: 'Video Production',
    metric: '1,200%',
    metricLabel: 'Boost in content shares',
    description:
      'Created a brand film that became the centrepiece of their £2M funding pitch. Viewed 250,000 times in the first week across all channels.',
    href: '/case-studies/techstart-uk/',
    accent: true,
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="bg-white py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-end">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div>
              <span className="mb-6 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                Case Studies
              </span>
              <h2 className="text-5xl font-bold leading-none text-[#0F0F0F] md:text-6xl lg:text-7xl xl:text-8xl">
                Work That
                <br />
                <span className="font-serif italic text-[#C72C5B]">Speaks</span>
              </h2>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.2} ease="power3.out">
            <p className="max-w-md text-xl text-gray-600 lg:ml-auto">
              Real results for real businesses. Here&apos;s what happens when strategy meets execution.
            </p>
          </AnimatedContent>
        </div>

        {/* Case Studies List */}
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {caseStudies.map((study, index) => (
            <AnimatedContent
              key={study.number}
              direction="vertical"
              distance={60}
              duration={1}
              delay={0.1 * index}
              ease="power3.out"
            >
              <Link href={study.href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="group grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:items-center"
                >
                  {/* Number + Client + Tag */}
                  <div className="lg:col-span-4">
                    <span className="mb-3 block text-sm font-bold text-gray-300">
                      {study.number}
                    </span>
                    <h3 className="mb-4 text-2xl font-bold text-[#0F0F0F] transition-colors group-hover:text-[#C72C5B] md:text-3xl lg:text-4xl">
                      {study.client}
                    </h3>
                    <span
                      className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                        study.accent
                          ? 'bg-[#C72C5B] text-white'
                          : 'bg-[#0F0F0F] text-white'
                      }`}
                    >
                      {study.service}
                    </span>
                  </div>

                  {/* Big Metric */}
                  <div className="lg:col-span-3">
                    <div className="text-5xl font-bold leading-none text-[#C72C5B] md:text-6xl lg:text-7xl">
                      {study.metric}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-500">
                      {study.metricLabel}
                    </div>
                  </div>

                  {/* Description + Arrow */}
                  <div className="flex items-start justify-between gap-6 lg:col-span-5">
                    <p className="text-lg leading-relaxed text-gray-600">
                      {study.description}
                    </p>
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 transition-all group-hover:border-[#C72C5B] group-hover:bg-[#C72C5B] group-hover:text-white"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </AnimatedContent>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.4}
          ease="power3.out"
          className="mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/services/"
            className="inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-10 py-5 text-lg font-bold text-white transition-all hover:bg-[#C72C5B]"
          >
            See All Services
            <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 rounded-full border-2 border-gray-200 px-10 py-5 text-lg font-bold text-[#0F0F0F] transition-all hover:border-[#0F0F0F]"
          >
            Start a Project
          </Link>
        </AnimatedContent>
      </div>
    </section>
  );
}
