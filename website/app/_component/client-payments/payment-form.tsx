"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { saveClientPayment, type ClientPaymentFormInput } from "@/actions/client-payments";
import { MAX_PAYMENT_ITEMS, parsePounds } from "@/lib/client-payments/policy";
import { formatMoney } from "@/lib/events/catalog";

const emptyItem = () => ({ name: "", description: "", quantity: "1", unitPrice: "" });
const fieldClass = "mt-2 min-h-12 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-base text-[#151515] outline-none transition focus:border-[#C72C5B] focus:ring-2 focus:ring-[#C72C5B]/20";

export default function ClientPaymentForm({
  paymentId,
  initial,
}: {
  paymentId?: string;
  initial?: ClientPaymentFormInput;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ClientPaymentFormInput>(initial || {
    clientName: "", clientEmail: "", projectTitle: "", note: "", items: [emptyItem()],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const total = useMemo(() => form.items.reduce((sum, item) => {
    const price = parsePounds(item.unitPrice);
    const quantity = Number(item.quantity);
    return sum + (price && Number.isSafeInteger(quantity) && quantity > 0 ? price * quantity : 0);
  }, 0), [form.items]);

  function setField<K extends keyof Omit<ClientPaymentFormInput, "items">>(key: K, value: ClientPaymentFormInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function setItem(index: number, key: keyof ClientPaymentFormInput["items"][number], value: string) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await saveClientPayment(form, paymentId);
      if (result.error || !result.paymentId) throw new Error(result.error || "Could not save the draft.");
      router.push(`/me/payments/${result.paymentId}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the draft.");
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-[#242424]">Client name
        <input className={fieldClass} autoComplete="name" required maxLength={100} value={form.clientName} onChange={(event) => setField("clientName", event.target.value)} />
      </label>
      <label className="block text-sm font-semibold text-[#242424]">Client email
        <input className={fieldClass} type="email" autoComplete="email" required maxLength={254} value={form.clientEmail} onChange={(event) => setField("clientEmail", event.target.value)} />
      </label>
    </div>
    <label className="block text-sm font-semibold text-[#242424]">Project or agreement title
      <input className={fieldClass} required maxLength={160} placeholder="e.g. Brand identity and launch website" value={form.projectTitle} onChange={(event) => setField("projectTitle", event.target.value)} />
    </label>
    <label className="block text-sm font-semibold text-[#242424]">Context for the client <span className="font-normal text-black/45">(optional)</span>
      <textarea className={`${fieldClass} min-h-28 resize-y`} maxLength={1000} placeholder="A short summary of the work agreed outside the website." value={form.note} onChange={(event) => setField("note", event.target.value)} />
    </label>
    <section aria-labelledby="payment-items-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="payment-items-heading" className="text-xl font-bold tracking-tight">Agreed items</h2>
          <p className="mt-1 text-sm text-black/50">These details appear on the client&apos;s private payment page.</p>
        </div>
        {form.items.length < MAX_PAYMENT_ITEMS && <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-semibold hover:border-[#C72C5B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]" onClick={() => setForm((current) => ({ ...current, items: [...current.items, emptyItem()] }))}>
          <Plus className="h-4 w-4" /> Add item
        </button>}
      </div>
      {form.items.map((item, index) => <div key={index} className="rounded-3xl border border-black/10 bg-[#FAF8F7] p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C72C5B]">Item {index + 1}</p>
          {form.items.length > 1 && <button type="button" aria-label={`Remove item ${index + 1}`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700" onClick={() => setForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))}>
            <Trash2 className="h-4 w-4" /> Remove
          </button>}
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_6rem_9rem]">
          <label className="block text-sm font-semibold">Service or package
            <input className={fieldClass} required maxLength={120} placeholder="e.g. Website design" value={item.name} onChange={(event) => setItem(index, "name", event.target.value)} />
          </label>
          <label className="block text-sm font-semibold">Qty
            <input className={fieldClass} type="number" min="1" max="100" step="1" required value={item.quantity} onChange={(event) => setItem(index, "quantity", event.target.value)} />
          </label>
          <label className="block text-sm font-semibold">Unit price (£)
            <input className={fieldClass} inputMode="decimal" required placeholder="0.00" value={item.unitPrice} onChange={(event) => setItem(index, "unitPrice", event.target.value)} />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold">What&apos;s included <span className="font-normal text-black/45">(optional)</span>
          <input className={fieldClass} maxLength={300} placeholder="A short plain-language description" value={item.description || ""} onChange={(event) => setItem(index, "description", event.target.value)} />
        </label>
      </div>)}
    </section>
    <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#171619] p-6 text-white">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Total to pay</p><p className="mt-2 text-3xl font-bold tracking-tight">{formatMoney(total, "gbp")}</p></div>
      <button disabled={busy} type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-[#A8254D] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {busy ? "Saving draft…" : "Save draft"}
      </button>
    </div>
    {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p>}
  </form>;
}
