'use server';

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// Generate unique voucher code
function generateVoucherCode(): string {
  const prefix = 'WTV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ========== ACTOR ACTIONS ==========

export async function getAllActors() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const actors = await prisma.actor.findMany({
      include: {
        vouchers: {
          select: {
            id: true,
            code: true,
            totalAmount: true,
            remainingAmount: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, actors };
  } catch (error) {
    console.error('Error fetching actors:', error);
    return { success: false, message: 'Failed to fetch actors' };
  }
}

export async function getActorById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const actor = await prisma.actor.findUnique({
      where: { id },
      include: {
        vouchers: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });
    if (!actor) return { success: false, message: 'Actor not found' };
    return { success: true, actor };
  } catch (error) {
    console.error('Error fetching actor:', error);
    return { success: false, message: 'Failed to fetch actor' };
  }
}

export async function createActor(data: {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  image?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const actor = await prisma.actor.create({
      data
    });
    revalidatePath('/me/vouchers/actors');
    return { success: true, actor };
  } catch (error) {
    console.error('Error creating actor:', error);
    return { success: false, message: 'Failed to create actor' };
  }
}

// ========== VOUCHER ACTIONS ==========

export async function getAllVouchers() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, vouchers };
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return { success: false, message: 'Failed to fetch vouchers' };
  }
}

export async function getVoucherByCode(code: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const voucher = await prisma.voucher.findUnique({
      where: { code },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!voucher) return { success: false, message: 'Voucher not found' };
    return { success: true, voucher };
  } catch (error) {
    console.error('Error fetching voucher:', error);
    return { success: false, message: 'Failed to fetch voucher' };
  }
}

export async function createVoucher(data: {
  actorId: string;
  totalAmount: number;
  clientPassword: string;
  description?: string;
  projectName?: string;
  expiresAt?: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const code = generateVoucherCode();
    const hashedPassword = await bcrypt.hash(data.clientPassword, 10);

    const voucher = await prisma.voucher.create({
      data: {
        code,
        actorId: data.actorId,
        totalAmount: data.totalAmount,
        remainingAmount: data.totalAmount,
        clientPassword: hashedPassword,
        description: data.description,
        projectName: data.projectName,
        expiresAt: data.expiresAt,
      },
      include: {
        actor: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    revalidatePath('/me/vouchers');
    return { success: true, voucher };
  } catch (error) {
    console.error('Error creating voucher:', error);
    return { success: false, message: 'Failed to create voucher' };
  }
}

// Actor view - get their vouchers (public access via code)
export async function getActorVouchers(actorId: string) {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { actorId },
      select: {
        id: true,
        code: true,
        totalAmount: true,
        remainingAmount: true,
        spentAmount: true,
        status: true,
        projectName: true,
        description: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, vouchers };
  } catch (error) {
    console.error('Error fetching actor vouchers:', error);
    return { success: false, message: 'Failed to fetch vouchers' };
  }
}

// Client - verify password and get voucher details
export async function verifyVoucherAccess(code: string, password: string) {
  try {
    const voucher = await prisma.voucher.findUnique({
      where: { code },
      include: {
        actor: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    if (!voucher) {
      return { success: false, message: 'Voucher not found' };
    }

    const isValidPassword = await bcrypt.compare(password, voucher.clientPassword);
    if (!isValidPassword) {
      return { success: false, message: 'Invalid password' };
    }

    // Return voucher without sensitive data
    return {
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        totalAmount: voucher.totalAmount,
        remainingAmount: voucher.remainingAmount,
        spentAmount: voucher.spentAmount,
        status: voucher.status,
        projectName: voucher.projectName,
        description: voucher.description,
        createdAt: voucher.createdAt,
        expiresAt: voucher.expiresAt,
        actor: voucher.actor,
      }
    };
  } catch (error) {
    console.error('Error verifying voucher:', error);
    return { success: false, message: 'Failed to verify voucher' };
  }
}

// Client - add transaction/spending
export async function addVoucherTransaction(data: {
  voucherId: string;
  amount: number;
  description?: string;
  location?: string;
}) {
  try {
    if (!data.amount || data.amount <= 0) {
      return { success: false, message: 'Amount must be greater than zero' };
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: data.voucherId }
    });

    if (!voucher) {
      return { success: false, message: 'Voucher not found' };
    }

    if (voucher.status !== 'ACTIVE') {
      return { success: false, message: 'Voucher is not active' };
    }

    if (data.amount > voucher.remainingAmount) {
      return { success: false, message: 'Amount exceeds remaining balance' };
    }

    const newSpentAmount = voucher.spentAmount + data.amount;
    const newRemainingAmount = voucher.totalAmount - newSpentAmount;

    // Create transaction
    const transaction = await prisma.voucherTransaction.create({
      data: {
        voucherId: data.voucherId,
        amount: data.amount,
        description: data.description,
        location: data.location,
      }
    });

    // Update voucher
    const updatedVoucher = await prisma.voucher.update({
      where: { id: data.voucherId },
      data: {
        spentAmount: newSpentAmount,
        remainingAmount: newRemainingAmount,
        status: newRemainingAmount <= 0 ? 'EXHAUSTED' : 'ACTIVE'
      }
    });

    return { success: true, transaction, voucher: updatedVoucher };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, message: 'Failed to add transaction' };
  }
}

// Delete voucher
export async function deleteVoucher(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.voucher.delete({
      where: { id }
    });
    revalidatePath('/me/vouchers');
    return { success: true };
  } catch (error) {
    console.error('Error deleting voucher:', error);
    return { success: false, message: 'Failed to delete voucher' };
  }
}

// Get voucher transactions
export async function getVoucherTransactions(voucherId: string) {
  try {
    const transactions = await prisma.voucherTransaction.findMany({
      where: { voucherId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, transactions };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, message: 'Failed to fetch transactions' };
  }
}

// Delete actor (admin only)
export async function deleteActor(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.actor.delete({ where: { id } });
    revalidatePath('/me/vouchers/actors');
    return { success: true };
  } catch (error) {
    console.error('Error deleting actor:', error);
    return { success: false, message: 'Failed to delete actor' };
  }
}

// Reset voucher client password (admin only)
export async function resetVoucherPassword(voucherId: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.voucher.update({
      where: { id: voucherId },
      data: { clientPassword: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    console.error('Error resetting voucher password:', error);
    return { success: false, message: 'Failed to reset password' };
  }
}

// Update voucher status (admin only)
export async function updateVoucherStatus(id: string, status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED') {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const voucher = await prisma.voucher.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/me/vouchers');
    return { success: true, voucher };
  } catch (error) {
    console.error('Error updating voucher status:', error);
    return { success: false, message: 'Failed to update status' };
  }
}
