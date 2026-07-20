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
  year: string;
  tagline: string;
  /** Headline result, e.g. "+180%" */
  metric: string;
  metricLabel: string;
  /** Hex accent that stays legible on white and pops on near-black. */
  accentColor: string;
  /** Optional hero mockup living in /public/images. */
  image?: string;
  /** Domain shown in the browser-frame poster. Falls back to "{slug}.co.uk". */
  domain?: string;
  deliverables: string[];
  description: string;
  challenge: string;
  approach: { step: string; title: string; description: string }[];
  results: CaseStudyResult[];
  testimonial?: { quote: string; author: string; role: string };
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
    year: '2024',
    tagline: 'A website that gives parents confidence before they even visit',
    metric: '+180%',
    metricLabel: 'Increase in enquiries',
    accentColor: '#1E3A8A',
    image: '/images/nopeca-mockup.webp',
    deliverables: ['UX Strategy', 'Web Design', 'Next.js Build', 'SEO'],
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
  },
  {
    slug: 'savana-lounge',
    number: '02',
    client: 'Savana Lounge',
    industry: 'Hospitality',
    service: 'Brand Identity',
    serviceSlug: 'brand-identity',
    location: 'Surrey, UK',
    year: '2024',
    tagline: 'A brand that makes people choose Savana before they check the menu',
    metric: '+320%',
    metricLabel: 'Boost in direct bookings',
    accentColor: '#B4531F',
    image: '/images/savana-mockup.png',
    deliverables: ['Brand Strategy', 'Visual Identity', 'Art Direction', 'Web Design'],
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
  },
  {
    slug: 'voxbridge',
    number: '03',
    client: 'Voxbridge',
    industry: 'Language School',
    service: 'Brand & Custom Operating System',
    serviceSlug: 'web-design',
    location: 'United Kingdom',
    year: '2025',
    tagline: 'Speak the world.',
    metric: 'No.1',
    metricLabel: 'Language school in the region',
    accentColor: '#E64A2E',
    image: '/images/voxbridge-brand.png',
    domain: 'voxbridge.com',
    deliverables: ['Brand Identity', 'Marketing Strategy', 'Custom Operating System', 'Launch'],
    description:
      "Full brand identity, launch marketing strategy, and a custom-built school operating system for an international language school — taking them from launch to the #1 ranked school in their region, with 50% of their initial investment recovered within the first four months.",
    challenge:
      "Voxbridge came to us pre-launch with nothing but a vision: become the leading international language school in their region. No brand, no go-to-market, no way to run the day-to-day. Everything had to be built from zero — and it had to work from the moment the doors opened.",
    approach: [
      {
        step: '01',
        title: 'Brand From Zero',
        description:
          'We built the entire identity from the ground up — name, voice, and a visual system confident enough to make a brand-new school feel like the established leader.',
      },
      {
        step: '02',
        title: 'Go-To-Market Strategy',
        description:
          'A full launch marketing strategy engineered to win the region fast — positioning, channels, and messaging aimed squarely at becoming the obvious first choice.',
      },
      {
        step: '03',
        title: 'Custom Operating System',
        description:
          'We designed and built a bespoke platform to run the school: enrolments, scheduling, student progress, and payments in one place — no patchwork of off-the-shelf tools.',
      },
      {
        step: '04',
        title: 'Launch & Lead',
        description:
          "We launched them into the market and kept optimising. Within four months they were the top-rated school in their region — running leaner than any competitor.",
      },
    ],
    results: [
      { value: 'No.1', label: 'Ranked school in the region' },
      { value: '50%', label: 'Startup investment recovered' },
      { value: '4 mo', label: 'To recover that investment' },
      { value: '1', label: 'Platform runs the whole school' },
    ],
  },
  {
    slug: 'hayat-clinic',
    number: '04',
    client: 'Hayat Clinic',
    industry: 'Healthcare',
    service: 'Brand & Custom AI Operating System',
    serviceSlug: 'web-design',
    location: 'United Arab Emirates',
    year: '2025',
    tagline: 'Care that grows with you.',
    metric: '15k+',
    metricLabel: 'Patients cared for',
    accentColor: '#3E7C5B',
    image: '/images/hayat-brand.png',
    domain: 'hayatclinic.com',
    deliverables: ['Brand Identity', 'Marketing', 'Launch Campaign', 'Custom AI Operating System'],
    description:
      "Complete brand identity, marketing, and launch campaign for a modern medical clinic — powered by a custom AI-driven operating system we built to run their entire practice.",
    challenge:
      "Hayat Clinic needed to launch as a trusted, modern practice and stand out from day one — while running the operational load of a much larger organisation. A growing clinic can't afford the overhead of enterprise systems, but it still needs enterprise-grade operations to deliver real care.",
    approach: [
      {
        step: '01',
        title: 'A Brand Around Meaning',
        description:
          'We built a warm, trustworthy identity around the meaning of "Hayat" — life. Every touchpoint designed to make patients feel cared for before they walk in.',
      },
      {
        step: '02',
        title: 'Marketing & Launch',
        description:
          'A complete marketing strategy and launch campaign that put the clinic on the map from day one — turning a new practice into a recognised local name.',
      },
      {
        step: '03',
        title: 'Custom AI Operating System',
        description:
          'We designed and engineered a custom AI-powered platform built around how the clinic actually works: appointment management, patient records, and automated patient communication.',
      },
      {
        step: '04',
        title: 'The Operational Backbone',
        description:
          'The result is a growing practice with the operational muscle of a much larger organisation — without the headcount, the overhead, or the enterprise price tag.',
      },
    ],
    results: [
      { value: '15k+', label: 'Patients cared for' },
      { value: 'AI', label: 'Runs the whole practice' },
      { value: '3-in-1', label: 'Bookings · records · comms' },
      { value: 'Day 1', label: 'On the map at launch' },
    ],
  },
  {
    slug: 'ordonnox',
    number: '05',
    client: 'Ordonnox',
    industry: 'Healthcare AI',
    service: 'Brand & Custom Software Development',
    serviceSlug: 'web-design',
    location: 'Remote',
    year: '2025',
    tagline: 'Healthcare, on autopilot.',
    metric: '-42%',
    metricLabel: 'Admin time per patient',
    accentColor: '#12B886',
    image: '/images/ordonnox-brand.png',
    domain: 'ordonnox.ai',
    deliverables: ['Brand Identity', 'Custom Software', 'Product Design', 'AI Platform'],
    description:
      "Brand identity and custom software, built from scratch, for an AI-powered healthcare SaaS platform that takes the administrative weight off clinicians.",
    challenge:
      "Ordonnox started as an idea — an AI platform to take the administrative weight off healthcare providers. There was no brand and no product: just a vision that needed to become something real, credible, and ready for its first users.",
    approach: [
      {
        step: '01',
        title: 'Identity From Scratch',
        description:
          'We designed the brand from zero to signal exactly what the product does — intelligent, precise, and in motion. An identity that reads as trustworthy healthcare software at a glance.',
      },
      {
        step: '02',
        title: 'From Idea To Product',
        description:
          'We took Ordonnox from a concept to a working product — defining what it needed to be and shaping the experience around real clinical workflows.',
      },
      {
        step: '03',
        title: 'Custom Software, End-To-End',
        description:
          'We engineered the platform ourselves: an AI system that automates the administrative load — records, suggestions, and patient analytics — built for reliability from the first line of code.',
      },
      {
        step: '04',
        title: 'Launch-Ready',
        description:
          'We delivered a product ready for its first users from day one — brand and software shipped as one coherent whole, not a prototype held together with tape.',
      },
    ],
    results: [
      { value: '-42%', label: 'Admin time per patient' },
      { value: '0→1', label: 'Idea to shipped product' },
      { value: 'AI', label: 'Clinician assistant, built in' },
      { value: '100%', label: 'Custom-built software' },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((s) => s.slug);
}

/** The next study in the series, wrapping around — powers the "keep reading" flow. */
export function getNextCaseStudy(slug: string): CaseStudy {
  const index = caseStudies.findIndex((s) => s.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
}
