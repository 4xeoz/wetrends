'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Linkedin,
  LinkIcon,
  List,
  Twitter,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { useBlogEngagement } from '@/hooks/use-blog-engagement';
import { BlogCover } from './blog-cover';
import type { TocEntry } from '@/lib/blog-content';

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
  } | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
}

interface ServiceCta {
  title: string;
  description: string;
  href: string;
}

interface BlogPostContentProps {
  post: Post;
  html: string;
  toc: TocEntry[];
  relatedPosts: RelatedPost[];
  serviceCta: ServiceCta | null;
}

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-[#C72C5B]"
      style={{ scaleX }}
    />
  );
}

function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = toc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 2) return null;

  return (
    <nav className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/60 p-6">
      <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <List className="h-4 w-4" />
        In this article
      </p>
      <ol className="space-y-2.5">
        {toc.map((entry) => (
          <li key={entry.id} className={entry.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${entry.id}`}
              className={`block text-sm leading-snug transition-colors hover:text-[#C72C5B] ${
                activeId === entry.id ? 'font-semibold text-[#C72C5B]' : 'text-gray-600'
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = (network: 'linkedin' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const target =
      network === 'linkedin'
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(target, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-gray-400">Share:</span>
      <button
        onClick={() => share('linkedin')}
        aria-label="Share on LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        onClick={() => share('twitter')}
        aria-label="Share on X"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-10 items-center justify-center gap-2 rounded-full bg-gray-100 px-4 text-sm font-medium text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}

export function BlogPostContent({ post, html, toc, relatedPosts, serviceCta }: BlogPostContentProps) {
  useBlogEngagement(post.slug);

  return (
    <article className="min-h-[100svh] bg-white">
      <ReadingProgress />

      {/* Hero Section */}
      <section className="relative min-h-[55vh] w-full overflow-hidden sm:min-h-[60vh] lg:min-h-[65vh]">
        <BlogCover
          title={post.title}
          category={post.category?.name}
          slug={post.slug}
          size="hero"
          className="absolute inset-0"
          meta={
            <>
              <span className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-white">{post.author?.name || 'WeTrends'}</span>
              </span>
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
            </>
          }
        />

        {/* Back link */}
        <div className="absolute left-0 right-0 top-0 z-20 px-5 py-5 sm:px-8 sm:py-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Excerpt */}
          <p className="mb-10 text-xl font-medium leading-relaxed text-gray-700 sm:text-2xl">
            {post.excerpt}
          </p>

          {/* Table of contents */}
          <TableOfContents toc={toc} />

          {/* Content — optimized reading experience */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900
              prose-headings:scroll-mt-24
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
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Service CTA */}
          {serviceCta && (
            <div className="mt-14 overflow-hidden rounded-2xl bg-[#0F0F0F] p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
                Need a hand with this?
              </span>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{serviceCta.title}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-white/60">
                {serviceCta.description}
              </p>
              <Link
                href={serviceCta.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#A3244A]"
              >
                Explore the Service
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}

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
          <div className="mt-8">
            <ShareButtons title={post.title} />
          </div>

          {/* Author Card */}
          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C72C5B]/10">
                <User className="h-5 w-5 text-[#C72C5B]" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{post.author?.name || 'WeTrends'}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Building uncopyable brands for small businesses. No jargon, no fake urgency — just the truth, told properly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/60 py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
              Keep <span className="font-serif italic text-[#C72C5B]">Reading</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <Link key={related.id} href={`/blogs/${related.slug}/`} className="group block">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-[#C72C5B]/40 hover:shadow-md">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <BlogCover
                        title={related.title}
                        category={related.category?.name}
                        slug={related.slug}
                        index={index}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {related.category && (
                        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#C72C5B]">
                          {related.category.name}
                        </span>
                      )}
                      <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#C72C5B]">
                        {related.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {related.excerpt}
                      </p>
                      <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-[#C72C5B]">
                        Read article
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
