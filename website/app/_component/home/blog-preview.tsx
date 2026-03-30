'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Calendar, ArrowUpRight, BookOpen } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

// Static blog data for preview (will show even before database has posts)
const previewPosts = [
  {
    id: '1',
    title: 'The Future of Video Marketing in 2024',
    excerpt: 'Discover how short-form video content is reshaping brand storytelling and driving unprecedented engagement rates.',
    category: 'Video Production',
    date: 'Dec 15, 2024',
    slug: '#',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: '2',
    title: 'Building a Brand That Stands Out',
    excerpt: 'Learn the key principles of creating a distinctive brand identity that resonates with your target audience.',
    category: 'Branding',
    date: 'Dec 10, 2024',
    slug: '#',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: '3',
    title: 'Social Media Trends to Watch',
    excerpt: 'Stay ahead of the curve with these emerging social media trends that will define the coming year.',
    category: 'Social Media',
    date: 'Dec 5, 2024',
    slug: '#',
    gradient: 'from-emerald-600 to-teal-600',
  },
];

export function BlogPreview() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white py-24 md:py-32 flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1}
              ease="power3.out"
            >
              <span className="mb-4 inline-block rounded-full bg-[#C72C5B]/10 px-4 py-1.5 text-sm font-medium text-[#C72C5B]">
                From The Blog
              </span>
            </AnimatedContent>
            
            <AnimatedContent
              direction="vertical"
              distance={80}
              duration={1.2}
              delay={0.1}
              ease="power3.out"
            >
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Latest
                <span className="ml-2 font-serif italic text-[#C72C5B]">Insights</span>
              </h2>
            </AnimatedContent>
            
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1.2}
              delay={0.2}
              ease="power3.out"
            >
              <p className="mt-4 max-w-lg text-lg text-gray-600">
                Expert tips, industry trends, and creative inspiration from our team.
              </p>
            </AnimatedContent>
          </div>

          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            delay={0.3}
            ease="power3.out"
          >
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-gray-900 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
            >
              View All Articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedContent>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {previewPosts.map((post, index) => (
            <AnimatedContent
              key={post.id}
              direction="vertical"
              distance={100}
              duration={1}
              delay={0.1 * index}
              ease="power3.out"
            >
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link href={post.slug}>
                  {/* Gradient Card */}
                  <div className={`relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${post.gradient}`}>
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Read More Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <span className="flex items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-gray-900 opacity-0 transition-opacity group-hover:opacity-100">
                        Read Article
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </motion.div>

                    {/* Category Badge */}
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                    
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#C72C5B]">
                      {post.title}
                    </h3>
                    
                    <p className="line-clamp-2 text-gray-600">
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
          distance={60}
          duration={1}
          delay={0.5}
          ease="power3.out"
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 md:p-12">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#C72C5B]/20 to-purple-600/20" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C72C5B]/30 blur-3xl" />
            
            <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  Stay in the Loop
                </h3>
                <p className="text-gray-300">
                  Get the latest insights delivered straight to your inbox.
                </p>
              </div>
              
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-full bg-white/10 px-6 py-3 text-white placeholder-gray-400 outline-none ring-2 ring-transparent transition-all focus:ring-[#C72C5B] md:w-64"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
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
