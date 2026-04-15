'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowDownRight,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = {
  'video-production': {
    icon: Video,
    title: 'Video Production',
    headline: 'Cinematic Stories That Stop The Scroll',
    description: 'From concept to final cut, we create video content that captures attention and drives meaningful engagement across all platforms. Our Guildford studio combines creative excellence with technical expertise.',
    features: ['Brand Films', 'Social Content', 'Motion Graphics', 'Commercials', 'Documentary Style', 'Product Videos', 'Event Coverage', 'Aerial/Drone'],
    process: [
      { step: '01', title: 'Discovery', description: 'We learn your brand, goals, and audience to craft the perfect concept.' },
      { step: '02', title: 'Pre-Production', description: 'Scriptwriting, storyboarding, location scouting, and crew assembly.' },
      { step: '03', title: 'Production', description: 'Professional filming with cinema-grade equipment and experienced crew.' },
      { step: '04', title: 'Post-Production', description: 'Editing, color grading, sound design, and motion graphics.' },
    ],
    benefits: [
      { title: 'Increase Engagement', description: 'Video content generates significantly more shares than text and images combined.' },
      { title: 'Professional Quality', description: '4K/8K production quality that elevates your brand above the competition.' },
      { title: 'Fast Turnaround', description: 'From brief to delivery in as little as two weeks.' },
      { title: 'Local Filming', description: 'We film across Guildford, Woking, Farnham and the wider Surrey area.' },
    ],
    testimonial: {
      quote: "WeTrends transformed our brand story into a cinematic experience. The video they produced for our product launch exceeded all expectations and drove record engagement.",
      author: "Sarah Mitchell",
      role: "Marketing Director, TechStart UK"
    },
    localFocus: 'We film across Guildford, Woking, Farnham and the wider Surrey area. Local knowledge means we know the best locations and can respond quickly to your needs.',
  },
  'brand-identity': {
    icon: Palette,
    title: 'Brand Identity',
    headline: 'Make Your Brand Impossible to Ignore',
    description: 'We craft distinctive visual identities that capture your essence and resonate deeply with your target audience. Stand out in the crowded Guildford and Surrey business landscape.',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Packaging', 'Brand Strategy', 'Naming', 'Typography', 'Color Systems'],
    process: [
      { step: '01', title: 'Research', description: 'Deep dive into your market, competitors, and target audience.' },
      { step: '02', title: 'Strategy', description: 'Define your brand positioning, personality, and key messages.' },
      { step: '03', title: 'Design', description: 'Create visual concepts that bring your brand strategy to life.' },
      { step: '04', title: 'Rollout', description: 'Implement across all touchpoints with comprehensive guidelines.' },
    ],
    benefits: [
      { title: 'Increased Recognition', description: 'Consistent branding makes you memorable and builds trust over time.' },
      { title: 'Customer Trust', description: 'Consumers prefer to buy from brands they recognize and relate to.' },
      { title: 'Premium Positioning', description: 'Strong brands can command higher prices than competitors.' },
      { title: 'Scalable Systems', description: 'Identity systems that grow with your business.' },
    ],
    testimonial: {
      quote: "The brand identity WeTrends created for us perfectly captures who we are. We've seen a significant increase in brand recognition since the rebrand launched.",
      author: "James Anderson",
      role: "CEO, GreenLeaf Solutions"
    },
    localFocus: 'We understand the Guildford and Surrey business environment. Our designs help local companies compete with London agencies while maintaining their unique identity.',
  },
  'web-design': {
    icon: Globe,
    title: 'Web Design',
    headline: 'Websites That Convert Visitors to Customers',
    description: 'High-performing digital experiences built for results. We design and develop websites that turn Guildford browsers into buyers across all devices.',
    features: ['UI/UX Design', 'Development', 'E-commerce', 'Web Apps', 'SEO Optimization', 'CMS Integration', 'Performance', 'Analytics'],
    process: [
      { step: '01', title: 'Discovery', description: 'Understand your business goals, users, and technical requirements.' },
      { step: '02', title: 'Design', description: 'Create beautiful, intuitive designs focused on user experience.' },
      { step: '03', title: 'Development', description: 'Build with clean code using Next.js, React, and modern technologies.' },
      { step: '04', title: 'Launch', description: 'Rigorous testing, optimization, and deployment to your domain.' },
    ],
    benefits: [
      { title: 'Higher Conversions', description: 'User-centered design that turns visitors into leads and customers.' },
      { title: 'Lightning Fast', description: 'Optimized performance for better SEO and user experience.' },
      { title: 'Mobile First', description: 'Over 60% of traffic is mobile — we design for thumb-friendly interaction.' },
      { title: 'Built to Scale', description: 'Next.js architecture that grows with your business.' },
    ],
    testimonial: {
      quote: "Our new website from WeTrends increased online enquiries dramatically. The design is stunning and the performance is incredible — we rank highly for our key terms.",
      author: "Emily Chen",
      role: "Founder, Surrey Wellness"
    },
    localFocus: 'Based in Guildford, we offer face-to-face consultations and rapid response times. We build websites that help local businesses compete nationally.',
  },
  'social-media': {
    icon: Users,
    title: 'Social Media',
    headline: 'Build Communities That Drive Revenue',
    description: 'Strategic social media management that grows your following and turns engagement into revenue. We handle content, community, and campaigns across all platforms.',
    features: ['Content Strategy', 'Creative Direction', 'Community Management', 'Analytics', 'Paid Social', 'Influencer Campaigns', 'Video Content', 'Reporting'],
    process: [
      { step: '01', title: 'Strategy', description: 'Develop a tailored strategy aligned with your business goals.' },
      { step: '02', title: 'Creation', description: 'Produce thumb-stopping content that reflects your brand voice.' },
      { step: '03', title: 'Publishing', description: 'Post at optimal times with compelling captions and hashtags.' },
      { step: '04', title: 'Optimization', description: 'Analyze performance and continuously refine for better results.' },
    ],
    benefits: [
      { title: 'Organic Growth', description: 'We help clients grow engaged, loyal follower bases.' },
      { title: 'Strong ROI', description: 'Our social campaigns are optimized for measurable returns.' },
      { title: 'Always-On Management', description: 'Round-the-clock monitoring and engagement with your community.' },
      { title: 'Data-Driven', description: 'Every decision is backed by analytics and audience insights.' },
    ],
    testimonial: {
      quote: "WeTrends took our Instagram from dormant to thriving in just a few months. Their content strategy is unmatched — they truly understand what resonates with our audience.",
      author: "Michael Brown",
      role: "Owner, Guildford Cafe Co"
    },
    localFocus: 'We know the Surrey social landscape. From Guildford to Woking, we create content that resonates with local audiences while building national reach.',
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
      { title: 'More Engagement', description: 'Animated content increases time-on-page and social shares.' },
      { title: 'Universal Appeal', description: 'Animation transcends language barriers for global audiences.' },
      { title: 'Endless Creative', description: 'Any concept is possible with the right animation approach.' },
    ],
    testimonial: {
      quote: "The explainer video WeTrends created helped us reduce support tickets significantly. Customers finally understand our product, and sales have increased dramatically.",
      author: "Lisa Park",
      role: "Product Manager, SaaS Co"
    },
    localFocus: 'Our Guildford animation studio serves clients across the UK. We combine local accessibility with world-class animation expertise.',
  },
  'content-strategy': {
    icon: PenTool,
    title: 'Content Strategy',
    headline: 'Words That Work as Hard as You Do',
    description: 'Strategic content that positions you as the authority in your space. We craft narratives that educate, engage, and convert your Guildford and UK audience.',
    features: ['SEO Content', 'Copywriting', 'Editorial', 'Storytelling', 'Blog Management', 'Email Campaigns', 'White Papers', 'Case Studies'],
    process: [
      { step: '01', title: 'Research', description: 'Identify high-value topics your audience is searching for.' },
      { step: '02', title: 'Outline', description: 'Structure content for maximum engagement and SEO value.' },
      { step: '03', title: 'Write', description: 'Craft compelling copy that informs, entertains, and converts.' },
      { step: '04', title: 'Optimize', description: 'SEO refinement, internal linking, and performance tracking.' },
    ],
    benefits: [
      { title: 'Organic Traffic', description: 'SEO-optimized content strategy that drives sustainable growth.' },
      { title: 'Thought Leadership', description: 'Position your brand as the go-to expert in your industry.' },
      { title: 'Evergreen Results', description: 'Quality content continues driving traffic for years.' },
      { title: 'Consistent Voice', description: 'A unified tone across every channel and touchpoint.' },
    ],
    testimonial: {
      quote: "Since WeTrends took over our content strategy, our organic traffic has grown consistently. We now rank for highly competitive keywords in our industry.",
      author: "David Wilson",
      role: "CMO, FinanceHub UK"
    },
    localFocus: 'We understand the Surrey business landscape and create content that resonates locally while building national authority.',
  },
};

const tabs = ['Overview', 'Features', 'Process', 'Results'] as const;

type Tab = typeof tabs[number];

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services[slug as keyof typeof services];
  const Icon = service.icon;
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  return (
    <main className="min-h-[100svh] bg-white">
      {/* Back nav */}
      <div className="fixed left-0 right-0 top-0 z-50 px-4 py-6 sm:px-6 lg:px-8">
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

      {/* Dark Hero */}
      <section className="relative flex min-h-[70svh] flex-col justify-end pb-12 pt-32 md:min-h-[75svh] md:pb-16 md:pt-40">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero_background.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#050505]/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Icon className="h-4 w-4 text-[#C72C5B]" />
              <span className="text-sm font-medium uppercase tracking-widest text-[#C72C5B]">
                {service.title}
              </span>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.2} ease="power3.out">
            <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.9] tracking-tight text-white">
              {service.headline.split(' ').slice(0, -2).join(' ')}
              <br />
              <span className="font-serif italic text-[#C72C5B]">
                {service.headline.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4} ease="power3.out">
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg">
              {service.description}
            </p>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.5} ease="power3.out">
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
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4 text-[#C72C5B]" />
                Guildford, Surrey
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-[#C72C5B] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F0F0F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <section className="min-h-[60svh] bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-12 lg:grid-cols-2"
              >
                <div className="space-y-8">
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
                    <h2 className="mb-4 text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                      What to Expect
                    </h2>
                    <p className="leading-relaxed text-gray-600">
                      {service.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.features.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
                    <div className="mb-4 inline-flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#C72C5B]" />
                      <span className="text-sm font-medium text-gray-500">Local Service</span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-[#0F0F0F]">
                      Proudly Serving Guildford & Surrey
                    </h3>
                    <p className="text-gray-600">{service.localFocus}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Guildford', 'Woking', 'Farnham', 'Dorking', 'Reigate', 'Cobham', 'Esher', 'Leatherhead'].map((town) => (
                        <span
                          key={town}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
                        >
                          {town}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="rounded-2xl border border-gray-200 bg-[#050505] p-8 text-white md:p-10">
                    <span className="text-5xl font-bold text-[#C72C5B] md:text-6xl">"</span>
                    <blockquote className="mb-6 text-lg font-medium leading-relaxed md:text-xl">
                      {service.testimonial.quote}
                    </blockquote>
                    <div>
                      <div className="font-semibold">{service.testimonial.author}</div>
                      <div className="text-sm text-white/60">{service.testimonial.role}</div>
                    </div>
                  </div>

                  <motion.a
                    href="/#contact"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between rounded-2xl bg-[#C72C5B] p-6 text-white transition-colors hover:bg-[#a82448] md:p-8"
                  >
                    <div>
                      <div className="text-lg font-bold md:text-xl">Ready to start?</div>
                      <div className="text-sm text-white/80">Book a free consultation</div>
                    </div>
                    <ArrowUpRight className="h-6 w-6" />
                  </motion.a>
                </div>
              </motion.div>
            )}

            {activeTab === 'Features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                    Everything You Get
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Comprehensive {service.title.toLowerCase()} services tailored to your needs.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C72C5B]/10">
                        <Sparkles className="h-5 w-5 text-[#C72C5B]" />
                      </div>
                      <span className="font-medium text-[#0F0F0F]">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Process' && (
              <motion.div
                key="process"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                    Our Process
                  </h2>
                  <p className="mt-2 text-gray-600">
                    A proven four-step approach that delivers exceptional results every time.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {service.process.map((step, index) => (
                    <div
                      key={step.step}
                      className="relative rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
                    >
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#C72C5B] text-sm font-bold text-white">
                        {step.step}
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-[#0F0F0F]">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {index < 3 && (
                        <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 lg:flex">
                          <ArrowUpRight className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                    Why It Works
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Measurable impact you can expect when working with us.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {service.benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      whileHover={{ x: 6 }}
                      className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg md:p-8"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C72C5B]/10">
                        <CheckCircle2 className="h-6 w-6 text-[#C72C5B]" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-[#0F0F0F]">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Let&apos;s discuss your {service.title.toLowerCase()} project. Free consultation for Guildford & Surrey businesses.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#C72C5B]/20 transition-all hover:bg-[#a82448]"
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
