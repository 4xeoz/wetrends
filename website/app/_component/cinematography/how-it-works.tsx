// Static server component — zero client JS, instant render
import { CalendarDays, Camera, Download } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: CalendarDays,
    title: 'Pick Your Date & Package',
    description:
      'Select your graduation date below and choose Essentials (£35) or Premium (£45). Multiple students can book the same date — we shoot all day long.',
  },
  {
    number: '2',
    icon: Camera,
    title: 'We Come to You',
    description:
      "Meet us on the University of Surrey campus or anywhere in Guildford. We work fast so you can get back to celebrating with your friends and family.",
  },
  {
    number: '3',
    icon: Download,
    title: 'Download in 48 Hours',
    description:
      'Your edited photos (and cinematic video if you chose Premium) land in your inbox within 48 hours, ready to share, print, or add to your LinkedIn.',
  },
];

export default function CinematographyHowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Simple Process
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Ready in 3 Easy Steps
          </h2>
          <p className="mt-3 text-base text-gray-500">
            From booking to beautiful memories — completely stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line desktop */}
          <div
            aria-hidden
            className="absolute top-10 left-1/2 hidden h-px w-[calc(100%-8rem)] -translate-x-1/2 bg-gradient-to-r from-gray-200 via-[#C72C5B]/30 to-gray-200 md:block"
          />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {/* Icon circle */}
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#C72C5B]/20 bg-white shadow-md shadow-gray-100">
                <Icon className="h-8 w-8 text-[#C72C5B]" />
                {/* Step badge */}
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C72C5B] text-xs font-black text-white shadow-sm">
                  {number}
                </span>
              </div>
              <h3 className="mb-2 text-base font-black text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA reminder */}
        <div className="mt-14 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-7 text-center">
          <p className="text-base font-semibold text-gray-800">
            Ready to book your spot?
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Slots fill up fast during graduation season — secure yours below.
          </p>
          <a
            href="#book"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-3 text-sm font-bold text-white shadow-md shadow-[#C72C5B]/20 transition-colors hover:bg-[#a8244d]"
          >
            Book Now &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
