import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { getPublicCloudinaryAdmin } from '@/lib/cloudinary-admin';

export const runtime = 'nodejs';

const MAX_BYTES = 12 * 1024 * 1024;
const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);

function safeStem(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70) || 'blog-cover';
}

export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.authorized) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const base64 = typeof record.base64 === 'string' ? record.base64.replace(/^data:[^;]+;base64,/, '') : '';
  const contentType = typeof record.contentType === 'string' ? record.contentType : '';
  const filename = typeof record.filename === 'string' ? record.filename : 'blog-cover.webp';
  const alt = typeof record.alt === 'string' ? record.alt.trim().slice(0, 200) : '';
  const imageKind = typeof record.imageKind === 'string' ? record.imageKind : 'editorial';
  const credit = typeof record.credit === 'string' ? record.credit.trim().slice(0, 200) : '';

  if (!base64 || !allowedTypes.has(contentType) || !alt) {
    return NextResponse.json(
      { success: false, message: 'base64, a supported contentType and alt text are required' },
      { status: 400 }
    );
  }
  if (!['ai_supporting', 'portfolio', 'editorial'].includes(imageKind)) {
    return NextResponse.json({ success: false, message: 'Invalid imageKind' }, { status: 400 });
  }
  if (!/^[A-Za-z0-9+/=\s]+$/.test(base64)) {
    return NextResponse.json({ success: false, message: 'Invalid base64 image data' }, { status: 400 });
  }

  const bytes = Buffer.byteLength(base64, 'base64');
  if (bytes < 100 || bytes > MAX_BYTES) {
    return NextResponse.json({ success: false, message: 'Image size is outside the allowed range' }, { status: 413 });
  }

  try {
    const { cloudinary } = getPublicCloudinaryAdmin();
    const result = await cloudinary.uploader.upload(`data:${contentType};base64,${base64}`, {
      resource_type: 'image',
      type: 'upload',
      folder: 'wetrends/blog',
      public_id: safeStem(filename),
      unique_filename: true,
      overwrite: false,
      format: 'webp',
      transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }],
      context: { alt, image_kind: imageKind, credit: credit || 'WeTrends' },
    });

    return NextResponse.json(
      {
        success: true,
        image: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          alt,
          kind: imageKind,
          credit: credit || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API Blog Media] Upload error:', error);
    return NextResponse.json({ success: false, message: 'Failed to store blog image' }, { status: 500 });
  }
}
