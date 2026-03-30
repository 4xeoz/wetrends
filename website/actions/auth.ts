"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type, message: "Invalid email or password" };
    }
    return { error: "UnknownError", message: "An error occurred during sign in" };
  }
}

export async function logout() {
  await signOut({ redirect: false });
}
