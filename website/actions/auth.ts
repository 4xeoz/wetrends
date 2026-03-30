"use server"
import { signIn as signInServer } from "@/lib/auth/auth"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
  try {
    // Extract and validate form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    console.log("[Login Action] Attempting login for:", email)

    // Use NextAuth signIn function
    const result = await signInServer("credentials", {
      email,
      password,
      redirect: false,
    })
    
    console.log("[Login Action] Login successful:", result)
    return { success: true, ...result }

  } catch (error) {
    console.error("[Login Action] Error:", error)
    if (error instanceof AuthError) {
      return { error: error.type, message: error.message }
    }
    return { error: "UnknownError", message: "An error occurred during sign in" }
  }
}

