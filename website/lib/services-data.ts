// Single source of truth for service pages — used by the service detail
// route, the sitemap, and llms.txt.

export const servicesData = {
  'video-production': {
    title: 'Video Production Guildford | Professional Content Creation',
    description: 'Award-winning video production services in Guildford, Surrey. Brand films, commercials, social content & motion graphics. Local studio, national quality.',
    keywords: ['video production Guildford', 'commercial filming Surrey', 'brand films', 'social media video', 'motion graphics'],
  },
  'brand-identity': {
    title: 'Brand Identity Design Guildford | Logo & Visual Identity',
    description: 'Strategic brand identity design in Guildford, Surrey. Logo design, visual systems, brand guidelines & packaging. Make your brand unforgettable.',
    keywords: ['brand identity Guildford', 'logo design Surrey', 'visual identity', 'brand guidelines', 'packaging design'],
  },
  'web-design': {
    title: 'Web Design Guildford | Website Development Surrey',
    description: 'High-converting web design & development in Guildford, Surrey. Custom websites, e-commerce, web apps. Next.js specialists.',
    keywords: ['web design Guildford', 'website development Surrey', 'e-commerce design', 'Next.js development', 'UI/UX design'],
  },
  'social-media': {
    title: 'Social Media Management Guildford | Content Strategy',
    description: 'Expert social media management in Guildford, Surrey. Content strategy, community management, paid social & analytics. Grow your following.',
    keywords: ['social media management Guildford', 'content strategy Surrey', 'community management', 'paid social', 'Instagram marketing'],
  },
  'animation': {
    title: 'Animation Studio Guildford | Motion Graphics Surrey',
    description: 'Creative animation & motion graphics in Guildford, Surrey. 2D animation, explainers, logo animation & micro-interactions. Bring your brand to life.',
    keywords: ['animation studio Guildford', 'motion graphics Surrey', '2D animation', 'explainer videos', 'logo animation'],
  },
  'content-strategy': {
    title: 'Content Strategy Guildford | Copywriting Surrey',
    description: 'Strategic content creation in Guildford, Surrey. SEO content, copywriting, editorial & storytelling. Words that convert.',
    keywords: ['content strategy Guildford', 'copywriting Surrey', 'SEO content', 'brand storytelling', 'blog writing'],
  },
} as const;

export type ServiceSlug = keyof typeof servicesData;

export const serviceSlugs = Object.keys(servicesData) as ServiceSlug[];
