"use server"

import { auth } from "@/lib/auth/auth"

export async function getUserData() {
    const session = await auth()
    if (!session) {
        return null
    }
    return session.user
}