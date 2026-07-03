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
  CheckCircle2,
  MapPin,
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
    video: '/videos/video-preview-wetrends.mp4',
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
    video: '/videos/design-preview-wetrends.mp4',
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
    video: '/videos/website-preview-wetrends.mp4',
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
    video: '/videos/animations-preview-wetrends.mp4',
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
    <main className="min-h-[100svh] bg-white">
      {/* Full-Bleed Video Hero */}
      <section className="relative flex min-h-[85svh] flex-col justify-end pb-12 pt-32 md:min-h-[90svh] md:pb-16 md:pt-40">
        {/* Background Video */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
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

      {/* Features Grid */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
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
                ease="power3.out"
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
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
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
                ease="power3.out"
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

      {/* Benefits */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Why It Works
              </span>
              <h2 className="text-4xl font-bold text-[#0F0F0F] md:text-5xl lg:text-6xl">
                Results That <span className="font-serif italic text-[#C72C5B]">Matter</span>
              </h2>
            </AnimatedContent>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {service.benefits.map((benefit, index) => (
              <AnimatedContent
                key={benefit.title}
                direction="horizontal"
                distance={40}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <motion.div
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
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Local Focus */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
                  <div className="mb-4 inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#C72C5B]" />
                    <span className="text-sm font-medium text-gray-500">Local Service</span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-[#0F0F0F] md:text-4xl lg:text-5xl">
                    Proudly Serving
                    <br />
                    <span className="font-serif italic text-[#C72C5B]">Guildford & Surrey</span>
                  </h2>
                  <p className="text-gray-600">{service.localFocus}</p>
                </AnimatedContent>
              </div>

              <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.2} ease="power3.out">
                <div className="flex flex-wrap gap-3">
                  {['Guildford', 'Woking', 'Farnham', 'Dorking', 'Reigate', 'Cobham', 'Esher', 'Leatherhead'].map((town) => (
                    <span
                      key={town}
                      className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#C72C5B]/30 hover:bg-[#C72C5B]/5"
                    >
                      {town}
                    </span>
                  ))}
                </div>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <span className="text-3xl text-[#C72C5B]">&ldquo;</span>
            </div>
            <blockquote className="mb-8 text-2xl font-medium leading-relaxed text-white md:text-3xl">
              {service.testimonial.quote}
            </blockquote>
            <div>
              <div className="font-semibold text-white">{service.testimonial.author}</div>
              <div className="text-sm text-[#C72C5B]">{service.testimonial.role}</div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C72C5B] py-24 md:py-32">
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
