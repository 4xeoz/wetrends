import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no bcrypt — used by middleware
export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
