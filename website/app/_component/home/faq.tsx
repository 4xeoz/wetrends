'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const homeFaqs = [
  {
    question: 'What does WeTrends actually do?',
    answer:
      'WeTrends is a creative digital agency based in Guildford, Surrey. We build uncopyable brands through web design, brand identity, video production, social media management, and content strategy.',
  },
  {
    question: 'How much should a small business spend on a website?',
    answer:
      "Most small businesses in the UK should budget between £3,000 and £15,000 for a proper website. Anything under £3,000 and you're probably getting a template with your logo slapped on it. We sit in the middle, bespoke design, modern tech, and a site that actually converts visitors into customers.",
  },
  {
    question: 'What makes a brand uncopyable?',
    answer:
      "An uncopyable brand is one where customers would drive past a competitor to get to you. Not because you're cheaper, because you're the only one that feels like YOU. It's the combination of your story, your visuals, your tone of voice, and the experience you deliver.",
  },
  {
    question: 'How long does a rebrand take?',
    answer:
      'A proper rebrand takes 6 to 12 weeks from discovery to launch. Rush jobs in 2 weeks exist, but they skip the most important part: figuring out what actually makes you different.',
  },
];

function FaqItem({ faq, index }: { faq: typeof homeFaqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatedContent
      direction="vertical"
      distance={30}
      duration={0.6}
      delay={0.08 * index}
      ease="power3.out"
    >
      <div className="border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-start justify-between gap-4 py-5 text-left sm:py-6"
        >
          <span className="text-base font-bold text-[#0F0F0F] sm:text-lg">
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-0.5 shrink-0"
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
              <p className="pb-5 text-sm leading-relaxed text-gray-600 sm:text-base sm:pb-6">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedContent>
  );
}

export function HomeFaq() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          ease="power3.out"
        >
          <div className="mb-10 text-center sm:mb-12">
            <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Common Questions
              <span className="h-px w-8 bg-[#C72C5B]" />
            </span>
            <h2 className="text-3xl font-bold text-[#0F0F0F] sm:text-4xl md:text-5xl">
              Answers in{' '}
              <span className="font-serif italic text-[#C72C5B]">Plain English</span>
            </h2>
          </div>
        </AnimatedContent>

        <div>
          {homeFaqs.map((faq, index) => (
            <FaqItem key={faq.question} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
