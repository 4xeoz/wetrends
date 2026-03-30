import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  // Get the token using JWT
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET 
  });
  
  const isAuthenticated = !!token;

  // Upon successful sign-in redirect to /me
  if (isAuthenticated && nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/me", nextUrl.origin));
  }

  // Protect /me and all paths under it - redirect to sign-in if not authenticated
  if (
    nextUrl.pathname.startsWith("/me") &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Prevent authenticated users from accessing sign-in page
  if (nextUrl.pathname === "/sign-in" && isAuthenticated) {
    return NextResponse.redirect(new URL("/me", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|fonts).*)",
  ],
};
