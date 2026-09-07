import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { NavigationProgress } from "@/app/_component/shared/navigation-progress";
import { organisationSchema, siteProfile } from "@/lib/site-profile";
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_PATH } from "@/lib/social-metadata";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeTrends | Creative Technology & Production Agency London",
  description: siteProfile.description,
  keywords: [
    "creative agency London",
    "technology agency London",
    "production agency London",
    "event photography London",
    "photoshoot London",
    "video production London",
    "web design London",
    "brand identity London",
    "content marketing London",
    "programmatic content agency",
    "digital agency Guildford",
    "creative agency Surrey",
    "creative agency near me",
    "digital branding UK"
  ],
  authors: [{ name: "WeTrends" }],
  creator: "WeTrends",
  publisher: "WeTrends",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://wetrends.co.uk",
  },
  openGraph: {
    title: "WeTrends | Creative Technology & Production Agency London",
    description: siteProfile.description,
    url: "https://wetrends.co.uk",
    type: "website",
    locale: "en_GB",
    siteName: "WeTrends",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeTrends | Creative Technology & Production Agency London",
    description: siteProfile.description,
    images: [DEFAULT_SOCIAL_IMAGE_PATH],
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
  metadataBase: new URL('https://wetrends.co.uk'),
};

export const viewport: Viewport = {
  themeColor: "#C72C5B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en-GB">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/images/logo-transparent.svg" as="image" type="image/svg+xml" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Schema markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
          <SessionProvider>
            <NavigationProgress />
            {children}
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
