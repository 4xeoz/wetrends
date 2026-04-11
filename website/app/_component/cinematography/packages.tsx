import Link from 'next/link';
import { Check, ArrowUpRight, Clock } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const packages = [
  {
    id: 'PHOTOS_8',
    name: 'Essentials',
    price: '£35',
    period: 'one-time',
    description: 'Perfect for sharing with family and framing at home.',
    theme: 'light' as const,
    features: [
      '8 professionally edited photos',
      'You choose the shots you love',
      'High-resolution digital files',
      'Delivered within 48 hours',
      'Surrey campus or Guildford outdoors',
      'Colour-graded to perfection',
    ],
  },
  {
    id: 'PHOTOS_10_VIDEO',
    name: 'Premium',
    price: '£45',
    period: 'one-time',
    description: 'Ideal for LinkedIn, Instagram, and proud parents abroad.',
    theme: 'dark' as const,
    popular: true,
    features: [
      '10 professionally edited photos',
      'You choose the shots you love',
      'Short cinematic graduation reel',
      'Optimised for LinkedIn & social media',
      'High-resolution digital files',
      'Delivered within 48 hours',
      'Surrey campus or Guildford outdoors',
      'Colour-graded to perfection',
    ],
  },
];

export default function CinematographyPackages() {
  const isLight = (theme: string) => theme === 'light';
  const isDark = (theme: string) => theme === 'dark';

  return (
    <section id="packages" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out" className="mb-12 md:mb-16">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
            Transparent Pricing
          </span>
          <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl xl:text-7xl">
            Two Packages,
            <br />
            <span className="font-serif italic text-[#C72C5B]">Zero Surprises</span>
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.1} ease="power3.out" className="mb-10 md:mb-14">
          <p className="max-w-xl text-lg leading-relaxed text-gray-600">
            No hidden fees, no complex add-ons. Choose your package, book your
            date, and receive stunning memories in 48 hours.
          </p>
        </AnimatedContent>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {packages.map((pkg, index) => (
            <AnimatedContent
              key={pkg.id}
              direction="vertical"
              distance={50}
              duration={0.8}
              delay={0.15 * index}
              ease="power3.out"
            >
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 md:p-10 ${
                  isLight(pkg.theme)
                    ? 'border-gray-200 bg-white hover:border-[#C72C5B]'
                    : 'border-gray-800 bg-[#0F0F0F] text-white hover:border-gray-600'
                }`}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-[#C72C5B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </span>
                )}

                {/* 48h pill */}
                <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <Clock className="h-3 w-3" />
                  48-hour delivery guaranteed
                </div>

                {/* Name + description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold md:text-2xl">{pkg.name}</h3>
                  <p className={`mt-1 text-sm ${isDark(pkg.theme) ? 'text-gray-400' : 'text-gray-500'}`}>
                    {pkg.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight md:text-6xl">
                    {pkg.price}
                  </span>
                  <span className={`text-base ${isDark(pkg.theme) ? 'text-gray-400' : 'text-gray-500'}`}>
                    {pkg.period}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="#book"
                  className={`group/btn mb-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all ${
                    isLight(pkg.theme)
                      ? 'bg-[#0F0F0F] text-white hover:bg-[#C72C5B]'
                      : 'bg-white text-[#0F0F0F] hover:bg-[#C72C5B] hover:text-white'
                  }`}
                >
                  Book {pkg.name} — {pkg.price}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:rotate-45" />
                </Link>

                {/* Divider */}
                <div className={`mb-8 h-px ${isDark(pkg.theme) ? 'bg-white/10' : 'bg-gray-100'}`} />

                {/* Features */}
                <ul className="flex-1 space-y-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C72C5B]" />
                      <span className={`text-sm leading-relaxed ${isDark(pkg.theme) ? 'text-gray-300' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Reassurance */}
        <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.35} ease="power3.out" className="mt-8">
          <p className="text-center text-sm text-gray-400">
            Both packages include professional colour grading &amp; full digital delivery.
            Shoots at the University of Surrey campus or nearby Guildford locations.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
