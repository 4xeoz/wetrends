export const RECOVERY_ACCESS_DAYS = 14;
export const MIN_RECOVERY_FEE = 50;
export const MAX_RECOVERY_FEE = 100_000;
export const objectIdPattern = /^[a-f\d]{24}$/i;

export function isRecoverySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(request.url);
    // Next may construct a localhost URL while the browser uses 127.0.0.1,
    // or an internal HTTP URL behind the platform's HTTPS proxy.
    const host = request.headers.get("host") || url.host;
    const forwardedProtocol = request.headers.get("x-forwarded-proto");
    const protocol =
      forwardedProtocol === "https" || forwardedProtocol === "http"
        ? `${forwardedProtocol}:`
        : url.protocol;
    return new URL(origin).origin === new URL(`${protocol}//${host}`).origin;
  } catch {
    return false;
  }
}

export function parseRecoveryFee(pounds: string) {
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(pounds.trim())) return null;
  const amount = Math.round(Number(pounds) * 100);
  return Number.isSafeInteger(amount) &&
    amount >= MIN_RECOVERY_FEE &&
    amount <= MAX_RECOVERY_FEE
    ? amount
    : null;
}

export function recoveryExpiry(
  paidAt: Date,
  accessDays = RECOVERY_ACCESS_DAYS,
) {
  return new Date(paidAt.getTime() + accessDays * 86_400_000);
}

export function canDownloadRecovery(
  recovery: {
    status: string;
    paidAt: Date | null;
    expiresAt: Date | null;
    order: { status: string } | null;
  },
  now = new Date(),
) {
  return (
    recovery.status === "PAID" &&
    recovery.order?.status === "PAID" &&
    Boolean(recovery.paidAt && recovery.expiresAt && recovery.expiresAt > now)
  );
}

export const recoveryPrivateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};
