import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { getQrLinkWithScans } from '@/actions/qr';
import CopyButton from './copy-button';

function DeviceIcon({ device }: { device?: string | null }) {
  if (device === 'Mobile') return <Smartphone className="h-3.5 w-3.5" />;
  if (device === 'Tablet') return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default async function QrDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const link = await getQrLinkWithScans(code);

  if (!link) notFound();

  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wetrends.co.uk'}/r/${link.code}`;

  const deviceCounts = link.scans.reduce<Record<string, number>>((acc, s) => {
    const d = s.device ?? 'Unknown';
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  const countryCounts = link.scans.reduce<Record<string, number>>((acc, s) => {
    const c = s.country ?? 'Unknown';
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8">
      {/* Back */}
      <Link
        href="/me/qr"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#C72C5B]"
      >
        <ArrowLeft className="h-4 w-4" />
        All QR Codes
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — QR + info */}
        <div className="space-y-4 lg:col-span-1">
          {/* QR card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center rounded-xl bg-white p-4">
              <QRCode value={redirectUrl} size={180} />
            </div>
            <h2 className="mb-1 text-center text-lg font-bold text-[#0F0F0F]">{link.label}</h2>
            <p className="mb-4 text-center font-mono text-xs text-gray-400">/r/{link.code}</p>

            <div className="flex flex-col gap-2">
              <CopyButton text={redirectUrl} label="Copy Redirect URL" />
              <a
                href={link.destination}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:text-[#0F0F0F]"
              >
                <ExternalLink className="h-4 w-4" />
                Open Destination
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[#0F0F0F]">Scan Stats</h3>
            <div className="mb-4">
              <p className="text-3xl font-black text-[#C72C5B]">{link._count.scans}</p>
              <p className="text-xs text-gray-500">total scans</p>
            </div>

            {Object.keys(deviceCounts).length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">By Device</p>
                <div className="space-y-1.5">
                  {Object.entries(deviceCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <DeviceIcon device={device} />
                          {device}
                        </span>
                        <span className="font-semibold text-[#0F0F0F]">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {Object.keys(countryCounts).length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">By Country</p>
                <div className="space-y-1.5">
                  {Object.entries(countryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <Globe className="h-3.5 w-3.5" />
                          {country}
                        </span>
                        <span className="font-semibold text-[#0F0F0F]">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — scan log */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold text-[#0F0F0F]">Recent Scans</h3>
              <p className="text-xs text-gray-500">Last 50 scans shown</p>
            </div>

            {link.scans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Clock className="mb-3 h-10 w-10 text-gray-200" />
                <p className="text-sm font-semibold text-gray-400">No scans yet</p>
                <p className="mt-1 text-xs text-gray-300">Share your QR code to start tracking</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {link.scans.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <DeviceIcon device={scan.device} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-sm font-semibold text-[#0F0F0F]">
                          {scan.device ?? 'Unknown device'}
                        </span>
                        {scan.country && (
                          <span className="text-xs text-gray-400">
                            {scan.city ? `${scan.city}, ` : ''}{scan.country}
                          </span>
                        )}
                      </div>
                      {scan.ip && (
                        <p className="mt-0.5 font-mono text-xs text-gray-300">{scan.ip}</p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400">
                      {timeAgo(scan.scannedAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
