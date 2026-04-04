export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fullBio: string;
  linkedin: string;
  twitter: string;
  email: string;
  skills: string[];
  achievements: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'eddy',
    name: 'Eddy',
    role: 'Founder & Creative Director',
    image: '/images/eddy.png',
    bio: 'Visionary leader with a passion for storytelling and brand building. 10+ years in creative industry.',
    fullBio: `Eddy is the visionary founder and creative director of WeTrends. With over a decade of experience in the creative industry, Eddy has helped hundreds of brands find their unique voice and connect with their audiences through compelling storytelling.

Before founding WeTrends, Eddy worked with major agencies across London and New York, developing campaigns for Fortune 500 companies. His approach combines data-driven insights with creative excellence, ensuring every project delivers measurable results.

When not leading the creative team, Eddy mentors young creatives and speaks at industry conferences about the future of digital marketing and brand storytelling.`,
    linkedin: 'https://linkedin.com/in/eddy',
    twitter: 'https://twitter.com/eddy',
    email: 'eddy@wetrends.co.uk',
    skills: ['Brand Strategy', 'Creative Direction', 'Video Production', 'Team Leadership', 'Client Relations'],
    achievements: [
      'Founded WeTrends in 2019',
      'Led campaigns generating £10M+ in client revenue',
      'Featured in Creative Review Top 100',
      'Speaker at D&AD Festival 2023'
    ]
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Head of Strategy',
    image: '/images/sarah.png',
    bio: 'Data-driven strategist who turns insights into impactful campaigns that deliver ROI.',
    fullBio: `Sarah leads the strategy team at WeTrends, bringing a wealth of experience in data analytics and market research. With an MBA from LSE and 8 years in digital marketing, Sarah ensures every campaign is backed by solid research and clear objectives.

Her expertise lies in transforming complex data into actionable insights that drive creative decisions. Sarah has pioneered several proprietary research methodologies that have become industry standards for understanding Gen Z and Millennial consumers.

Sarah is passionate about sustainable marketing practices and regularly advises clients on ethical brand positioning.`,
    linkedin: 'https://linkedin.com/in/sarah',
    twitter: 'https://twitter.com/sarah',
    email: 'sarah@wetrends.co.uk',
    skills: ['Market Research', 'Data Analytics', 'Brand Positioning', 'Consumer Insights', 'Campaign Planning'],
    achievements: [
      'MBA from London School of Economics',
      'Former Strategy Director at Ogilvy',
      'Published author on consumer behavior',
      'Won 5 industry strategy awards'
    ]
  },
  {
    id: 'zack',
    name: 'Zack',
    role: 'Lead Designer',
    image: '/images/zack.png',
    bio: 'Award-winning designer crafting visual experiences that captivate and convert.',
    fullBio: `Zack is the creative force behind WeTrends' visual identity work. An award-winning designer with a background in both traditional graphic design and digital experiences, Zack brings a unique perspective to every project.

His design philosophy centers on the belief that great design should be both beautiful and functional. Zack has created visual systems for brands ranging from tech startups to established luxury retailers, always finding the perfect balance between innovation and brand heritage.

Zack studied at Central Saint Martins and has previously worked at Pentagram and Moving Brands. His work has been featured in Design Week, Creative Review, and Communication Arts.`,
    linkedin: 'https://linkedin.com/in/zack',
    twitter: 'https://twitter.com/zack',
    email: 'zack@wetrends.co.uk',
    skills: ['Visual Identity', 'UI/UX Design', 'Motion Graphics', 'Brand Guidelines', 'Art Direction'],
    achievements: [
      'D&AD Pencil Winner 2022',
      'Central Saint Martins Graduate',
      'Former designer at Pentagram',
      'Featured in Communication Arts'
    ]
  },
  {
    id: 'meryem',
    name: 'Meryem',
    role: 'Creative Producer',
    image: '/images/meryem.png',
    bio: 'Creative producer who bridges strategy and execution, ensuring every project ships on time and above expectations.',
    fullBio: `Meryem is WeTrends' Creative Producer, the engine behind how ideas become reality. With a background in creative project management and brand consultancy, she keeps every production running smoothly from brief to delivery.

Her strength lies in translating ambitious creative visions into tight, executable plans without ever sacrificing quality. Clients consistently cite her communication and organisation as transformative for their experience working with the agency.

Meryem is passionate about building processes that empower creatives to do their best work — and about building brands that genuinely connect with people.`,
    linkedin: 'https://linkedin.com/in/meryem',
    twitter: 'https://twitter.com/meryem',
    email: 'meryem@wetrends.co.uk',
    skills: ['Project Management', 'Creative Production', 'Client Relations', 'Brand Strategy', 'Workflow Design'],
    achievements: [
      'Managed 80+ brand projects end-to-end',
      'Reduced average project delivery time by 30%',
      'Built WeTrends production workflow from scratch',
      'Certified Project Management Professional (PMP)'
    ]
  },
  {
    id: 'ash',
    name: 'Ash',
    role: 'Video Production Lead',
    image: '/images/ash.png',
    bio: 'Video wizard bringing stories to life through cinematic visuals and motion.',
    fullBio: `Ash leads the video production team at WeTrends, bringing stories to life through cinematic visuals and innovative motion design. With a background in film production and 7 years creating content for brands, Ash knows how to craft videos that capture attention and drive engagement.

Ash's work spans commercial spots, social content, documentary-style brand films, and animated explainers. They're equally comfortable on set directing talent or in the edit suite perfecting the final cut. Their ability to understand a brand's essence and translate it into moving image is unmatched.

Before joining WeTrends, Ash worked as a freelance director and editor for BBC, Channel 4, and numerous production companies. They hold a degree in Film Production from the London Film School.`,
    linkedin: 'https://linkedin.com/in/ash',
    twitter: 'https://twitter.com/ash',
    email: 'ash@wetrends.co.uk',
    skills: ['Video Direction', 'Cinematography', 'Motion Graphics', 'Video Editing', 'Color Grading'],
    achievements: [
      'London Film School Graduate',
      'Directed 100+ brand videos',
      'Worked with BBC and Channel 4',
      'Vimeo Staff Pick recipient'
    ]
  },
  {
    id: 'rebecca',
    name: 'Rebecca',
    role: 'Content Strategist',
    image: '/images/rebecca.png',
    bio: 'Word-obsessed strategist turning brand stories into scroll-stopping content.',
    fullBio: `Rebecca shapes the voice behind every campaign that leaves WeTrends. With a background in journalism and digital publishing, she knows how to hook readers in three seconds and keep them clicking until the end.

From SEO blogs to viral social captions, Rebecca crafts narratives that feel human and perform like machines. She leads the content department with a sharp eye for tone and a relentless focus on metrics that matter.

Rebecca has written for major UK lifestyle publications and brings that editorial rigour to every brand she touches.`,
    linkedin: 'https://linkedin.com/in/rebecca',
    twitter: 'https://twitter.com/rebecca',
    email: 'rebecca@wetrends.co.uk',
    skills: ['Copywriting', 'SEO Strategy', 'Editorial Direction', 'Social Copy', 'Brand Voice'],
    achievements: [
      'Former Editor at Sunday Times Style',
      'Grew client blog traffic by 400%',
      'Published novelist',
      'Speaker at Content Marketing World'
    ]
  },
  {
    id: 'jullia',
    name: 'Jullia',
    role: 'Account Director',
    image: '/images/Jullia.png',
    bio: 'The bridge between ambitious clients and flawless delivery.',
    fullBio: `Jullia ensures every WeTrends client feels like our only client. With 10 years in agency account management, she has a gift for translating complex creative processes into clear timelines, budgets, and results.

She leads the client services team with a philosophy built on transparency and partnership. Jullia's proactive approach means problems are solved before clients even know they exist.

Before joining WeTrends, she managed accounts at Droga5 and Wieden+Kennedy, working with global brands across fashion, tech, and FMCG sectors.`,
    linkedin: 'https://linkedin.com/in/jullia',
    twitter: 'https://twitter.com/jullia',
    email: 'jullia@wetrends.co.uk',
    skills: ['Account Management', 'Client Strategy', 'Negotiation', 'Project Leadership', 'CRM'],
    achievements: [
      'Managed £5M+ annual client portfolios',
      'Former Account Director at Droga5',
      'Client retention rate of 98%',
      'Mentor at IPA Foundation'
    ]
  }
];

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}

export function getAllTeamMembers(): TeamMember[] {
  return teamMembers;
}
