import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/prisma/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          console.log("[Auth] Attempting login with credentials:", credentials);
          
          // Validate credentials with Zod
          const validatedCredentials = credentialsSchema.parse(credentials);
          const { email, password } = validatedCredentials;

          console.log("[Auth] Looking up user:", email);
          
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            console.log("[Auth] User not found:", email);
            return null;
          }

          console.log("[Auth] User found, checking password...");

          // Check if user has password
          if (!existingUser.password) {
            console.log("[Auth] User has no password set");
            return null;
          }

          // Compare passwords
          const passwordMatch = await bcrypt.compare(password, existingUser.password);
          console.log("[Auth] Password match:", passwordMatch);

          if (passwordMatch) {
            console.log("[Auth] Login successful for:", email);
            return {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              image: existingUser.image,
            };
          }
          
          console.log("[Auth] Password mismatch");
          return null;
          
        } catch (error) {
          console.error("[Auth] Authentication error:", error);
          if (error instanceof z.ZodError) {
            console.error("[Auth] Validation errors:", error.errors);
          }
          return null;
        }
      }
    })
  ]
} satisfies NextAuthConfig