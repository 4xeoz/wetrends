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
    slug: 'nopeca',
    number: '01',
    client: 'Nopeca',
    industry: 'Education',
    service: 'Web Design',
    serviceSlug: 'web-design',
    location: 'London, UK',
    tagline: 'A website that gives parents confidence before they even visit',
    metric: '+180%',
    metricLabel: 'Increase in enquiries',
    description:
      "Nopeca had a brilliant approach to education but a website that looked like it was built during the dial up era. We rebuilt their digital presence so parents feel confident about their child's future.",
    challenge:
      "Nopeca was the best educational consultancy in their area — but nobody knew it. Their site was confusing, slow, and buried on page three of Google. Meanwhile, the school down the road was fully booked with a website that wasn't half as good.",
    approach: [
      {
        step: '01',
        title: 'Deep Discovery',
        description:
          'Talked to parents, teachers, and students. Mapped the full journey from "I need a school" to "Enrolment confirmed" and found every point where people lost faith.',
      },
      {
        step: '02',
        title: 'Conversion Design',
        description:
          'Clear messaging, easy navigation, trust signals everywhere. Every page built to turn curious parents into enrolled families. If it doesn\'t build confidence, it doesn\'t go on the page.',
      },
      {
        step: '03',
        title: 'Speed First Build',
        description:
          'Next.js, 97 PageSpeed score, mobile first. Because parents browse on their phones at 11pm when the kids are finally asleep.',
      },
      {
        step: '04',
        title: 'Launch & Optimise',
        description:
          'A/B tested headlines, simplified enquiry forms. The winning version asked for less information upfront and had bigger buttons. Obvious in hindsight.',
      },
    ],
    results: [
      { value: '+180%', label: 'Enquiries' },
      { value: '4.9★', label: 'Average parent rating' },
      { value: '2 min', label: 'Average session time' },
      { value: '40%', label: 'Return visit rate' },
    ],
    testimonial: {
      quote:
        "WeTrends built us a site that finally reflects who we are. Enquiries nearly tripled and parents keep telling us they chose us because the website made them feel confident about their child's future.",
      author: 'Dr. Marco Silva',
      role: 'Director, Nopeca',
    },
    accent: true,
  },
  {
    slug: 'savana-lounge',
    number: '02',
    client: 'Savana Lounge',
    industry: 'Hospitality',
    service: 'Brand Identity',
    serviceSlug: 'brand-identity',
    location: 'Surrey, UK',
    tagline: 'A brand that makes people choose Savana before they check the menu',
    metric: '+320%',
    metricLabel: 'Boost in direct bookings',
    description:
      "Savana Lounge had incredible food and a brand that looked like every other restaurant on the high street. We figured out what made them different and built an identity people actually remember.",
    challenge:
      "The food at Savana Lounge was class. But their brand was forgettable. When people can't tell the difference between you and the place next door, they choose on price or convenience. That's a race Savana couldn't win.",
    approach: [
      {
        step: '01',
        title: 'Brand Archaeology',
        description:
          'Dug into their story, their regulars, and the atmosphere nobody else was capturing. Found the one thing only Savana Lounge could own.',
      },
      {
        step: '02',
        title: 'Visual Identity',
        description:
          'Colours, typography, photography style. Everything designed to feel unmistakably Savana Lounge. If you covered up the logo, you\'d still know it was them.',
      },
      {
        step: '03',
        title: 'Digital Experience',
        description:
          'Translated the brand into a web experience that feels as warm as the restaurant itself. Every scroll should make you want to book a table.',
      },
      {
        step: '04',
        title: 'Launch Strategy',
        description:
          'Rolled it out across every touchpoint. Consistent, confident, impossible to ignore. The rebrand paid for itself in the first month.',
      },
    ],
    results: [
      { value: '+320%', label: 'Direct bookings' },
      { value: '65%', label: 'Returning customers' },
      { value: '3×', label: 'Social engagement' },
      { value: '50k', label: 'New followers' },
    ],
    testimonial: {
      quote:
        "WeTrends didn't just give us a new look. They figured out who we actually are and put it into words and visuals we never could have got to ourselves. Our customers notice the difference.",
      author: 'James Osei',
      role: 'Owner, Savana Lounge',
    },
    accent: false,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((s) => s.slug);
}
