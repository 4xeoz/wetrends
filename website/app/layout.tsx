import type { Metadata } from "next"; 
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeTrends - Your Content Partner",
  description: "Get agency-level content at unbeatable value. AI-powered, fast, and reliable.",
  keywords: [
    "business",
    "marketing",
    "content",
    "social media",
    "video editing",
    "graphic design",
    "affordable",
    "cheap price",
    "free trial",
    "digital marketing",
    "content creation",
    "copywriting",
    "SEO",
    "web design",
    "brand strategy",
    "online advertising",
    "PPC",
    "email marketing",
    "content marketing",
    "digital branding",
    "multimedia production",
    "creative design",
    "visual storytelling",
    "engagement",
    "cost effective",
    "innovative solutions",
    "digital strategy",
    "user experience",
    "responsive design",
    "AI-powered",
    "fast delivery",
    "reliable service"
  ],
  openGraph: {
    title: "WeTrends - Your Content Partner",
    description: "Get agency-level content at unbeatable value. AI-powered, fast, and reliable.",
    url: "https://wetrends.co.uk",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "WeTrends Open Graph Image",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
