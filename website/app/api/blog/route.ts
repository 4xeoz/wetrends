import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { createBlogPostSchema } from "@/lib/zod/blog";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const auth = validateApiKey(request);
  if (!auth.authorized) {
    return auth.response;
  }

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = createBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // 3. Verify authorId exists (if provided)
  if (data.authorId) {
    const authorExists = await prisma.user.findUnique({
      where: { id: data.authorId },
      select: { id: true },
    });
    if (!authorExists) {
      return NextResponse.json(
        { success: false, message: `User with id '${data.authorId}' does not exist` },
        { status: 400 }
      );
    }
  }

  // 4. Verify categoryId exists (if provided)
  if (data.categoryId) {
    const categoryExists = await prisma.blogCategory.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: `Category with id '${data.categoryId}' does not exist` },
        { status: 400 }
      );
    }
  }

  // 5. Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "A post with this slug already exists" },
      { status: 409 }
    );
  }

  // 6. Create post
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords ?? [],
        categoryId: data.categoryId,
        authorId: data.authorId,
      },
    });

    // 5. Revalidate blog pages
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(
      { success: true, post },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API Blog] Create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
