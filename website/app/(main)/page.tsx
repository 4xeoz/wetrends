import type { Metadata } from 'next';
import React from 'react';
import Hero from '../_component/home/hero';
import SubHero from '../_component/home/subHero';
import { CaseStudies } from '../_component/home/case-studies';
import { Team } from '../_component/home/team';
import { Services } from '../_component/home/services';
import { BlogPreview } from '../_component/home/blog-preview';
import Contact from '../_component/home/contact';
import { getDiscoveryReadyPosts } from '@/actions/blog';
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/social-metadata';

export const metadata: Metadata = {
  title: "Creative Technology & Production Agency London | WeTrends",
  description: "WeTrends builds brands, websites, campaigns, films and photography for London, Surrey and UK businesses.",
  alternates: {
    canonical: "https://wetrends.co.uk/",
  },
  openGraph: {
    title: "Creative Technology & Production Agency London | WeTrends",
    description: "Brand, web, production, social, event and photography work for ambitious London, Surrey and UK businesses.",
    url: "https://wetrends.co.uk/",
    type: "website",
    locale: "en_GB",
    siteName: "WeTrends",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Technology & Production Agency London | WeTrends',
    description: 'Brand, web, production, social, event and photography work for London, Surrey and UK businesses.',
    images: [DEFAULT_SOCIAL_IMAGE_PATH],
  },
};

export default async function Home() {
  const result = await getDiscoveryReadyPosts(3);
  const posts = result.success && result.posts ? result.posts : [];

  return (
    <div className="">
      <Hero/> 
      <SubHero/>
      <CaseStudies />
      <Team />
      <Services />
      <BlogPreview posts={posts} />
      <Contact/>
    </div>
  );
}
