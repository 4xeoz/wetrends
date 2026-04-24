'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { createQrLink } from '@/actions/qr';

const schema = z.object({
  code: z
    .string()
    .min(2, 'At least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  label: z.string().min(1, 'Label is required'),
  destination: z.string().url('Must be a valid URL (include https://)'),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wetrends.co.uk';

export default function CreateQrForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [previewCode, setPreviewCode] = useState('');
  const [previewDest, setPreviewDest] = useState('');

  const codeRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  const redirectUrl = previewCode ? `${siteUrl}/r/${previewCode}` : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const raw = {
      code: codeRef.current?.value ?? '',
      label: labelRef.current?.value ?? '',
      destination: destRef.current?.value ?? '',
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof Errors;
        if (!errs[key]) errs[key] = err.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const result = await createQrLink(parsed.data);
    setSubmitting(false);

    if (result.success) {
      router.push(`/me/qr/${result.code}`);
    } else {
      setServerError(result.message ?? 'Something went wrong.');
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/me/qr"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#C72C5B]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to QR Codes
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Label */}
          <div>
            <label htmlFor="label" className="mb-1.5 block text-sm font-bold text-[#0F0F0F]">
              Label
            </label>
            <input
              id="label"
              ref={labelRef}
              placeholder="e.g. Business Card"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F0F0F] placeholder:text-gray-400 focus:border-[#C72C5B] focus:outline-none focus:ring-2 focus:ring-[#C72C5B]/10"
            />
            {errors.label && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />{errors.label}
              </p>
            )}
          </div>

          {/* Code / slug */}
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-bold text-[#0F0F0F]">
              URL Code
            </label>
            <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#C72C5B] focus-within:ring-2 focus-within:ring-[#C72C5B]/10">
              <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-400">
                /r/
              </span>
              <input
                id="code"
                ref={codeRef}
                placeholder="business-card"
                onChange={(e) => setPreviewCode(e.target.value)}
                className="flex-1 bg-white px-4 py-3 text-sm text-[#0F0F0F] placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            {errors.code && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />{errors.code}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">Lowercase letters, numbers, and hyphens only</p>
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="mb-1.5 block text-sm font-bold text-[#0F0F0F]">
              Destination URL
            </label>
            <input
              id="destination"
              ref={destRef}
              type="url"
              placeholder="https://wa.me/447700000000"
              onChange={(e) => setPreviewDest(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F0F0F] placeholder:text-gray-400 focus:border-[#C72C5B] focus:outline-none focus:ring-2 focus:ring-[#C72C5B]/10"
            />
            {errors.destination && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />{errors.destination}
              </p>
            )}
          </div>

          {serverError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0F0F0F] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              'Create QR Code'
            )}
          </button>
        </form>
      </div>

      {/* Live QR preview */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8">
        {redirectUrl ? (
          <>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <QRCode value={redirectUrl} size={200} />
            </div>
            <p className="mt-4 font-mono text-xs text-gray-400 break-all text-center">{redirectUrl}</p>
            <p className="mt-2 text-xs text-gray-400">
              → <span className="break-all">{previewDest || '(enter destination URL)'}</span>
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-200">
              <div className="grid grid-cols-3 gap-1 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-5 w-5 rounded-sm bg-gray-500" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400">Enter a URL code to see a live preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
