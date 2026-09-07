import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const objectIdPattern = /^[a-f\d]{24}$/i;
const referralClaimTtlMs = 1000 * 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.EVENT_LINK_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('EVENT_LINK_SECRET must contain at least 32 characters');
  }
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createEventToken(eventJobId: string, accessVersion: number) {
  const payload = `${eventJobId}.${accessVersion}`;
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifyEventToken(token: string) {
  const [encoded, providedSignature, ...rest] = token.split('.');
  if (!encoded || !providedSignature || rest.length > 0) return null;

  const expectedSignature = sign(encoded);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const separator = decoded.lastIndexOf('.');
  if (separator < 1) return null;
  const eventJobId = decoded.slice(0, separator);
  const accessVersion = Number(decoded.slice(separator + 1));
  if (!objectIdPattern.test(eventJobId) || !Number.isInteger(accessVersion) || accessVersion < 1) return null;

  return { eventJobId, accessVersion };
}

export function createReferralClaim(eventToken: string) {
  if (!verifyEventToken(eventToken)) throw new Error('Invalid event token');
  const expiresAt = Date.now() + referralClaimTtlMs;
  const payload = `${eventToken}.${expiresAt}`;
  const encoded = Buffer.from(payload, 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifyReferralClaim(claim: string) {
  const [encoded, providedSignature, ...rest] = claim.split('.');
  if (!encoded || !providedSignature || rest.length > 0) return null;

  const expectedSignature = sign(encoded);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const separator = decoded.lastIndexOf('.');
  if (separator < 1) return null;
  const token = decoded.slice(0, separator);
  const expiresAt = Number(decoded.slice(separator + 1));
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null;

  const event = verifyEventToken(token);
  if (!event) return null;
  return { token, expiresAt, ...event };
}

export function getAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, '');

  const vercelHost = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`.replace(/\/$/, '');

  return 'http://127.0.0.1:3000';
}

export function getEventOfferUrl(eventJobId: string, accessVersion: number) {
  const token = createEventToken(eventJobId, accessVersion);
  return `${getAppUrl()}/events/client/${token}`;
}

export function getEventConfirmationUrl(eventJobId: string, accessVersion: number, orderId: string) {
  const token = createEventToken(eventJobId, accessVersion);
  return `${getAppUrl()}/events/client/${token}/confirmed?order_id=${encodeURIComponent(orderId)}`;
}

export function getEventGalleryUrl(eventJobId: string, accessVersion: number) {
  const token = createEventToken(eventJobId, accessVersion);
  return `${getAppUrl()}/gallery/${token}`;
}
