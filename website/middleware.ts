import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth({ ...authConfig });

export default auth(async (req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  //  Upon successful sign-in redirect to /me
  if (isAuthenticated && nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/me", nextUrl.origin));
  }

  // Protect, /me and all paths under it (like /me/something) - redirect to sign-in if not authenticated
  if (
    (nextUrl.pathname.startsWith("/me")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Prevent authenticated users from accessing sign-in page
  if (nextUrl.pathname === "/sign-in" && isAuthenticated) {
    return NextResponse.redirect(new URL("/me", nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|fonts).*)",
  ],
};
