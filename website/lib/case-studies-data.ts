export interface CaseStudyResult {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  number: string;
  client: string;
  industry: string;
  service: string;
  serviceSlug: string;
  location: string;
  tagline: string;
  metric: string;
  metricLabel: string;
  description: string;
  challenge: string;
  approach: { step: string; title: string; description: string }[];
  results: CaseStudyResult[];
  testimonial: { quote: string; author: string; role: string };
  accent: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'surrey-wellness',
    number: '01',
    client: 'Surrey Wellness',
    industry: 'Health & Wellness',
    service: 'Web Design',
    serviceSlug: 'web-design',
    location: 'Guildford, Surrey',
    tagline: 'From invisible to industry-leading in 60 days',
    metric: '+250%',
    metricLabel: 'Increase in online enquiries',
    description:
      'Surrey Wellness came to us with a dated website that was losing them customers daily. We rebuilt their entire digital presence from the ground up with a conversion-first approach — and the results speak for themselves.',
    challenge:
      'Surrey Wellness was the best wellness clinic in Guildford — but nobody knew it. Their old website was slow, mobile-unfriendly, and buried on page 4 of Google. Competitors with half the quality were getting all the leads.',
    approach: [
      {
        step: '01',
        title: 'Deep Discovery',
        description:
          'We audited their existing site, interviewed 12 past clients, and mapped the full customer journey from search to booking.',
      },
      {
        step: '02',
        title: 'Conversion Architecture',
        description:
          'Designed every page around a single goal: getting visitors to book a consultation. Clear hierarchy, social proof at every scroll point, and a frictionless booking flow.',
      },
      {
        step: '03',
        title: 'SEO-First Build',
        description:
          'Built with Next.js for a 97 PageSpeed score. Structured data, local SEO optimisation, and a content strategy targeting 40+ high-intent keywords.',
      },
      {
        step: '04',
        title: 'Launch & Optimise',
        description:
          'A/B tested key landing pages post-launch. Iterated on hero copy and CTA placement over the first 30 days based on heatmap and session data.',
      },
    ],
    results: [
      { value: '+250%', label: 'Online enquiries' },
      { value: '#1', label: 'Google ranking for key terms' },
      { value: '97', label: 'PageSpeed score' },
      { value: '60 days', label: 'Time to #1 ranking' },
    ],
    testimonial: {
      quote:
        'WeTrends completely transformed how patients find us online. Our enquiries tripled within two months and we had to hire two extra therapists to keep up with demand.',
      author: 'Dr. Lisa Park',
      role: 'Founder, Surrey Wellness',
    },
    accent: true,
  },
  {
    slug: 'guildford-cafe-co',
    number: '02',
    client: 'Guildford Cafe Co',
    industry: 'Hospitality',
    service: 'Social Media',
    serviceSlug: 'social-media',
    location: 'Guildford, Surrey',
    tagline: '500 to 50,000 followers. Coffee, culture, and community.',
    metric: '500 → 50k',
    metricLabel: 'Followers in 6 months',
    description:
      'A beloved local coffee shop with a loyal but small audience. We built a content machine that made them the most-talked-about spot in Guildford — and turned social followers into daily regulars.',
    challenge:
      'Guildford Cafe Co had incredible coffee, a stunning space, and zero social presence. They were relying entirely on foot traffic while competitors were building audiences of tens of thousands. They needed a social identity as good as their espresso.',
    approach: [
      {
        step: '01',
        title: 'Brand Voice & Visual Identity',
        description:
          'Created a distinct social persona rooted in local culture: warm, witty, and visually consistent. Every post felt unmistakably them.',
      },
      {
        step: '02',
        title: 'Content Pillars',
        description:
          'Built a weekly content rhythm across 4 pillars: behind-the-scenes craft, community stories, menu moments, and local culture — each designed to drive saves, shares, and follows.',
      },
      {
        step: '03',
        title: 'Trend-Led Execution',
        description:
          'Our weekly Trend Radar flagged viral formats early. We adapted them to the brand\'s voice and published at peak engagement windows.',
      },
      {
        step: '04',
        title: 'Community Management',
        description:
          'Responded to every comment and DM within 2 hours. Turned casual followers into brand advocates through genuine, human interaction.',
      },
    ],
    results: [
      { value: '500 → 50k', label: 'Followers grown' },
      { value: '4.2×', label: 'ROI on social spend' },
      { value: '340%', label: 'Increase in foot traffic' },
      { value: '6 months', label: 'Time to 50k followers' },
    ],
    testimonial: {
      quote:
        'I used to think social media was for big brands. WeTrends proved me completely wrong. Our Instagram is now our busiest customer channel — people come in specifically because they found us online.',
      author: 'Michael Brown',
      role: 'Owner, Guildford Cafe Co',
    },
    accent: false,
  },
  {
    slug: 'techstart-uk',
    number: '03',
    client: 'TechStart UK',
    industry: 'Technology',
    service: 'Video Production',
    serviceSlug: 'video-production',
    location: 'London & Surrey',
    tagline: 'A brand film that closed a £2M funding round',
    metric: '1,200%',
    metricLabel: 'Boost in content shares',
    description:
      'TechStart UK needed to explain a complex AI product to investors and customers in a way that was clear, compelling, and memorable. We created a brand film that became the centrepiece of their £2M funding pitch.',
    challenge:
      'TechStart had brilliant technology but struggled to explain it. Their existing content was technical, dry, and landing with neither investors nor customers. They had a funding pitch in 8 weeks and needed something that could make a room full of VCs lean forward.',
    approach: [
      {
        step: '01',
        title: 'Story First',
        description:
          'We distilled 47 pages of technical documentation into one human story: a founder who couldn\'t find the insight she needed, and the tool that changed everything. Emotion over specification.',
      },
      {
        step: '02',
        title: 'Pre-Production',
        description:
          'Three rounds of scriptwriting. Storyboarded every shot. Cast a real founder — not an actor — for authenticity. Location scouted across London and Surrey for a cinematic feel.',
      },
      {
        step: '03',
        title: 'Cinema-Grade Production',
        description:
          'Shot over 2 days with a RED camera, professional lighting rig, and a 6-person crew. Every frame designed to feel premium, not startup-bootstrap.',
      },
      {
        step: '04',
        title: 'Post & Delivery',
        description:
          'Full colour grade, original score, motion graphics to visualise the product. Delivered in 6 formats: pitch deck embed, website hero, LinkedIn, YouTube, Instagram Reel, and TV-safe.',
      },
    ],
    results: [
      { value: '£2M', label: 'Funding raised after pitch' },
      { value: '1,200%', label: 'Boost in content shares' },
      { value: '250k', label: 'Views in first week' },
      { value: '87%', label: 'Pitch success rate' },
    ],
    testimonial: {
      quote:
        'Every investor we pitched said the film was the reason they stayed in the room. It\'s the single best investment we\'ve ever made in our marketing. WeTrends didn\'t just make a video — they told our story.',
      author: 'Sarah Mitchell',
      role: 'CEO, TechStart UK',
    },
    accent: true,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((s) => s.slug);
}
