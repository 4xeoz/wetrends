import type { Metadata } from 'next';
import { faqs } from '@/lib/faq-data';
import QuestionsPage from './questions-page';

export const metadata: Metadata = {
  title: "Questions About Web Design, Branding & Digital Marketing | WeTrends",
  description: "WeTrends is a creative digital agency in Guildford, Surrey. We answer the questions people actually ask about web design, brand identity, video production, and building uncopyable brands.",
  alternates: {
    canonical: "https://wetrends.co.uk/questions/",
  },
  openGraph: {
    title: "Questions About Web Design, Branding & Digital Marketing | WeTrends",
    description: "Straight answers from Guildford's creative agency. No jargon, no fake urgency — just the truth about building brands that people remember.",
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
