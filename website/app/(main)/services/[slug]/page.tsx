import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData, serviceSlugs, type ServiceSlug } from '@/lib/services-data';
import ServiceDetail from './service-detail';

export async function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug as ServiceSlug];

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: service.title,
    description: service.description,
    keywords: [...service.keywords],
    alternates: {
      canonical: `https://wetrends.co.uk/services/${slug}/`,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `https://wetrends.co.uk/services/${slug}/`,
      type: 'article',
      locale: 'en_GB',
      siteName: 'WeTrends',
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData[slug as ServiceSlug];

  if (!service) {
    notFound();
  }

  const serviceName = service.title.split('|')[0].trim();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: service.description,
    url: `https://wetrends.co.uk/services/${slug}/`,
    provider: {
      '@type': 'ProfessionalService',
      name: 'WeTrends',
      url: 'https://wetrends.co.uk',
    },
    areaServed: [
      { '@type': 'City', name: 'London' },
      { '@type': 'City', name: 'Guildford' },
      { '@type': 'AdministrativeArea', name: 'Surrey' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wetrends.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://wetrends.co.uk/services/' },
      { '@type': 'ListItem', position: 3, name: serviceName, item: `https://wetrends.co.uk/services/${slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiceDetail slug={slug} />
    </>
  );
}
