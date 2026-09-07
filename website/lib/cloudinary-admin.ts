import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

export function getCloudinaryAdmin() {
  const cloudName = process.env.EVENT_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.EVENT_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.EVENT_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary server credentials are not configured');
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return { cloudinary, cloudName, apiKey, apiSecret };
}

export function getPublicCloudinaryAdmin() {
  const publicCredentials = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
  const eventCredentials = {
    cloudName: process.env.EVENT_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.EVENT_CLOUDINARY_API_KEY,
    apiSecret: process.env.EVENT_CLOUDINARY_API_SECRET,
  };

  // A partial credential set must never be combined with another account.
  // Prefer the dedicated public-media account, then use the complete event
  // account as an atomic fallback. Blog assets remain public and isolated in
  // `wetrends/blog`; gallery assets keep their authenticated delivery type.
  const credentials =
    publicCredentials.cloudName && publicCredentials.apiKey && publicCredentials.apiSecret
      ? publicCredentials
      : eventCredentials.cloudName && eventCredentials.apiKey && eventCredentials.apiSecret
        ? eventCredentials
        : null;

  if (!credentials) {
    throw new Error('Public Cloudinary server credentials are not configured');
  }

  cloudinary.config({
    cloud_name: credentials.cloudName,
    api_key: credentials.apiKey,
    api_secret: credentials.apiSecret,
    secure: true,
  });
  return { cloudinary, cloudName: credentials.cloudName };
}

export function cloudinaryGalleryAssetUrl(publicId: string, download = false) {
  const { cloudinary } = getCloudinaryAdmin();
  return cloudinary.url(publicId, {
    resource_type: 'image',
    type: 'authenticated',
    secure: true,
    sign_url: true,
    flags: download ? 'attachment' : undefined,
    transformation: download
      ? [{ quality: 'auto:best', fetch_format: 'auto' }]
      : [{ width: 2200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }],
  });
}
