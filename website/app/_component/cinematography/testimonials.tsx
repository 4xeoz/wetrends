import { Star } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const testimonials = [
  {
    initials: 'SR',
    name: 'Sofia R.',
    detail: 'BSc Computer Science · Surrey 2024',
    quote:
      "I was sceptical at first — £45 for 15 pictures seemed almost too affordable. But the quality blew me away. My LinkedIn has never looked so good. Photos arrived the very next day.",
    color: '#0F0F0F',
  },
  {
    initials: 'JA',
    name: 'James A.',
    detail: 'MEng Civil Engineering · Surrey 2024',
    quote:
      "Got the Essentials package for the 8 photos. Every single one is frame-worthy. The photographer was relaxed and fun which made the whole thing feel natural. 100% recommend to any Surrey grad.",
    color: '#C72C5B',
  },
  {
    initials: 'PK',
    name: 'Priya K.',
    detail: 'BA Business Management · Surrey 2024',
    quote:
      "Three of us from the same course booked on the same day — they handled everything. The cinematic video is genuinely stunning. My parents in India cried watching it.",
    color: '#0F0F0F',
  },
];

const Stars = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

export default function CinematographyTestimonials() {
  return (
    <section className="relative bg-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <AnimatedContent direction="vertical" distance={80} duration={1.2} ease="power3.out" threshold={0.1}>
          <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
              Student Reviews
            </span>
            <div className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none">
              <h2 className="font-bold text-[#0F0F0F]">Don&apos;t Take</h2>
              <h2 className="font-serif italic font-bold text-[#C72C5B]">Our Word for It</h2>
            </div>
          </div>
        </AnimatedContent>

        {/* Content grid — same layout as WhyLoveUs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left — aggregate rating */}
          <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1.2}
              delay={0.2}
              ease="power3.out"
              animateOpacity
              threshold={0.1}
              className="py-4 md:py-10"
            >
              <div className="flex flex-col gap-3">
                <Stars />
                <p className="text-2xl font-black text-[#0F0F0F]">5.0 / 5.0</p>
                <p className="text-base font-semibold text-gray-600 lg:w-2/3">
                  &ldquo;200+ University of Surrey graduates. Every single one rated us 5 stars.&rdquo;
                </p>
              </div>
            </AnimatedContent>
          </div>

          {/* Right — testimonial cards */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {testimonials.map((t, index) => (
                <AnimatedContent
                  key={t.name}
                  direction="vertical"
                  distance={100}
                  duration={1.2}
                  delay={0.35 + index * 0.1}
                  ease="power3.out"
                  animateOpacity
                  threshold={0.1}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl h-72 md:h-80"
                    style={{ backgroundColor: t.color }}
                  >
                    <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between text-white">
                      {/* Stars */}
                      <Stars />

                      {/* Quote */}
                      <p className="text-sm leading-relaxed opacity-90 flex-1 mt-4">
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                          {t.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{t.name}</p>
                          <p className="text-[10px] opacity-60">{t.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
