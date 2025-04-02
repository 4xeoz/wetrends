"use server"
import { signIn as signInServer } from "@/lib/auth/auth"
export async function login(formData: FormData) {
  try {

    // Extract and validate form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    
    // Use NextAuth signIn function
    const result = await signInServer("credentials", {
      email,
      password,
      redirect: false,
    })

    return result

  } catch (error) {
    
  }
}

