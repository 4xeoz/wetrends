import Image from "next/image";
import Link from "next/link";

type Step = "welcome" | "offer" | "payment";

const steps: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "offer", label: "Your offer" },
  { key: "payment", label: "Payment" },
];

export default function ClientFlowHeader({ step, reference, compact = false }: { step: Step; reference: string; compact?: boolean }) {
  const activeIndex = steps.findIndex((item) => item.key === step);

  return <header className="bg-[#F3F0EA] px-5 text-[#1B1819] sm:px-8 lg:px-12">
    <div className="mx-auto max-w-[1384px]">
      <div className={`flex items-center justify-between gap-4 border-b border-[#1B1819]/15 ${compact ? "py-3" : "py-4 sm:py-5"}`}>
        <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className="h-8 w-auto brightness-0" />
        </Link>
        <div className="text-right">
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B1819]/45 sm:block">Private project</p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1B1819]/70 sm:mt-1">{reference}</p>
        </div>
      </div>
      <nav aria-label="Payment steps" className={compact ? "py-3 sm:py-4" : "py-4 sm:py-5"}>
        <div>
          <ol className="grid grid-cols-3 gap-2 sm:gap-6">
            {steps.map((item, index) => {
              const active = index === activeIndex;
              const completed = index < activeIndex;
              return <li key={item.key} aria-current={active ? "step" : undefined} className="flex min-w-0 items-baseline gap-1.5 sm:gap-3">
                <span className={`font-serif text-xl italic leading-none sm:text-2xl ${active ? "wt-client-step-current text-[#A52249]" : completed ? "text-[#1B1819]" : "text-[#1B1819]/35"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className={`text-[9px] font-bold uppercase tracking-[0.06em] sm:text-xs sm:tracking-[0.14em] ${active ? "text-[#1B1819]" : completed ? "text-[#1B1819]/65" : "text-[#1B1819]/40"}`}>{item.label}</span>
              </li>;
            })}
          </ol>
          <div aria-hidden="true" className="mt-4 h-px bg-[#1B1819]/20 sm:mt-5">
            <span className="wt-client-progress-fill block h-[2px] bg-[#A52249]" style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </nav>
    </div>
  </header>;
}
