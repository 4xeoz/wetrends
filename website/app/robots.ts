import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/me/', '/api/', '/_next/'],
    },
    sitemap: 'https://wetrends.co.uk/sitemap.xml',
    host: 'https://wetrends.co.uk',
  };
}
