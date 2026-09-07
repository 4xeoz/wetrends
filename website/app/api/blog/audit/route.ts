import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { auditPublishedContent } from '@/lib/published-content-audit';
import { prisma } from '@/prisma/prisma';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.authorized) return auth.response;

  const requestedLimit = Number.parseInt(request.nextUrl.searchParams.get('limit') ?? '25', 10);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 50)) : 25;

  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        featuredImageAlt: true,
        featuredImageKind: true,
        metaTitle: true,
        metaDescription: true,
        campaign: true,
        contentType: true,
        primaryServiceUrl: true,
        sourceUrls: true,
        qualityScore: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      audit: auditPublishedContent(posts, limit),
    });
  } catch (error) {
    console.error('[API Blog Audit] Read error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to audit published content' },
      { status: 500 },
    );
  }
}
