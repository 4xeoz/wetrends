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
    role: 'Filmmaker & Creative Director',
    image: '/images/eddy.png',
    bio: 'Leads filmmaking, creative direction and visual storytelling for WeTrends.',
    fullBio: `Eddy works across creative direction, filmmaking and production at WeTrends. He helps shape ideas into clear visual stories for brands, organisations and events.

His work spans early concepts, on-set direction and the decisions that connect production to the audience and commercial goal.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Brand Strategy', 'Creative Direction', 'Video Production', 'Team Leadership', 'Client Relations'],
    achievements: []
  },
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Head of Strategy',
    image: '/images/sarah.png',
    bio: 'Connects audience evidence, positioning and campaign choices to clear business goals.',
    fullBio: `Sarah leads strategic thinking across brand and campaign work at WeTrends. She turns research, audience context and commercial priorities into focused creative briefs.

Her role is to keep the work anchored to a useful customer problem and a result the team can measure.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Market Research', 'Data Analytics', 'Brand Positioning', 'Consumer Insights', 'Campaign Planning'],
    achievements: []
  },
  {
    id: 'zack',
    name: 'Zack',
    role: 'Lead Designer',
    image: '/images/zack.png',
    bio: 'Shapes visual identities and digital experiences that are clear, distinctive and useful.',
    fullBio: `Zack leads design work across identity, digital products and campaign systems at WeTrends. He develops visual directions that can stay coherent across channels and formats.

His focus is the practical connection between brand expression, usability and the details required for a consistent delivery.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Visual Identity', 'UI/UX Design', 'Motion Graphics', 'Brand Guidelines', 'Art Direction'],
    achievements: []
  },
  {
    id: 'meryem',
    name: 'Meryem',
    role: 'Creative Producer',
    image: '/images/meryem.png',
    bio: 'Turns creative briefs into organised productions with clear owners, decisions and delivery.',
    fullBio: `Meryem produces creative projects from brief through delivery at WeTrends. She coordinates the people, materials and timelines needed to move an idea into production.

Her work keeps creative ambition connected to an executable plan and a straightforward client experience.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Project Management', 'Creative Production', 'Client Relations', 'Brand Strategy', 'Workflow Design'],
    achievements: []
  },
  {
    id: 'ash',
    name: 'Ash',
    role: 'Video Production Lead',
    image: '/images/ash.png',
    bio: 'Leads moving-image production from capture through edit and final delivery.',
    fullBio: `Ash works across cinematography, direction and post-production at WeTrends. Their role covers the practical and creative choices that carry a story from shot list to finished film.

The work includes brand films, social content, event coverage and motion-led explainers.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Video Direction', 'Cinematography', 'Motion Graphics', 'Video Editing', 'Color Grading'],
    achievements: []
  },
  {
    id: 'rebecca',
    name: 'Rebecca',
    role: 'Content Strategist',
    image: '/images/rebecca.png',
    bio: 'Builds practical content systems around audience questions, search intent and brand voice.',
    fullBio: `Rebecca shapes content strategy and editorial direction at WeTrends. She turns audience questions and campaign goals into useful formats, briefs and publishing plans.

Her focus is clear language, a consistent voice and content that gives the reader a reason to take the next step.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Copywriting', 'SEO Strategy', 'Editorial Direction', 'Social Copy', 'Brand Voice'],
    achievements: []
  },
  {
    id: 'jullia',
    name: 'Jullia',
    role: 'Account Director',
    image: '/images/Jullia.png',
    bio: 'Keeps client communication, scope and delivery aligned throughout the work.',
    fullBio: `Jullia leads client coordination at WeTrends. She turns project requirements into clear next steps and keeps communication connected to scope, timing and delivery.

Her role is to make the working relationship straightforward for both the client and the production team.`,
    linkedin: '',
    twitter: '',
    email: 'team@wetrends.co.uk',
    skills: ['Account Management', 'Client Strategy', 'Negotiation', 'Project Leadership', 'CRM'],
    achievements: []
  }
];

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}

export function getAllTeamMembers(): TeamMember[] {
  return teamMembers;
}
