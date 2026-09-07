import type { CreateBlogPostInput } from '@/lib/zod/blog';

export type QualityIssue = {
  code: string;
  severity: 'critical' | 'warning';
  message: string;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ');
}

function hrefs(value: string) {
  return [...value.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
}

export function evaluateBlogDraft(draft: CreateBlogPostInput) {
  const issues: QualityIssue[] = [];
  const add = (code: string, severity: QualityIssue['severity'], message: string) => {
    issues.push({ code, severity, message });
  };

  const text = stripHtml(draft.content).trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  const h1Count = (draft.content.match(/<h1\b/gi) || []).length;
  const h2Count = (draft.content.match(/<h2\b/gi) || []).length;
  const links = hrefs(draft.content);
  const sourceUrls = draft.sourceUrls ?? [];

  if (draft.title.length > 60) add('title_too_long', 'warning', 'Title is longer than 60 characters.');
  if (!draft.metaTitle || draft.metaTitle.length > 60) add('meta_title', 'warning', 'Meta title is missing or longer than 60 characters.');
  if (!draft.metaDescription || draft.metaDescription.length > 155) add('meta_description', 'warning', 'Meta description is missing or longer than 155 characters.');
  if (wordCount < 700 || wordCount > 1_800) add('word_count', 'critical', `Word count ${wordCount} is outside 700–1,800.`);
  if (h1Count !== 1) add('h1_count', 'critical', `Expected exactly one H1; found ${h1Count}.`);
  if (h2Count < 4) add('section_count', 'critical', `Expected at least four H2 sections; found ${h2Count}.`);
  if (!/^\s*<h1\b[\s\S]*?<\/h1>\s*<p\b/i.test(draft.content)) {
    add('answer_first', 'warning', 'The article should begin with H1 followed by a direct-answer paragraph.');
  }

  if (
    /```|\{\{[^}]+\}\}|\b(?:lorem ipsum|placeholder text|TODO|TBD)\b|\[(?:insert|client name|company name|source needed|citation needed|date)\b[^\]]*\]/i.test(
      draft.content
    )
  ) {
    add('placeholder_text', 'critical', 'The draft contains a code fence or unresolved placeholder.');
  }

  if (
    draft.contentType !== 'case_study' &&
    /\b(?:we|our team|wetrends)\s+(?:have\s+)?(?:helped|worked\s+with|delivered|filmed|photographed|produced|achieved|increased|reduced|grew|cut)\b/i.test(
      text
    )
  ) {
    add('first_party_claim_review', 'critical', 'A first-party client or outcome claim needs human evidence review.');
  }

  if (!draft.campaign) add('campaign_missing', 'critical', 'Campaign is required for automated drafts.');
  if (!draft.contentType) add('content_type_missing', 'warning', 'Content type is missing.');
  if (!draft.primaryServiceUrl) {
    add('cta_missing', 'critical', 'A primary service URL is required.');
  } else {
    const path = new URL(draft.primaryServiceUrl).pathname;
    if (!links.some((link) => link === draft.primaryServiceUrl || link === path)) {
      add('cta_link_missing', 'critical', 'The content does not link to its primary service page.');
    }
  }

  if (sourceUrls.length === 0) add('sources_missing', 'warning', 'No source URLs were supplied.');
  const unknownExternal = links.filter((link) => {
    if (!/^https:\/\//i.test(link) || link.startsWith('https://wetrends.co.uk/')) return false;
    return !sourceUrls.includes(link);
  });
  if (unknownExternal.length) add('unknown_external_link', 'critical', 'The article contains an external link that is not in sourceUrls.');

  const hasUncitedStatistic = [...draft.content.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].some((match) => {
    const paragraph = match[1];
    if (!/\b\d+(?:\.\d+)?\s*(?:%|x|×)(?![a-z0-9])/i.test(stripHtml(paragraph))) return false;
    return !hrefs(paragraph).some((link) => sourceUrls.includes(link));
  });
  if (hasUncitedStatistic) {
    add('statistic_source_missing', 'critical', 'Every percentage or multiplier needs a source link in the same paragraph.');
  }

  const unsupportedClaimPatterns = [
    /\b(?:best|leading|number one|#1|award[- ]winning)\b/i,
    /\b(?:based in|our office in|our london studio)\s+london\b/i,
    /\bguarantee(?:d|s)?\b/i,
  ];
  if (unsupportedClaimPatterns.some((pattern) => pattern.test(text))) {
    add('unsupported_claim_language', 'critical', 'The draft contains a superlative, guarantee or unverified London-base claim.');
  }

  if (!draft.featuredImage) {
    add('featured_image_missing', 'critical', 'Automated drafts require a featured image before review.');
  } else {
    if (!draft.featuredImageAlt) add('image_alt_missing', 'critical', 'Featured image alt text is required.');
    if (!draft.featuredImageKind) add('image_kind_missing', 'critical', 'Featured image provenance is required.');
  }
  if (draft.contentType === 'case_study' && draft.featuredImageKind !== 'portfolio') {
    add('case_study_proof_missing', 'critical', 'Case studies require a genuine portfolio image, not AI supporting art.');
  }
  if (
    draft.featuredImageKind === 'ai_supporting' &&
    /\b(?:real client|client work|our portfolio|photographed by wetrends)\b/i.test(draft.featuredImageAlt ?? '')
  ) {
    add('ai_image_misrepresented', 'critical', 'AI supporting art must not be described as real client work.');
  }

  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  const warningCount = issues.length - criticalCount;
  const score = Math.max(0, 100 - criticalCount * 25 - warningCount * 7);

  return {
    pass: criticalCount === 0 && score >= 80,
    score,
    wordCount,
    h1Count,
    h2Count,
    issues,
  };
}
