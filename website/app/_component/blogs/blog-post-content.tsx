'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, User, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  views: number;
  keywords: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface BlogPostContentProps {
  post: Post;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="min-h-[100svh] bg-white">
      {/* Navigation */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#C72C5B]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.featuredImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category */}
          {post.category && (
            <Link
              href={`/blogs?category=${post.category.slug}`}
              className="mb-4 inline-block rounded-full bg-[#C72C5B]/10 px-4 py-1.5 text-sm font-medium text-[#C72C5B] transition-colors hover:bg-[#C72C5B]/20"
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-gray-100 pb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name || 'Anonymous'}</p>
                <p className="text-xs">Author</p>
              </div>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.publishedAt
                ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                : 'Draft'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              5 min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
          </div>

          {/* Excerpt */}
          <p className="mb-8 text-xl font-medium text-gray-700">{post.excerpt}</p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#C72C5B] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.keywords.length > 0 && (
            <div className="mt-12 border-t border-gray-100 pt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Share:</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-[#C72C5B] hover:text-white">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
