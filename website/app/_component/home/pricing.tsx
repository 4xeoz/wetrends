import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedContent from "@/components/ui/animated-content";

const plans = [
  {
    name: 'TrendOps™ Core',
    price: '£749',
    period: '/mo',
    description: 'Give us the plan—get the polished assets.',
    features: [
      'You supply strategy, scripts, rough footage',
      'We edit, design & format for every channel',
      '48-h turnaround on one active request',
      'Unlimited revisions until you\'re happy',
    ],
    theme: 'light',
  },
  {
    name: 'TrendOps™ Growth',
    price: '£939',
    period: '/mo',
    description: 'We find the angles, script them, and ship the assets.',
    features: [
      'Weekly Trend Radar & competitor scan',
      'We draft scripts / storyboards for approval',
      'We design, edit & size for every channel',
      '48-h turnaround on 1 active request',
      'Monthly performance insight & tweaks',
      'Unlimited revisions until you\'re thrilled',
    ],
    theme: 'dark',
    popular: true,
  },
  {
    name: 'TrendOps™ Enterprise',
    price: 'Custom',
    period: '',
    description: 'Bespoke creative partnership for scaling brands.',
    features: [
      'Everything in Growth, plus:',
      'Dedicated creative team',
      'Unlimited active requests',
      'Same-day priority turnaround',
      'Weekly strategy calls',
      'Full brand system & guidelines',
    ],
    theme: 'accent',
  },
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          ease="power3.out"
          className="mb-12 md:mb-16"
        >
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
            Partnerships
          </span>
          <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl xl:text-7xl">
            Results Come
            <br />
            <span className="font-serif italic text-[#C72C5B]">First</span>
          </h2>
        </AnimatedContent>

        <AnimatedContent
          direction="vertical"
          distance={40}
          duration={1}
          delay={0.1}
          ease="power3.out"
          className="mb-10 md:mb-14"
        >
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
            Pick the partnership level that matches your workload and move the metrics, not just make pretty files.
          </p>
        </AnimatedContent>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const isLight = plan.theme === 'light';
            const isDark = plan.theme === 'dark';
            const isAccent = plan.theme === 'accent';

            return (
              <AnimatedContent
                key={plan.name}
                direction="vertical"
                distance={50}
                duration={0.8}
                delay={0.15 * index}
                ease="power3.out"
              >
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 md:p-8 ${
                    isLight
                      ? 'border-gray-200 bg-white hover:border-[#C72C5B]'
                      : isDark
                      ? 'border-gray-800 bg-[#0F0F0F] text-white hover:border-gray-600'
                      : 'border-[#C72C5B] bg-[#C72C5B] text-white hover:bg-[#b5284d]'
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <span className="absolute right-6 top-6 rounded-full bg-[#C72C5B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Most Popular
                    </span>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold md:text-2xl">{plan.name}</h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : isAccent ? 'text-white/80' : 'text-gray-500'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight md:text-5xl">{plan.price}</span>
                    {plan.period && <span className={`text-lg ${isDark ? 'text-gray-400' : isAccent ? 'text-white/70' : 'text-gray-500'}`}>{plan.period}</span>}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/#contact"
                    className={`mb-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all md:text-base ${
                      isLight
                        ? 'bg-[#0F0F0F] text-white hover:bg-[#C72C5B]'
                        : isDark
                        ? 'bg-white text-[#0F0F0F] hover:bg-[#C72C5B] hover:text-white'
                        : 'bg-white text-[#C72C5B] hover:bg-[#0F0F0F] hover:text-white'
                    }`}
                  >
                    {plan.price === 'Custom' ? 'Contact Us' : 'Get Started'}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </Link>

                  {/* Divider */}
                  <div className={`mb-6 h-px ${isLight ? 'bg-gray-100' : isDark ? 'bg-white/10' : 'bg-white/20'}`} />

                  {/* Features */}
                  <ul className="flex-1 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`mt-0.5 h-5 w-5 flex-shrink-0 ${isAccent ? 'text-white' : 'text-[#C72C5B]'}`} />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : isAccent ? 'text-white/90' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
