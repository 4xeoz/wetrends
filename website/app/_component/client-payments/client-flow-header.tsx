import Image from "next/image";
import Link from "next/link";

type Step = "welcome" | "offer" | "payment";

const steps: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "offer", label: "Your offer" },
  { key: "payment", label: "Payment" },
];

export default function ClientFlowHeader({ step, reference, compact = false }: { step: Step; reference: string; compact?: boolean }) {
  return <header className={compact ? "bg-[#171619] px-4 pt-2 text-white sm:px-6 sm:pt-3" : "bg-[#171619] px-4 pt-5 text-white sm:px-6"}>
    <div className="mx-auto max-w-6xl">
      <div className={compact ? "flex items-center justify-between gap-4 border-b border-white/15 pb-2" : "flex items-center justify-between gap-4 border-b border-white/15 pb-5"}>
        <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className={compact ? "h-7 w-auto" : "h-9 w-auto"} />
        </Link>
        <p className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-white/65">{compact ? <><span className="hidden sm:inline">Private project · </span>{reference}</> : <>Private project · {reference}</>}</p>
      </div>
      <nav aria-label="Payment steps" className={compact ? "py-2" : "py-5"}>
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {steps.map((item, index) => {
            const active = item.key === step;
            const size = compact ? "px-2 py-1.5 sm:px-3" : "px-3 py-3 sm:px-4";
            return <li key={item.key} aria-current={active ? "step" : undefined} className={active ? `rounded-xl border border-[#F28AAA]/60 bg-[#C72C5B]/20 text-white ${size}` : `rounded-xl border border-white/10 text-white/55 ${size}`}>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")} / 03</span>
              <span className={compact ? "block text-xs font-semibold" : "mt-1 block text-sm font-semibold"}>{item.label}</span>
            </li>;
          })}
        </ol>
      </nav>
    </div>
  </header>;
}
