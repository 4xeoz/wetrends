import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { prisma } from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * Protected title inventory for planning and cannibalisation checks. It lists
 * every live URL so legacy content still blocks near-duplicate generation,
 * while `discoveryReady` limits suggested internal links to evidence-ready
 * articles. No draft copy or unpublished metadata is returned.
 */
export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.authorized) return auth.response;

  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        title: true,
        slug: true,
        automationStatus: true,
        qualityScore: true,
        campaign: true,
        contentType: true,
        primaryServiceUrl: true,
        featuredImage: true,
        featuredImageAlt: true,
        featuredImageKind: true,
        sourceUrls: true,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    const posts = rows.map((post) => ({
      title: post.title,
      slug: post.slug,
      url: `https://wetrends.co.uk/blogs/${post.slug}/`,
      discoveryReady: Boolean(
        post.automationStatus === 'published' &&
        post.qualityScore != null &&
        post.qualityScore >= 80 &&
        post.campaign &&
        post.contentType &&
        post.primaryServiceUrl &&
        post.featuredImage &&
        post.featuredImageAlt &&
        post.featuredImageKind &&
        post.sourceUrls.length > 0
      ),
    }));

    return NextResponse.json(
      { success: true, count: posts.length, posts },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    console.error('[API Blog Inventory] Read error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read the published content inventory' },
      { status: 500 },
    );
  }
}
