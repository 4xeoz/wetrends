import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { LoadingScreen } from "@/components/providers/loading-screen";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeTrends | Creative Agency Guildford, Surrey | Digital Marketing & Content",
  description: "WeTrends is a creative digital agency in Guildford, Surrey. We help UK businesses grow with expert video production, social media management, web design, branding & content creation. Local agency, national results.",
  keywords: [
    "digital agency Guildford",
    "marketing agency Surrey",
    "content creation Guildford",
    "video production Surrey",
    "social media management Guildford",
    "web design Guildford",
    "branding agency Surrey",
    "digital marketing Guildford",
    "creative agency near me",
    "content marketing Surrey",
    "graphic design Guildford",
    "SEO agency Surrey",
    "brand strategy Guildford",
    "digital branding UK",
    "video editing Surrey",
    "social media agency Guildford",
    "web development Surrey",
    "animation studio Guildford",
    "creative design Surrey",
    "marketing consultant Guildford",
    "local marketing agency",
    "Surrey business marketing",
    "Guildford business growth",
    "Woking marketing agency",
    "Farnham creative agency",
    "Dorking digital marketing",
    "Reigate content creation",
    "Leatherhead web design",
    "Cobham branding agency",
    "Esher video production"
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
    title: "WeTrends | Creative Digital Agency in Guildford, Surrey",
    description: "Guildford's leading creative agency for video production, social media, web design & branding. Helping UK businesses grow with compelling digital content.",
    url: "https://wetrends.co.uk",
    type: "website",
    locale: "en_GB",
    siteName: "WeTrends",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeTrends Creative Agency Guildford Surrey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WeTrends | Creative Agency Guildford, Surrey",
    description: "Guildford's creative agency for digital marketing, video production & branding. Local expertise, national results.",
    images: ["/images/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code", // TODO: Add your Google Search Console code here
  },
  metadataBase: new URL('https://wetrends.co.uk'),
};

export const viewport: Viewport = {
  themeColor: "#C72C5B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Local Business Schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "WeTrends",
  "description": "Creative digital agency in Guildford, Surrey specialising in video production, social media management, web design, branding and content creation.",
  "url": "https://wetrends.co.uk",
  "email": "wetrends.uk@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Guildford",
    "addressRegion": "Surrey",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "51.2362",
    "longitude": "-0.5704"
  },
  "areaServed": [
    { "@type": "City", "name": "Guildford" },
    { "@type": "City", "name": "Woking" },
    { "@type": "City", "name": "Farnham" },
    { "@type": "City", "name": "Dorking" },
    { "@type": "City", "name": "Reigate" },
    { "@type": "AdministrativeArea", "name": "Surrey" },
    { "@type": "Country", "name": "United Kingdom" }
  ],
  "serviceType": [
    "Video Production",
    "Social Media Management",
    "Web Design & Development",
    "Brand Strategy",
    "Content Creation",
    "Graphic Design",
    "Animation",
    "Digital Marketing"
  ],
  "priceRange": "££",
  "openingHours": ["Mo-Fr 09:00-18:00"],
  "sameAs": [
    "https://www.instagram.com/wetrends.uk",
    "https://www.linkedin.com/company/wetrends-uk"
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="GB-SRY" />
        <meta name="geo.placename" content="Guildford" />
        <meta name="geo.position" content="51.2362;-0.5704" />
        <meta name="ICBM" content="51.2362, -0.5704" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingScreen>
          <SmoothScrollProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </SmoothScrollProvider>
        </LoadingScreen>
      </body>
    </html>
  );
}
