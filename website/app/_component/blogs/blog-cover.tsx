import Image from 'next/image';

const GRADIENTS = [
  'from-[#0F0F0F] via-[#1a1a1a] to-[#C72C5B]/30',
  'from-[#17101a] via-[#0F0F0F] to-purple-900/40',
  'from-[#0F0F0F] via-[#2a0f18] to-[#C72C5B]/40',
  'from-[#0F0F0F] via-[#161320] to-indigo-900/30',
];

interface BlogCoverProps {
  title: string;
  category?: string | null;
  index?: number;
  size?: 'card' | 'hero';
  className?: string;
}

/**
 * Typographic cover art for blog posts — the title itself is the visual,
 * so there's no dependency on a featured-image URL that may be missing or broken.
 */
export function BlogCover({ title, category, index = 0, size = 'card', className = '' }: BlogCoverProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const isHero = size === 'hero';

  return (
    <div
      className={`relative flex h-full w-full items-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C72C5B]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl"
      />
      <Image
        src="/images/logo-transparent.svg"
        alt=""
        aria-hidden
        width={isHero ? 200 : 100}
        height={isHero ? 200 : 100}
        className="pointer-events-none absolute -bottom-6 -right-6 opacity-[0.07]"
      />

      <div className={`relative z-10 w-full ${isHero ? 'px-8 py-14 sm:px-14 sm:py-20' : 'px-5 py-5 sm:px-6 sm:py-6'}`}>
        {category && (
          <span
            className={`mb-3 inline-block font-bold uppercase tracking-widest text-[#C72C5B] ${
              isHero ? 'text-xs sm:text-sm' : 'text-[10px]'
            }`}
          >
            {category}
          </span>
        )}
        <p
          className={`font-bold leading-tight text-white ${
            isHero
              ? 'line-clamp-4 text-2xl sm:text-4xl md:text-5xl'
              : 'line-clamp-3 text-base sm:text-lg'
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
