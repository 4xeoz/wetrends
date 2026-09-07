// Server-side enrichment of blog post HTML before rendering:
// - strips the content's own <h1> (the page template renders the title h1)
// - adds ids to h2/h3 headings and extracts them for the table of contents
// - auto-links the first mention of each service to its service page
// - picks the most relevant service CTA for the post

import { servicesData, type ServiceSlug } from '@/lib/services-data';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface EnrichedContent {
  html: string;
  toc: TocEntry[];
}

// First mention of these phrases (outside headings/links) links to the
// matching service page. Longer phrases first so they win over substrings.
const serviceLinkTargets: [string, string][] = [
  ['social media management', '/services/social-media/'],
  ['content strategy', '/services/content-strategy/'],
  ['video production', '/services/video-production/'],
  ['brand identity', '/services/brand-identity/'],
  ['social media', '/services/social-media/'],
  ['web design', '/services/web-design/'],
  ['animation', '/services/animation/'],
  ['branding', '/services/brand-identity/'],
];

function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/**
 * Converts plain text content to structured HTML.
 * Handles markdown-like syntax and plain text paragraph separation.
 * (Moved server-side from blog-post-content.tsx so enrichment can run on it.)
 */
function formatContentToHtml(content: string): string {
  // If content already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';

    // Skip lines that are just dashes (used as separators)
    if (/^[-–—]{2,}$/.test(line)) continue;

    // Headers: lines ending with colon that are short and followed by content
    if (
      line.length < 80 &&
      line.endsWith(':') &&
      !line.startsWith(' ') &&
      nextLine.length > 0 &&
      !nextLine.endsWith(':')
    ) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h2>${line.slice(0, -1)}</h2>`;
      continue;
    }

    // Bold lines wrapped in ** or __
    const boldMatch = line.match(/^(\*\*|__)(.+?)\1$/);
    if (boldMatch) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p><strong>${boldMatch[2]}</strong></p>`;
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    }

    // Numbered lists
    const numberedMatch = line.match(/^\d+\.\s(.+)$/);
    if (numberedMatch) {
      if (!inList) {
        html += '<ol>';
        inList = true;
      }
      html += `<li>${numberedMatch[1]}</li>`;
      continue;
    }

    // Close any open list
    if (inList) {
      html += '</ul>';
      inList = false;
    }

    // Regular paragraph with inline bold/italic
    const processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>');

    html += `<p>${processed}</p>`;
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

export function enrichBlogContent(rawContent: string): EnrichedContent {
  const rawHtml = formatContentToHtml(rawContent);
  // Drop the content's own <h1>; the page renders the post title.
  let html = rawHtml.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');


  // Add ids to h2/h3 and collect the TOC.
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();
  html = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level, attrs, inner) => {
    const text = stripTags(inner).trim();
    const id = slugifyHeading(text, usedIds);
    if (level === '2') toc.push({ id, text, level: 2 });
    else toc.push({ id, text, level: 3 });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  // Auto-link first mention of each service. Only touch text inside <p>
  // paragraphs that don't already contain a link, and never link twice to
  // the same destination.
  const linkedDestinations = new Set<string>();
  for (const [phrase, href] of serviceLinkTargets) {
    if (linkedDestinations.has(href)) continue;
    const phrasePattern = new RegExp(`\\b(${phrase.replace(/\s+/g, '\\s+')})\\b`, 'i');
    let done = false;
    html = html.replace(/<p>([\s\S]*?)<\/p>/gi, (match, inner) => {
      if (done || /<a[\s>]/i.test(inner) || /<h[1-6]/i.test(inner)) return match;
      const m = inner.match(phrasePattern);
      if (!m) return match;
      done = true;
      linkedDestinations.add(href);
      const linked = inner.replace(
        phrasePattern,
        `<a href="${href}">$1</a>`
      );
      return `<p>${linked}</p>`;
    });
  }

  return { html, toc };
}

export interface ServiceCta {
  title: string;
  description: string;
  href: string;
}

// Phrases that signal a post belongs with a given service.
const serviceSignals: [ServiceSlug, string[]][] = [
  ['social-media', ['social media', 'instagram', 'linkedin', 'facebook', 'meta ads', 'meta lead', 'followers', 'tiktok']],
  ['web-design', ['web design', 'website', 'landing page', 'funnel', 'e-commerce', 'conversion']],
  ['content-strategy', ['content strategy', 'content system', 'copywriting', 'seo', 'blog', 'email list', 'newsletter', 'ghostwriting']],
  ['video-production', ['video', 'film', 'cinematography']],
  ['brand-identity', ['brand', 'branding', 'logo', 'identity', 'rebrand']],
  ['animation', ['animation', 'motion graphics', 'explainer']],
];

export function pickServiceCta(
  title: string,
  keywords: string[],
  categoryName?: string | null,
  campaign?: string | null,
  primaryServiceUrl?: string | null
): ServiceCta | null {
  if (campaign === 'events' || primaryServiceUrl?.includes('/events/')) {
    return {
      title: 'Event photography and film',
      description: 'Plan coverage around the room, the moments and the content you need afterwards.',
      href: '/events/',
    };
  }
  if (campaign === 'photoshoots' || primaryServiceUrl?.includes('/photoshoots/')) {
    return {
      title: 'Photoshoots for people and brands',
      description: 'Build a practical shot list for portraits, teams, products or a personal brand campaign.',
      href: '/photoshoots/',
    };
  }

  const haystack = [title, ...keywords, categoryName ?? ''].join(' ').toLowerCase();

  let best: { slug: ServiceSlug; score: number } | null = null;
  for (const [slug, signals] of serviceSignals) {
    const score = signals.filter((s) => haystack.includes(s)).length;
    if (score > 0 && (!best || score > best.score)) best = { slug, score };
  }
  if (!best) return null;

  const service = servicesData[best.slug];
  return {
    title: service.title.split('|')[0].trim(),
    description: service.description,
    href: `/services/${best.slug}/`,
  };
}
