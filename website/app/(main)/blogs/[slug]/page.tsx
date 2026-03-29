import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPublishedPosts } from '@/actions/blog';
import { BlogPostContent } from '@/app/_component/blogs/blog-post-content';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const result = await getPublishedPosts();
  if (!result.success || !result.posts) return [];
  
  return result.posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  
  if (!result.success || !result.post) {
    return {
      title: 'Post Not Found | WeTrends',
    };
  }

  const post = result.post;

  return {
    title: post.metaTitle || `${post.title} | WeTrends Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `https://wetrends.co.uk/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://wetrends.co.uk/blogs/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author.name ? [post.author.name] : undefined,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result.success || !result.post) {
    notFound();
  }

  return <BlogPostContent post={result.post} />;
}
