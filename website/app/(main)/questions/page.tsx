import type { Metadata } from 'next';
import { faqs } from '@/lib/faq-data';
import QuestionsPage from './questions-page';

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
