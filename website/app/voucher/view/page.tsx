'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyVoucherAccess, getVoucherTransactions } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, Wallet, Receipt, Calendar, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    name: string;
    email: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  location: string | null;
  createdAt: Date;
}

function VoucherViewContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  const [step, setStep] = useState<'input' | 'verify' | 'view'>('input');
  const [code, setCode] = useState(initialCode || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      setStep('verify');
    }
  }, [initialCode]);

  const handleVerify = async () => {
    if (!code || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyVoucherAccess(code, password);
      if (response.success && response.voucher) {
        setVoucher(response.voucher as Voucher);
        // Fetch transactions
        const transResponse = await getVoucherTransactions(response.voucher.id);
        if (transResponse.success) {
          setTransactions(transResponse.transactions as Transaction[]);
        }
        setStep('view');
      } else {
        setError(response.message || 'Invalid code or password');
      }
    } catch (err) {
      setError('An error occurred');
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#C72C5B] py-8 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Voucher Access</h1>
          <p className="text-white/80">View your voucher details</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* Code Input Step */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-[#C72C5B]" />
                    Enter Voucher Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="code" className="text-gray-300">Voucher Code</Label>
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="WTV-XXXXXXXX-XXXX"
                      className="bg-gray-800 border-gray-700 text-white font-mono"
                    />
                  </div>
                  <Button
                    onClick={() => setStep('verify')}
                    disabled={!code}
                    className="w-full bg-[#C72C5B] hover:bg-[#A3244A]"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Password Verify Step */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#C72C5B]" />
                    Enter Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-300 mb-2 block">Voucher Code</Label>
                    <p className="text-white font-mono bg-gray-800 p-3 rounded-lg">{code}</p>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your voucher password"
                        className="bg-gray-800 border-gray-700 text-white pr-10"
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('input')}
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={!password || isLoading}
                      className="flex-1 bg-[#C72C5B] hover:bg-[#A3244A]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'View Voucher'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Voucher View Step */}
          {step === 'view' && voucher && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Voucher Header */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-bold text-white font-mono mb-2">{voucher.code}</h2>
                  <Badge className={`${getStatusColor(voucher.status)} text-white`}>
                    {voucher.status}
                  </Badge>
                  <p className="text-gray-400 mt-2">{voucher.actor.name}</p>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="bg-white border-0">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <QRCode
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/voucher/scan?code=${voucher.code}`}
                      size={180}
                      level="H"
                    />
                  </div>
                  <p className="text-gray-600 text-sm text-center">
                    Show this QR code when making purchases
                  </p>
                </CardContent>
              </Card>

              {/* Balance */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#C72C5B]" />
                    Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-white font-bold">£{voucher.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Spent</span>
                    <span className="text-red-400 font-bold">£{voucher.spentAmount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Remaining</span>
                    <span className="text-green-400 font-bold text-xl">£{voucher.remainingAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              {(voucher.projectName || voucher.description) && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {voucher.projectName && (
                      <p className="text-white font-medium mb-2">{voucher.projectName}</p>
                    )}
                    {voucher.description && (
                      <p className="text-gray-400 text-sm">{voucher.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created {format(new Date(voucher.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transaction History */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((t) => (
                        <div key={t.id} className="flex justify-between items-start p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-red-400">-£{t.amount.toFixed(2)}</p>
                            {t.description && (
                              <p className="text-sm text-gray-400">{t.description}</p>
                            )}
                            {t.location && (
                              <p className="text-sm text-gray-500">@ {t.location}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(t.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('input');
                    setCode('');
                    setPassword('');
                    setVoucher(null);
                    setError(null);
                  }}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Check Another Voucher
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function VoucherViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
        </div>
      }
    >
      <VoucherViewContent />
    </Suspense>
  );
}
