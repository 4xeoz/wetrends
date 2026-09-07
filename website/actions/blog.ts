'use server';

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';

/**
 * Stricter than `published: true`: only evidence-ready posts may be promoted
 * by the homepage, llms.txt or related-content modules. Legacy posts remain
 * reachable until the owner approves a separate consolidation decision.
 */
const discoveryReadyWhere: Prisma.BlogPostWhereInput = {
  published: true,
  automationStatus: 'published',
  qualityScore: { gte: 80 },
  campaign: { not: null },
  contentType: { not: null },
  primaryServiceUrl: { not: null },
  featuredImage: { not: null },
  featuredImageAlt: { not: null },
  featuredImageKind: { not: null },
  sourceUrls: { isEmpty: false },
};

// Get all published blog posts
export async function getPublishedPosts(limit?: number) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, message: 'Failed to fetch posts' };
  }
}

// Get posts that passed the current evidence and provenance contract.
export async function getDiscoveryReadyPosts(limit?: number) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: discoveryReadyWhere,
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching discovery-ready posts:', error);
    return { success: false, message: 'Failed to fetch discovery-ready posts' };
  }
}

// Get all posts (for admin)
export async function getAllPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        category: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, message: 'Failed to fetch posts' };
  }
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return { success: false, message: 'Post not found' };
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, message: 'Failed to fetch post' };
  }
}

// Get related posts for interlinking: same category first, then keyword
// overlap, backfilled with most recent.
export async function getRelatedPosts(postId: string, categoryId: string | null, keywords: string[], limit = 3) {
  try {
    const candidates = await prisma.blogPost.findMany({
      where: { ...discoveryReadyWhere, id: { not: postId } },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        featuredImageAlt: true,
        keywords: true,
        publishedAt: true,
        categoryId: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 60,
    });

    const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));
    const scored = candidates
      .map((post) => {
        let score = 0;
        if (categoryId && post.categoryId === categoryId) score += 2;
        score += post.keywords.filter((k) => keywordSet.has(k.toLowerCase())).length;
        return { post, score };
      })
      .sort((a, b) => b.score - a.score || (b.post.publishedAt?.getTime() ?? 0) - (a.post.publishedAt?.getTime() ?? 0));

    return { success: true, posts: scored.slice(0, limit).map((s) => s.post) };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return { success: false, posts: [] };
  }
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: { slug: categorySlug },
      },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, message: 'Failed to fetch posts' };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, message: 'Failed to fetch categories' };
  }
}

// Create new blog post
interface CreatePostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  categoryId?: string;
  authorId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  published?: boolean;
}

export async function createPost(data: CreatePostData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  // Validate slug format
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    return { success: false, message: 'Slug must be lowercase, hyphenated, and URL-safe' };
  }

  try {
    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return { success: false, message: 'A post with this slug already exists' };
    }

    // Validate categoryId exists (if provided)
    if (data.categoryId) {
      const category = await prisma.blogCategory.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (!category) {
        return { success: false, message: `Category with id '${data.categoryId}' does not exist` };
      }
    }

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        authorId: data.authorId || session.user.id || null,
        publishedAt: data.published ? new Date() : null,
      },
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath('/sitemap.xml');
    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: 'Failed to create post' };
  }
}

// Update blog post
interface UpdatePostData {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  categoryId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  published?: boolean;
}

export async function updatePost(data: UpdatePostData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const { id, ...updateData } = data;

    // Check post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!existingPost) {
      return { success: false, message: 'Post not found' };
    }

    // Validate slug format (if changing)
    if (updateData.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(updateData.slug)) {
      return { success: false, message: 'Slug must be lowercase, hyphenated, and URL-safe' };
    }

    // Check slug uniqueness (if changed)
    if (updateData.slug && updateData.slug !== existingPost.slug) {
      const slugTaken = await prisma.blogPost.findUnique({
        where: { slug: updateData.slug },
      });
      if (slugTaken) {
        return { success: false, message: 'A post with this slug already exists' };
      }
    }

    // Validate categoryId exists (if provided)
    if (updateData.categoryId) {
      const category = await prisma.blogCategory.findUnique({
        where: { id: updateData.categoryId },
        select: { id: true },
      });
      if (!category) {
        return { success: false, message: `Category with id '${updateData.categoryId}' does not exist` };
      }
    }

    // Handle publishedAt logic
    let publishedAt = existingPost.publishedAt;
    if (updateData.published !== undefined) {
      if (updateData.published && !existingPost.published) {
        publishedAt = new Date();
      } else if (!updateData.published) {
        publishedAt = null;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        ...(publishedAt !== undefined && { publishedAt }),
      },
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath('/sitemap.xml');
    return { success: true, post };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, message: 'Failed to update post' };
  }
}

// Delete blog post
export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/blogs');
    revalidatePath('/sitemap.xml');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, message: 'Failed to delete post' };
  }
}

// Create category
export async function createCategory(name: string, slug: string, description?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  // Validate slug format
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { success: false, message: 'Slug must be lowercase, hyphenated, and URL-safe' };
  }

  try {
    // Check slug uniqueness
    const existing = await prisma.blogCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      return { success: false, message: 'A category with this slug already exists' };
    }

    const category = await prisma.blogCategory.create({
      data: { name, slug, description },
    });

    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, message: 'Failed to create category' };
  }
}
