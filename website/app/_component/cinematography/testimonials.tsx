// Static server component — zero JS, pure HTML/CSS
import { Star } from 'lucide-react';

const testimonials = [
  {
    initials: 'SR',
    name: 'Sofia R.',
    detail: 'BSc Computer Science · Surrey 2024',
    quote:
      "I was skeptical at first — £45 for photos and a video seemed almost too affordable. But the quality genuinely blew me away. My LinkedIn has never looked so good. Booking was dead easy and the photos arrived the very next day.",
    stars: 5,
    bg: 'bg-rose-100 text-rose-700',
  },
  {
    initials: 'JA',
    name: 'James A.',
    detail: 'MEng Civil Engineering · Surrey 2024',
    quote:
      "Got the Essentials package for the 8 photos. Every single one is frame-worthy. The photographer was relaxed and fun, which made the whole thing feel natural instead of awkward. Would 100% recommend to any Surrey grad.",
    stars: 5,
    bg: 'bg-blue-100 text-blue-700',
  },
  {
    initials: 'PK',
    name: 'Priya K.',
    detail: 'BA Business Management · Surrey 2024',
    quote:
      "Three of us from the same course booked on the same day — we didn't have to coordinate anything, they just handled it all. The cinematic video is genuinely stunning. My parents in India cried when they saw it.",
    stars: 5,
    bg: 'bg-violet-100 text-violet-700',
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[...Array(count)].map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

export default function CinematographyTestimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Student Reviews
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Don't Take Our Word for It
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ initials, name, detail, quote, stars, bg }) => (
            <div
              key={name}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <Stars count={stars} />

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-700">
                &ldquo;{quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${bg}`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <Stars count={5} />
          <p className="text-sm text-gray-500">
            <strong className="text-gray-900">5.0</strong> average from 200+ University of Surrey graduates
          </p>
        </div>
      </div>
    </section>
  );
}
