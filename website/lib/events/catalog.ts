export type PrintProduct = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  unitAmount: number;
  mockupImage: string;
};

export const PRINT_PRODUCTS: PrintProduct[] = [
  {
    id: 'frame_6x4',
    name: 'Framed favourite · 6×4 in',
    shortName: '6×4',
    description: 'A compact black wood frame with no mount, ready for a desk or wall.',
    unitAmount: 999,
    mockupImage: '/images/framed-print-6x4-wetrends.png',
  },
  {
    id: 'frame_8x12',
    name: 'Framed statement · 8×12 in',
    shortName: '8×12',
    description: 'A larger black wood frame made for a shelf or feature wall.',
    unitAmount: 3199,
    mockupImage: '/images/framed-print-8x12-wetrends.png',
  },
];

export const PRINT_PRODUCT_MAP = new Map(PRINT_PRODUCTS.map((product) => [product.id, product]));
export const STANDARD_SHIPPING_AMOUNT = 599;
export const COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT = 30;

export function getCompleteStoryReferralPrice(amount: number) {
  return Math.max(0, Math.round(amount * (100 - COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT) / 100));
}

export function formatMoney(amount: number, currency = 'gbp') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
