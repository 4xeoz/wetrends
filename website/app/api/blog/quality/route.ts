import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { createBlogPostSchema } from '@/lib/zod/blog';
import { evaluateBlogDraft } from '@/lib/blog-quality';

export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.authorized) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, quality: evaluateBlogDraft(parsed.data) });
}
