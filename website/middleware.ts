import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

// Use edge-safe config — no Prisma, no bcrypt
const { auth } = NextAuth(authConfig);

function requestScopedUrl(pathname: string, req: NextRequest) {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredAppUrl) return new URL(pathname, configuredAppUrl);

  const originalUrl = new URL(req.url);
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = originalUrl.host || req.headers.get('host') || forwardedHost || req.nextUrl.host;
  const forwardedProtocol = req.headers.get('x-forwarded-proto');
  const protocol = forwardedProtocol === 'http' || forwardedProtocol === 'https'
    ? forwardedProtocol
    : originalUrl.protocol.replace(':', '');
  return new URL(pathname, `${protocol}://${host}`);
}

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Recovery photos must never enter Next's shared image optimizer cache.
  if (pathname === '/_next/image') {
    const source = req.nextUrl.searchParams.get('url');
    if (source) {
      try {
        const imagePath = decodeURIComponent(new URL(source, req.url).pathname);
        if (/^\/api\/(recovery|admin\/recoveries)(\/|$)/.test(imagePath)) {
          return new Response('Private images cannot be optimized', { status: 400, headers: { 'Cache-Control': 'no-store' } });
        }
      } catch { return new Response('Invalid image URL', { status: 400 }); }
    }
  }

  // Redirect authenticated users away from sign-in page
  if (isAuthenticated && pathname === "/sign-in") {
    return new Response(null, { status: 307, headers: { Location: requestScopedUrl('/me', req).toString() } });
  }

  // Protect /me/* routes — redirect unauthenticated users to sign-in
  if (!isAuthenticated && pathname.startsWith("/me")) {
    return new Response(null, {
      status: 307,
      headers: { Location: requestScopedUrl('/sign-in', req).toString() },
    });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/_next/image",
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|fonts).*)",
  ],
};
