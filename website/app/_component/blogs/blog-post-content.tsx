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

/**
 * Converts plain text content to structured HTML.
 * Handles markdown-like syntax and plain text paragraph separation.
 */
function formatContentToHtml(content: string): string {
  // If content already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';

    // Skip lines that are just dashes (used as separators)
    if (/^[-–—]{2,}$/.test(line)) continue;

    // Headers: lines ending with colon that are short and followed by content
    if (
      line.length < 80 &&
      line.endsWith(':') &&
      !line.startsWith(' ') &&
      nextLine.length > 0 &&
      !nextLine.endsWith(':')
    ) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h2>${line.slice(0, -1)}</h2>`;
      continue;
    }

    // Bold lines wrapped in ** or __
    const boldMatch = line.match(/^(\*\*|__)(.+?)\1$/);
    if (boldMatch) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p><strong>${boldMatch[2]}</strong></p>`;
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    }

    // Numbered lists
    const numberedMatch = line.match(/^\d+\.\s(.+)$/);
    if (numberedMatch) {
      if (!inList) {
        html += '<ol>';
        inList = true;
      }
      html += `<li>${numberedMatch[1]}</li>`;
      continue;
    }

    // Close any open list
    if (inList) {
      html += '</ul>';
      inList = false;
    }

    // Regular paragraph with inline bold/italic
    let processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>');

    html += `<p>${processed}</p>`;
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const formattedContent = formatContentToHtml(post.content);

  return (
    <article className="min-h-[100svh] bg-white">
      {/* Navigation */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-[720px] px-5 py-4 sm:px-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#C72C5B]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.featuredImage ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={`Featured image for ${post.title} — article by WeTrends, creative digital agency in Guildford, Surrey`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#C72C5B] to-purple-700">
          <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-6 sm:py-24">
            <div className="max-w-2xl">
              <span className="text-6xl font-black text-white/20 sm:text-8xl">
                {post.title.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category */}
          {post.category && (
            <Link
              href={`/blogs?category=${post.category.slug}`}
              className="mb-5 inline-block rounded-full bg-[#C72C5B]/10 px-4 py-1.5 text-sm font-semibold text-[#C72C5B] transition-colors hover:bg-[#C72C5B]/20"
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mb-6 text-[1.75rem] font-extrabold leading-[1.2] tracking-tight text-gray-900 sm:text-[2.25rem] md:text-[2.75rem]">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-100 pb-8 text-sm text-gray-500">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <span className="font-medium text-gray-700">
                {post.author.name || 'Anonymous'}
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.publishedAt ? (
                <time dateTime={new Date(post.publishedAt).toISOString()}>
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
              ) : (
                'Draft'
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {Math.ceil(post.content.split(' ').length / 200)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
          </div>

          {/* Excerpt */}
          <p className="mb-10 text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
            {post.excerpt}
          </p>

          {/* Content — optimized reading experience */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-[1.5rem] prose-h2:leading-tight sm:prose-h2:text-[1.75rem]
              prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-[1.25rem] prose-h3:leading-tight
              prose-p:my-6 prose-p:leading-[1.75] prose-p:text-gray-700
              prose-strong:font-bold prose-strong:text-gray-900
              prose-ul:my-6 prose-ul:space-y-2.5 prose-ul:text-gray-700
              prose-ol:my-6 prose-ol:space-y-2.5 prose-ol:text-gray-700
              prose-li:leading-relaxed
              prose-a:font-semibold prose-a:text-[#C72C5B] prose-a:no-underline hover:prose-a:underline
              prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-[#C72C5B] prose-blockquote:bg-gray-50 
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
              prose-blockquote:text-gray-700 prose-blockquote:italic prose-blockquote:font-medium
              prose-hr:my-12 prose-hr:border-gray-200
              first:prose-p:mt-0
            "
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Tags */}
          {post.keywords.length > 0 && (
            <div className="mt-14 border-t border-gray-100 pt-8">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">Share:</span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Author Card */}
          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C72C5B]/10">
                <User className="h-5 w-5 text-[#C72C5B]" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{post.author.name || 'Anonymous'}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Building uncopyable brands for small businesses. No jargon, no fake urgency — just the truth, told properly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
