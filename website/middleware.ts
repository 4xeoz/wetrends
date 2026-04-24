import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Use edge-safe config — no Prisma, no bcrypt
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Redirect authenticated users away from sign-in page
  if (isAuthenticated && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/me", req.nextUrl.origin));
  }

  // Protect /me/* routes — redirect unauthenticated users to sign-in
  if (!isAuthenticated && pathname.startsWith("/me")) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|fonts).*)",
  ],
};
