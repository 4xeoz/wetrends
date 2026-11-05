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

  return <header className={compact ? "bg-[#171619] px-4 pt-2 text-white sm:px-6 sm:pt-3" : "bg-[#171619] px-4 pt-5 text-white sm:px-6"}>
    <div className="mx-auto max-w-6xl">
      <div className={compact ? "flex items-center justify-between gap-4 border-b border-white/10 pb-2" : "flex items-center justify-between gap-4 border-b border-white/10 pb-5"}>
        <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className={compact ? "h-7 w-auto" : "h-9 w-auto"} />
        </Link>
        <p className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-white/65">{compact ? <><span className="hidden sm:inline">Private project · </span>{reference}</> : <>Private project · {reference}</>}</p>
      </div>
      <nav aria-label="Payment steps" className={compact ? "py-1" : "py-5"}>
        <div className="relative">
          <div aria-hidden="true" className={`absolute left-[16.6667%] right-[16.6667%] ${compact ? "top-[15px]" : "top-[19px]"} h-[2px] bg-white/20`}>
            <span className="wt-client-progress-fill block h-full bg-[#F28AAA]" style={{ width: `${activeIndex * 50}%` }} />
          </div>
          <ol className="relative grid grid-cols-3">
            {steps.map((item, index) => {
              const active = index === activeIndex;
              const completed = index < activeIndex;
              return <li key={item.key} aria-current={active ? "step" : undefined} className="flex min-w-0 flex-col items-center gap-1 text-center">
                <span className={`grid ${compact ? "size-8" : "size-10"} shrink-0 place-items-center rounded-full border-2 text-[10px] font-black tracking-[0.08em] ${active ? "wt-client-step-current border-[#F28AAA] bg-[#C72C5B] text-white ring-4 ring-[#C72C5B]/25" : completed ? "border-[#F28AAA] bg-[#F28AAA] text-[#171619]" : "border-white/30 bg-[#171619] text-white/65"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className={`${compact ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"} font-bold uppercase tracking-[0.12em] ${active ? "text-white" : completed ? "text-[#F8B9CB]" : "text-white/55"}`}>{item.label}</span>
              </li>;
            })}
          </ol>
        </div>
      </nav>
    </div>
  </header>;
}
