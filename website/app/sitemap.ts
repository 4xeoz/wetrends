import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/actions/blog';
import { getAllTeamMembers } from '@/lib/team-data';
import { getAllCaseStudySlugs } from '@/lib/case-studies-data';
import { serviceSlugs } from '@/lib/services-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wetrends.co.uk';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/questions/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cinematography/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Service detail pages
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Case studies
  const caseStudyPages: MetadataRoute.Sitemap = getAllCaseStudySlugs().map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

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
  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${baseUrl}/who/${member.id}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPosts, ...caseStudyPages, ...teamPages];
}
