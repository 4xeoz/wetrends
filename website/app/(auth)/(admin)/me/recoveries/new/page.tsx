import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import RecoveryForm from "@/app/_component/recovery/recovery-form";
import { objectIdPattern } from "@/lib/recovery/policy";

export const dynamic = "force-dynamic";
export default async function NewRecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event } = await searchParams;
  const source =
    event && objectIdPattern.test(event)
      ? await prisma.eventJob.findUnique({ where: { id: event } })
      : null;
  return (
    <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/me/recoveries"
          className="inline-flex items-center gap-2 text-sm text-black/50"
        >
          <ArrowLeft className="h-4 w-4" /> Gallery recovery
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
          01 · Client & recovery fee
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">
          Restore their moments.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-black/55">
          Start a new delivery for photographs you can recover. Add the photos
          before emailing the client.
        </p>
        <section className="mt-7 rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <RecoveryForm
            sourceEventJobId={source?.id}
            initial={
              source
                ? {
                    clientName: source.clientName,
                    clientEmail: source.clientEmail,
                    eventTitle: source.eventTitle,
                    fee: "",
                  }
                : undefined
            }
          />
        </section>
      </div>
    </main>
  );
}
