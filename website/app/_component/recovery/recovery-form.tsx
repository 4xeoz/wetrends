"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { saveRecovery } from "@/actions/recovery";

export default function RecoveryForm({
  recoveryId,
  sourceEventJobId,
  initial,
}: {
  recoveryId?: string;
  sourceEventJobId?: string;
  initial?: {
    clientName: string;
    clientEmail: string;
    eventTitle: string;
    fee: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await saveRecovery(
        {
          clientName: String(data.get("clientName")),
          clientEmail: String(data.get("clientEmail")),
          eventTitle: String(data.get("eventTitle")),
          fee: String(data.get("fee")),
        },
        recoveryId,
        sourceEventJobId,
      );
      if (result.error) setError(result.error);
      else if (result.recoveryId) {
        router.push(`/me/recoveries/${result.recoveryId}`);
        router.refresh();
      }
    } catch {
      setError("Could not save the recovery. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Client name"
          name="clientName"
          defaultValue={initial?.clientName}
          maxLength={100}
        />
        <Field
          label="Client email"
          name="clientEmail"
          type="email"
          defaultValue={initial?.clientEmail}
          maxLength={254}
        />
      </div>
      <Field
        label="Event / collection title"
        name="eventTitle"
        defaultValue={initial?.eventTitle}
        maxLength={160}
      />
      <div>
        <Field
          label="Recovery fee (£)"
          name="fee"
          type="number"
          min="0.50"
          max="1000"
          step="0.01"
          defaultValue={initial?.fee}
        />
        <p className="mt-2 text-xs leading-relaxed text-black/50">
          One payment for finding and re-uploading the photographs. Download
          access lasts 14 days after payment.
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <button
        disabled={busy}
        aria-busy={busy}
        className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {busy
          ? "Saving…"
          : recoveryId
            ? "Save draft"
            : "Create recovery & add photos"}
      </button>
    </form>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        {...props}
        className="mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-normal outline-none focus:border-[#C72C5B] focus:ring-2 focus:ring-[#C72C5B]/15"
      />
    </label>
  );
}
