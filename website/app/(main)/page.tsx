import type { Metadata } from 'next';
import React from 'react';
import Hero from '../_component/home/hero';
import SubHero from '../_component/home/subHero';
import { CaseStudies } from '../_component/home/case-studies';
import { Team } from '../_component/home/team';
import { BlogPreview } from '../_component/home/blog-preview';
import Contact from '../_component/home/contact';
import { getPublishedPosts } from '@/actions/blog';

export const metadata: Metadata = {
  title: "WeTrends | Creative Digital Agency Guildford, Surrey | Web Design & Branding",
  description: "WeTrends is a creative digital agency based in Guildford, Surrey, UK. We build uncopyable brands through bespoke web design, brand identity, video production, and social media management for small businesses across Surrey and London.",
  alternates: {
    canonical: "https://wetrends.co.uk/",
  },
  openGraph: {
    title: "Digital Marketing Agency Guildford Surrey | WeTrends",
    description: "Guildford's creative agency for video production, social media, web design & branding. Helping Surrey businesses grow with compelling digital content.",
    url: "https://wetrends.co.uk/",
    type: "website",
    locale: "en_GB",
    siteName: "WeTrends",
  },
};

export default async function Home() {
  const result = await getPublishedPosts(3);
  const posts = result.success && result.posts ? result.posts : [];

  return (
    <div className="">
      <Hero/> 
      <SubHero/>
      <CaseStudies />
      <Team />
      <BlogPreview posts={posts} />
      <Contact/>
    </div>
  );
}
