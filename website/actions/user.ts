"use server"

import { auth } from "@/lib/auth/auth"
import { prisma } from "@/prisma/prisma"
import bcrypt from "bcryptjs"

export async function getUserData() {
  const session = await auth()
  if (!session) {
    return null
  }
  return session.user
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return { success: false, message: "User not found" }
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return { success: false, message: "Current password is incorrect" }
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, message: "Failed to update password" }
  }
}
