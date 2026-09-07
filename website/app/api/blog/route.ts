import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { createBlogPostSchema } from "@/lib/zod/blog";
import { revalidatePath } from "next/cache";
import { evaluateBlogDraft } from "@/lib/blog-quality";

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.authorized) return auth.response;

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { success: false, message: "A slug query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("[API Blog] Lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

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

  if (data.published) {
    return NextResponse.json(
      { success: false, message: "New API posts must be created as drafts" },
      { status: 400 }
    );
  }

  const quality = evaluateBlogDraft(data);
  if (data.automationStatus === "review_ready" && !quality.pass) {
    return NextResponse.json(
      { success: false, message: "Draft failed the quality gate", quality },
      { status: 422 }
    );
  }

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
        featuredImageAlt: data.featuredImageAlt,
        featuredImageKind: data.featuredImageKind,
        featuredImageCredit: data.featuredImageCredit,
        published: false,
        publishedAt: null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords ?? [],
        campaign: data.campaign,
        contentType: data.contentType,
        primaryServiceUrl: data.primaryServiceUrl,
        sourceUrls: data.sourceUrls ?? [],
        automationStatus: data.automationStatus ?? "drafted",
        automationRunId: data.automationRunId,
        qualityScore: quality.score,
        categoryId: data.categoryId,
        authorId: data.authorId,
      },
    });

    // 5. Revalidate blog pages
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(
      { success: true, post, quality },
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
