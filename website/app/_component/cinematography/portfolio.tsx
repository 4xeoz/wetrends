// Lightweight portfolio — CSS-only reveal, no Framer Motion
// Images lazy-loaded by default via Next.js Image
import Image from 'next/image';

const portfolioImages = [
  {
    src: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=700&q=80',
    alt: 'Graduation portrait at University of Surrey campus',
    tall: true, // spans 2 rows
  },
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=75',
    alt: 'Graduate celebrating at Guildford ceremony',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=75',
    alt: 'Graduation cap in the air, Surrey University',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=500&q=75',
    alt: 'Student portrait on graduation day',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=500&q=75',
    alt: 'Graduate holding diploma outdoors Guildford',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&q=80',
    alt: 'Group of Surrey University graduates celebrating',
    tall: false,
  },
];

export default function CinematographyPortfolio() {
  return (
    <section id="work" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Our Work
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Real Graduates. Real Moments.
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Every shoot is unique — here's a taste of what we create at Surrey
            University and across Guildford.
          </p>
        </div>

        {/* Grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-3 lg:auto-rows-[220px]">
          {portfolioImages.map((img, i) => (
            <div
              key={img.src}
              className={`group relative overflow-hidden rounded-xl bg-gray-200 ${
                img.tall ? 'row-span-2' : ''
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={
                  img.tall
                    ? '(max-width: 768px) 50vw, 33vw'
                    : '(max-width: 768px) 50vw, 33vw'
                }
                loading={i < 2 ? 'eager' : 'lazy'}
                className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Sample portfolio — your photos will be tailored to your graduation day
        </p>

        {/* Inline CTA */}
        <div className="mt-8 text-center">
          <a
            href="#book"
            className="inline-flex items-center gap-2 rounded-full border border-[#C72C5B] px-6 py-2.5 text-sm font-semibold text-[#C72C5B] transition-colors hover:bg-[#C72C5B] hover:text-white"
          >
            Book your shoot &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
