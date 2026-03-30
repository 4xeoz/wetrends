'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyVoucherAccess, addVoucherTransaction, getVoucherTransactions } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, QrCode, Lock, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface Voucher {
  id: string;
  code: string;
  totalAmount: number;
  remainingAmount: number;
  spentAmount: number;
  status: string;
  projectName: string | null;
  description: string | null;
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

function ScanVoucherContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code');

  const [step, setStep] = useState<'input' | 'password' | 'details'>('input');
  const [code, setCode] = useState(initialCode || '');
  const [password, setPassword] = useState('');
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Transaction form
  const [spendAmount, setSpendAmount] = useState('');
  const [spendDescription, setSpendDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!code || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await verifyVoucherAccess(code, password);
      if (response.success && response.voucher) {
        setVoucher(response.voucher as Voucher);
        // Fetch transactions
        const transResponse = await getVoucherTransactions((response.voucher as Voucher).id);
        if (transResponse.success) {
          setTransactions(transResponse.transactions as Transaction[]);
        }
        setStep('details');
      } else {
        setError(response.message || 'Invalid code or password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!voucher || !spendAmount) return;
    
    const amount = parseFloat(spendAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount > voucher.remainingAmount) {
      setError('Amount exceeds remaining balance');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await addVoucherTransaction({
        voucherId: voucher.id,
        amount,
        description: spendDescription,
        location,
      });
      
      if (response.success) {
        setSuccess(true);
        // Refresh voucher data
        const verifyResponse = await verifyVoucherAccess(code, password);
        if (verifyResponse.success && verifyResponse.voucher) {
          setVoucher(verifyResponse.voucher as Voucher);
        }
        // Refresh transactions
        const transResponse = await getVoucherTransactions(voucher.id);
        if (transResponse.success) {
          setTransactions(transResponse.transactions as Transaction[]);
        }
        // Reset form
        setSpendAmount('');
        setSpendDescription('');
        setLocation('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to add transaction');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
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
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scan Voucher</h1>
        <p className="mt-1 text-gray-600">Verify and update voucher spending</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Enter Voucher Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Voucher Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="WTV-XXXXXXXX-XXXX"
                    className="font-mono"
                  />
                </div>
                <Button
                  onClick={() => setStep('password')}
                  disabled={!code}
                  className="w-full bg-[#C72C5B] hover:bg-[#A3244A]"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Enter Access Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter client password"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('input')}
                    className="flex-1"
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
                      'Verify & Access'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'details' && voucher && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Voucher Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono">{voucher.code}</CardTitle>
                  <Badge className={getStatusColor(voucher.status)}>
                    {voucher.status}
                  </Badge>
                </div>
                <p className="text-gray-600">{voucher.actor.name}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold">£{voucher.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Spent</p>
                    <p className="text-lg font-bold text-red-600">£{voucher.spentAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-lg font-bold text-green-600">£{voucher.remainingAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Transaction */}
            {voucher.status === 'ACTIVE' && voucher.remainingAmount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Spending</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {success && (
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Transaction added successfully!
                    </div>
                  )}
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                      <X className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (£)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        max={voucher.remainingAmount}
                        value={spendAmount}
                        onChange={(e) => setSpendAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Store/Location name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={spendDescription}
                      onChange={(e) => setSpendDescription(e.target.value)}
                      placeholder="What was purchased?"
                    />
                  </div>
                  <Button 
                    onClick={handleAddTransaction}
                    disabled={isSubmitting || !spendAmount}
                    className="w-full bg-[#C72C5B] hover:bg-[#A3244A]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add Transaction'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions yet</p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((t) => (
                      <div key={t.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-600">-£{t.amount.toFixed(2)}</p>
                          {t.description && (
                            <p className="text-sm text-gray-600">{t.description}</p>
                          )}
                          {t.location && (
                            <p className="text-sm text-gray-500">@ {t.location}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {format(new Date(t.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => {
                setStep('input');
                setCode('');
                setPassword('');
                setVoucher(null);
                setError(null);
              }}
              className="w-full"
            >
              Scan Another Voucher
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function ScanVoucherPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
      </div>
    }>
      <ScanVoucherContent />
    </Suspense>
  );
}
