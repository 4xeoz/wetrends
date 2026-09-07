// Single source of truth for service pages — used by the service detail
// route, the sitemap, and llms.txt.

export const servicesData = {
  'video-production': {
    title: 'Video Production London & Surrey | WeTrends',
    description: 'Video production for London, Surrey and UK teams: brand films, campaigns, social content and motion graphics from one creative production partner.',
    keywords: ['video production London', 'video production Surrey', 'brand films', 'social media video', 'motion graphics'],
  },
  'brand-identity': {
    title: 'Brand Identity Agency London & Surrey | WeTrends',
    description: 'Strategic brand identity for London, Surrey and UK businesses, including visual systems, brand guidelines, campaigns and packaging.',
    keywords: ['brand identity London', 'branding agency Surrey', 'visual identity', 'brand guidelines', 'packaging design'],
  },
  'web-design': {
    title: 'Web Design & Development London | WeTrends',
    description: 'Conversion-focused web design and development for London, Surrey and UK businesses, including custom websites, e-commerce and Next.js applications.',
    keywords: ['web design London', 'website development Surrey', 'e-commerce design', 'Next.js development', 'UI/UX design'],
  },
  'social-media': {
    title: 'Social Media Management London & Surrey | WeTrends',
    description: 'Social media strategy, production, community management, paid campaigns and measurement for London, Surrey and UK brands.',
    keywords: ['social media management London', 'content strategy Surrey', 'community management', 'paid social', 'Instagram marketing'],
  },
  'animation': {
    title: 'Animation & Motion Design London | WeTrends',
    description: 'Animation and motion design for London, Surrey and UK teams, including explainers, campaign assets, logo animation and product motion.',
    keywords: ['animation studio London', 'motion graphics Surrey', '2D animation', 'explainer videos', 'logo animation'],
  },
  'content-strategy': {
    title: 'SEO & Content Strategy London | WeTrends',
    description: 'Evidence-led SEO, programmatic content, editorial strategy and copywriting for London, Surrey and UK businesses.',
    keywords: ['content strategy London', 'programmatic SEO agency', 'copywriting Surrey', 'SEO content', 'brand storytelling'],
  },
} as const;

export type ServiceSlug = keyof typeof servicesData;

export const serviceSlugs = Object.keys(servicesData) as ServiceSlug[];
