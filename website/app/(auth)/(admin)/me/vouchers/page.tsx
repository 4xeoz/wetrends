'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllVouchers, deleteVoucher } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, Eye, QrCode, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface Voucher {
  id: string;
  code: string;
  totalAmount: number;
  remainingAmount: number;
  spentAmount: number;
  status: 'ACTIVE' | 'EXHAUSTED' | 'EXPIRED' | 'CANCELLED';
  projectName: string | null;
  description: string | null;
  actor: {
    name: string;
    email: string;
  };
  _count: {
    transactions: number;
  };
  createdAt: Date;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllVouchers();
      if (response.success && response.vouchers) {
        setVouchers(response.vouchers as Voucher[]);
        setFilteredVouchers(response.vouchers as Voucher[]);
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch vouchers');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;
    
    setDeletingId(id);
    try {
      const response = await deleteVoucher(id);
      if (response.success) {
        setVouchers(vouchers.filter(v => v.id !== id));
        setFilteredVouchers(filteredVouchers.filter(v => v.id !== id));
      } else {
        alert(response.message || 'Failed to delete voucher');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = vouchers.filter(v => 
        v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVouchers(filtered);
    } else {
      setFilteredVouchers(vouchers);
    }
  }, [searchTerm, vouchers]);

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
          <p className="text-gray-600">Loading vouchers...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchVouchers} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
          <p className="mt-1 text-gray-600">Manage actor vouchers and spending</p>
        </div>
        <div className="flex gap-2">
          <Link href="/voucher/scan">
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Scan
            </Button>
          </Link>
          <Link href="/me/vouchers/create">
            <Button className="bg-[#C72C5B] hover:bg-[#A3244A]">
              <Plus className="mr-2 h-4 w-4" />
              Create Voucher
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by code, actor name, or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Vouchers</p>
            <p className="text-2xl font-bold">{vouchers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {vouchers.filter(v => v.status === 'ACTIVE').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">
              £{vouchers.reduce((sum, v) => sum + v.totalAmount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-blue-600">
              £{vouchers.reduce((sum, v) => sum + v.remainingAmount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {filteredVouchers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No vouchers found matching your search.' : 'No vouchers yet. Create your first voucher!'}
            </p>
            {!searchTerm && (
              <Link href="/me/vouchers/create">
                <Button className="bg-[#C72C5B] hover:bg-[#A3244A]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Voucher
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 font-mono">
                          {voucher.code}
                        </h3>
                        <Badge className={getStatusColor(voucher.status)}>
                          {voucher.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Actor:</span> {voucher.actor.name}
                      </p>
                      {voucher.projectName && (
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Project:</span> {voucher.projectName}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span>Total: <span className="font-medium text-gray-900">£{voucher.totalAmount.toFixed(2)}</span></span>
                        <span>Spent: <span className="font-medium text-red-600">£{voucher.spentAmount.toFixed(2)}</span></span>
                        <span>Remaining: <span className="font-medium text-green-600">£{voucher.remainingAmount.toFixed(2)}</span></span>
                        <span>Transactions: {voucher._count.transactions}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/me/vouchers/${voucher.code}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(voucher.id)}
                        disabled={deletingId === voucher.id}
                      >
                        {deletingId === voucher.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
