import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/prisma/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
// import { getNameFromEmail } from "@/utils/helpers"


 
const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})


export default {
  
  providers: [
    // Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with Zod
          const validatedCredentials = credentialsSchema.parse(credentials);
          const { email, password } = validatedCredentials;

          // Check if user exists (for login)
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if(!existingUser){
            return null;
          }

          // Login flow
          if (existingUser && existingUser.password) {
            // Compare passwords
            const passwordMatch = await bcrypt.compare(
              password,
              existingUser.password
            );

            if (passwordMatch) {
              return existingUser;
            }
            
            return null;
            
          }



          // Sign-up flow - user doesn't exist
          // if (!existingUser) {
            // // Hash password
            // const hashedPassword = await bcrypt.hash(password, 10);

            // // Create new user
            // const newUser = await prisma.user.create({
            //   data: {
            //     email,
            //     password: hashedPassword,
            //     name: getNameFromEmail(email),
            //   },
            // });

            // return newUser;
          // }

          // User exists but doesn't have a password (e.g., they signed up with Google)
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ]
} satisfies NextAuthConfig