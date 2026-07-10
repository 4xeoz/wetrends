// FAQ content for /questions — shared between the page UI and the
// FAQPage JSON-LD emitted by the server component.

export const faqs = [
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

export type Faq = (typeof faqs)[number];
