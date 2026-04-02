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
    id: 'eyad-cherifi',
    name: 'Eyad Cherifi',
    role: 'Founder & Creative Director',
    image: '/images/eyad_cherifi.webp',
    bio: 'Visionary leader with a passion for storytelling and brand building. 10+ years in creative industry.',
    fullBio: `Eyad Cherifi is the visionary founder and creative director of WeTrends. With over a decade of experience in the creative industry, Eyad has helped hundreds of brands find their unique voice and connect with their audiences through compelling storytelling.

Before founding WeTrends, Eyad worked with major agencies across London and New York, developing campaigns for Fortune 500 companies. His approach combines data-driven insights with creative excellence, ensuring every project delivers measurable results.

When not leading the creative team, Eyad mentors young creatives and speaks at industry conferences about the future of digital marketing and brand storytelling.`,
    linkedin: 'https://linkedin.com/in/eyadcherifi',
    twitter: 'https://twitter.com/eyadcherifi',
    email: 'eyad@wetrends.co.uk',
    skills: ['Brand Strategy', 'Creative Direction', 'Video Production', 'Team Leadership', 'Client Relations'],
    achievements: [
      'Founded WeTrends in 2019',
      'Led campaigns generating £10M+ in client revenue',
      'Featured in Creative Review Top 100',
      'Speaker at D&AD Festival 2023'
    ]
  },
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    role: 'Head of Strategy',
    image: '/images/person1.webp',
    bio: 'Data-driven strategist who turns insights into impactful campaigns that deliver ROI.',
    fullBio: `Sarah Mitchell leads the strategy team at WeTrends, bringing a wealth of experience in data analytics and market research. With an MBA from LSE and 8 years in digital marketing, Sarah ensures every campaign is backed by solid research and clear objectives.

Her expertise lies in transforming complex data into actionable insights that drive creative decisions. Sarah has pioneered several proprietary research methodologies that have become industry standards for understanding Gen Z and Millennial consumers.

Sarah is passionate about sustainable marketing practices and regularly advises clients on ethical brand positioning.`,
    linkedin: 'https://linkedin.com/in/sarahmitchell',
    twitter: 'https://twitter.com/sarahmitchell',
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
    id: 'james-anderson',
    name: 'James Anderson',
    role: 'Lead Designer',
    image: '/images/person2.webp',
    bio: 'Award-winning designer crafting visual experiences that captivate and convert.',
    fullBio: `James Anderson is the creative force behind WeTrends' visual identity work. An award-winning designer with a background in both traditional graphic design and digital experiences, James brings a unique perspective to every project.

His design philosophy centers on the belief that great design should be both beautiful and functional. James has created visual systems for brands ranging from tech startups to established luxury retailers, always finding the perfect balance between innovation and brand heritage.

James studied at Central Saint Martins and has previously worked at Pentagram and Moving Brands. His work has been featured in Design Week, Creative Review, and Communication Arts.`,
    linkedin: 'https://linkedin.com/in/jamesanderson',
    twitter: 'https://twitter.com/jamesanderson',
    email: 'james@wetrends.co.uk',
    skills: ['Visual Identity', 'UI/UX Design', 'Motion Graphics', 'Brand Guidelines', 'Art Direction'],
    achievements: [
      'D&AD Pencil Winner 2022',
      'Central Saint Martins Graduate',
      'Former designer at Pentagram',
      'Featured in Communication Arts'
    ]
  },
  {
    id: 'meriam',
    name: 'Meriam',
    role: 'Creative Producer',
    image: '/images/meriam.webp',
    bio: 'Creative producer who bridges strategy and execution, ensuring every project ships on time and above expectations.',
    fullBio: `Meriam is WeTrends' Creative Producer, the engine behind how ideas become reality. With a background in creative project management and brand consultancy, she keeps every production running smoothly from brief to delivery.

Her strength lies in translating ambitious creative visions into tight, executable plans without ever sacrificing quality. Clients consistently cite her communication and organisation as transformative for their experience working with the agency.

Meriam is passionate about building processes that empower creatives to do their best work — and about building brands that genuinely connect with people.`,
    linkedin: 'https://linkedin.com/in/meriam',
    twitter: 'https://twitter.com/meriam',
    email: 'meriam@wetrends.co.uk',
    skills: ['Project Management', 'Creative Production', 'Client Relations', 'Brand Strategy', 'Workflow Design'],
    achievements: [
      'Managed 80+ brand projects end-to-end',
      'Reduced average project delivery time by 30%',
      'Built WeTrends production workflow from scratch',
      'Certified Project Management Professional (PMP)'
    ]
  },
  {
    id: 'emily-chen',
    name: 'Emily Chen',
    role: 'Video Production Lead',
    image: '/images/person3.webp',
    bio: 'Video wizard bringing stories to life through cinematic visuals and motion.',
    fullBio: `Emily Chen leads the video production team at WeTrends, bringing stories to life through cinematic visuals and innovative motion design. With a background in film production and 7 years creating content for brands, Emily knows how to craft videos that capture attention and drive engagement.

Emily's work spans commercial spots, social content, documentary-style brand films, and animated explainers. She's equally comfortable on set directing talent or in the edit suite perfecting the final cut. Her ability to understand a brand's essence and translate it into moving image is unmatched.

Before joining WeTrends, Emily worked as a freelance director and editor for BBC, Channel 4, and numerous production companies. She holds a degree in Film Production from the London Film School.`,
    linkedin: 'https://linkedin.com/in/emilychen',
    twitter: 'https://twitter.com/emilychen',
    email: 'emily@wetrends.co.uk',
    skills: ['Video Direction', 'Cinematography', 'Motion Graphics', 'Video Editing', 'Color Grading'],
    achievements: [
      'London Film School Graduate',
      'Directed 100+ brand videos',
      'Worked with BBC and Channel 4',
      'Vimeo Staff Pick recipient'
    ]
  }
];

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}

export function getAllTeamMembers(): TeamMember[] {
  return teamMembers;
}
