import type { Metadata } from 'next';
import { getPublishedPosts, getCategories } from '@/actions/blog';
import { BlogList } from '@/app/_component/blogs/blog-list';
import { BlogHero } from '@/app/_component/blogs/blog-hero';

export const metadata: Metadata = {
  title: 'Creative Technology & Production Insights | WeTrends',
  description: 'Practical insights on creative technology, web design, content, events, photography and production for London, Surrey and UK teams.',
  alternates: {
    canonical: 'https://wetrends.co.uk/blogs',
  },
  openGraph: {
    title: 'Blog | Digital Marketing Insights | WeTrends',
    description: 'Expert insights on video production, social media marketing, web design and branding.',
    url: 'https://wetrends.co.uk/blogs',
    type: 'website',
    locale: 'en_GB',
    siteName: 'WeTrends',
  },
};

export default async function BlogPage() {
  const [postsResult, categoriesResult] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  const posts = (postsResult.success ? postsResult.posts : []) ?? [];
  const categories = (categoriesResult.success ? categoriesResult.categories : []) ?? [];

  return (
    <main className="min-h-[100svh] bg-[#e9e9e9]">
      <BlogHero />
      <BlogList posts={posts} categories={categories} />
    </main>
  );
}
