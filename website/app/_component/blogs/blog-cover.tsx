import Image from 'next/image';
import type { ReactNode } from 'react';

const COVER_IMAGES = [
  '/images/hero_background.webp',
  '/images/footer_background.webp',
];

const GRADIENTS = [
  'from-[#0F0F0F]/90 via-[#0F0F0F]/60 to-transparent',
  'from-[#050505]/90 via-[#050505]/55 to-transparent',
];

interface BlogCoverProps {
  title: string;
  category?: string | null;
  index?: number;
  slug?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  size?: 'card' | 'hero';
  meta?: ReactNode;
  className?: string;
}

function getImageIndex(index: number | undefined, slug: string | undefined): number {
  if (index !== undefined) return index;
  if (!slug) return 0;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COVER_IMAGES.length;
}

/**
 * Editorial cover art for blog posts.
 *
 * Alternates between two wetrends background images — hero_background.webp and
 * footer_background.webp — based on the post index or slug. A dark gradient
 * overlay keeps the title readable regardless of the image behind it.
 */
export function BlogCover({
  title,
  category,
  index,
  slug,
  imageUrl,
  imageAlt,
  size = 'card',
  meta,
  className = '',
}: BlogCoverProps) {
  const imageIndex = getImageIndex(index, slug);
  const image = imageUrl || COVER_IMAGES[imageIndex % COVER_IMAGES.length];
  const gradient = GRADIENTS[imageIndex % GRADIENTS.length];
  const isHero = size === 'hero';

  return (
    <div className={`group relative h-full w-full overflow-hidden ${className}`}>
      {/* Background image */}
      <Image
        src={image}
        alt={imageUrl ? imageAlt || title : ""}
        fill
        sizes={isHero ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        priority={isHero}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]"
      />

      {/* Content */}
      <div
        className={`relative z-10 flex h-full w-full flex-col justify-end ${
          isHero ? 'px-6 py-10 sm:px-12 sm:py-16 md:px-16 md:py-20' : 'p-5 sm:p-6'
        }`}
      >
        {category && (
          <span
            className={`mb-3 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 font-bold uppercase tracking-widest text-white backdrop-blur-sm ${
              isHero ? 'text-xs sm:text-sm' : 'text-[10px]'
            }`}
          >
            {category}
          </span>
        )}
        <p
          className={`font-bold leading-[1.1] text-white ${
            isHero
              ? 'line-clamp-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
              : 'line-clamp-3 text-lg sm:text-xl'
          }`}
        >
          {title}
        </p>

        {isHero && meta && (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}
