"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Download,
  Loader2,
  LockKeyhole,
} from "lucide-react";

type Asset = { id: string; title: string; url: string };
export default function RecoveryClient({
  token,
  title,
  clientName,
  price,
  count,
  accessDays,
  expiresAt,
  assets,
  expired,
  paymentNotice,
}: {
  token: string;
  title: string;
  clientName: string;
  price: string;
  count: number;
  accessDays: number;
  expiresAt: string | null;
  assets: Asset[];
  expired: boolean;
  paymentNotice?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState(false);
  const unlocked = assets.length > 0 && !expired;
  const date = expiresAt
    ? new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/London",
      }).format(new Date(expiresAt))
    : "";
  async function pay() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/recovery/${token}/checkout`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.url)
        throw new Error(
          result.error || "Could not open payment. Please try again.",
        );
      window.location.assign(result.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not open payment. Please try again.",
      );
      setBusy(false);
    }
  }
  async function download() {
    if (busy || !selected.size) return;
    setBusy(true);
    setError("");
    try {
      const files: Record<string, Uint8Array> = {};
      const chosen = assets.filter((asset) => selected.has(asset.id));
      const extensions: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };
      for (const [index, asset] of chosen.entries()) {
        setProgress(`Preparing ${index + 1} of ${chosen.length} photographs…`);
        const response = await fetch(`${asset.url}?download=1`, {
          cache: "no-store",
        });
        if (!response.ok)
          throw new Error(
            "A photograph could not be downloaded. Refresh this page and try again; if access has ended, reply to your email for help.",
          );
        const extension =
          extensions[response.headers.get("content-type")?.split(";")[0] || ""];
        if (!extension)
          throw new Error(
            "Unexpected photograph format. Please contact WeTrends.",
          );
        const name =
          asset.title.replace(/[^a-z0-9_-]/gi, "-").slice(0, 100) ||
          "photograph";
        files[`${String(index + 1).padStart(3, "0")}-${name}.${extension}`] =
          new Uint8Array(await response.arrayBuffer());
      }
      setProgress("Creating your ZIP…");
      const { zip } = await import("fflate");
      const zipped = await new Promise<Uint8Array>((resolve, reject) =>
        zip(files, { level: 0 }, (err, data) =>
          err ? reject(err) : resolve(data),
        ),
      );
      const url = URL.createObjectURL(
        new Blob([zipped as BlobPart], { type: "application/zip" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9_-]/gi, "-").slice(0, 100)}-wetrends.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Download failed. Please try again.",
      );
    } finally {
      setBusy(false);
      setProgress("");
    }
  }
  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setDone(false);
  }
  return (
    <main className="min-h-screen bg-[#F7F4F2] text-[#12090D]">
      <header className="border-b border-black/5 bg-white px-5 py-5 sm:px-8">
        <span className="text-lg font-black tracking-tight">WETRENDS</span>
        <span className="float-right inline-flex items-center gap-2 text-xs font-semibold text-black/45">
          <LockKeyhole className="h-3.5 w-3.5" /> Private delivery
        </span>
      </header>
      <section className="relative isolate overflow-hidden border-b border-black/5 px-5 py-12 sm:py-16">
        <Image
          src="/images/events-mesh-light.png?v=brand-magenta"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none -z-10 object-cover opacity-65"
        />
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">
            {expired
              ? "Download period ended"
              : unlocked
                ? "Gallery restored"
                : "Your photographs, recovered"}
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.06em]">
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60">
            {expired
              ? "This restored gallery’s access period has ended. Reply to your recovery email if you need help."
              : unlocked
                ? `Here they are, ${clientName}. Select your favourites or keep the whole collection.`
                : `Hi ${clientName}. We’ve found your photographs and uploaded them again.`}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        {paymentNotice && !unlocked && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {paymentNotice}
          </p>
        )}
        {expired ? (
          <section className="rounded-3xl border border-black/10 bg-white p-7">
            <h2 className="text-xl font-bold">Need another copy?</h2>
            <p className="mt-3 text-sm text-black/55">
              Contact WeTrends by replying to your gallery email. We’ll check
              whether the photographs can be recovered again.
            </p>
          </section>
        ) : !unlocked ? (
          <section className="grid overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm sm:grid-cols-[1.2fr_1fr]">
            <div className="p-7 sm:p-9">
              <h2 className="text-2xl font-bold tracking-tight">
                Reopen your collection.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/55">
                The original two-week download period has ended. This one-time
                admin fee covers finding and re-uploading your photographs.
              </p>
              <div className="mt-6 space-y-3 text-sm font-semibold">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C72C5B]" /> {count} recovered
                  photographs
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C72C5B]" /> {accessDays} days
                  to download after payment
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C72C5B]" /> Keep your
                  downloaded copies
                </p>
              </div>
            </div>
            <div className="relative isolate overflow-hidden bg-[#C72C5B] p-7 text-white sm:p-9">
              <Image
                src="/images/events-mesh-dark.png?v=brand-magenta"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="-z-10 object-cover opacity-70"
              />
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                One-time recovery fee
              </p>
              <p className="mt-3 text-5xl font-bold tracking-tight">{price}</p>
              <p className="mt-3 text-xs text-white/75">
                No subscription. Access starts when you pay.
              </p>
              <button
                disabled={busy}
                aria-busy={busy}
                onClick={pay}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#12090D] disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                {busy ? "Opening secure payment…" : "Pay & restore my gallery"}
              </button>
              <p className="mt-3 text-center text-xs text-white/65">
                Secure payment with Stripe
              </p>
            </div>
          </section>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">
                  {count} photographs · payment confirmed
                </p>
                <p className="mt-1 text-xs text-black/55">
                  Download by {date} (UK time).
                </p>
              </div>
              <button
                disabled={busy}
                onClick={() => {
                  setSelected(
                    selected.size === assets.length
                      ? new Set()
                      : new Set(assets.map((asset) => asset.id)),
                  );
                  setDone(false);
                }}
                className="min-h-11 rounded-full border border-black/10 bg-white px-5 text-sm font-bold disabled:opacity-50"
              >
                {selected.size === assets.length ? "Clear all" : "Select all"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  disabled={busy}
                  onClick={() => toggle(asset.id)}
                  aria-label={`${selected.has(asset.id) ? "Deselect" : "Select"} ${asset.title}`}
                  aria-pressed={selected.has(asset.id)}
                  className={`group relative overflow-hidden rounded-2xl bg-black/5 text-left focus-visible:ring-4 focus-visible:ring-[#C72C5B] ${selected.has(asset.id) ? "ring-4 ring-[#C72C5B]" : ""}`}
                >
                  <Image
                    unoptimized
                    src={asset.url}
                    alt={asset.title}
                    width={400}
                    height={500}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <span
                    className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border-2 border-white ${selected.has(asset.id) ? "bg-[#C72C5B] text-white" : "bg-black/20 text-transparent"}`}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-8 text-xs font-semibold text-white">
                    {asset.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#12090D] p-5 text-white">
              <p className="text-sm font-bold">
                {selected.size} {selected.size === 1 ? "photo" : "photos"}{" "}
                selected
              </p>
              <button
                disabled={busy || !selected.size}
                aria-busy={busy}
                onClick={download}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold disabled:opacity-45"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {busy ? "Preparing download…" : "Download selected"}
              </button>
            </div>
            {progress && (
              <p role="status" className="mt-4 text-sm text-black/60">
                {progress}
              </p>
            )}
            {done && (
              <section
                role="status"
                className="mt-5 rounded-2xl bg-emerald-50 p-5 text-emerald-900"
              >
                <p className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-5 w-5" /> Your download has
                  started.
                </p>
                <p className="mt-2 text-sm">
                  Check your device’s Downloads folder for the ZIP and save a
                  backup.
                </p>
              </section>
            )}
          </>
        )}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <p className="mt-7 text-center text-xs leading-relaxed text-black/45">
          Questions? Reply to your WeTrends recovery email.
          <br />
          Keep this private link safe.
        </p>
      </div>
    </main>
  );
}
