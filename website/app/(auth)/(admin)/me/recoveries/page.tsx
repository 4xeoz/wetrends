import Link from "next/link";
import { ArchiveRestore, ArrowRight, Plus } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { formatMoney } from "@/lib/events/catalog";

export const dynamic = "force-dynamic";
export default async function RecoveriesPage() {
  const recoveries = await prisma.galleryRecovery.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { assets: true } }, order: true },
  });
  return (
    <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">
              Event Studio
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
              Gallery recovery
            </h1>
            <p className="mt-3 text-sm text-black/55">
              Restore an expired delivery. Set a fee. Reopen access after
              payment.
            </p>
          </div>
          <Link
            href="/me/recoveries/new"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" /> New recovery
          </Link>
        </header>
        {!recoveries.length ? (
          <section className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center">
            <ArchiveRestore className="mx-auto h-9 w-9 text-[#C72C5B]" />
            <h2 className="mt-4 text-xl font-bold">No recoveries yet</h2>
            <p className="mt-2 text-sm text-black/50">
              Create a recovery when you have located a client’s photographs.
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            {recoveries.map((recovery) => {
              const expired =
                recovery.status === "PAID" &&
                recovery.expiresAt &&
                recovery.expiresAt <= new Date();
              const label = expired
                ? "Access expired"
                : recovery.status === "PAID"
                  ? "Paid · access open"
                  : recovery.status === "READY"
                    ? "Awaiting payment"
                    : "Draft";
              return (
                <Link
                  key={recovery.id}
                  href={`/me/recoveries/${recovery.id}`}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#C72C5B]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold tracking-tight">
                      {recovery.eventTitle}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${recovery.status === "PAID" && !expired ? "bg-emerald-50 text-emerald-800" : "bg-[#FFF0F4] text-[#C72C5B]"}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="mt-2 break-words text-sm text-black/50">
                    {recovery.clientName} · {recovery.clientEmail}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-5 border-t border-black/5 pt-4 text-sm">
                    <span className="font-bold">
                      {formatMoney(recovery.feeAmount, recovery.currency)}
                    </span>
                    <span className="text-black/50">
                      {recovery._count.assets} photographs
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#C72C5B]">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
