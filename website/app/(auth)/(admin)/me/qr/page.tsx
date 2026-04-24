import Link from 'next/link';
import { QrCode, Plus, ExternalLink, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import { getAllQrLinks } from '@/actions/qr';
import QrDeleteButton from './delete-button';

function DeviceIcon({ device }: { device?: string | null }) {
  if (device === 'Mobile') return <Smartphone className="h-3 w-3" />;
  if (device === 'Tablet') return <Tablet className="h-3 w-3" />;
  return <Monitor className="h-3 w-3" />;
}

export default async function QrAdminPage() {
  const links = await getAllQrLinks();

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F]">QR Codes</h1>
          <p className="mt-1 text-sm text-gray-500">Track scans from your business cards and links</p>
        </div>
        <Link
          href="/me/qr/create"
          className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0F0F0F]"
        >
          <Plus className="h-4 w-4" />
          New QR Code
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <QrCode className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-1 text-base font-bold text-[#0F0F0F]">No QR codes yet</h3>
          <p className="mb-6 text-sm text-gray-500">Create your first tracked QR code to start collecting scan data.</p>
          <Link
            href="/me/qr/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0F0F0F]"
          >
            <Plus className="h-4 w-4" />
            Create QR Code
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Label + scan count */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#0F0F0F]">{link.label}</h3>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">/r/{link.code}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-[#C72C5B]/10 px-3 py-1 text-xs font-bold text-[#C72C5B]">
                  {link._count.scans} scans
                </span>
              </div>

              {/* Destination */}
              <a
                href={link.destination}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 flex items-center gap-1.5 truncate text-xs text-gray-500 hover:text-[#C72C5B]"
              >
                <Globe className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{link.destination}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <Link
                  href={`/me/qr/${link.code}`}
                  className="flex-1 rounded-xl border border-gray-200 py-2 text-center text-xs font-semibold text-[#0F0F0F] transition-colors hover:border-[#C72C5B] hover:text-[#C72C5B]"
                >
                  View Details
                </Link>
                <QrDeleteButton id={link.id} label={link.label} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
