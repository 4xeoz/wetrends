"use client";
import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import StorySection from "./Story/sotry-section";

const SectionData = [
  {
    header: "Hiring Designers is a Hassle",
    paragraph:
      "Skilled designers cost a lot, take time to manage, and don’t always get your brand. Risky, slow, and not scalable.",
    images: [
      "/images/wetrends icons 1.png",
      "/images/wetrends icons 2.png",
      "/images/wetrends icons 3.png",
      "/images/wetrends icons 4.png",
    ],
  },
  {
    header:
      "AI Tools? Overwhelming.",
    paragraph:
      "Sure, they’re powerful—but starting from scratch, staying on trend, and doing it all yourself? Way too much.",
    images: [
      "/images/wetrends icons 5.png",
      "/images/wetrends icons 6.png",
      "/images/wetrends icons 7.png",
      "/images/wetrends icons 8.png",
    ],
  },
  {
    header:
      "Ads Don’t Work Without Trust",
    paragraph:
      "People scroll past ads unless your brand looks credible. Without pro visuals, you’re just another post.",
    images: [
      "/images/wetrends icons 9.png",
      "/images/wetrends icons 10.png",
      "/images/wetrends icons 11.png",
      "/images/wetrends icons 12.png",
    ],
  },
  {
    header:
      "We Make It Easy",
    paragraph:
      "We mix top-tier creatives with the latest AI to deliver high-quality content 10x faster—for less. No headaches, no fluff.",
    images: [
      "/images/wetrends icons 13.png",
      "/images/wetrends icons 14.png",
      "/images/wetrends icons 15.png",
      "/images/wetrends icons 16.png",
    ],
  },
];

export default function Story() {
  const scrollContainerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const inView = useInView(scrollContainerRef, { initial: true });

  useEffect(() => {
    if (!inView) {
      setIsInView(false);
    }
  }, [inView]);

  return (
    <motion.section
      ref={scrollContainerRef}
      className="h-full"
      style={{ scrollBehavior: "smooth" }}
    >
      {isInView
        ? SectionData.map((section, index) => (
            <div key={index} className="h-screen bg-wetrends-600 flex justify-center items-center">
              <StorySection
                header={section.header}
                paragraph={section.paragraph}
                images={section.images}
              />
            </div>
          ))
        : null}
    </motion.section>
  );
}