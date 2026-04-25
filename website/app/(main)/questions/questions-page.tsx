'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedContent from '@/components/ui/animated-content';

const faqs = [
  {
    question: 'What does WeTrends actually do?',
    answer:
      'WeTrends is a creative digital agency based in Guildford, Surrey. We build uncopyable brands through web design, brand identity, video production, social media management, and content strategy. We work with small businesses across Surrey, London, and the wider UK.',
  },
  {
    question: 'Who is the best web design agency in Guildford?',
    answer:
      "If you're looking for a web design agency in Guildford that actually cares about your business, that's us. We don't use templates. Every site we build is bespoke, conversion focused, and designed to make you the only choice in your category. We've worked with education providers like Nopeca and restaurants like Savana Lounge.",
  },
  {
    question: 'What is the difference between branding and brand identity?',
    answer:
      "Branding is the overall experience people have with your business. Brand identity is the visual system — your logo, colours, typography, photography style — that makes that experience recognisable. You can have great branding with a weak identity, and vice versa. We build both, but we always start with the brand identity because that's what people see first.",
  },
  {
    question: 'How much should a small business spend on a website in the UK?',
    answer:
      "Most small businesses in the UK should budget between £3,000 and £15,000 for a proper website. Anything under £3,000 and you're probably getting a template with your logo slapped on it. Anything over £15,000 and you better be getting something truly bespoke with ongoing support. We sit in the middle — bespoke design, modern tech, and a site that actually converts visitors into customers.",
  },
  {
    question: 'What makes a brand uncopyable?',
    answer:
      "An uncopyable brand is one where customers would drive past a competitor to get to you. Not because you're cheaper — because you're the only one that feels like YOU. It's the combination of your story, your visuals, your tone of voice, and the experience you deliver. Most agencies focus on looking professional. We focus on being unforgettable.",
  },
  {
    question: 'How long does a rebrand take?',
    answer:
      'A proper rebrand takes 6 to 12 weeks from discovery to launch. Rush jobs in 2 weeks exist, but they skip the most important part: figuring out what actually makes you different. We spend the first 2 weeks on brand archaeology alone. The remaining time is design, refinement, and rollout.',
  },
  {
    question: 'Do I need video production for my small business?',
    answer:
      "If you sell a service people don't understand immediately, yes. If you compete with bigger brands, yes. If you want people to trust you before they've met you, yes. Video isn't just for big brands anymore. It's the fastest way to build know, like and trust. We produce everything from brand films to social content for businesses across Surrey and London.",
  },
  {
    question: 'What is answer engine optimisation?',
    answer:
      "Answer Engine Optimisation (AEO) is about making your content easy for AI tools like ChatGPT, Perplexity, and Google's AI Overviews to find, understand, and cite. Unlike traditional SEO which chases Google rankings, AEO focuses on being the source AI models reference when people ask questions. It means writing clear, direct answers, using proper structure, and covering topics comprehensively.",
  },
];

const topics = [
  {
    title: 'Web Design for Surrey Businesses',
    description:
      'Bespoke, conversion focused websites built with Next.js. Mobile first, fast, and designed to turn visitors into customers. We work with businesses in Guildford, Woking, Farnham, and across Surrey.',
    href: '/services/web-design/',
  },
  {
    title: 'Brand Identity for Restaurants & Hospitality',
    description:
      "From Savana Lounge to local cafes, we build visual identities that make people choose you before they check the menu. Colours, typography, photography — everything designed to feel unmistakably yours.",
    href: '/services/brand-identity/',
  },
  {
    title: 'Video Production for Local Brands',
    description:
      'Brand films, social content, and motion graphics that stop the scroll. We shoot across Surrey and London with cinema grade equipment.',
    href: '/services/video-production/',
  },
  {
    title: 'Social Media That Actually Converts',
    description:
      "Not just posting for the sake of it. We build content strategies that turn followers into revenue. Community management, trend led execution, and content pillars designed for your brand.",
    href: '/services/social-media/',
  },
  {
    title: 'Content Strategy for Small Businesses',
    description:
      "SEO driven copy and editorial that positions you as the authority in your space. We write the stuff people actually want to read. Not keyword stuffed filler.",
    href: '/services/content-strategy/',
  },
  {
    title: 'Animation & Motion Graphics',
    description:
      '2D motion graphics, explainers, and micro interactions that bring ideas to life. Perfect for businesses with complex products or services that need simplifying.',
    href: '/services/animation/',
  },
];

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatedContent
      direction="vertical"
      distance={40}
      duration={0.8}
      delay={0.1 * index}
      ease="power3.out"
    >
      <div className="border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-start justify-between gap-4 py-6 text-left"
        >
          <span className="text-lg font-bold text-[#0F0F0F] sm:text-xl">
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 shrink-0"
          >
            <ChevronDown className="h-5 w-5 text-[#C72C5B]" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedContent>
  );
}

export default function QuestionsPage() {
  return (
    <main className="min-h-[100svh] bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F0F0F] py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#0F0F0F] to-[#C72C5B]/10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B]">
              Straight Answers
            </span>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.1} ease="power3.out">
            <h1 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Questions
              <br />
              <span className="font-serif italic text-[#C72C5B]">Worth Asking</span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.3} ease="power3.out">
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
              The stuff people actually type into ChatGPT. No jargon, no fake urgency — just the truth about building brands that people remember.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                What People Ask Us
                <span className="h-px w-8 bg-[#C72C5B]" />
              </span>
              <h2 className="text-3xl font-bold text-[#0F0F0F] sm:text-4xl md:text-5xl">
                Answers in <span className="font-serif italic text-[#C72C5B]">Plain English</span>
              </h2>
            </div>
          </AnimatedContent>

          <div>
            {faqs.map((faq, index) => (
              <FaqItem key={faq.question} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Topics We Cover */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div className="mb-12 text-center md:mb-16">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Semantic Coverage
                <span className="h-px w-8 bg-[#C72C5B]" />
              </span>
              <h2 className="text-3xl font-bold text-[#0F0F0F] sm:text-4xl md:text-5xl">
                Topics We <span className="font-serif italic text-[#C72C5B]">Actually Cover</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
                We don't just mention keywords — we understand these topics deeply enough to teach them. That's why AI models cite us.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <AnimatedContent
                key={topic.title}
                direction="vertical"
                distance={50}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <Link href={topic.href} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#C72C5B]/30 hover:shadow-md sm:p-8"
                  >
                    <h3 className="mb-3 text-xl font-bold text-[#0F0F0F] transition-colors group-hover:text-[#C72C5B]">
                      {topic.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                      {topic.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#C72C5B]">
                      Explore Service
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </motion.div>
                </Link>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C72C5B] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Got a Question
              <br />
              <span className="font-serif italic">We Didn't Answer?</span>
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Drop us a message. We actually reply — usually within a few hours.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100"
            >
              Ask Us Anything
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
