"use server"
import { signIn as signInServer } from "@/lib/auth/auth"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
  const callbackUrl = (formData.get('callbackUrl') as string) || '/me'
  try {
    await signInServer("credentials", {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    throw error // Re-throw NEXT_REDIRECT so Next.js handles navigation
  }
}
