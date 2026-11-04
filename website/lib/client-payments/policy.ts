export const paymentIdPattern = /^[a-f\d]{24}$/i;
export const MAX_PAYMENT_ITEMS = 12;
export const MAX_PAYMENT_TOTAL = 10_000_000; // £100,000 in pence.

export type PaymentItemInput = {
  name: string;
  description?: string;
  quantity: string;
  unitPrice: string;
};

export type PaymentItem = {
  name: string;
  description: string;
  quantity: number;
  unitAmount: number;
};

export function parsePounds(value: string) {
  const match = /^(\d{1,6})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;
  const amount = Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0"));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

export function normalisePaymentItems(input: PaymentItemInput[]) {
  if (!Array.isArray(input) || input.length < 1 || input.length > MAX_PAYMENT_ITEMS)
    return null;
  const items: PaymentItem[] = [];
  let total = 0;
  for (const raw of input) {
    const name = raw.name.trim();
    const description = (raw.description || "").trim();
    const quantity = Number(raw.quantity);
    const unitAmount = parsePounds(raw.unitPrice);
    if (
      !name || name.length > 120 || description.length > 300 ||
      !/^[1-9]\d{0,2}$/.test(raw.quantity.trim()) ||
      !Number.isSafeInteger(quantity) || quantity > 100 || unitAmount === null
    ) return null;
    const lineTotal = quantity * unitAmount;
    if (!Number.isSafeInteger(lineTotal)) return null;
    total += lineTotal;
    if (!Number.isSafeInteger(total) || total > MAX_PAYMENT_TOTAL) return null;
    items.push({ name, description, quantity, unitAmount });
  }
  return total >= 50 ? { items, total } : null;
}

export function paymentItemsFromJson(value: unknown): PaymentItem[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_PAYMENT_ITEMS)
    return null;
  const items: PaymentItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { name, description, quantity, unitAmount } = item as Record<string, unknown>;
    if (
      typeof name !== "string" || !name ||
      typeof description !== "string" ||
      typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 1 ||
      typeof unitAmount !== "number" || !Number.isSafeInteger(unitAmount) || unitAmount < 1
    ) return null;
    items.push({ name, description, quantity, unitAmount });
  }
  return items;
}

export function paymentReference(id: string) {
  return `WT-${id.slice(-8).toUpperCase()}`;
}

export const paymentPrivateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};

export function isPaymentSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host") || url.host;
    const forwardedProtocol = request.headers.get("x-forwarded-proto");
    const protocol = forwardedProtocol === "https" || forwardedProtocol === "http"
      ? `${forwardedProtocol}:` : url.protocol;
    return new URL(origin).origin === new URL(`${protocol}//${host}`).origin;
  } catch {
    return false;
  }
}
