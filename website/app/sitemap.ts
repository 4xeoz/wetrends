import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/actions/blog';
import { getAllTeamMembers } from '@/lib/team-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wetrends.co.uk';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voucher/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/voucher/view/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const result = await getPublishedPosts();
    if (result.success && result.posts) {
      blogPosts = result.posts.map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}/`,
        lastModified: post.updatedAt || post.publishedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
  }

  // Team member pages
  const teamMembers = getAllTeamMembers();
  const teamPages = teamMembers.map((member) => ({
    url: `${baseUrl}/who/${member.id}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPosts, ...teamPages];
}
