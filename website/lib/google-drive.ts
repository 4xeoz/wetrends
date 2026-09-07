import 'server-only';

import { createSign, randomUUID } from 'node:crypto';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

type DriveFile = {
  id: string;
  name?: string;
  mimeType?: string;
  size?: string;
};

type ServiceAccountCredentials = {
  client_email?: unknown;
  private_key?: unknown;
};

type DriveConfig = {
  sharedDriveId: string;
  eventsRootFolderId: string;
  accessToken?: string;
  clientEmail?: string;
  privateKey?: string;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function readServiceAccount() {
  const raw = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
  let parsed: ServiceAccountCredentials = {};

  if (raw) {
    try {
      parsed = JSON.parse(raw) as ServiceAccountCredentials;
    } catch {
      throw new Error('Google Drive service account JSON is invalid');
    }
  }

  const clientEmail = String(parsed.client_email || process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL || '').trim();
  const privateKey = String(parsed.private_key || process.env.GOOGLE_DRIVE_PRIVATE_KEY || '')
    .replace(/\\n/g, '\n')
    .trim();

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive server credentials are not configured');
  }

  return { clientEmail, privateKey };
}

export function getGoogleDriveConfig(): DriveConfig {
  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID?.trim();
  const eventsRootFolderId = process.env.GOOGLE_DRIVE_EVENTS_ROOT_FOLDER_ID?.trim();
  if (!sharedDriveId || !eventsRootFolderId) {
    throw new Error('Google Drive folder IDs are not configured');
  }

  const accessToken = process.env.GOOGLE_DRIVE_ACCESS_TOKEN?.trim();
  if (accessToken) return { sharedDriveId, eventsRootFolderId, accessToken };

  const { clientEmail, privateKey } = readServiceAccount();
  return { sharedDriveId, eventsRootFolderId, clientEmail, privateKey };
}

export function isGoogleDriveConfigured() {
  try {
    getGoogleDriveConfig();
    return true;
  } catch {
    return false;
  }
}

async function getAccessToken(config: DriveConfig) {
  if (config.accessToken) return config.accessToken;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.accessToken;
  if (!config.clientEmail || !config.privateKey) throw new Error('Google Drive server credentials are not configured');

  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const claim = base64Url(JSON.stringify({
    iss: config.clientEmail,
    scope: DRIVE_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(config.privateKey).toString('base64url')}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Google Drive authentication failed');
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error('Google Drive authentication returned no access token');

  cachedToken = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + Math.max(60, Number(payload.expires_in || 3600)) * 1000,
  };
  return payload.access_token;
}

async function driveFetch(url: string | URL, init: RequestInit = {}) {
  const config = getGoogleDriveConfig();
  const token = await getAccessToken(config);
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  const response = await fetch(url, { ...init, headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`Google Drive request failed (${response.status})`);
  return response;
}

function escapeQueryValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function findFolder(name: string, parentId: string, config: DriveConfig) {
  const params = new URLSearchParams({
    q: `'${escapeQueryValue(parentId)}' in parents and name = '${escapeQueryValue(name)}' and mimeType = '${FOLDER_MIME_TYPE}' and trashed = false`,
    corpora: 'drive',
    driveId: config.sharedDriveId,
    includeItemsFromAllDrives: 'true',
    supportsAllDrives: 'true',
    pageSize: '10',
    fields: 'files(id,name,mimeType)',
  });
  const response = await driveFetch(`${DRIVE_API}/files?${params.toString()}`);
  const payload = await response.json() as { files?: DriveFile[] };
  return payload.files?.[0] || null;
}

async function createFolder(name: string, parentId: string) {
  const params = new URLSearchParams({ supportsAllDrives: 'true', fields: 'id,name,mimeType' });
  const response = await driveFetch(`${DRIVE_API}/files?${params.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mimeType: FOLDER_MIME_TYPE, parents: [parentId] }),
  });
  return await response.json() as DriveFile;
}

async function ensureFolder(name: string, parentId: string, config: DriveConfig) {
  return (await findFolder(name, parentId, config)) || createFolder(name, parentId);
}

export async function ensureEventDriveFolders(input: {
  eventJobId: string;
  eventTitle: string;
  existingFolderId?: string | null;
}) {
  const config = getGoogleDriveConfig();
  const activeFolder = await ensureFolder('01 · Active Events', config.eventsRootFolderId, config);
  const eventFolder = input.existingFolderId
    ? { id: input.existingFolderId }
    : await ensureFolder(`${input.eventTitle} · ${input.eventJobId.slice(0, 8)}`, activeFolder.id, config);

  const [originals, editedGallery, printReady, clientDelivery] = await Promise.all([
    ensureFolder('01 · Originals', eventFolder.id, config),
    ensureFolder('02 · Edited Gallery', eventFolder.id, config),
    ensureFolder('03 · Print Ready', eventFolder.id, config),
    ensureFolder('04 · Client Delivery', eventFolder.id, config),
  ]);

  return {
    eventFolderId: eventFolder.id,
    originalsFolderId: originals.id,
    editedGalleryFolderId: editedGallery.id,
    printReadyFolderId: printReady.id,
    clientDeliveryFolderId: clientDelivery.id,
  };
}

export async function uploadGoogleDriveFile(input: {
  name: string;
  mimeType: string;
  parentId: string;
  body: Buffer;
}) {
  const config = getGoogleDriveConfig();
  const boundary = `wetrends-${randomUUID()}`;
  const metadata = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({
      name: input.name,
      parents: [input.parentId],
    })}\r\n--${boundary}\r\nContent-Type: ${input.mimeType}\r\n\r\n`,
    );
  const ending = Buffer.from(`\r\n--${boundary}--`);
  const payload = Buffer.concat([metadata, input.body, ending]);
  const params = new URLSearchParams({ uploadType: 'multipart', supportsAllDrives: 'true', fields: 'id,name,mimeType,size' });
  const token = await getAccessToken(config);
  const response = await fetch(`${DRIVE_UPLOAD_API}?${params.toString()}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      Accept: 'application/json',
    },
    body: payload as unknown as BodyInit,
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Google Drive upload failed (${response.status})`);
  const uploaded = await response.json() as DriveFile;
  if (!uploaded.id) throw new Error('Google Drive upload returned no file ID');
  return uploaded;
}

export async function downloadGoogleDriveFile(fileId: string) {
  const params = new URLSearchParams({ alt: 'media', supportsAllDrives: 'true' });
  return driveFetch(`${DRIVE_API}/files/${encodeURIComponent(fileId)}?${params.toString()}`, { headers: { Accept: '*/*' } });
}
