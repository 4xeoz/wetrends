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
  const url = `https://wetrends.co.uk/blogs/${post.slug}/`;

  return {
    title: post.metaTitle || `${post.title} | WeTrends Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      locale: 'en_GB',
      siteName: 'WeTrends',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result.success || !result.post) {
    notFound();
  }

  const post = result.post;
  const url = `https://wetrends.co.uk/blogs/${post.slug}/`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(post.featuredImage && { image: post.featuredImage }),
    ...(post.publishedAt && { datePublished: post.publishedAt.toISOString() }),
    ...(post.updatedAt && { dateModified: post.updatedAt.toISOString() }),
    author: {
      '@type': post.author?.name ? 'Person' : 'Organization',
      name: post.author?.name || 'WeTrends',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WeTrends',
      url: 'https://wetrends.co.uk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wetrends.co.uk/images/logo-transparent.svg',
      },
    },
    ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
    ...(post.category && { articleSection: post.category.name }),
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wetrends.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://wetrends.co.uk/blogs/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
