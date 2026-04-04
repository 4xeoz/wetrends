'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Calendar, ArrowUpRight, BookOpen } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const previewPosts = [
  {
    id: '1',
    title: 'The Future of Video Marketing in 2024',
    excerpt: 'Discover how short-form video content is reshaping brand storytelling and driving unprecedented engagement rates.',
    category: 'Video Production',
    date: 'Dec 15, 2024',
    slug: '#',
    color: '#0F0F0F',
  },
  {
    id: '2',
    title: 'Building a Brand That Stands Out',
    excerpt: 'Learn the key principles of creating a distinctive brand identity that resonates with your target audience.',
    category: 'Branding',
    date: 'Dec 10, 2024',
    slug: '#',
    color: '#C72C5B',
  },
  {
    id: '3',
    title: 'Social Media Trends to Watch',
    excerpt: 'Stay ahead of the curve with these emerging social media trends that will define the coming year.',
    category: 'Social Media',
    date: 'Dec 5, 2024',
    slug: '#',
    color: '#0F0F0F',
  },
];

export function BlogPreview() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 md:py-24 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 md:mb-14 md:flex-row md:items-end">
          <div>
            <AnimatedContent
              direction="vertical"
              distance={40}
              duration={1}
              ease="power3.out"
            >
              <span className="mb-2 inline-block rounded-full bg-[#C72C5B]/10 px-3 py-1 text-xs font-medium text-[#C72C5B] sm:mb-3 sm:px-4 sm:py-1.5 sm:text-sm">
                From The Blog
              </span>
            </AnimatedContent>
            
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1.2}
              delay={0.1}
              ease="power3.out"
            >
              <h2 className="text-3xl font-bold leading-none text-[#0F0F0F] sm:text-4xl md:text-5xl lg:text-6xl">
                Latest
                <span className="ml-2 font-serif italic text-[#C72C5B] sm:ml-3">Insights</span>
              </h2>
            </AnimatedContent>
            
            <AnimatedContent
              direction="vertical"
              distance={40}
              duration={1.2}
              delay={0.2}
              ease="power3.out"
            >
              <p className="mt-2 max-w-lg text-sm text-gray-600 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Expert tips, industry trends, and creative inspiration from our team.
              </p>
            </AnimatedContent>
          </div>

          <AnimatedContent
            direction="vertical"
            distance={40}
            duration={1}
            delay={0.3}
            ease="power3.out"
          >
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-900 hover:text-white sm:px-6 sm:py-3"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
            </Link>
          </AnimatedContent>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewPosts.map((post, index) => (
            <AnimatedContent
              key={post.id}
              direction="vertical"
              distance={50}
              duration={0.8}
              delay={0.1 * index}
              ease="power3.out"
            >
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group"
              >
                <Link href={post.slug}>
                  {/* Solid Color Card */}
                  <div 
                    className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl sm:mb-4 sm:aspect-[4/3] sm:rounded-2xl"
                    style={{ backgroundColor: post.color }}
                  >
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-white/30 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Read More Button */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                      <span className="flex items-center justify-center gap-1 rounded-full bg-white py-2 text-xs font-semibold text-gray-900 opacity-0 transition-opacity group-hover:opacity-100 sm:gap-2 sm:py-3 sm:text-sm">
                        Read Article
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-900 backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 sm:mb-2 sm:gap-2 sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {post.date}
                    </div>
                    
                    <h3 className="mb-1 text-base font-bold text-gray-900 transition-colors group-hover:text-[#C72C5B] sm:mb-2 sm:text-lg md:text-xl">
                      {post.title}
                    </h3>
                    
                    <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            </AnimatedContent>
          ))}
        </div>

        {/* Newsletter CTA */}
        <AnimatedContent
          direction="vertical"
          distance={40}
          duration={1}
          delay={0.5}
          ease="power3.out"
          className="mt-10 sm:mt-14 md:mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0F0F0F] p-5 sm:rounded-3xl sm:p-8 md:p-12">
            <div className="relative flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="mb-1 text-lg font-bold text-white sm:mb-2 sm:text-xl md:text-2xl lg:text-3xl">
                  Stay in the Loop
                </h3>
                <p className="text-xs text-gray-300 sm:text-sm md:text-base">
                  Get the latest insights delivered straight to your inbox.
                </p>
              </div>
              
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3 md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none ring-2 ring-transparent transition-all focus:ring-[#C72C5B] sm:px-6 sm:py-3 md:w-64"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 sm:px-8 sm:py-3"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
