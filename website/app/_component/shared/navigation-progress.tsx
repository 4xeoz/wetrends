'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_DELAY = 120;
const SAFETY_TIMEOUT = 12_000;

function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldTrackAnchor(anchor: HTMLAnchorElement) {
  if (anchor.dataset.noProgress !== undefined || anchor.hasAttribute('download')) return false;
  if (anchor.target && anchor.target !== '_self') return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const current = new URL(window.location.href);
  return url.pathname !== current.pathname || url.search !== current.search;
}

/**
 * Gives internal route changes immediate feedback while the server-rendered
 * page is being prepared. The route-level loading screen remains the fallback
 * for slower transitions; this bar covers the quiet gap immediately after a
 * click so the interface never appears stuck.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const revealTimer = useRef<number | null>(null);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    setVisible(false);
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    if (safetyTimer.current !== null) window.clearTimeout(safetyTimer.current);
  }, [pathname]);

  useEffect(() => {
    const clearTimers = () => {
      if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
      if (safetyTimer.current !== null) window.clearTimeout(safetyTimer.current);
      revealTimer.current = null;
      safetyTimer.current = null;
    };

    const stop = () => {
      clearTimers();
      setVisible(false);
    };

    const start = () => {
      clearTimers();
      revealTimer.current = window.setTimeout(() => setVisible(true), REVEAL_DELAY);
      safetyTimer.current = window.setTimeout(stop, SAFETY_TIMEOUT);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest('a[href]');
      if (anchor instanceof HTMLAnchorElement && shouldTrackAnchor(anchor)) start();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', stop);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', stop);
      clearTimers();
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-1 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      aria-label="Loading page"
    >
      <span className="wt-route-progress-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#C72C5B] shadow-[0_0_14px_rgba(199,44,91,0.55)]" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
