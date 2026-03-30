'use server';

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth/auth';
import { revalidatePath } from 'next/cache';

// Get all published blog posts
export async function getPublishedPosts(limit?: number) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        category: true,
        author: {
          select: { name: true, image: true },
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

// Get all posts (for admin)
export async function getAllPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
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

// Get single post by ID (admin edit)
export async function getPostById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: { name: true, image: true },
        },
      },
    });
    if (!post) return { success: false, message: 'Post not found' };
    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, message: 'Failed to fetch post' };
  }
}

// Get single post by slug (public)
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: { name: true, image: true },
        },
      },
    });
    if (!post) return { success: false, message: 'Post not found' };

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
          select: { name: true, image: true },
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
  authorId: string;
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

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        authorId: session.user.id,
        publishedAt: data.published ? new Date() : null,
      },
    });
    revalidatePath('/blogs');
    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: 'Failed to create post' };
  }
}

// Update blog post — preserves publishedAt if post was already published
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

    // Fetch current post to preserve publishedAt when re-publishing
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { published: true, publishedAt: true, slug: true },
    });
    if (!currentPost) return { success: false, message: 'Post not found' };

    let publishedAt = currentPost.publishedAt;
    if (updateData.published === true && !currentPost.publishedAt) {
      publishedAt = new Date();
    } else if (updateData.published === false) {
      publishedAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: { ...updateData, publishedAt },
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${currentPost.slug}`);
    if (post.slug !== currentPost.slug) revalidatePath(`/blogs/${post.slug}`);
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
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath('/blogs');
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

  try {
    const category = await prisma.blogCategory.create({
      data: { name, slug, description },
    });
    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, message: 'Failed to create category' };
  }
}

// Delete category — clears categoryId on posts first to avoid FK errors
export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    // Detach posts from this category before deleting
    await prisma.blogPost.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    await prisma.blogCategory.delete({ where: { id } });
    revalidatePath('/me/blog/categories');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'Failed to delete category' };
  }
}
