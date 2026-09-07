export interface CaseStudyResult {
  value: string;
  label: string;
  /**
   * The three fields that turn a number into evidence. A figure with no
   * starting point, no window and no source reads as decoration. A case study
   * can ship without results, but any result shown must carry a measurement
   * window and a traceable source.
   */
  /** Where it started, e.g. "from 14/mo". Omit for launches with no "before". */
  baseline?: string;
  /** Period measured over, e.g. "first 3 months". */
  window: string;
  /** Who can vouch for it, e.g. "Client booking system" or "Google Business Profile". */
  source: string;
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
  /** Optional headline result. It may only be shown with the evidence below. */
  metric?: string;
  metricLabel?: string;
  metricEvidence?: {
    baseline?: string;
    window: string;
    source: string;
  };
  /** Hex accent that stays legible on white and pops on near-black. */
  accentColor: string;
  /** Optional hero mockup living in /public/images. */
  image?: string;
  deliverables: string[];
  /** At-a-glance facts for the overview panel, e.g. "62 covers", "Opened 2026". */
  snapshot?: string[];
  description: string;
  challenge: string;
  approach: { step: string; title: string; description: string }[];
  /** Verified outcomes only. Use an empty array when measurement is unavailable. */
  results: CaseStudyResult[];
  /**
   * What else moved the needle over the same period. Naming the other variables
   * is counter-intuitive but it is the strongest credibility signal on the page:
   * every reader already knows one change never causes all the growth.
   */
  attribution?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    /** Internal reference to the client's approval record; not rendered publicly. */
    approvalReference: string;
  };
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
    year: '2026',
    tagline: 'A website that gives parents confidence before they even visit',
    accentColor: '#1E3A8A',
    image: '/images/nopeca-mockup.png',
    deliverables: ['UX Strategy', 'Web Design', 'Next.js Build', 'SEO'],
    snapshot: [
      'Education-sector website and UX engagement',
      'Scope included information architecture, responsive design and implementation',
      'Built with Next.js and a mobile-first layout',
    ],
    description:
      'WeTrends redesigned and built Nopeca\'s digital presence around a clear objective: help parents understand the offer, find relevant information and take the next step with confidence.',
    challenge:
      'Education decisions carry a high trust burden. The project therefore needed to make important information easy to find, present the organisation consistently and give families a clear route from initial research to enquiry without relying on unsupported marketing claims.',
    approach: [
      {
        step: '01',
        title: 'Content Discovery',
        description:
          'We reviewed the existing content and mapped the intended journey from initial research to enquiry, identifying the questions each page needed to answer.',
      },
      {
        step: '02',
        title: 'Journey Design',
        description:
          'We designed clearer messaging, navigation and calls to action so that evidence and next steps appear where a visitor is likely to need them.',
      },
      {
        step: '03',
        title: 'Performance-Aware Build',
        description:
          'The responsive Next.js implementation prioritised legibility, maintainability and efficient page delivery across mobile and desktop devices.',
      },
      {
        step: '04',
        title: 'Launch & QA',
        description:
          'We reviewed the primary page templates and enquiry path across common screen sizes before preparing the site for launch.',
      },
    ],
    results: [],
  },
  {
    slug: 'savana-lounge',
    number: '02',
    client: 'Savana Lounge',
    industry: 'Hospitality',
    service: 'Brand Identity',
    serviceSlug: 'brand-identity',
    location: 'Surrey, UK',
    year: '2026',
    tagline: 'The location nobody walks past — so we built a front door online',
    accentColor: '#B4531F',
    image: '/images/savana-mockup.png',
    deliverables: ['Brand Strategy', 'Visual Identity', 'Art Direction', 'Web Design'],
    snapshot: [
      'Launch identity for an independent restaurant and cocktail lounge',
      'Scope included brand strategy, visual identity, art direction and web design',
      'Digital touchpoints designed to support venue discovery and booking',
    ],
    description:
      'WeTrends developed a launch identity and digital presence for Savana Lounge, an independent restaurant and cocktail lounge in Guildford.',
    challenge:
      'A new hospitality brand needs to communicate its atmosphere, offer and practical details before a guest visits. The work focused on creating a coherent set of brand and digital touchpoints that could support discovery and booking.',
    approach: [
      {
        step: '01',
        title: 'Position the Experience',
        description:
          'We defined a position around the intended venue experience and the reasons a guest might choose it for a planned visit.',
      },
      {
        step: '02',
        title: 'An Identity From Nothing',
        description:
          'The visual system covered name treatment, palette, typography, menu design, signage and photography direction.',
      },
      {
        step: '03',
        title: 'Digital Front Door',
        description:
          'The website and booking journey were designed to make the venue, offer, location and next step easy to understand online.',
      },
      {
        step: '04',
        title: 'Launch System',
        description:
          'We prepared the core visual and digital assets as a consistent launch system for use across the venue\'s owned channels.',
      },
    ],
    results: [],
  },
  {
    slug: 'voxbridge',
    number: '03',
    client: 'Voxbridge',
    industry: 'Language School',
    service: 'Brand & Custom Operating System',
    serviceSlug: 'web-design',
    location: 'United Kingdom',
    year: '2026',
    tagline: 'Speak the world.',
    accentColor: '#E64A2E',
    image: '/images/voxbridge-brand.png',
    deliverables: ['Brand Identity', 'Marketing Strategy', 'Custom Operating System', 'Launch'],
    snapshot: [
      'Brand and digital product engagement for an international language school',
      'Scope covered identity, launch planning and operational workflows',
      'A single system was designed around enrolment, scheduling and administration',
    ],
    description:
      'The Voxbridge engagement combined brand identity, launch planning and the design of a bespoke operating system for core school workflows.',
    challenge:
      'The brief needed the public-facing brand and internal operating model to feel coherent. Work therefore covered both how the school would present itself and how enrolment, scheduling, progress and payment workflows could fit together.',
    approach: [
      {
        step: '01',
        title: 'Brand From Zero',
        description:
          'We developed the name, voice and visual system around a clear, accessible international education proposition.',
      },
      {
        step: '02',
        title: 'Go-To-Market Strategy',
        description:
          'The launch plan defined priority audiences, channel roles and the messages needed at each stage of the decision journey.',
      },
      {
        step: '03',
        title: 'Custom Operating System',
        description:
          'The product scope brought enrolment, scheduling, student progress and payment workflows into one tailored interface.',
      },
      {
        step: '04',
        title: 'Launch Preparation',
        description:
          'Brand, campaign assets and operating workflows were prepared as one coordinated launch package.',
      },
    ],
    results: [],
  },
  {
    slug: 'hayat-clinic',
    number: '04',
    client: 'Hayat Clinic',
    industry: 'Healthcare',
    service: 'Brand & Custom AI Operating System',
    serviceSlug: 'web-design',
    location: 'United Arab Emirates',
    year: '2026',
    tagline: 'Care that grows with you.',
    accentColor: '#3E7C5B',
    image: '/images/hayat-brand.png',
    deliverables: ['Brand Identity', 'Marketing', 'Launch Campaign', 'Custom AI Operating System'],
    snapshot: [
      'Healthcare brand and operational product engagement',
      'Scope included identity, launch communications and workflow design',
      'Brand and digital operations were designed as a connected system',
    ],
    description:
      'The Hayat Clinic engagement combined brand identity, launch communications and the design of a tailored operational platform.',
    challenge:
      'Healthcare communication has to balance clarity, warmth and operational precision. The project joined those requirements so that public-facing materials and internal workflows used a consistent model.',
    approach: [
      {
        step: '01',
        title: 'A Brand Around Meaning',
        description:
          'The identity was developed around the meaning carried by the name Hayat, using a warm visual register across the core touchpoints.',
      },
      {
        step: '02',
        title: 'Marketing & Launch',
        description:
          'The launch work defined audience priorities, messages and a practical set of campaign assets for the clinic\'s owned channels.',
      },
      {
        step: '03',
        title: 'Custom AI Operating System',
        description:
          'The platform design brought appointment and communication workflows into a tailored interface, with automation considered for repetitive administrative steps.',
      },
      {
        step: '04',
        title: 'Connected Delivery',
        description:
          'Brand, launch communications and operational workflows were designed as connected parts of the same service experience.',
      },
    ],
    results: [],
  },
  {
    slug: 'ordonnox',
    number: '05',
    client: 'Ordonnox',
    industry: 'Healthcare AI',
    service: 'Brand & Custom Software Development',
    serviceSlug: 'web-design',
    location: 'Remote',
    year: '2026',
    tagline: 'Healthcare, on autopilot.',
    accentColor: '#12B886',
    image: '/images/ordonnox-brand.png',
    deliverables: ['Brand Identity', 'Custom Software', 'Product Design', 'AI Platform'],
    snapshot: [
      'Brand and product engagement for a healthcare AI proposition',
      'Scope covered identity, product definition and interface design',
      'Custom software workflows were designed around clinical administration',
    ],
    description:
      'The Ordonnox engagement combined brand identity and custom product design for an AI-assisted healthcare administration platform.',
    challenge:
      'Healthcare software must communicate its purpose clearly and support careful evaluation. The brand and product therefore needed to use consistent language, interaction patterns and trust signals without overstating what automation can do.',
    approach: [
      {
        step: '01',
        title: 'Identity From Scratch',
        description:
          'We developed an identity system intended to communicate precision, movement and a healthcare context across product and marketing surfaces.',
      },
      {
        step: '02',
        title: 'From Idea To Product',
        description:
          'The product-definition work clarified the intended workflows, boundaries and role of automation within the broader clinical administration process.',
      },
      {
        step: '03',
        title: 'Custom Software, End-To-End',
        description:
          'The custom interface work covered administrative records, assisted suggestions and analytics views, with reliability treated as a core design requirement.',
      },
      {
        step: '04',
        title: 'Coherent System',
        description:
          'The identity and product experience were designed together so that the proposition remained consistent from marketing page to application interface.',
      },
    ],
    results: [],
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
