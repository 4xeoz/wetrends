"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Send, XCircle } from "lucide-react";
import { publishClientPayment, voidClientPayment } from "@/actions/client-payments";

export default function ClientPaymentControls({ paymentId, status, url }: {
  paymentId: string;
  status: "DRAFT" | "OPEN" | "PAID" | "VOID";
  url?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function publish() {
    setBusy(true); setError("");
    try {
      const result = await publishClientPayment(paymentId);
      if (result.error) throw new Error(result.error);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not publish the payment page.");
    } finally { setBusy(false); }
  }
  async function voidPayment() {
    if (!window.confirm("Void this unpaid payment request? Its client link will stop accepting payment.")) return;
    setBusy(true); setError("");
    try {
      const result = await voidClientPayment(paymentId);
      if (result.error) throw new Error(result.error);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not void the payment request.");
    } finally { setBusy(false); }
  }
  async function copy() {
    if (!url) return;
    try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setError("Could not copy the link. Select it below instead."); }
  }
  return <div className="space-y-4">
    {status === "DRAFT" && <div className="rounded-3xl border border-[#C72C5B]/20 bg-[#FFF0F4] p-5 sm:p-6">
      <p className="font-bold text-[#3C1724]">Ready to share?</p>
      <p className="mt-2 text-sm leading-relaxed text-[#5A3440]">Review the client and every price first. Publishing locks these terms and creates a private link; it does not email the client.</p>
      <button type="button" onClick={publish} disabled={busy} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white hover:bg-[#A8254D] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish payment page
      </button>
    </div>}
    {url && <div className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C72C5B]">Private client link</p>
      <p className="mt-2 text-sm text-black/55">Share only with the agreed client. Anyone with this link can view the payment summary.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input aria-label="Private client payment link" readOnly value={url} onFocus={(event) => event.target.select()} className="min-h-12 min-w-0 flex-1 rounded-2xl border border-black/15 bg-[#FAF8F7] px-4 text-sm" />
        <button type="button" onClick={copy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-bold hover:border-[#C72C5B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy link"}
        </button>
      </div>
      {status === "OPEN" && <button type="button" onClick={voidPayment} disabled={busy} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">
        <XCircle className="h-4 w-4" /> Void this request
      </button>}
    </div>}
    {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p>}
  </div>;
}
