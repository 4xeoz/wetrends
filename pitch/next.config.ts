import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy PostHog through our own domain so ad blockers don't drop analytics
  // (PostHog's documented reverse-proxy path convention).
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog requests have no trailing slash — don't let a trailing-slash
  // redirect turn its POSTs into GETs.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
