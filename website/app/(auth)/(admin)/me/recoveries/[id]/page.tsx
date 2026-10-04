import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { formatMoney } from "@/lib/events/catalog";
import { getRecoveryUrl } from "@/lib/recovery/access";
import { objectIdPattern } from "@/lib/recovery/policy";
import { isGoogleDriveConfigured } from "@/lib/google-drive";
import RecoveryControls from "@/app/_component/recovery/recovery-controls";
import RecoveryForm from "@/app/_component/recovery/recovery-form";

export const dynamic = "force-dynamic";
export default async function RecoveryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!objectIdPattern.test(id)) notFound();
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id },
    include: {
      assets: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      order: true,
      emails: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!recovery) notFound();
  const expired = Boolean(
    recovery.expiresAt && recovery.expiresAt <= new Date(),
  );
  const date = (value: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London",
    }).format(value);
  return (
    <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/me/recoveries"
          className="inline-flex items-center gap-2 text-sm text-black/50"
        >
          <ArrowLeft className="h-4 w-4" /> Gallery recovery
        </Link>
        <header className="mt-6 rounded-3xl bg-[#12090D] p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F08BAB]">
            {expired
              ? "Access expired"
              : recovery.status === "PAID"
                ? "Paid · gallery restored"
                : recovery.status === "READY"
                  ? "Awaiting payment"
                  : "Draft recovery"}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">
            {recovery.eventTitle}
          </h1>
          <p className="mt-3 break-words text-sm text-white/65">
            {recovery.clientName} · {recovery.clientEmail}
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <span className="font-bold">
              {formatMoney(recovery.feeAmount, recovery.currency)} recovery fee
            </span>
            <span className="text-white/65">
              {recovery.assets.length} photographs
            </span>
            <span className="text-white/65">
              {recovery.expiresAt
                ? `Available until ${date(recovery.expiresAt)} (UK)`
                : `${recovery.accessDays} days after payment`}
            </span>
          </div>
        </header>
        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-7">
            {recovery.status === "DRAFT" && (
              <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-5 text-xl font-bold">01 · Client & fee</h2>
                <RecoveryForm
                  recoveryId={id}
                  initial={{
                    clientName: recovery.clientName,
                    clientEmail: recovery.clientEmail,
                    eventTitle: recovery.eventTitle,
                    fee: (recovery.feeAmount / 100).toFixed(2),
                  }}
                />
              </section>
            )}
            <RecoveryControls
              id={id}
              status={recovery.status}
              clientEmail={recovery.clientEmail}
              assetCount={recovery.assets.length}
              folderUrl={
                recovery.driveFolderId
                  ? `https://drive.google.com/drive/folders/${recovery.driveFolderId}`
                  : null
              }
              clientUrl={getRecoveryUrl(id, recovery.accessVersion)}
              driveConfigured={isGoogleDriveConfigured()}
              expired={expired}
            />
          </div>
          <div className="space-y-7">
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="text-xl font-bold">Recovered photographs</h2>
              {!recovery.assets.length ? (
                <p className="mt-4 text-sm text-black/45">
                  Your uploads will appear here.
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {recovery.assets.map((asset) => (
                    <figure key={asset.id}>
                      <Image
                        unoptimized
                        src={`/api/admin/recoveries/${id}/assets/${asset.id}`}
                        alt={asset.title}
                        width={180}
                        height={180}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <figcaption className="mt-1 truncate text-xs text-black/50">
                        {asset.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="text-xl font-bold">Payment</h2>
              <p className="mt-3 text-sm text-black/55">
                {recovery.order
                  ? `${recovery.order.status.toLowerCase().replaceAll("_", " ")} · ${formatMoney(recovery.order.total, recovery.order.currency)}`
                  : "No checkout started yet."}
              </p>
              {recovery.paidAt && (
                <p className="mt-2 text-xs text-black/45">
                  Paid {date(recovery.paidAt)} (UK). The download window starts
                  here.
                </p>
              )}
            </section>
            <section className="rounded-3xl border border-black/10 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Mail className="h-5 w-5 text-[#C72C5B]" /> Email history
              </h2>
              {!recovery.emails.length ? (
                <p className="mt-4 text-sm text-black/45">
                  No emails sent yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {recovery.emails.map((email) => (
                    <article
                      key={email.id}
                      className="border-b border-black/5 pb-3 last:border-0"
                    >
                      <div className="flex justify-between gap-3">
                        <p className="text-sm font-bold">
                          {email.kind === "recovery-paid"
                            ? "Payment & downloads"
                            : "Recovery invitation"}
                        </p>
                        <span
                          className={`text-xs font-bold ${email.status === "sent" ? "text-emerald-700" : "text-red-600"}`}
                        >
                          {email.status === "sent" ? "Accepted" : "Failed"}
                        </span>
                      </div>
                      <p className="mt-1 break-words text-xs text-black/45">
                        {email.recipient} · {date(email.createdAt)}
                      </p>
                      {email.errorMessage && (
                        <p className="mt-1 text-xs text-red-700">
                          {email.errorMessage}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
