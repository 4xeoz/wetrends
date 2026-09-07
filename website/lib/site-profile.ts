export const siteProfile = {
  name: 'WeTrends',
  url: 'https://wetrends.co.uk',
  email: 'team@wetrends.co.uk',
  description:
    'WeTrends is a creative technology and production agency serving London, Surrey and UK clients with web, brand, video, social, event and photography work.',
  locationStatement:
    'Serving London, Surrey and UK clients while completing our move from Guildford to London.',
  areaServed: ['London', 'Guildford', 'Surrey', 'United Kingdom'],
  socialProfiles: [
    'https://www.instagram.com/wetrends.uk',
    'https://www.linkedin.com/company/wetrends-uk',
  ],
} as const;

export const organisationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${siteProfile.url}/#organisation`,
  name: siteProfile.name,
  description: siteProfile.description,
  url: siteProfile.url,
  email: siteProfile.email,
  areaServed: [
    { '@type': 'City', name: 'London' },
    { '@type': 'City', name: 'Guildford' },
    { '@type': 'AdministrativeArea', name: 'Surrey' },
    { '@type': 'Country', name: 'United Kingdom' },
  ],
  serviceType: [
    'Web Design and Development',
    'Brand Identity',
    'Video Production',
    'Content Strategy',
    'Social Media Management',
    'Animation',
    'Event Photography and Film',
    'Portrait and Brand Photography',
  ],
  priceRange: '££',
  sameAs: [...siteProfile.socialProfiles],
};
