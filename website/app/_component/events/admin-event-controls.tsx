'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addCloudinaryGalleryAsset,
  addExternalGalleryAsset,
  publishEventGallery,
  rotateEventAccess,
  sendEventOffer,
} from '@/actions/events';
import { Check, Clipboard, CloudUpload, ExternalLink, Loader2, Mail, RefreshCcw, Send } from 'lucide-react';

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  type: string;
  signature: string;
  error?: string;
};

type UploadResult = {
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  error?: { message?: string };
};

export default function AdminEventControls({
  eventJobId,
  initialOfferUrl,
  galleryUrl,
  clientEmail,
  testEmail,
  selectedPackage,
  galleryStatus,
  assetCount,
  googleDriveConfigured,
  cloudinaryConfigured,
}: {
  eventJobId: string;
  initialOfferUrl: string;
  galleryUrl: string;
  clientEmail: string;
  testEmail: string | null;
  selectedPackage: string | null;
  galleryStatus: string;
  assetCount: number;
  googleDriveConfigured: boolean;
  cloudinaryConfigured: boolean;
}) {
  const router = useRouter();
  const [offerUrl, setOfferUrl] = useState(initialOfferUrl);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  function begin(name: string) {
    setBusy(name);
    setNotice('');
    setError('');
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setNotice(`${label} copied.`);
  }

  async function emailOffer(recipient?: string) {
    begin(recipient ? 'test-email' : 'client-email');
    try {
      const result = await sendEventOffer(eventJobId, recipient, crypto.randomUUID());
      if (!result.success) setError(result.message || 'Email could not be sent.');
      else setNotice(`Offer email sent to ${recipient || clientEmail}.`);
      router.refresh();
    } catch {
      setError('Email could not be sent.');
    } finally {
      setBusy('');
    }
  }

  async function rotateLink() {
    if (!window.confirm('Create a new private link? The current link will stop working immediately.')) return;
    begin('rotate');
    try {
      const result = await rotateEventAccess(eventJobId);
      setOfferUrl(result.offerUrl);
      setNotice('A new private link is ready.');
      router.refresh();
    } catch {
      setError('The link could not be rotated.');
    } finally {
      setBusy('');
    }
  }

  async function addExternal(formData: FormData) {
    begin('external');
    try {
      const result = await addExternalGalleryAsset({
        eventJobId,
        title: String(formData.get('title') || ''),
        alt: String(formData.get('alt') || ''),
        sourceUrl: String(formData.get('sourceUrl') || ''),
      });
      if (!result.success) setError(result.message);
      else {
        setNotice('Photograph added to the gallery.');
        router.refresh();
      }
    } catch {
      setError('The photograph could not be added.');
    } finally {
      setBusy('');
    }
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    begin('upload');
    try {
      let completed = 0;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);
        if (googleDriveConfigured) {
          const uploadData = new FormData();
          uploadData.set('eventJobId', eventJobId);
          uploadData.set('file', file);
          const uploadResponse = await fetch('/api/admin/events/drive-upload', {
            method: 'POST',
            body: uploadData,
          });
          const uploaded = await uploadResponse.json() as { name?: string; error?: string };
          if (!uploadResponse.ok) throw new Error(uploaded.error || `Upload failed for ${file.name}.`);
        } else {
          const signatureResponse = await fetch('/api/admin/events/cloudinary-signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventJobId }),
          });
          const signature = await signatureResponse.json() as UploadSignature;
          if (!signatureResponse.ok) throw new Error(signature.error || 'Upload storage is unavailable.');

          const uploadData = new FormData();
          uploadData.set('file', file);
          uploadData.set('api_key', signature.apiKey);
          uploadData.set('timestamp', String(signature.timestamp));
          uploadData.set('folder', signature.folder);
          uploadData.set('type', signature.type);
          uploadData.set('signature', signature.signature);
          const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
            method: 'POST',
            body: uploadData,
          });
          const uploaded = await uploadResponse.json() as UploadResult;
          if (!uploadResponse.ok || !uploaded.public_id || !uploaded.format || !uploaded.width || !uploaded.height) {
            throw new Error(uploaded.error?.message || `Upload failed for ${file.name}.`);
          }

          const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || `Event photograph ${assetCount + completed + 1}`;
          const registered = await addCloudinaryGalleryAsset({
            eventJobId,
            title: cleanName,
            alt: `${cleanName} from this event`,
            cloudinaryId: uploaded.public_id,
            cloudinaryFormat: uploaded.format,
            width: uploaded.width,
            height: uploaded.height,
          });
          if (!registered.success) throw new Error(registered.message);
        }
        completed += 1;
        setNotice(`Uploaded ${completed} of ${files.length} photographs…`);
      }
      setNotice(`${completed} ${completed === 1 ? 'photograph' : 'photographs'} uploaded securely.`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The upload failed.');
    } finally {
      setBusy('');
    }
  }

  async function publish() {
    begin('publish');
    try {
      const result = await publishEventGallery(eventJobId, undefined, crypto.randomUUID());
      if (!result.success) setError(result.message);
      else {
        setNotice(result.emailSent ? 'Gallery published and the client email was sent.' : 'Gallery published, but the email needs attention.');
        router.refresh();
      }
    } catch {
      setError('The gallery could not be published.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="space-y-6">
      {(notice || error) && (
        <div role="status" className={`rounded-2xl border px-5 py-4 text-sm font-medium ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {error || notice}
        </div>
      )}

      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Private offer</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Send the client their choices</h2></div>
          <a href={offerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold"><ExternalLink className="h-3.5 w-3.5" /> Preview</a>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#F7F4F2] p-3">
          <code className="min-w-0 flex-1 truncate text-xs text-black/55">{offerUrl}</code>
          <button type="button" onClick={() => copy(offerUrl, 'Offer link')} className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white text-[#C72C5B]" aria-label="Copy offer link"><Clipboard className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton onClick={() => emailOffer()} loading={busy === 'client-email'} icon={<Mail className="h-4 w-4" />}>Send to client</ActionButton>
          {testEmail && <ActionButton onClick={() => emailOffer(testEmail)} loading={busy === 'test-email'} secondary icon={<Send className="h-4 w-4" />}>Send test</ActionButton>}
          <ActionButton onClick={rotateLink} loading={busy === 'rotate'} secondary icon={<RefreshCcw className="h-4 w-4" />}>Rotate link</ActionButton>
        </div>
      </section>

      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Gallery production</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-2xl font-bold tracking-[-0.03em]">Add finished photographs</h2><p className="mt-2 text-sm text-black/45">{assetCount} uploaded · {galleryStatus.toLowerCase()}</p></div>
          {galleryStatus === 'PUBLISHED' && <button type="button" onClick={() => copy(galleryUrl, 'Gallery link')} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-bold"><Clipboard className="h-3.5 w-3.5" /> Copy gallery link</button>}
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-[#C72C5B]/30 bg-[#FFF6F8] p-6 text-center">
          <CloudUpload className="mx-auto h-7 w-7 text-[#C72C5B]" />
          <p className="mt-3 text-sm font-bold">Secure image upload</p>
          <p className="mt-1 text-xs text-black/45">{googleDriveConfigured ? 'Photographs upload to the private company Google Drive.' : 'Photographs upload to private Cloudinary storage.'}</p>
          <label className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#C72C5B] px-5 py-3 text-xs font-bold text-white ${!(googleDriveConfigured || cloudinaryConfigured) || busy === 'upload' ? 'pointer-events-none opacity-45' : ''}`}>
            {busy === 'upload' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
            {busy === 'upload' ? 'Uploading…' : 'Choose photographs'}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => uploadFiles(event.target.files)} />
          </label>
          {!googleDriveConfigured && !cloudinaryConfigured && <p className="mt-3 text-xs font-medium text-amber-700">Connect the company Drive credentials to enable uploads.</p>}
          {googleDriveConfigured && <p className="mt-3 text-xs text-emerald-700">Drive is connected. New uploads go to this event&apos;s private production folder.</p>}
        </div>

        <details className="mt-5 rounded-2xl border border-black/[0.06] p-5">
          <summary className="cursor-pointer text-sm font-bold">Add an existing image URL</summary>
          <form action={addExternal} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-black/55">Title<input required name="title" placeholder="Cake cutting" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-normal outline-none focus:border-[#C72C5B]" /></label>
            <label className="text-xs font-bold text-black/55">Accessible description<input required name="alt" placeholder="Guests celebrating around the cake" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-normal outline-none focus:border-[#C72C5B]" /></label>
            <label className="text-xs font-bold text-black/55 sm:col-span-2">Local path or HTTPS URL<input required name="sourceUrl" placeholder="/images/events-birthday.png" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-normal outline-none focus:border-[#C72C5B]" /></label>
            <button disabled={busy === 'external'} className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-xs font-bold"><ExternalLink className="h-4 w-4" /> Add URL</button>
          </form>
        </details>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-6">
          <ActionButton onClick={publish} loading={busy === 'publish'} disabled={!selectedPackage || assetCount < 1} icon={<Check className="h-4 w-4" />}>{galleryStatus === 'PUBLISHED' ? 'Resend gallery email' : 'Publish & email client'}</ActionButton>
          {!selectedPackage && <p className="text-xs text-black/45">Waiting for the client to choose a collection.</p>}
        </div>
      </section>
    </div>
  );
}

function ActionButton({ children, onClick, loading, secondary = false, disabled = false, icon }: { children: React.ReactNode; onClick: () => void; loading: boolean; secondary?: boolean; disabled?: boolean; icon: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={loading || disabled} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${secondary ? 'border border-black/10 bg-white text-black hover:border-black/25' : 'bg-[#C72C5B] text-white hover:bg-[#0F0F0F]'}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}{children}
    </button>
  );
}
