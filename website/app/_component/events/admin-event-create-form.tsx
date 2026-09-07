'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createEventJob } from '@/actions/events';

type InitialEvent = {
  leadId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  eventTitle?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
};

const inputClass = 'mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C72C5B] focus:ring-4 focus:ring-[#C72C5B]/10';

export default function AdminEventCreateForm({ initial = {} }: { initial?: InitialEvent }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setLoading(true);
    setError('');
    const pounds = (name: string) => Math.round(Number(formData.get(name) || 0) * 100);
    try {
      const result = await createEventJob({
        leadId: initial.leadId,
        clientName: String(formData.get('clientName') || ''),
        clientEmail: String(formData.get('clientEmail') || ''),
        clientPhone: String(formData.get('clientPhone') || ''),
        eventTitle: String(formData.get('eventTitle') || ''),
        eventType: String(formData.get('eventType') || ''),
        eventDate: String(formData.get('eventDate') || ''),
        location: String(formData.get('location') || ''),
        photographerName: String(formData.get('photographerName') || ''),
        photographerImage: String(formData.get('photographerImage') || ''),
        partnerName: String(formData.get('partnerName') || ''),
        includedImageCount: Number(formData.get('includedImageCount') || 10),
        fullGalleryPrice: pounds('fullGalleryPrice'),
        retouchingPrice: pounds('retouchingPrice'),
        extraCoverageMinutes: Number(formData.get('extraCoverageMinutes') || 0),
        extraCoveragePrice: pounds('extraCoveragePrice'),
      });
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(`/me/events/${result.eventJobId}`);
      router.refresh();
    } catch {
      setError('The event could not be created. Check the details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="space-y-8">
      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Client & event</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Client name" name="clientName" defaultValue={initial.clientName} required />
          <Field label="Client email" name="clientEmail" type="email" defaultValue={initial.clientEmail} required />
          <Field label="Phone" name="clientPhone" type="tel" defaultValue={initial.clientPhone} />
          <Field label="Event title" name="eventTitle" defaultValue={initial.eventTitle || 'Birthday celebration'} required />
          <Field label="Event type" name="eventType" defaultValue={initial.eventType || 'Celebration'} required />
          <Field label="Event date" name="eventDate" type="date" defaultValue={initial.eventDate} />
          <div className="sm:col-span-2"><Field label="Location" name="location" defaultValue={initial.location} /></div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Personalisation</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Photographer name" name="photographerName" defaultValue="Iyad Chirifi" required />
          <Field label="Photographer image" name="photographerImage" defaultValue="/images/eddy-event-photographer-v2.png" />
          <div className="sm:col-span-2"><Field label="Partner contribution name (optional)" name="partnerName" placeholder="e.g. Savanna Venue" /></div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Offer & agreed charges</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Included photographs" name="includedImageCount" type="number" defaultValue="10" min="1" required />
          <Field label="Complete gallery (£)" name="fullGalleryPrice" type="number" step="0.01" min="0" defaultValue="79" required />
          <Field label="Signature retouching (£)" name="retouchingPrice" type="number" step="0.01" min="0" defaultValue="35" required />
          <Field label="Agreed extra minutes" name="extraCoverageMinutes" type="number" min="0" defaultValue="0" />
          <Field label="Agreed extra coverage (£)" name="extraCoveragePrice" type="number" step="0.01" min="0" defaultValue="0" />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-black/45">Extra coverage appears as a fixed line item only when both minutes and price are entered. Standard editing remains included.</p>
      </section>

      {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</p>}
      <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0F0F0F] disabled:opacity-60 sm:w-auto">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <>Create private offer <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}

function Field({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="block text-sm font-semibold text-black/70">
      {label}
      <input name={name} className={inputClass} {...props} />
    </label>
  );
}
