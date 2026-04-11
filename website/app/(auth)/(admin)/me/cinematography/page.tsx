'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  Camera,
  Film,
  Calendar,
  Phone,
  User,
  Clock,
  RefreshCw,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getAllCinemaBookings,
  updateBookingStatus,
  deleteCinemaBooking,
} from '@/actions/cinematography';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
// Local alias that matches the Prisma CinemaBookingStatus enum values
type CinemaBookingStatus = BookingStatus;
type ServiceType = 'PHOTOS_8' | 'PHOTOS_10_VIDEO';

interface Booking {
  id: string;
  name: string;
  phone: string;
  date: Date;
  service: ServiceType;
  status: BookingStatus;
  notes?: string | null;
  createdAt: Date;
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: <Clock className="h-3 w-3" />,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <XCircle className="h-3 w-3" />,
  },
};

const SERVICE_CONFIG: Record<ServiceType, { label: string; price: string; icon: React.ReactNode }> = {
  PHOTOS_8: {
    label: 'Essentials · 8 Photos',
    price: '£35',
    icon: <Camera className="h-4 w-4" />,
  },
  PHOTOS_10_VIDEO: {
    label: 'Premium · 10 Photos + Video',
    price: '£45',
    icon: <Film className="h-4 w-4" />,
  },
};

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

type FilterStatus = 'ALL' | BookingStatus;

export default function CinematographyAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllCinemaBookings();
      if (res.success && res.bookings) {
        setBookings(res.bookings as Booking[]);
      } else {
        setError(res.message ?? 'Failed to load bookings');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      const res = await updateBookingStatus(id, newStatus as CinemaBookingStatus);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking?.id === id) {
          setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await deleteCinemaBooking(id);
      if (res.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking?.id === id) setSelectedBooking(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filterStatus === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    revenue: bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.service === 'PHOTOS_8' ? 35 : 45), 0),
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
          <p className="text-sm text-gray-500">Loading bookings…</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center p-6">
        <Card className="max-w-sm text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <p className="mb-4 text-red-600">{error}</p>
            <Button onClick={fetchBookings} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cinematography Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Graduation photography &amp; cinematography — Surrey / Guildford
          </p>
        </div>
        <Button onClick={fetchBookings} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600' },
          { label: 'Completed', value: stats.completed, color: 'text-green-600' },
          { label: 'Revenue (est.)', value: `£${stats.revenue}`, color: 'text-[#C72C5B]' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" />
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                filterStatus === s
                  ? 'bg-[#C72C5B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          )
        )}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2" style={{ minHeight: '60vh' }}>
        {/* Bookings list */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#C72C5B]" />
              Bookings ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Camera className="mb-3 h-12 w-12 text-gray-200" />
                <p className="text-sm">No bookings found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((booking) => {
                  const svc = SERVICE_CONFIG[booking.service];
                  const status = STATUS_CONFIG[booking.status];
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedBooking(booking)}
                      className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                        selectedBooking?.id === booking.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 truncate">
                              {booking.name}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${status.color}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              {svc.icon}
                              {svc.price}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(booking.date), 'dd MMM yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking detail panel */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {selectedBooking ? (
                <motion.div
                  key={selectedBooking.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="space-y-5"
                >
                  {/* Name & status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Client
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <User className="h-4 w-4 text-[#C72C5B]" />
                        {selectedBooking.name}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                        STATUS_CONFIG[selectedBooking.status].color
                      }`}
                    >
                      {STATUS_CONFIG[selectedBooking.status].icon}
                      {STATUS_CONFIG[selectedBooking.status].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-900">
                        <Phone className="h-4 w-4 text-[#C72C5B]" />
                        {selectedBooking.phone}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-900">
                        <Calendar className="h-4 w-4 text-[#C72C5B]" />
                        {format(new Date(selectedBooking.date), 'EEEE, dd MMMM yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Package
                    </p>
                    <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#C72C5B]/20 bg-[#C72C5B]/5 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C72C5B]/10 text-[#C72C5B]">
                        {SERVICE_CONFIG[selectedBooking.service].icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {SERVICE_CONFIG[selectedBooking.service].label}
                        </p>
                        <p className="text-sm font-bold text-[#C72C5B]">
                          {SERVICE_CONFIG[selectedBooking.service].price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Notes
                      </p>
                      <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}

                  {/* Booked at */}
                  <p className="text-xs text-gray-400">
                    Booked on{' '}
                    {format(new Date(selectedBooking.createdAt), 'dd MMM yyyy, h:mm a')}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    {STATUS_TRANSITIONS[selectedBooking.status].map((nextStatus) => (
                      <Button
                        key={nextStatus}
                        size="sm"
                        variant={nextStatus === 'CANCELLED' ? 'outline' : 'default'}
                        disabled={updatingId === selectedBooking.id}
                        onClick={() =>
                          handleStatusUpdate(selectedBooking.id, nextStatus)
                        }
                        className={
                          nextStatus === 'CANCELLED'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'bg-[#C72C5B] text-white hover:bg-[#a8244d]'
                        }
                      >
                        {updatingId === selectedBooking.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          `Mark as ${STATUS_CONFIG[nextStatus].label}`
                        )}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto border-red-200 text-red-600 hover:bg-red-50"
                      disabled={deletingId === selectedBooking.id}
                      onClick={() => handleDelete(selectedBooking.id)}
                    >
                      {deletingId === selectedBooking.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-gray-400"
                >
                  <Camera className="mb-3 h-12 w-12 text-gray-200" />
                  <p className="text-sm">Select a booking to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
