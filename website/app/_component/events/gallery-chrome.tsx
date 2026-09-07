import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GalleryShareButton } from './gallery-share';

export function GalleryHeader({
  token,
  eventTitle,
  backHref,
  backLabel = 'Back',
  nextHref,
  nextLabel = 'Next',
}: {
  token: string;
  eventTitle: string;
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between gap-3 border-b border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-8">
      <div className="min-w-0 flex-1">
        {backHref ? (
          <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-bold text-black/55 transition hover:text-black">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        ) : (
          <Link href="/events" className="text-sm font-black tracking-[-0.02em]">WETRENDS</Link>
        )}
      </div>
      <div className="sm:hidden">
        <GalleryShareButton token={token} eventTitle={eventTitle} compact />
      </div>
      <div className="hidden sm:block">
        <GalleryShareButton token={token} eventTitle={eventTitle} />
      </div>
      {nextHref ? (
        <Link
          href={nextHref}
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-5 text-xs font-bold text-white transition hover:bg-[#A91F49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] focus-visible:ring-offset-2"
        >
          {nextLabel} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </header>
  );
}

const defaultSteps = ['View', 'Frames', 'Photos', 'Done'];

export function GallerySteps({
  active,
  labels = defaultSteps,
  completeCurrent = false,
}: {
  active: number;
  labels?: string[];
  completeCurrent?: boolean;
}) {
  return (
    <nav aria-label="Gallery order progress" className="mx-auto grid w-full max-w-5xl grid-cols-4 gap-1.5 px-4 py-4 sm:gap-3 sm:px-6 sm:py-6">
      {labels.map((label, index) => {
        const number = index + 1;
        const complete = number < active || (completeCurrent && number === active);
        const current = number === active;
        return (
          <div
            key={label}
            aria-current={current ? 'step' : undefined}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-2 text-[10px] font-bold sm:min-h-14 sm:justify-start sm:px-4 sm:text-xs ${current ? 'border-[#C72C5B] bg-[#FFF2F6] text-[#C72C5B]' : complete ? 'border-[#C72C5B]/15 bg-white text-black/70' : 'border-black/[0.06] bg-white/55 text-black/30'}`}
          >
            <span className={`grid h-6 w-6 flex-none place-items-center rounded-full text-[9px] ${current || complete ? 'bg-[#C72C5B] text-white' : 'bg-black/[0.06]'}`}>
              {complete ? <Check className="h-3 w-3" strokeWidth={3} /> : String(number).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        );
      })}
    </nav>
  );
}
