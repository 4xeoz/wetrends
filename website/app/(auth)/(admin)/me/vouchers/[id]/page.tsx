'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVoucherByCode, getVoucherTransactions } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, User, Calendar, PoundSterling, Receipt, Copy, Check, ExternalLink, Eye, Lock, RefreshCw, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
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
  createdAt: Date;
  expiresAt: Date | null;
  actor: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  location: string | null;
  createdAt: Date;
}

export default function VoucherDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewCopied, setPreviewCopied] = useState(false);

  const actorLink = voucher && typeof window !== 'undefined' 
    ? `${window.location.origin}/voucher/view?code=${voucher.code}`
    : '';

  const copyLink = () => {
    if (actorLink) {
      navigator.clipboard.writeText(actorLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyPreviewLink = () => {
    if (actorLink) {
      navigator.clipboard.writeText(actorLink);
      setPreviewCopied(true);
      setTimeout(() => setPreviewCopied(false), 2000);
    }
  };

  useEffect(() => {
    fetchVoucherData();
  }, [id]);

  const fetchVoucherData = async () => {
    setIsLoading(true);
    try {
      // Note: This assumes the ID is the voucher code, or we need to adjust
      const voucherResponse = await getVoucherByCode(id);
      if (voucherResponse.success && voucherResponse.voucher) {
        setVoucher(voucherResponse.voucher as Voucher);
        
        // Fetch transactions
        const transResponse = await getVoucherTransactions(voucherResponse.voucher.id);
        if (transResponse.success) {
          setTransactions(transResponse.transactions as Transaction[]);
        }
      } else {
        setError('Voucher not found');
      }
    } catch (err) {
      setError('An error occurred while fetching voucher data');
      console.error(err);
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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
          <p className="text-gray-600">Loading voucher...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !voucher) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/me/vouchers">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vouchers
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">{error || 'Voucher not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/me/vouchers">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vouchers
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-mono">{voucher.code}</h1>
            <p className="mt-1 text-gray-600">Voucher Details</p>
          </div>
          <Badge className={`${getStatusColor(voucher.status)} text-white px-4 py-1`}>
            {voucher.status}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - QR Code */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#C72C5B]" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl mb-4">
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/voucher/scan?code=${voucher.code}`}
                  size={180}
                  level="H"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Scan this QR code to view and update voucher
              </p>
            </CardContent>
          </Card>

          {/* Shareable Link */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="h-4 w-4 text-[#C72C5B]" />
                Actor Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Share this link with the actor. They will need the password to view their voucher.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={actorLink}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview as Actor */}
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-blue-900">
                <Eye className="h-4 w-4 text-blue-600" />
                Preview as Actor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-3">
                See what the actor sees when they access their voucher.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => window.open(actorLink, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPreviewLink}
                  className="shrink-0 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  {previewCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Info */}
          <Card className="mt-6 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-amber-900">
                <Lock className="h-4 w-4 text-amber-600" />
                Access Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Key className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800 font-medium">
                  Password is set and encrypted
                </span>
              </div>
              <p className="text-xs text-amber-700 mb-3">
                For security, the password is stored encrypted. You provided this password when creating the voucher.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => alert('Password reset functionality coming soon!')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Column - Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#C72C5B]" />
                Voucher Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Actor Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-[#C72C5B] flex items-center justify-center text-white font-bold text-lg">
                  {voucher.actor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{voucher.actor.name}</p>
                  <p className="text-sm text-gray-500">{voucher.actor.email}</p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-900">£{voucher.totalAmount.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Spent</p>
                  <p className="text-xl font-bold text-red-600">£{voucher.spentAmount.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Remaining</p>
                  <p className="text-xl font-bold text-green-600">£{voucher.remainingAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                {voucher.projectName && (
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium text-gray-900">{voucher.projectName}</span>
                  </div>
                )}
                {voucher.description && (
                  <div className="flex items-start gap-2">
                    <Receipt className="h-4 w-4 text-gray-400 mt-1" />
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium text-gray-900">{voucher.description}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(voucher.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                {voucher.expiresAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(voucher.expiresAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-red-600">-£{transaction.amount.toFixed(2)}</p>
                      {transaction.description && (
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      )}
                      {transaction.location && (
                        <p className="text-sm text-gray-500">@ {transaction.location}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
