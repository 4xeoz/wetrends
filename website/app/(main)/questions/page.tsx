import type { Metadata } from 'next';
import { faqs } from '@/lib/faq-data';
import QuestionsPage from './questions-page';
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/social-metadata';

export const metadata: Metadata = {
  title: "Questions About Web Design, Branding & Digital Marketing | WeTrends",
  description: "Straight answers from WeTrends about web design, brand identity, production, content, events and photography for London, Surrey and UK teams.",
  alternates: {
    canonical: "https://wetrends.co.uk/questions/",
  },
  openGraph: {
    title: "Questions About Web Design, Branding & Digital Marketing | WeTrends",
    description: "No jargon or fake urgency—just useful answers about building brands, content and digital products.",
    url: "https://wetrends.co.uk/questions/",
    type: "website",
    locale: "en_GB",
    siteName: "WeTrends",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Questions About Web Design, Branding & Digital Marketing | WeTrends',
    description: 'Straight answers about creative technology, production, events and photography.',
    images: [DEFAULT_SOCIAL_IMAGE_PATH],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <QuestionsPage />
    </>
  );
}
