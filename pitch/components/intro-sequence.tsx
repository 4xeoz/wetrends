"use client";

import { useEffect, useState } from "react";

// How long each title card holds (must match the intro-step keyframe
// duration in globals.css) and how long the exit slide takes.
const STEP_MS = 1000;
const EXIT_MS = 750;

export function IntroSequence({
  displayName,
  closingLine = "I made this for you",
}: {
  displayName: string;
  closingLine?: string;
}) {
  // null = the logo card
  const steps: (string | null)[] = [null, "Hey", displayName, closingLine];

  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // Reduced motion: skip the sequence entirely
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
    }
  }, []);

  useEffect(() => {
    if (gone) return;
    if (exiting) {
      const t = setTimeout(() => setGone(true), EXIT_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (step < steps.length - 1) setStep(step + 1);
      else setExiting(true);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [step, exiting, gone]);

  if (gone) return null;

  const isFinal = step === steps.length - 1;
  const content = steps[step];

  return (
    <div
      onClick={() => setExiting(true)}
      className={`intro-overlay fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#0F0F0F] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        exiting ? "-translate-y-full" : ""
      }`}
      aria-hidden="true"
    >
      {/* Without JS the sequence can never finish — don't trap the reader */}
      <noscript>
        <style>{`.intro-overlay { display: none; }`}</style>
      </noscript>

      <div key={step} className={`${isFinal ? "intro-step-final" : "intro-step"} px-6 text-center`}>
        {content === null ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny static svg
          <img
            src="/images/logo-transparent.svg"
            alt=""
            className="h-16 w-auto brightness-0 invert sm:h-20"
          />
        ) : content === displayName ? (
          <span className="font-serif text-5xl italic leading-tight text-[var(--pitch-accent)] sm:text-7xl">
            {displayName}
          </span>
        ) : (
          <span className="text-5xl font-bold tracking-tight text-white sm:text-7xl">{content}</span>
        )}
      </div>

      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
        Tap to skip
      </span>
    </div>
  );
}
