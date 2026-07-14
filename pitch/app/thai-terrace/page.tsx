import type { Metadata } from "next";
import { EmailCta } from "@/components/email-cta";
import { EmailIdentifier } from "@/components/email-identifier";
import { IntroSequence } from "@/components/intro-sequence";
import { StreamPlayer } from "@/components/stream-player";

export const metadata: Metadata = {
  title: "Hey Thai Terrace — a quick word from WeTrends",
};

// WhatsApp number in international format, digits only (07444 311490 → 44...)
const WHATSAPP_NUMBER = "447444311490";

const marqueeItems = [
  "Made for The Thai Terrace",
  "From WeTrends in Guildford",
  "One video, no strings",
  "Reply if you like it",
];

function MarqueeContent() {
  return (
    <>
      {marqueeItems.map((item) => (
        <span key={item} className="mx-6 inline-flex items-center gap-6">
          {item}
          <span className="text-white/40">✦</span>
        </span>
      ))}
    </>
  );
}

export default function ThaiTerracePage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Cinematic title sequence: logo → Hey → Thai Terrace → I made this
          for you → slide up to reveal the page. Tap to skip. */}
      <IntroSequence />

      {/* Identify the visitor when they arrive via an email link (?email=...). */}
      <EmailIdentifier />

      {/* Full-bleed brand gradient with slow ambient drift */}
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny 23KB
          static webp, not worth next/image's runtime for a background */}
      <img
        src="/images/hero_background.webp"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="animate-bg-drift pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft wine tint so white type pops without dulling the colour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#400b1a]/20" />
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Edge vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(64,11,26,0.45)_100%)]"
      />

      {/* Top bar */}
      <header className="animate-fade-in relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny
              static decorative svg, not worth next/image's runtime */}
          <img
            src="/images/logo-transparent.svg"
            alt=""
            aria-hidden="true"
            className="h-7 w-auto brightness-0 invert sm:h-8"
          />
          <span className="text-base font-bold text-white sm:text-lg">WeTrends</span>
        </div>
        <span className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
          Guildford · Surrey
        </span>
      </header>

      {/* Hero — editorial split: type left, film right */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-14">
        {/* Type + CTAs */}
        <div className="text-center lg:text-left">
          <p className="animate-fade-in fade-delay-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 sm:text-xs">
            <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-white/60" />
            A personal note, not a pitch deck
          </p>

          <h1 className="animate-fade-in fade-delay-1 mt-5 text-5xl font-bold leading-[0.9] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Hey
            <br />
            <span className="font-serif italic">Thai Terrace</span>{" "}
            <span className="inline-block origin-[70%_70%] transition-transform duration-300 hover:rotate-12">
              👋
            </span>
          </h1>

          <p className="animate-fade-in fade-delay-2 mx-auto mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg lg:mx-0">
            Made this for you in a few minutes — take a look and let me know what you think.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in fade-delay-3 mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <EmailCta />

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-[#25D366] hover:bg-[#25D366]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp us
            </a>

            <a
              href="https://wetrends.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#C72C5B]"
            >
              wetrends.co.uk
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform group-hover:rotate-45"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* The film */}
        <div className="animate-fade-in fade-delay-2">
          <div className="rounded-[1.75rem] bg-white/10 p-1.5 shadow-2xl shadow-[#400b1a]/50 ring-1 ring-white/25 backdrop-blur-md">
            <StreamPlayer />
          </div>
          <p className="mt-4 text-center font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">
            Sound on 🔊 — it&apos;s short
          </p>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative z-10 overflow-hidden border-t border-white/15 bg-white/5 py-3 backdrop-blur-sm">
        <div className="animate-marquee flex w-max whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </main>
  );
}
