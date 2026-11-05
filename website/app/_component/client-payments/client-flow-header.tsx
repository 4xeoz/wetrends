import Image from "next/image";
import Link from "next/link";

type Step = "welcome" | "offer" | "payment";

const steps: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "offer", label: "Your offer" },
  { key: "payment", label: "Payment" },
];

export default function ClientFlowHeader({ step, reference }: { step: Step; reference: string }) {
  return <header className="bg-[#171619] px-4 pt-5 text-white sm:px-6">
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
        <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className="h-9 w-auto" />
        </Link>
        <p className="text-right text-xs font-semibold uppercase tracking-[0.16em] text-white/65">Private project · {reference}</p>
      </div>
      <nav aria-label="Payment steps" className="py-5">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {steps.map((item, index) => {
            const active = item.key === step;
            return <li key={item.key} aria-current={active ? "step" : undefined} className={active ? "rounded-xl border border-[#F28AAA]/60 bg-[#C72C5B]/20 px-3 py-3 text-white sm:px-4" : "rounded-xl border border-white/10 px-3 py-3 text-white/55 sm:px-4"}>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")} / 03</span>
              <span className="mt-1 block text-sm font-semibold">{item.label}</span>
            </li>;
          })}
        </ol>
      </nav>
    </div>
  </header>;
}
