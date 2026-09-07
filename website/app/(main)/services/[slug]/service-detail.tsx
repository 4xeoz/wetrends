'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  ArrowDownRight,
  Play,
  Pause,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = {
  'video-production': {
    icon: Video,
    title: 'Video Production',
    headline: 'Cinematic Stories Built for Every Channel',
    description: 'From concept to final cut, we create video content designed for the audiences and platforms used by London, Surrey and UK teams.',
    features: ['Brand Films', 'Social Content', 'Motion Graphics', 'Commercials', 'Documentary Style', 'Product Videos', 'Event Coverage', 'Aerial/Drone'],
    process: [
      { step: '01', title: 'Discovery', description: 'We learn your brand, goals, and audience to craft the perfect concept.' },
      { step: '02', title: 'Pre-Production', description: 'Scriptwriting, storyboarding, location scouting, and crew assembly.' },
      { step: '03', title: 'Production', description: 'Professional filming with cinema-grade equipment and experienced crew.' },
      { step: '04', title: 'Post-Production', description: 'Editing, color grading, sound design, and motion graphics.' },
    ],
    benefits: [
      { title: 'Channel-Ready Edits', description: 'Formats and cut-downs are planned around the channels where the work will appear.' },
      { title: 'Brief-Matched Production', description: 'The crew, equipment and finish are selected for the creative brief and delivery requirements.' },
      { title: 'Planned Delivery', description: 'Scope, review rounds and delivery dates are agreed before production begins.' },
      { title: 'Flexible Filming', description: 'We film on location across London, Surrey and the wider UK.' },
    ],
    localFocus: 'We film on location across London, Surrey and the wider UK, with production planned around the brief and venue.',
    video: '/videos/video-preview-wetrends.mp4',
  },
  'brand-identity': {
    icon: Palette,
    title: 'Brand Identity',
    headline: 'Build a Brand People Can Recognise',
    description: 'We craft distinctive visual identities that capture your essence and resonate with your target audience across London, Surrey and the wider UK.',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Packaging', 'Brand Strategy', 'Naming', 'Typography', 'Color Systems'],
    process: [
      { step: '01', title: 'Research', description: 'Deep dive into your market, competitors, and target audience.' },
      { step: '02', title: 'Strategy', description: 'Define your brand positioning, personality, and key messages.' },
      { step: '03', title: 'Design', description: 'Create visual concepts that bring your brand strategy to life.' },
      { step: '04', title: 'Rollout', description: 'Implement across all touchpoints with comprehensive guidelines.' },
    ],
    benefits: [
      { title: 'Increased Recognition', description: 'Consistent branding makes you memorable and builds trust over time.' },
      { title: 'Clearer Signals', description: 'A coherent identity helps people understand who you are and what you offer.' },
      { title: 'Distinct Positioning', description: 'A considered visual and verbal system helps distinguish your offer in its market.' },
      { title: 'Scalable Systems', description: 'Identity systems that grow with your business.' },
    ],
    localFocus: 'We help London, Surrey and UK organisations build distinctive identities that work across digital and physical touchpoints.',
    video: '/videos/design-preview-wetrends.mp4',
  },
  'web-design': {
    icon: Globe,
    title: 'Web Design',
    headline: 'Websites Designed Around Real User Journeys',
    description: 'We design and develop fast, accessible websites that make services, evidence and next steps clear across devices.',
    features: ['UI/UX Design', 'Development', 'E-commerce', 'Web Apps', 'SEO Optimization', 'CMS Integration', 'Performance', 'Analytics'],
    process: [
      { step: '01', title: 'Discovery', description: 'Understand your business goals, users, and technical requirements.' },
      { step: '02', title: 'Design', description: 'Create beautiful, intuitive designs focused on user experience.' },
      { step: '03', title: 'Development', description: 'Build with clean code using Next.js, React, and modern technologies.' },
      { step: '04', title: 'Launch', description: 'Rigorous testing, optimization, and deployment to your domain.' },
    ],
    benefits: [
      { title: 'Clear Conversion Paths', description: 'Calls to action and information architecture are designed around the intended user journey.' },
      { title: 'Performance-Conscious', description: 'Technical choices support fast loading, search visibility and a smoother experience.' },
      { title: 'Mobile First', description: 'Layouts and interactions are designed for small screens before being expanded for larger ones.' },
      { title: 'Built to Scale', description: 'Next.js architecture that grows with your business.' },
    ],
    localFocus: 'We work with London, Surrey and UK teams remotely and on location, with consultation details agreed for each project.',
    video: '/videos/website-preview-wetrends.mp4',
  },
  'social-media': {
    icon: Users,
    title: 'Social Media',
    headline: 'Build Communities With a Clear Purpose',
    description: 'Social media planning, production and management aligned with your audience, brand and commercial goals.',
    features: ['Content Strategy', 'Creative Direction', 'Community Management', 'Analytics', 'Paid Social', 'Influencer Campaigns', 'Video Content', 'Reporting'],
    process: [
      { step: '01', title: 'Strategy', description: 'Develop a tailored strategy aligned with your business goals.' },
      { step: '02', title: 'Creation', description: 'Produce thumb-stopping content that reflects your brand voice.' },
      { step: '03', title: 'Publishing', description: 'Post at optimal times with compelling captions and hashtags.' },
      { step: '04', title: 'Optimization', description: 'Analyze performance and continuously refine for better results.' },
    ],
    benefits: [
      { title: 'Audience Fit', description: 'Content themes and formats are selected for the people you need to reach.' },
      { title: 'Measurable Campaigns', description: 'Campaign goals, tracking and reporting are agreed before launch.' },
      { title: 'Managed Coverage', description: 'Publishing, monitoring and response coverage are agreed around the brief.' },
      { title: 'Evidence-Led Iteration', description: 'Available platform data and audience signals inform each review cycle.' },
    ],
    localFocus: 'We create social content for London, Surrey and UK audiences while building reach around each client\'s real market.',
    video: '/videos/social-preview-wetrends.mp4',
  },
  'animation': {
    icon: Zap,
    title: 'Animation',
    headline: 'Bring Complex Ideas to Life',
    description: 'Dynamic motion design that explains, entertains, and engages. From 2D explainers to complex motion graphics, we make the complex simple and captivating.',
    features: ['2D Animation', 'Motion Graphics', 'Explainers', 'Micro-interactions', 'Logo Animation', 'Lottie Files', 'Character Design', 'UI Animation'],
    process: [
      { step: '01', title: 'Script', description: 'Craft a compelling narrative that communicates your message clearly.' },
      { step: '02', title: 'Storyboard', description: 'Visualize every scene to ensure the story flows perfectly.' },
      { step: '03', title: 'Design', description: 'Create distinctive visual styles that match your brand identity.' },
      { step: '04', title: 'Animate', description: 'Bring designs to life with smooth, engaging motion.' },
    ],
    benefits: [
      { title: 'Explain Simply', description: 'Complex products explained clearly through animated storytelling.' },
      { title: 'Channel Flexibility', description: 'Motion systems can be adapted for web, presentations and social formats.' },
      { title: 'Universal Appeal', description: 'Animation transcends language barriers for global audiences.' },
      { title: 'Endless Creative', description: 'Any concept is possible with the right animation approach.' },
    ],
    localFocus: 'Our animation work serves London, Surrey and UK clients through a flexible remote and on-location production model.',
    video: '/videos/animations-preview-wetrends.mp4',
  },
  'content-strategy': {
    icon: PenTool,
    title: 'Content Strategy',
    headline: 'Useful Content Built Around Buyer Questions',
    description: 'Research-led content designed to answer real questions, communicate expertise and support London, Surrey and UK buyer journeys.',
    features: ['SEO Content', 'Copywriting', 'Editorial', 'Storytelling', 'Blog Management', 'Email Campaigns', 'White Papers', 'Case Studies'],
    process: [
      { step: '01', title: 'Research', description: 'Identify high-value topics your audience is searching for.' },
      { step: '02', title: 'Outline', description: 'Structure content for maximum engagement and SEO value.' },
      { step: '03', title: 'Write', description: 'Craft compelling copy that informs, entertains, and converts.' },
      { step: '04', title: 'Optimize', description: 'SEO refinement, internal linking, and performance tracking.' },
    ],
    benefits: [
      { title: 'Search Foundation', description: 'Topics and page structures are aligned with relevant search intent.' },
      { title: 'Demonstrable Expertise', description: 'Original examples and clearly attributed evidence help readers assess your expertise.' },
      { title: 'Reusable Knowledge', description: 'Useful source material can support search, sales and social channels.' },
      { title: 'Consistent Voice', description: 'A unified tone across every channel and touchpoint.' },
    ],
    localFocus: 'We create content for London and Surrey buyers while preserving the wider UK relevance of each client\'s expertise.',
    video: '/videos/design-preview-wetrends.mp4',
  },
};

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services[slug as keyof typeof services];
  const Icon = service.icon;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPaused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <main className="min-h-[100svh] bg-white pt-[72px]">
      {/* Full-Bleed Video Hero */}
      <section className="relative flex min-h-[85svh] flex-col justify-end pb-12 pt-32 md:min-h-[90svh] md:pb-16 md:pt-40">
        {/* Background Video.
            z-0, not -z-10: <main> paints a solid bg-white, and this section is
            `relative` with z-index auto so it creates no stacking context. At a
            negative z-index this layer would paint before <main>'s background
            and be covered by it. Content is z-10, back-nav z-50, pause z-40. */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            src={service.video}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/50" />
        </div>

        {/* Back nav */}
        <div className="absolute left-0 right-0 top-0 z-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/services/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Services
            </Link>
          </div>
        </div>

        {/* Pause/Play button */}
        <button
          onClick={toggleVideo}
          className="absolute right-6 top-24 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/20 md:right-10 md:top-28"
          aria-label={isPaused ? 'Play video' : 'Pause video'}
        >
          {isPaused ? <Play className="h-5 w-5 fill-current" /> : <Pause className="h-5 w-5 fill-current" />}
        </button>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1}>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Icon className="h-4 w-4 text-[#C72C5B]" />
              <span className="text-sm font-medium uppercase tracking-widest text-[#C72C5B]">
                {service.title}
              </span>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.2}>
            <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-tight text-white">
              {service.headline.split(' ').slice(0, -2).join(' ')}
              <br />
              <span className="font-serif italic text-[#C72C5B]">
                {service.headline.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg">
              {service.description}
            </p>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.5}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a82448]"
              >
                Get a Quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </motion.a>
              
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1}>
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Capabilities
              </span>
              <h2 className="text-4xl font-bold text-[#0F0F0F] md:text-5xl lg:text-6xl">
                What We <span className="font-serif italic text-[#C72C5B]">Offer</span>
              </h2>
            </AnimatedContent>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.features.map((feature, index) => (
              <AnimatedContent
                key={feature}
                direction="vertical"
                distance={40}
                duration={0.8}
                delay={0.05 * index}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex h-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C72C5B]/10">
                    <Sparkles className="h-5 w-5 text-[#C72C5B]" />
                  </div>
                  <span className="font-medium text-[#0F0F0F]">{feature}</span>
                </motion.div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Process — Dark Strip */}
      <section className="bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1}>
              <span className="mb-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Our Process
                <span className="h-px w-8 bg-[#C72C5B]" />
              </span>
              <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                How We <span className="font-serif italic text-[#C72C5B]">Work</span>
              </h2>
            </AnimatedContent>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <AnimatedContent
                key={step.step}
                direction="vertical"
                distance={60}
                duration={0.8}
                delay={0.1 * index}
              >
                <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#C72C5B] text-sm font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.description}</p>
                  {index < 3 && (
                    <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 lg:flex">
                      <ArrowUpRight className="h-3 w-3 text-white/60" />
                    </div>
                  )}
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-[#C72C5B] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1}>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Let&apos;s discuss your {service.title.toLowerCase()} project. Initial consultations are available for London, Surrey and UK teams.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100"
            >
              Start Your Project
              <ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </motion.a>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
