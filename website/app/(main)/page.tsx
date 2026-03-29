import React from 'react';
import Hero from '../_component/home/hero';
import SubHero from '../_component/home/subHero';
import WhyLoveUs from '../_component/home/whyLoveUs';
import Showcase from '../_component/home/showcase';
import Pricing from '../_component/home/pricing';
import Contact from '../_component/home/contact';

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
