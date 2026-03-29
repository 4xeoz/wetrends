import type { Metadata } from 'next';
import React from 'react';
import Hero from '../_component/home/hero';
import SubHero from '../_component/home/subHero';
import WhyLoveUs from '../_component/home/whyLoveUs';
import Showcase from '../_component/home/showcase';
import Pricing from '../_component/home/pricing';
import Contact from '../_component/home/contact';

export const metadata: Metadata = {
  title: "Digital Marketing Agency Guildford Surrey | Video, Social Media & Web Design",
  description: "WeTrends is Guildford's leading creative agency. We help Surrey businesses grow with video production, social media management, web design & branding. Local experts, national reach.",
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

export default function Home() {
  return (
    <div className="">
      <Hero/> 
      <SubHero/>
      <WhyLoveUs/>
      <Showcase/>
      <Pricing/>
      <Contact/>
    </div>
  );
}
