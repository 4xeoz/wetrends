import type { NextAuthConfig } from "next-auth"
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
          const validatedCredentials = credentialsSchema.parse(credentials);
          const { email, password } = validatedCredentials;

          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser || !existingUser.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, existingUser.password);
          if (!passwordMatch) {
            return null;
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image,
          };
        } catch {
          return null;
        }
      }
    })
  ]
} satisfies NextAuthConfig