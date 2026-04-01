import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Vouchers | WeTrends',
  description: 'Access and manage your WeTrends vouchers. View balance, transaction history, and redeem QR codes.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VoucherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
