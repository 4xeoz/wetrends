'use client';

import { useInView } from 'react-intersection-observer';
import { Camera, Film, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const packages = [
  {
    id: 'PHOTOS_8',
    name: 'Essentials',
    subtitle: 'Perfect for framing & sharing with family',
    price: 35,
    icon: Camera,
    popular: false,
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
    subtitle: 'Ideal for LinkedIn, Instagram & proud parents',
    price: 45,
    icon: Film,
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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="packages" ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Transparent Pricing
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Two Packages, Zero Surprises
          </h2>
          <p className="mt-3 text-base text-gray-500">
            No hidden fees. No complicated add-ons. Just beautiful memories.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                }}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  pkg.popular
                    ? 'border-[#C72C5B] shadow-xl shadow-[#C72C5B]/10 ring-1 ring-[#C72C5B]'
                    : 'border-gray-200 shadow-sm hover:shadow-md transition-shadow'
                } bg-white`}
              >
                {/* Most Popular ribbon */}
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#C72C5B] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon + name */}
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        pkg.popular ? 'bg-[#C72C5B]' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          pkg.popular ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">{pkg.name}</h3>
                      <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right">
                    <span
                      className={`text-3xl font-black ${
                        pkg.popular ? 'text-[#C72C5B]' : 'text-gray-900'
                      }`}
                    >
                      £{pkg.price}
                    </span>
                    <p className="text-xs text-gray-400">one-time</p>
                  </div>
                </div>

                {/* Delivery pill */}
                <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <Clock className="h-3 w-3" />
                  Delivered within 48 hours
                </div>

                {/* Features */}
                <ul className="mb-7 flex-1 space-y-2.5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          pkg.popular ? 'text-[#C72C5B]' : 'text-gray-400'
                        }`}
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a href="#book" className="block">
                  <Button
                    className={`w-full py-5 font-bold rounded-xl ${
                      pkg.popular
                        ? 'bg-[#C72C5B] text-white hover:bg-[#a8244d] shadow-md shadow-[#C72C5B]/20'
                        : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Book {pkg.name} — £{pkg.price}
                  </Button>
                </a>
              </div>
            );
          })}
        </div>

        {/* Reassurance */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Both packages include professional colour grading &amp; full digital delivery. Shoots at the University of Surrey campus or nearby Guildford locations.
        </p>
      </div>
    </section>
  );
}
