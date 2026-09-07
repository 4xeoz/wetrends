import { getEventJobFromToken, visibleGalleryAssets } from '@/lib/events/queries';
import { cloudinaryGalleryAssetUrl } from '@/lib/cloudinary-admin';
import { downloadGoogleDriveFile } from '@/lib/google-drive';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

export const runtime = 'nodejs';

const privateErrorHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

function privateError(message: string, status: number) {
  return new Response(message, { status, headers: privateErrorHeaders });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string; assetId: string }> },
) {
  const { token, assetId } = await context.params;
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) {
    return privateError('Not found', 404);
  }

  const asset = visibleGalleryAssets(job.gallery.assets, job.selectedPackage, job.includedImageCount)
    .find((candidate) => candidate.id === assetId);
  const mode = new URL(request.url).searchParams.get('mode');
  const download = mode === 'download';

  if (asset?.sourceUrl?.startsWith('/')) {
    try {
      const publicRoot = resolve(process.cwd(), 'public');
      const relativePath = decodeURIComponent(asset.sourceUrl.split('?')[0]).replace(/^\/+/, '');
      const filePath = resolve(publicRoot, relativePath);
      if (!filePath.startsWith(`${publicRoot}${sep}`)) return privateError('Not found', 404);
      const contents = await readFile(filePath);
      const extension = extname(filePath).slice(1).toLowerCase() || 'jpg';
      const safeTitle = asset.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'wetrends-photo';
      const contentTypes: Record<string, string> = {
        avif: 'image/avif', gif: 'image/gif', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
      };
      return new Response(contents, {
        headers: {
          'Content-Type': contentTypes[extension] || 'application/octet-stream',
          'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeTitle}.${extension}"`,
          'Cache-Control': 'private, no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    } catch {
      return privateError('Image unavailable', 404);
    }
  }

  if (asset?.provider === 'google-drive' && asset.driveFileId) {
    try {
      const upstream = await downloadGoogleDriveFile(asset.driveFileId);
      if (!upstream.ok || !upstream.body) return privateError('Image unavailable', 502);
      const contentType = upstream.headers.get('content-type') || asset.driveMimeType || 'image/jpeg';
      const extension = {
        'image/avif': 'avif',
        'image/gif': 'gif',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[contentType.split(';')[0].toLowerCase()] || asset.driveName?.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'jpg';
      const safeTitle = asset.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'wetrends-photo';

      return new Response(upstream.body, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeTitle}.${extension}"`,
          'Cache-Control': 'private, no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    } catch {
      return privateError('Image unavailable', 503);
    }
  }

  let sourceUrl: URL;
  try {
    if (asset?.provider === 'cloudinary' && asset.cloudinaryId) {
      sourceUrl = new URL(cloudinaryGalleryAssetUrl(asset.cloudinaryId, download));
    } else if (asset?.sourceUrl) {
      sourceUrl = new URL(asset.sourceUrl, request.url);
    } else {
      return privateError('Not found', 404);
    }
  } catch {
    return privateError('Image unavailable', 503);
  }

  const upstream = await fetch(sourceUrl, { cache: 'no-store' });
  if (!upstream.ok || !upstream.body) return privateError('Image unavailable', 502);
  const contentType = upstream.headers.get('content-type') || 'image/jpeg';
  const contentTypeExtensions: Record<string, string> = {
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const extension = contentTypeExtensions[contentType.split(';')[0].toLowerCase()]
    || asset.cloudinaryFormat
    || sourceUrl.pathname.split('.').pop()?.replace(/[^a-z0-9]/gi, '')
    || 'jpg';
  const safeTitle = asset.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'wetrends-photo';

  return new Response(upstream.body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeTitle}.${extension}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
