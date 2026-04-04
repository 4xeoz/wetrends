'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyVoucherAccess, getVoucherTransactions } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, Wallet, Receipt, Calendar, Eye, EyeOff, ArrowRight, CheckCircle2, Ticket, Copy } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const copyLink = () => {
    if (voucher && typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/voucher/scan?code=${voucher.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500 text-white';
      case 'EXHAUSTED': return 'bg-slate-500 text-white';
      case 'EXPIRED': return 'bg-rose-500 text-white';
      case 'CANCELLED': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 border-emerald-100';
      case 'EXHAUSTED': return 'bg-slate-50 border-slate-100';
      case 'EXPIRED': return 'bg-rose-50 border-rose-100';
      case 'CANCELLED': return 'bg-amber-50 border-amber-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-slate-200/60"
      >
        <div className="max-w-lg mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C72C5B] to-[#A3244A] flex items-center justify-center shadow-lg shadow-[#C72C5B]/20">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Voucher</h1>
              <p className="text-sm text-slate-500">Secure voucher portal</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-lg mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Code Input Step */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#C72C5B] to-[#A3244A]" />
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C72C5B]/10 to-[#C72C5B]/5 flex items-center justify-center mx-auto mb-4">
                      <Receipt className="h-8 w-8 text-[#C72C5B]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter Voucher Code</h2>
                    <p className="text-slate-500">Type your voucher code to continue</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="code" className="text-slate-700 font-medium mb-2 block">Voucher Code</Label>
                      <div className="relative">
                        <Input
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="WTV-XXXXXXXX-XXXX"
                          className="h-14 text-lg font-mono bg-slate-50 border-slate-200 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 text-slate-900 placeholder:text-slate-400"
                        />
                        <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep('verify')}
                      disabled={!code}
                      className="w-full h-14 bg-gradient-to-r from-[#C72C5B] to-[#A3244A] hover:from-[#B5264F] hover:to-[#921F3F] text-white font-semibold text-lg shadow-lg shadow-[#C72C5B]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-slate-400 text-sm mt-6">
                Powered by WeTrends
              </p>
            </motion.div>
          )}

          {/* Password Verify Step */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#C72C5B] to-[#A3244A]" />
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C72C5B]/10 to-[#C72C5B]/5 flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-[#C72C5B]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter Password</h2>
                    <p className="text-slate-500">Secure access required</p>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <Label className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1 block">Voucher Code</Label>
                      <p className="text-slate-900 font-mono text-lg font-semibold">{code}</p>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-slate-700 font-medium mb-2 block">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-14 bg-slate-50 border-slate-200 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 text-slate-900 placeholder:text-slate-400 pr-12"
                          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('input')}
                        className="flex-1 h-14 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleVerify}
                        disabled={!password || isLoading}
                        className="flex-1 h-14 bg-gradient-to-r from-[#C72C5B] to-[#A3244A] hover:from-[#B5264F] hover:to-[#921F3F] text-white font-semibold shadow-lg shadow-[#C72C5B]/25 transition-all duration-200"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            Access Voucher
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Voucher View Step */}
          {step === 'view' && voucher && (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border-2 ${getStatusBg(voucher.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Voucher Status</p>
                    <h2 className="text-3xl font-bold text-slate-900 font-mono">{voucher.code}</h2>
                    <p className="text-slate-600 mt-1">{voucher.actor.name}</p>
                  </div>
                  <Badge className={`${getStatusColor(voucher.status)} px-4 py-2 text-sm font-semibold`}>
                    {voucher.status}
                  </Badge>
                </div>
              </motion.div>

              {/* QR Code Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="inline-block p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-inner mb-6">
                        <QRCode
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/voucher/scan?code=${voucher.code}`}
                          size={200}
                          level="H"
                          className="mx-auto"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Show this code to vendors</h3>
                      <p className="text-slate-500 text-sm mb-4">Scan to update spending</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyLink}
                        className="border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Balance Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-4"
              >
                <Card className="border-0 shadow-lg shadow-slate-200/30 bg-white">
                  <CardContent className="p-5 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Total</p>
                    <p className="text-xl font-bold text-slate-900">£{voucher.totalAmount.toFixed(0)}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg shadow-rose-200/30 bg-gradient-to-br from-rose-50 to-white">
                  <CardContent className="p-5 text-center">
                    <p className="text-xs text-rose-400 uppercase tracking-wide font-semibold mb-1">Spent</p>
                    <p className="text-xl font-bold text-rose-600">£{voucher.spentAmount.toFixed(0)}</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg shadow-emerald-200/30 bg-gradient-to-br from-emerald-50 to-white">
                  <CardContent className="p-5 text-center">
                    <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">Remaining</p>
                    <p className="text-2xl font-bold text-emerald-600">£{voucher.remainingAmount.toFixed(0)}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="border-0 shadow-lg shadow-slate-200/30 bg-white">
                  <CardContent className="p-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Usage</span>
                      <span className="font-semibold text-slate-700">
                        {((voucher.spentAmount / voucher.totalAmount) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(voucher.spentAmount / voucher.totalAmount) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#C72C5B] to-[#A3244A] rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project Details */}
              {(voucher.projectName || voucher.description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-lg shadow-slate-200/30 bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-[#C72C5B]" />
                        Project Details
                      </h3>
                      {voucher.projectName && (
                        <p className="text-slate-900 font-medium mb-2">{voucher.projectName}</p>
                      )}
                      {voucher.description && (
                        <p className="text-slate-500 text-sm leading-relaxed">{voucher.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>Created {format(new Date(voucher.createdAt), 'MMMM d, yyyy')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="border-0 shadow-lg shadow-slate-200/30 bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-[#C72C5B]" />
                      Transaction History
                      <span className="ml-auto text-sm font-normal text-slate-400">{transactions.length} items</span>
                    </h3>
                    
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                          <Receipt className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((t, index) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="flex justify-between items-start p-4 bg-slate-50 rounded-xl border border-slate-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                                <span className="text-rose-600 font-bold text-sm">£</span>
                              </div>
                              <div>
                                <p className="font-semibold text-rose-600">-£{t.amount.toFixed(2)}</p>
                                {t.description && (
                                  <p className="text-sm text-slate-600 mt-0.5">{t.description}</p>
                                )}
                                {t.location && (
                                  <p className="text-xs text-slate-400 mt-0.5">@ {t.location}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {format(new Date(t.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('input');
                    setCode('');
                    setPassword('');
                    setVoucher(null);
                    setError(null);
                  }}
                  className="w-full h-14 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  Check Another Voucher
                </Button>
              </motion.div>
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
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#C72C5B] mx-auto mb-4" />
            <p className="text-slate-500">Loading...</p>
          </div>
        </div>
      }
    >
      <VoucherViewContent />
    </Suspense>
  );
}
