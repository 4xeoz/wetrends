import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Duplicate blog posts were unpublished (topic re-spins); 301 the dead
  // slugs to the surviving article so indexed URLs keep their equity.
  async redirects() {
    const dupes: Record<string, string> = {
      'scaling-revenue-beyond-meta-ads-surrey-smbs': 'scaling-smbs-beyond-meta-ads',
      '30-day-linkedin-authority-sprint-consultants': '30-day-linkedin-authority-sprint-london-consultants',
      '30-day-linkedin-sprint-for-consultants': '30-day-linkedin-authority-sprint-london-consultants',
      '30-day-linkedin-sprint-london-consultants': '30-day-linkedin-authority-sprint-london-consultants',
      'why-surrey-smbs-should-ditch-meta-lead-forms': 'scaling-surrey-smbs-crm-funnels-vs-meta-lead-forms',
      'beyond-meta-lead-forms-surrey-smb': 'scaling-surrey-smbs-crm-funnels-vs-meta-lead-forms',
      'scaling-past-lead-forms-surrey-smb': 'scaling-surrey-smbs-crm-funnels-vs-meta-lead-forms',
      'beyond-meta-lead-forms-surrey-smbs': 'scaling-surrey-smbs-crm-funnels-vs-meta-lead-forms',
      'meta-lead-forms-vs-landing-pages-growth': 'why-landing-pages-outperform-meta-lead-forms',
      'founder-content-system-3-hour-weekly-growth-strategy': 'founder-content-system-london-consultants',
      'winning-the-guildford-search-local-seo-strategy': 'winning-the-guildford-search-local-seo',
      'winning-the-guildford-search': 'winning-the-guildford-search-local-seo',
    };
    return Object.entries(dupes).map(([from, to]) => ({
      source: `/blogs/${from}/`,
      destination: `/blogs/${to}/`,
      permanent: true,
    }));
  },
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
  // PostHog requests have no trailing slash — don't let the site-wide
  // trailingSlash redirect turn its POSTs into GETs.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    optimizePackageImports: ["lucide-react", "motion", "gsap"],
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
      {
        source: "/events/client/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/gallery/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/me/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
