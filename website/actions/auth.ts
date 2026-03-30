"use server"
import { signIn as signInServer } from "@/lib/auth/auth"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signInServer("credentials", {
      email,
      password,
      redirect: false,
    })

    if (!result) {
      return { success: false, error: "InvalidCredentials", message: "Invalid email or password" }
    }

    return { success: true, ...result }

  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.type, message: error.message }
    }
    return { success: false, error: "UnknownError", message: "An error occurred during sign in" }
  }
}

