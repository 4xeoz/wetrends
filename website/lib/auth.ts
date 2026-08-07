import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/prisma/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

async function isLockedOut(identifier: string): Promise<boolean> {
  const record = await prisma.loginAttempt.findUnique({ where: { identifier } });
  if (!record?.lockedUntil) return false;

  if (record.lockedUntil > new Date()) return true;

  // Lock has expired — give the identifier a clean slate.
  await prisma.loginAttempt.update({
    where: { identifier },
    data: { attempts: 0, lockedUntil: null },
  });
  return false;
}

async function recordFailedAttempt(identifier: string): Promise<void> {
  const record = await prisma.loginAttempt.upsert({
    where: { identifier },
    create: { identifier, attempts: 1 },
    update: { attempts: { increment: 1 } },
  });

  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    await prisma.loginAttempt.update({
      where: { identifier },
      data: { lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MS) },
    });
  }
}

async function clearFailedAttempts(identifier: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { identifier } });
}

// No database adapter: sessions are JWTs and the only provider is Credentials,
// which reads the User record directly. Nothing here needs Auth.js' Account /
// Session / VerificationToken tables.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { password } = parsed.data;
        const identifier = parsed.data.email.toLowerCase().trim();

        // Checked before touching the user record or comparing a password,
        // so a locked-out identifier can't be used to keep probing passwords.
        if (await isLockedOut(identifier)) return null;

        const user = await prisma.user.findUnique({ where: { email: identifier } });
        if (!user?.password) {
          await recordFailedAttempt(identifier);
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          await recordFailedAttempt(identifier);
          return null;
        }

        await clearFailedAttempts(identifier);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
});
