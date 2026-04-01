import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Voucher | WeTrends',
  description: 'Securely view your WeTrends voucher details, balance, and transaction history.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VoucherViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
