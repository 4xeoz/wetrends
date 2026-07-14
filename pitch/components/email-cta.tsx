"use client";

import { useRef, useState } from "react";

const EMAIL = "eddy.c@wetrends.co.uk";

/**
 * Mailto links silently no-op on devices without a configured mail app, so
 * this button also copies the address and confirms it visibly — there's
 * always feedback, whether or not a mail client opens.
 */
export function EmailCta() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    // Don't preventDefault — let devices with a mail app open it natively.
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <a
      href={`mailto:${EMAIL}`}
      onClick={handleClick}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#C72C5B] shadow-xl shadow-[#400b1a]/40 transition-transform hover:scale-105"
    >
      {copied ? (
        <>
          {EMAIL} — copied!
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        </>
      ) : (
        <>
          Email us
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white transition-transform group-hover:rotate-45">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </span>
        </>
      )}
    </a>
  );
}
