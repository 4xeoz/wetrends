import { getPublishedPosts } from '@/actions/blog';
import { servicesData } from '@/lib/services-data';
import { faqs } from '@/lib/faq-data';

// Regenerate at most hourly so new blog posts show up without a redeploy.
export const revalidate = 3600;

const baseUrl = 'https://wetrends.co.uk';

export async function GET() {
  const services = Object.entries(servicesData)
    .map(([slug, service]) => {
      const name = service.title.split('|')[0].trim();
      return `- [${name}](${baseUrl}/services/${slug}/): ${service.description}`;
    })
    .join('\n');

  let posts = '';
  try {
    const result = await getPublishedPosts();
    if (result.success && result.posts) {
      posts = result.posts
        .map((post) => `- [${post.title}](${baseUrl}/blogs/${post.slug}/): ${post.excerpt}`)
        .join('\n');
    }
  } catch {
    // Blog listing is best-effort; serve the rest of the file regardless.
  }

  const faqSection = faqs
    .map((faq) => `### ${faq.question}\n\n${faq.answer}`)
    .join('\n\n');

  const content = `# WeTrends

> WeTrends is a creative digital agency in Guildford, Surrey, UK. We help small businesses build uncopyable brands through web design, brand identity, video production, social media management, animation, and content strategy. We serve Guildford, Woking, Farnham, Dorking, Reigate, wider Surrey, London, and the UK.

Contact: team@wetrends.co.uk — typical budget for a bespoke website is £3,000–£15,000; a full rebrand takes 6–12 weeks.

## Services

${services}

## Key Pages

- [Home](${baseUrl}/): Agency overview, portfolio, and contact form
- [Services](${baseUrl}/services/): All services with details and pricing guidance
- [Case Studies](${baseUrl}/case-studies/): Real projects and proven results
- [Blog](${baseUrl}/blogs/): Articles on branding, marketing, and growing a small business
- [Questions](${baseUrl}/questions/): Direct answers to common questions about web design, branding, and digital marketing
- [Cinematography](${baseUrl}/cinematography/): Cinematography and film production booking

## Blog Posts

${posts || '- See the [blog index](' + baseUrl + '/blogs/) for current articles.'}

## Frequently Asked Questions

${faqSection}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
