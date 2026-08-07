'use client';

import type { ReactNode } from 'react';
import Reveal from './reveal';

/**
 * Chapter heading for the case-study narrative.
 *
 * The detail page is written as a story rather than a spec sheet, so every
 * section announces itself the same way: a numbered marker, a title, and an
 * optional standfirst that sets up what the reader is about to get. Keeping the
 * furniture identical across chapters is what makes the page feel paced —
 * the reader learns the rhythm once and then just follows it.
 *
 * `tone` switches the type colours for the dark bands; everything else is
 * shared so the chapters can't drift apart visually.
 */
export default function Chapter({
  index,
  eyebrow,
  title,
  standfirst,
  accent,
  tone = 'light',
  children,
}: {
  /** Displayed as "01", "02"… Also the story's running order. */
  index: string;
  /** Small label above the title, e.g. "Where they started". */
  eyebrow: string;
  title: ReactNode;
  standfirst?: string;
  accent: string;
  tone?: 'light' | 'dark';
  children?: ReactNode;
}) {
  const dark = tone === 'dark';

  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: accent }}
          >
            {index}
          </span>
          <span
            aria-hidden
            className="h-px w-8 shrink-0"
            style={{ backgroundColor: accent }}
          />
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.25em] ${
              dark ? 'text-white/45' : 'text-gray-400'
            }`}
          >
            {eyebrow}
          </span>
        </div>

        <h2
          className={`mt-6 text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight ${
            dark ? 'text-white' : 'text-[#0F0F0F]'
          }`}
        >
          {title}
        </h2>

        {standfirst && (
          <p
            className={`mt-6 max-w-2xl text-lg leading-relaxed md:text-xl ${
              dark ? 'text-white/55' : 'text-gray-500'
            }`}
          >
            {standfirst}
          </p>
        )}
      </Reveal>

      {children}
    </div>
  );
}
