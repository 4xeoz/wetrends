export interface CaseStudyResult {
  value: string;
  label: string;
  /**
   * The three fields that turn a number into evidence. A figure with no
   * starting point, no window and no source reads as decoration — all optional
   * so a study can ship without them, but fill them where the data exists.
   */
  /** Where it started, e.g. "from 14/mo". Omit for launches with no "before". */
  baseline?: string;
  /** Period measured over, e.g. "first 3 months". */
  window?: string;
  /** Who can vouch for it, e.g. "Client booking system" or "Google Business Profile". */
  source?: string;
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
  deliverables: string[];
  /** At-a-glance facts for the overview panel, e.g. "62 covers", "Opened 2026". */
  snapshot?: string[];
  description: string;
  challenge: string;
  approach: { step: string; title: string; description: string }[];
  results: CaseStudyResult[];
  /**
   * What else moved the needle over the same period. Naming the other variables
   * is counter-intuitive but it is the strongest credibility signal on the page:
   * every reader already knows one change never causes all the growth.
   */
  attribution?: string;
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
    year: '2026',
    tagline: 'A website that gives parents confidence before they even visit',
    metric: '+180%',
    metricLabel: 'Increase in enquiries',
    accentColor: '#1E3A8A',
    image: '/images/nopeca-mockup.png',
    deliverables: ['UX Strategy', 'Web Design', 'Next.js Build', 'SEO'],
    snapshot: [
      'Educational consultancy working with families across London',
      'Existing site was slow, hard to navigate, and ranking on page three for its own core terms',
      'Rebuilt from scratch on Next.js, mobile-first',
    ],
    description:
      'Nopeca had a genuinely strong approach to education and a website that actively undersold it. We rebuilt the whole digital presence around a single job: making a parent feel confident enough to pick up the phone.',
    challenge:
      "Nopeca was, by any fair measure, the best educational consultancy in their area. The problem was that no parent could tell. Their site was slow, the navigation buried the things people actually came looking for, and it sat on page three of Google for the terms their own families were searching. Meanwhile the school down the road was fully booked on the back of a website that was nowhere near as good — because it turned up first and it was easy to use. Choosing a school is one of the highest-stakes decisions a parent makes, and it is made almost entirely on trust. A site that loads slowly and looks a decade old does not read as a minor aesthetic issue. It reads as a warning sign.",
    approach: [
      {
        step: '01',
        title: 'Deep Discovery',
        description:
          'We talked to parents, teachers and students, then mapped the full journey from "I need a school" to "enrolment confirmed". What we were looking for was every point where someone lost faith and closed the tab — because those moments, not the homepage, are where enquiries are actually won and lost.',
      },
      {
        step: '02',
        title: 'Conversion Design',
        description:
          'Clear messaging, navigation that leads rather than lists, and trust signals placed where doubt actually surfaces. We set one rule and held to it across every template: if an element does not build a parent\'s confidence, it does not go on the page.',
      },
      {
        step: '03',
        title: 'Speed First Build',
        description:
          'Rebuilt on Next.js, mobile-first, to a 97 PageSpeed score. Not a vanity metric: parents research schools on a phone at 11pm once the kids are finally asleep, usually on a patchy connection, and a site that stalls at that moment has already lost them.',
      },
      {
        step: '04',
        title: 'Launch & Optimise',
        description:
          'We A/B tested headlines and rebuilt the enquiry form. The winning version asked for less information upfront and made the buttons impossible to miss — obvious in hindsight, which is usually the sign that the test was worth running rather than argued about.',
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
    year: '2026',
    tagline: 'The location nobody walks past — so we built a front door online',
    metric: '+320%',
    metricLabel: 'Boost in direct bookings',
    accentColor: '#B4531F',
    image: '/images/savana-mockup.png',
    deliverables: ['Brand Strategy', 'Visual Identity', 'Art Direction', 'Web Design'],
    description:
      'A brand-new independent restaurant and cocktail lounge in Guildford, opening with no trading history, no customer list and no brand — in a site with almost no passing trade. We built the entire digital presence from a blank page.',
    challenge:
      'Most restaurants open with something to build on: a location that markets itself, or a name people already know. Savana Lounge had neither. The site sat off the footfall routes people actually walk to eat, which removes the single biggest source of new customers a restaurant gets for free. And it was starting from absolute zero — no logo, no photography, no website, no Google listing, no reviews. To anyone searching for somewhere to eat in Guildford, Savana did not exist. When footfall cannot find you, every customer has to arrive deliberately, and the brand has to do the work the location will not.',
    approach: [
      {
        step: '01',
        title: 'Position Around The Location',
        description:
          'A venue people will not stumble into needs a reason to be sought out. So we positioned Savana as a destination rather than a convenience — somewhere you decide to go, not somewhere you happen to pass.',
      },
      {
        step: '02',
        title: 'An Identity From Nothing',
        description:
          'Name treatment, palette, typography, menu design, signage and photography direction — the complete visual system, built from a blank page. With no reputation yet, the identity is the only credibility signal a first-time customer has.',
      },
      {
        step: '03',
        title: 'The Internet As The Front Door',
        description:
          'Website, booking flow, Google Business Profile and social presence, set up so a search for the venue — or for somewhere to eat in Guildford — lands on something that looks established. This is the substitute for footfall.',
      },
      {
        step: '04',
        title: 'Open As A Finished Business',
        description:
          'Everything live for opening, so Savana launched looking like a business that had been there for years rather than one still working itself out.',
      },
    ],
    results: [
      { value: '+320%', label: 'Direct bookings' },
      { value: '65%', label: 'Returning customers' },
      { value: '3×', label: 'Social engagement' },
      { value: '2k', label: 'New followers', baseline: 'from zero' },
    ],
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
    metric: 'No.1',
    metricLabel: 'Language school in the region',
    accentColor: '#E64A2E',
    image: '/images/voxbridge-brand.png',
    deliverables: ['Brand Identity', 'Marketing Strategy', 'Custom Operating System', 'Launch'],
    snapshot: [
      'International language school, launched from pre-revenue',
      'Arrived with a vision and nothing else — no brand, no go-to-market, no operational system',
      'We built all three, then launched them',
    ],
    description:
      'Voxbridge came to us before they had anything: no name in the market, no way to reach students, no way to run a school day. We built the brand, the go-to-market strategy and a bespoke operating system to run the business — then launched all three together.',
    challenge:
      'Voxbridge arrived pre-launch with a vision and very little else: become the leading international language school in their region. There was no brand to trade on, no route to market, and no system for running the day-to-day work of a school — enrolments, timetabling, tracking how students were progressing, taking payments. Every one of those had to be built from zero. The harder part was the timing. A school cannot soft-launch its operations; the first family who enrols expects the same competence as the hundredth. Everything had to be finished, coherent and working on the morning the doors opened — and it had to make a brand-new school feel like the established choice in a market that already had incumbents.',
    approach: [
      {
        step: '01',
        title: 'Brand From Zero',
        description:
          'Name, voice, and a full visual system built from a blank page. The brief we set ourselves was specific: a brand-new school has no reputation to lean on, so the identity has to carry all of the credibility on its own — confident enough that a parent assumes Voxbridge has been the established option for years.',
      },
      {
        step: '02',
        title: 'Go-To-Market Strategy',
        description:
          'A launch marketing strategy built to win the region quickly rather than grow into it — positioning against the incumbents, the channels where students and parents were already deciding, and messaging aimed at one outcome: becoming the obvious first choice rather than an alternative worth considering.',
      },
      {
        step: '03',
        title: 'Custom Operating System',
        description:
          'We designed and built a bespoke platform to run the school end to end: enrolments, scheduling, student progress and payments in one place. The alternative — four subscriptions stitched together, none of which quite fit how a language school actually works — is what most new schools inherit, and it quietly taxes every hour of admin from then on.',
      },
      {
        step: '04',
        title: 'Launch & Lead',
        description:
          'We launched them into the market and kept optimising after opening. Within four months Voxbridge was the top-ranked school in its region, running on a platform built for it rather than borrowed from someone else — and had recovered half the startup investment.',
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
    year: '2026',
    tagline: 'Care that grows with you.',
    metric: '15k+',
    metricLabel: 'Patients cared for',
    accentColor: '#3E7C5B',
    image: '/images/hayat-brand.png',
    deliverables: ['Brand Identity', 'Marketing', 'Launch Campaign', 'Custom AI Operating System'],
    snapshot: [
      'Medical clinic in the United Arab Emirates, launched as a new practice',
      'Needed enterprise-grade operations without enterprise headcount',
      'Brand, launch campaign and a custom AI operating system, built together',
    ],
    description:
      'A complete brand identity, marketing programme and launch campaign for a modern medical clinic — running on a custom AI operating system we built to handle the practice end to end, from bookings through to patient records and follow-up.',
    challenge:
      'Hayat Clinic had to do two hard things at the same time. It needed to open as a practice patients already trusted, in a market where trust is the entire basis of the decision and a new name has none of it. And it needed to carry the operational load of a much larger organisation from day one — appointments, records, patient communication — without the staff a larger organisation would have. That is the squeeze every growing clinic sits in: enterprise systems cost more than a new practice can justify, but the work still has to be done to an enterprise standard, because the alternative is administrative errors in a setting where those matter enormously. Hiring around the problem was not an option. The operations had to be built.',
    approach: [
      {
        step: '01',
        title: 'A Brand Around Meaning',
        description:
          'We built the identity around what the name already carried — "Hayat" means life. That gave us a warmer register than the clinical blue-and-white default most practices reach for, and a reason for every touchpoint to feel like care rather than administration. A patient should feel looked after before they have walked through the door.',
      },
      {
        step: '02',
        title: 'Marketing & Launch',
        description:
          'A full marketing strategy and launch campaign designed to make a brand-new practice a recognised local name from opening rather than over its first year. In healthcare the first months set the referral pattern, and a clinic that opens quietly tends to stay quiet.',
      },
      {
        step: '03',
        title: 'Custom AI Operating System',
        description:
          'We designed and engineered an AI-powered platform around how this clinic actually works, not how software vendors assume clinics work: appointment management, patient records, and automated patient communication in one system. Built specifically so that the routine, repetitive load — the reminders, the scheduling, the chasing — stops consuming clinical time.',
      },
      {
        step: '04',
        title: 'The Operational Backbone',
        description:
          'What Hayat ended up with is a growing practice that runs like a much larger one: the same operational reach, without the headcount, the overhead, or the enterprise price tag that would normally come with it.',
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
    year: '2026',
    tagline: 'Healthcare, on autopilot.',
    metric: '-42%',
    metricLabel: 'Admin time per patient',
    accentColor: '#12B886',
    image: '/images/ordonnox-brand.png',
    deliverables: ['Brand Identity', 'Custom Software', 'Product Design', 'AI Platform'],
    snapshot: [
      'AI healthcare SaaS, taken from idea to shipped product',
      'No brand and no product existed when we started',
      'We designed and engineered both, end to end',
    ],
    description:
      'Brand identity and custom software, both built from scratch, for an AI-powered healthcare platform that takes the administrative weight off clinicians. Ordonnox existed as an idea when we started and as a working product when we finished.',
    challenge:
      'Ordonnox began as a proposition rather than a company: an AI platform that would take the administrative load off healthcare providers. There was no brand, no product, and no evidence — just a clear view of a real problem. Both halves of that were hard for the same reason. Healthcare software is bought by people who are professionally sceptical, and rightly so; anything touching clinical work has to look and behave like it can be trusted before anyone will trial it, let alone rely on it. So the brand could not simply look modern, and the product could not simply demo well. Both had to hold up to scrutiny from clinicians on day one, and they had to say the same thing as each other.',
    approach: [
      {
        step: '01',
        title: 'Identity From Scratch',
        description:
          'We designed the brand from zero to signal what the product actually does — intelligent, precise, in motion. The bar for healthcare software is that it reads as trustworthy at a glance, before anyone has seen a feature, because a clinician deciding whether to trial something gives it about that long.',
      },
      {
        step: '02',
        title: 'From Idea To Product',
        description:
          'We took Ordonnox from a concept to a defined product: what it needed to do, what it deliberately would not do, and how the experience should sit inside real clinical workflows rather than alongside them. Software that asks a clinician to change how they work does not get adopted, however good it is.',
      },
      {
        step: '03',
        title: 'Custom Software, End-To-End',
        description:
          'We engineered the platform ourselves — an AI system that absorbs the administrative load: records, suggestions and patient analytics. Built for reliability from the first line of code, because in this context an unreliable feature is worse than a missing one.',
      },
      {
        step: '04',
        title: 'Launch-Ready',
        description:
          'We delivered something ready for its first real users from day one: brand and software shipped as one coherent whole, not a prototype held together with tape and a pitch deck explaining what it would eventually become.',
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
