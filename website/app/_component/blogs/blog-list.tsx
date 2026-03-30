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
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-[#C72C5B] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.slug
                  ? 'bg-[#C72C5B] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name} ({category._count?.posts ?? 0})
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
              >
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C72C5B] to-purple-600">
                        <span className="text-4xl font-bold text-white/30">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt
                          ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                          : 'Draft'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        5 min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#C72C5B]">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="line-clamp-2 text-gray-600">{post.excerpt}</p>

                    {/* Author & Read More */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {post.author.name || 'Anonymous'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-[#C72C5B] transition-transform group-hover:translate-x-1">
                        Read More
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
