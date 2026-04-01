import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WeTrends - Creative Digital Agency',
    short_name: 'WeTrends',
    description: 'Creative digital agency in Guildford, Surrey. Video production, social media, web design & branding.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C72C5B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo-transparent.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
