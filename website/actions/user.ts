"use server";

import { auth } from "@/lib/auth";

export async function getUserData() {
  const session = await auth();
  return session?.user ?? null;
}
