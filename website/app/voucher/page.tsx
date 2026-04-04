'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getActorVouchers } from '@/actions/voucher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Wallet, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';

interface Voucher {
  id: string;
  code: string;
  totalAmount: number;
  remainingAmount: number;
  spentAmount: number;
  status: 'ACTIVE' | 'EXHAUSTED' | 'EXPIRED' | 'CANCELLED';
  projectName: string | null;
  description: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

function VoucherView() {
  const searchParams = useSearchParams();
  const actorId = searchParams.get('actor');
  
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    if (actorId) {
      fetchVouchers();
    } else {
      setIsLoading(false);
      setError('No actor ID provided');
    }
  }, [actorId]);

  const fetchVouchers = async () => {
    try {
      const response = await getActorVouchers(actorId!);
      if (response.success && response.vouchers) {
        setVouchers(response.vouchers as Voucher[]);
        if (response.vouchers.length > 0) {
          setSelectedVoucher(response.vouchers[0] as Voucher);
        }
      } else {
        setError(response.message || 'Failed to fetch vouchers');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'EXHAUSTED': return 'bg-gray-500';
      case 'EXPIRED': return 'bg-red-500';
      case 'CANCELLED': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100svh] bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
      </div>
    );
  }

  if (error || vouchers.length === 0) {
    return (
      <div className="min-h-[100svh] bg-black flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">{error || 'No vouchers found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-black text-white">
      {/* Header */}
      <div className="bg-[#C72C5B] py-8 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Your Vouchers</h1>
          <p className="text-white/80">Show this QR code when making purchases</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Voucher Selector */}
        {vouchers.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {vouchers.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVoucher(v)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedVoucher?.id === v.id
                    ? 'bg-[#C72C5B] text-white'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {v.code}
              </button>
            ))}
          </div>
        )}

        {selectedVoucher && (
          <>
            {/* QR Code Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white border-0">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <QRCode
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/voucher/scan?code=${selectedVoucher.code}`}
                      size={200}
                      level="H"
                    />
                  </div>
                  <p className="text-gray-900 font-mono text-lg font-bold">
                    {selectedVoucher.code}
                  </p>
                  <Badge className={`${getStatusColor(selectedVoucher.status)} mt-2`}>
                    {selectedVoucher.status}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="h-5 w-5 text-[#C72C5B]" />
                    Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-white font-bold">£{selectedVoucher.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Spent</span>
                    <span className="text-red-400 font-bold">£{selectedVoucher.spentAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Remaining</span>
                    <span className="text-green-400 font-bold text-xl">£{selectedVoucher.remainingAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Info */}
            {(selectedVoucher.projectName || selectedVoucher.description) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedVoucher.projectName && (
                      <p className="text-white font-medium mb-2">{selectedVoucher.projectName}</p>
                    )}
                    {selectedVoucher.description && (
                      <p className="text-gray-400 text-sm">{selectedVoucher.description}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Instructions */}
            <div className="text-center text-gray-500 text-sm">
              <p>Show this QR code to the vendor when making a purchase.</p>
              <p className="mt-1">The vendor will scan and enter the amount spent.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
import { Suspense } from 'react';

export default function VoucherPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100svh] bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
      </div>
    }>
      <VoucherView />
    </Suspense>
  );
}
