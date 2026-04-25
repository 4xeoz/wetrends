'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { format } from 'date-fns';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  views: number;
  category: Category | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface BlogListProps {
  posts: Post[];
  categories: Category[];
}

export function BlogList({ posts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category?.slug === selectedCategory)
    : posts;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-[#C72C5B] text-white shadow-lg shadow-[#C72C5B]/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedCategory === category.slug
                  ? 'bg-[#C72C5B] text-white shadow-lg shadow-[#C72C5B]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1.5 opacity-60">({category._count?.posts ?? 0})</span>
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory || 'all'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <Link href={`/blogs/${post.slug}`} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={`Featured image for ${post.title} — WeTrends blog on digital marketing, web design, and branding`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C72C5B] to-purple-600">
                        <span className="text-5xl font-black text-white/20">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm shadow-sm">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    {/* Meta */}
                    <div className="mb-3 flex items-center gap-4 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.publishedAt ? (
                          <time dateTime={new Date(post.publishedAt).toISOString()}>
                            {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                          </time>
                        ) : (
                          'Draft'
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.ceil(post.excerpt.split(' ').length / 200)} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C72C5B]">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-500 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          <User className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {post.author.name || 'Anonymous'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#C72C5B] transition-transform group-hover:translate-x-1">
                        Read
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-gray-500">
              No posts found in this category. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
