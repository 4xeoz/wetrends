export type PublishedContentAuditInput = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  featuredImageKind?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  campaign?: string | null;
  contentType?: string | null;
  primaryServiceUrl?: string | null;
  sourceUrls?: string[] | null;
  qualityScore?: number | null;
  publishedAt?: Date | string | null;
};

export type PublishedContentRiskCode =
  | 'missing_sources'
  | 'missing_campaign'
  | 'missing_content_type'
  | 'missing_primary_service_url'
  | 'missing_featured_image'
  | 'missing_image_alt'
  | 'missing_image_provenance'
  | 'missing_meta_title'
  | 'missing_meta_description'
  | 'missing_quality_score'
  | 'thin_content'
  | 'invalid_h1_count'
  | 'claim_evidence_review'
  | 'untracked_external_link'
  | 'guildford_transition_review';

const riskWeights: Record<PublishedContentRiskCode, number> = {
  missing_sources: 15,
  missing_campaign: 5,
  missing_content_type: 5,
  missing_primary_service_url: 10,
  missing_featured_image: 10,
  missing_image_alt: 5,
  missing_image_provenance: 10,
  missing_meta_title: 5,
  missing_meta_description: 5,
  missing_quality_score: 5,
  thin_content: 15,
  invalid_h1_count: 10,
  claim_evidence_review: 15,
  untracked_external_link: 10,
  guildford_transition_review: 8,
};

const claimReviewPatterns = [
  /\b(?:best|leading|number one|#1|award[- ]winning|guarantee(?:d|s)?)\b/i,
  /\b(?:increase[sd]?|boost(?:s|ed)?|cut(?:s)?|reduce[sd]?|grow(?:s|th)?|generate[sd]?|outperform(?:s|ed)?|proven|record)\b/i,
  /(?:^|\s)[+−-]?\d+(?:\.\d+)?\s*(?:%|x|×)(?:\s|$)/i,
];

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ');
}

function externalLinks(value: string) {
  return [...value.matchAll(/<a\b[^>]*\bhref=["'](https:\/\/[^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((url) => !url.startsWith('https://wetrends.co.uk/'));
}

export function auditPublishedContent(posts: PublishedContentAuditInput[], maxItems = 25) {
  const audited = posts.map((post) => {
    const risks: PublishedContentRiskCode[] = [];
    const add = (condition: boolean, code: PublishedContentRiskCode) => {
      if (condition) risks.push(code);
    };
    const plainText = stripHtml(post.content).trim();
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const h1Count = (post.content.match(/<h1\b/gi) || []).length;
    const sources = post.sourceUrls ?? [];
    const trackedSources = new Set(sources);
    const unknownExternalLinks = externalLinks(post.content).filter((url) => !trackedSources.has(url));
    const claimText = `${post.title} ${post.excerpt} ${plainText}`;

    add(sources.length === 0, 'missing_sources');
    add(!post.campaign, 'missing_campaign');
    add(!post.contentType, 'missing_content_type');
    add(!post.primaryServiceUrl, 'missing_primary_service_url');
    add(!post.featuredImage, 'missing_featured_image');
    add(!post.featuredImageAlt, 'missing_image_alt');
    add(!post.featuredImageKind, 'missing_image_provenance');
    add(!post.metaTitle, 'missing_meta_title');
    add(!post.metaDescription, 'missing_meta_description');
    add(post.qualityScore == null, 'missing_quality_score');
    add(wordCount < 700, 'thin_content');
    add(h1Count !== 1, 'invalid_h1_count');
    add(claimReviewPatterns.some((pattern) => pattern.test(claimText)), 'claim_evidence_review');
    add(unknownExternalLinks.length > 0, 'untracked_external_link');
    add(/guildford/i.test(`${post.title} ${post.slug}`), 'guildford_transition_review');

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      wordCount,
      publishedAt: post.publishedAt ?? null,
      riskCodes: risks,
      reviewPriority: Math.min(100, risks.reduce((total, code) => total + riskWeights[code], 0)),
    };
  });

  const riskCounts = Object.fromEntries(
    Object.keys(riskWeights).map((code) => [
      code,
      audited.filter((post) => post.riskCodes.includes(code as PublishedContentRiskCode)).length,
    ]),
  ) as Record<PublishedContentRiskCode, number>;

  const topPriorities = [...audited]
    .sort((left, right) => {
      if (right.reviewPriority !== left.reviewPriority) return right.reviewPriority - left.reviewPriority;
      const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
      const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
      return rightDate - leftDate;
    })
    .slice(0, Math.max(1, Math.min(maxItems, 50)));

  return {
    totalPublished: audited.length,
    reviewRequired: audited.filter((post) => post.riskCodes.length > 0).length,
    clearUnderCurrentRules: audited.filter((post) => post.riskCodes.length === 0).length,
    riskCounts,
    titleLocationMix: {
      london: audited.filter((post) => /london/i.test(`${post.title} ${post.slug}`)).length,
      guildford: audited.filter((post) => /guildford/i.test(`${post.title} ${post.slug}`)).length,
    },
    topPriorities,
  };
}
