'use server';

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { CinemaService, CinemaBookingStatus } from '@prisma/client';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const CreateBookingSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z
    .string()
    .min(7, { message: 'Please enter a valid phone number' })
    .max(20, { message: 'Phone number is too long' }),
  date: z.string().refine((d: string) => !isNaN(Date.parse(d)), {
    message: 'Please select a valid date',
  }),
  service: z.enum(['PHOTOS_8', 'PHOTOS_10_VIDEO'], {
    errorMap: () => ({ message: 'Please select a service package' }),
  }),
  notes: z.string().optional(),
});

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

interface SuccessResponse {
  success: true;
  bookingId: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export type BookingResponse = SuccessResponse | ErrorResponse;

// ─── Public Actions ────────────────────────────────────────────────────────────

export async function createCinemaBooking(
  data: CreateBookingInput
): Promise<BookingResponse> {
  try {
    const validated = CreateBookingSchema.parse(data);

    const booking = await prisma.cinemaBooking.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        date: new Date(validated.date),
        service: validated.service as CinemaService,
        notes: validated.notes ?? null,
        status: CinemaBookingStatus.PENDING,
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((zodErr: z.ZodIssue) => {
        if (typeof zodErr.path[0] === 'string') errors[zodErr.path[0]] = zodErr.message;
      });
      return { success: false, message: 'Validation failed', errors };
    }
    console.error('[createCinemaBooking]', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// ─── Admin Actions ─────────────────────────────────────────────────────────────

export async function getAllCinemaBookings() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: 'Unauthorized' };
  }

  try {
    const bookings = await prisma.cinemaBooking.findMany({
      orderBy: { date: 'asc' },
    });
    return { success: true as const, bookings };
  } catch (error) {
    console.error('[getAllCinemaBookings]', error);
    return { success: false as const, message: 'Failed to fetch bookings' };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: CinemaBookingStatus
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: 'Unauthorized' };
  }

  try {
    await prisma.cinemaBooking.update({
      where: { id: bookingId },
      data: { status },
    });
    return { success: true as const };
  } catch (error) {
    console.error('[updateBookingStatus]', error);
    return { success: false as const, message: 'Failed to update booking' };
  }
}

export async function deleteCinemaBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: 'Unauthorized' };
  }

  try {
    await prisma.cinemaBooking.delete({ where: { id: bookingId } });
    return { success: true as const };
  } catch (error) {
    console.error('[deleteCinemaBooking]', error);
    return { success: false as const, message: 'Failed to delete booking' };
  }
}
