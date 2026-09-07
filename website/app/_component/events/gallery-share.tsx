'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Copy, Download, Loader2, Share2, Users, X } from 'lucide-react';

export type DownloadableGalleryAsset = {
  id: string;
  title: string;
  downloadUrl: string;
};

const extensionByContentType: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function safeFilename(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'wetrends-photo';
}

function getGalleryUrl(token: string) {
  return new URL(`/gallery/${token}`, window.location.origin).toString();
}

async function copyGalleryLink(token: string) {
  await navigator.clipboard.writeText(getGalleryUrl(token));
}

async function shareGallery(token: string, eventTitle: string) {
  const url = getGalleryUrl(token);
  if (navigator.share) {
    await navigator.share({
      title: `${eventTitle} | WeTrends`,
      text: `View, choose and download photos from our ${eventTitle} gallery.`,
      url,
    });
    return 'shared' as const;
  }
  await copyGalleryLink(token);
  return 'copied' as const;
}

export function GalleryShareButton({
  token,
  eventTitle,
  compact = false,
}: {
  token: string;
  eventTitle: string;
  compact?: boolean;
}) {
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState('');

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    setMessage('');
    try {
      const result = await shareGallery(token, eventTitle);
      setMessage(result === 'copied' ? 'Link copied' : 'Share opened');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        try {
          await copyGalleryLink(token);
          setMessage('Link copied');
        } catch {
          setMessage('Use your browser to copy this link');
        }
      }
    } finally {
      setSharing(false);
      window.setTimeout(() => setMessage(''), 2600);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        aria-busy={sharing}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3.5 text-xs font-bold transition hover:border-black/25 hover:bg-[#F7F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] sm:px-5"
      >
        {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
        <span>{compact ? 'Share' : 'Share with friends & family'}</span>
      </button>
      <AnimatePresence>
        {message && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            role="status"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 whitespace-nowrap rounded-full bg-[#12090D] px-3 py-2 text-[10px] font-bold text-white shadow-lg"
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DownloadShareDialog({
  open,
  onClose,
  token,
  eventTitle,
  assets,
  completionHref,
}: {
  open: boolean;
  onClose: () => void;
  token: string;
  eventTitle: string;
  assets: DownloadableGalleryAsset[];
  completionHref?: string;
}) {
  const [sharing, setSharing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preparing) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open, preparing]);

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    setMessage('');
    try {
      const result = await shareGallery(token, eventTitle);
      setMessage(result === 'copied' ? 'Private gallery link copied.' : 'Share options opened.');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setMessage('We could not open sharing. Copy the link instead.');
      }
    } finally {
      setSharing(false);
    }
  }

  async function handleCopy() {
    if (copying) return;
    setCopying(true);
    setMessage('');
    try {
      await copyGalleryLink(token);
      setMessage('Private gallery link copied.');
    } catch {
      setMessage('Copy the gallery link from your browser.');
    } finally {
      setCopying(false);
    }
  }

  async function handleDownload() {
    if (preparing || assets.length === 0) return;
    setPreparing(true);
    setProgress(0);
    setMessage('');

    try {
      const files: Record<string, Uint8Array> = {};
      let completed = 0;
      for (let batchStart = 0; batchStart < assets.length; batchStart += 4) {
        const batch = assets.slice(batchStart, batchStart + 4);
        await Promise.all(batch.map(async (asset, batchIndex) => {
          const response = await fetch(asset.downloadUrl);
          if (!response.ok) throw new Error(`Could not download ${asset.title}`);
          const contentType = response.headers.get('content-type')?.split(';')[0] || '';
          const extension = extensionByContentType[contentType] || 'jpg';
          const position = String(batchStart + batchIndex + 1).padStart(2, '0');
          files[`${position}-${safeFilename(asset.title)}.${extension}`] = new Uint8Array(await response.arrayBuffer());
          completed += 1;
          setProgress(completed);
        }));
      }

      const { zip } = await import('fflate');
      const archive = await new Promise<Uint8Array>((resolve, reject) => {
        zip(files, { level: 0 }, (error, data) => error ? reject(error) : resolve(data));
      });
      const payload = archive.buffer.slice(archive.byteOffset, archive.byteOffset + archive.byteLength) as ArrayBuffer;
      const objectUrl = URL.createObjectURL(new Blob([payload], { type: 'application/zip' }));
      const download = document.createElement('a');
      download.href = objectUrl;
      download.download = `${safeFilename(eventTitle)}-photos.zip`;
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      onClose();
      if (completionHref) {
        window.setTimeout(() => window.location.assign(completionHref), 250);
      }
    } catch {
      setMessage('We could not prepare the download. Please try again.');
    } finally {
      setPreparing(false);
      setProgress(0);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] grid place-items-center bg-[#12090D]/78 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-share-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 290, damping: 26 }}
            className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-white p-6 text-[#0F0F0F] shadow-[0_32px_110px_rgba(18,9,13,0.4)] sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={preparing}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/[0.05] transition hover:bg-black/10 disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FFF0F4] text-[#C72C5B]">
              <Share2 className="h-6 w-6" />
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Before you download</p>
            <h2 id="download-share-title" className="mt-3 text-4xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-5xl">Make it easy for everyone.</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/55 sm:text-base">
              Share this private gallery so friends and family can choose and download their own photos — or continue with yours now.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing || preparing}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-5 text-sm font-bold text-white transition hover:bg-[#A91F49] disabled:opacity-50"
              >
                {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                Share gallery
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={preparing || assets.length === 0}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#12090D] px-5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
              >
                {preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {preparing ? `Preparing ${progress}/${assets.length}` : 'Download now'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={copying || preparing}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-black/55 underline decoration-black/20 underline-offset-4 transition hover:text-[#C72C5B]"
            >
              {copying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
              Copy private link
            </button>
            {message && <p role="status" className="mt-4 text-xs font-semibold text-[#C72C5B]">{message}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
