import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/zod/blog";
import { revalidatePath } from "next/cache";
import {
  getAutomationTransitionError,
  getPublishedAutomationDisposition,
} from "@/lib/blog-automation-state";
import { auth } from "@/lib/auth";

// ─────────────────────────────────────────────
// GET — an authenticated admin session or API key is required so drafts are
// never exposed publicly while the existing admin editor keeps working.
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    const apiAuth = validateApiKey(request);
    if (!apiAuth.authorized) return apiAuth.response;
  }

  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PATCH — API key required
// ─────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const parsed = updateBlogPostSchema.safeParse(body);
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
  const { id } = await params;

  try {
    // 3. Find existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const publishedDisposition = getPublishedAutomationDisposition(existingPost, data);
    if (publishedDisposition === 'idempotent') {
      return NextResponse.json({ success: true, post: existingPost, idempotent: true });
    }
    if (publishedDisposition === 'blocked') {
      return NextResponse.json(
        { success: false, message: 'Published posts are read-only through the automation API' },
        { status: 409 }
      );
    }

    const transitionError = getAutomationTransitionError(existingPost, data);
    if (transitionError) {
      return NextResponse.json(
        { success: false, message: transitionError.message },
        { status: transitionError.status }
      );
    }

    if (data.published === true) {
      if (data.automationStatus !== "approved") {
        return NextResponse.json(
          { success: false, message: "API publication requires an explicit approved status in this request" },
          { status: 400 }
        );
      }

      if (!['drafted', 'quality_blocked', 'review_ready', 'approved', 'published'].includes(existingPost.automationStatus ?? '')) {
        return NextResponse.json(
          { success: false, message: "Only a private draft can be published" },
          { status: 409 }
        );
      }

      const publicationCandidate = {
        title: data.title ?? existingPost.title,
        slug: data.slug ?? existingPost.slug,
        excerpt: data.excerpt ?? existingPost.excerpt,
        content: data.content ?? existingPost.content,
        featuredImage: data.featuredImage ?? existingPost.featuredImage ?? undefined,
        featuredImageAlt: data.featuredImageAlt ?? existingPost.featuredImageAlt ?? undefined,
        featuredImageKind: data.featuredImageKind ?? existingPost.featuredImageKind ?? undefined,
        featuredImageCredit: data.featuredImageCredit ?? existingPost.featuredImageCredit ?? undefined,
        published: false,
        metaTitle: data.metaTitle ?? existingPost.metaTitle ?? undefined,
        metaDescription: data.metaDescription ?? existingPost.metaDescription ?? undefined,
        keywords: data.keywords ?? existingPost.keywords,
        campaign: data.campaign ?? existingPost.campaign ?? undefined,
        contentType: data.contentType ?? existingPost.contentType ?? undefined,
        primaryServiceUrl: data.primaryServiceUrl ?? existingPost.primaryServiceUrl ?? undefined,
        sourceUrls: data.sourceUrls ?? existingPost.sourceUrls,
        automationStatus: 'review_ready' as const,
        automationRunId: data.automationRunId ?? existingPost.automationRunId ?? undefined,
        qualityScore: data.qualityScore ?? existingPost.qualityScore ?? undefined,
        categoryId: data.categoryId ?? existingPost.categoryId ?? undefined,
        authorId: data.authorId ?? existingPost.authorId ?? undefined,
      };
      const candidateParsed = createBlogPostSchema.safeParse(publicationCandidate);
      if (!candidateParsed.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Draft is not publication-ready",
            errors: candidateParsed.error.flatten().fieldErrors,
          },
          { status: 422 }
        );
      }
    }

    // 4. Verify authorId exists (if changing)
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

    // 5. Verify categoryId exists (if provided)
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

    // 6. Check slug uniqueness if changed
    if (data.slug && data.slug !== existingPost.slug) {
      const slugTaken = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      });
      if (slugTaken) {
        return NextResponse.json(
          { success: false, message: "A post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // 7. Handle publishedAt logic
    let publishedAt = existingPost.publishedAt;
    if (data.published !== undefined) {
      if (data.published && !existingPost.published) {
        publishedAt = new Date();
      } else if (!data.published) {
        publishedAt = null;
      }
    }

    // 6. Update post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
        ...(data.featuredImageAlt !== undefined && { featuredImageAlt: data.featuredImageAlt }),
        ...(data.featuredImageKind !== undefined && { featuredImageKind: data.featuredImageKind }),
        ...(data.featuredImageCredit !== undefined && { featuredImageCredit: data.featuredImageCredit }),
        ...(data.published !== undefined && { published: data.published }),
        ...(publishedAt !== undefined && { publishedAt }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.keywords !== undefined && { keywords: data.keywords }),
        ...(data.campaign !== undefined && { campaign: data.campaign }),
        ...(data.contentType !== undefined && { contentType: data.contentType }),
        ...(data.primaryServiceUrl !== undefined && { primaryServiceUrl: data.primaryServiceUrl }),
        ...(data.sourceUrls !== undefined && { sourceUrls: data.sourceUrls }),
        ...(data.automationStatus !== undefined && {
          automationStatus: data.published === true ? "published" : data.automationStatus,
        }),
        ...(data.automationRunId !== undefined && { automationRunId: data.automationRunId }),
        ...(data.qualityScore !== undefined && { qualityScore: data.qualityScore }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.authorId !== undefined && { authorId: data.authorId }),
      },
    });

    // 7. Revalidate
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${post.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("[API Blog] Update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE — API key required
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authenticate
  const auth = validateApiKey(request);
  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;

  try {
    // 2. Find post (to know slug for revalidation)
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    if (post.published || post.automationStatus === 'published') {
      return NextResponse.json(
        { success: false, message: 'Published posts cannot be deleted through the automation API' },
        { status: 409 }
      );
    }

    // 3. Delete an unpublished draft only. Human administrators retain their
    // separate session-authenticated delete action in actions/blog.ts.
    await prisma.blogPost.delete({
      where: { id },
    });

    // 4. Revalidate
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${post.slug}`);

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("[API Blog] Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
