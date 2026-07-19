import Image from 'next/image';
import { Lock } from 'lucide-react';

/**
 * The visual for a case study, framed as a browser window so it reads as
 * "a real thing we shipped". When a mockup image exists it fills the frame;
 * otherwise we render an art-directed typographic poster tinted with the
 * study's accent — an intentional design, not a missing asset.
 */
export default function CasePoster({
  image,
  client,
  industry,
  accentColor,
  domain,
  priority = false,
}: {
  image?: string;
  client: string;
  industry: string;
  accentColor: string;
  domain?: string;
  priority?: boolean;
}) {
  const url = domain ?? `${client.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.uk`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141416] shadow-2xl shadow-black/40 ring-1 ring-black/5">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1c1c1f] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex flex-1 items-center gap-1.5 truncate rounded-md bg-black/40 px-3 py-1 text-[11px] text-white/50">
          <Lock className="h-3 w-3 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative aspect-[16/10] w-full">
        {image ? (
          <Image
            src={image}
            alt={`${client} website designed by WeTrends`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-top"
            priority={priority}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col justify-between p-8 md:p-10"
            style={{
              background: `radial-gradient(120% 120% at 15% 0%, ${accentColor}33 0%, transparent 55%), linear-gradient(160deg, #141416 0%, #0b0b0c 100%)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white"
                style={{ backgroundColor: accentColor }}
              >
                {industry}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Live
              </span>
            </div>

            <div>
              <div
                className="text-5xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-7xl"
                style={{ textShadow: `0 0 60px ${accentColor}55` }}
              >
                {client}
              </div>
              <div
                className="mt-4 h-1 w-24 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            </div>

            <div className="flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span>Train / Compete / Repeat</span>
              <span>{url}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
