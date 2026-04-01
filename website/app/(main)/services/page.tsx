'use client';

import { motion } from 'motion/react';
import { 
  Video, 
  Palette, 
  Globe, 
  Users, 
  Zap, 
  PenTool,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = [
  {
    slug: 'video-production',
    number: '01',
    icon: Video,
    title: 'Video Production',
    headline: 'Cinematic Stories That Captivate',
    description: 'From concept to final cut, we create video content that stops the scroll and drives engagement. Our Guildford studio produces everything from brand films to social shorts.',
    features: ['Brand Films', 'Social Content', 'Motion Graphics', 'Commercials', 'Documentary Style', 'Product Videos'],
    benefits: [
      'Increase engagement by up to 1200% with video content',
      'Professional 4K/8K production quality',
      'Fast turnaround - from brief to delivery in 2 weeks',
      'Local filming across Surrey & London'
    ],
    color: '#C72C5B',
    stats: { label: 'Videos Produced', value: '500+' },
  },
  {
    slug: 'brand-identity',
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    headline: 'Make Your Brand Unforgettable',
    description: 'We craft distinctive visual identities that capture your essence and resonate with your audience. Stand out in the crowded Guildford and Surrey business landscape.',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Packaging', 'Brand Strategy', 'Naming'],
    benefits: [
      'Cohesive brand presence across all touchpoints',
      'Memorable visual systems that drive recognition',
      'Strategic positioning to differentiate from competitors',
      'Scalable identity systems for growth'
    ],
    color: '#8B5CF6',
    stats: { label: 'Brands Launched', value: '150+' },
  },
  {
    slug: 'web-design',
    number: '03',
    icon: Globe,
    title: 'Web Design',
    headline: 'Websites That Convert Visitors',
    description: 'High-performing digital experiences built for results. We design and develop websites that turn Guildford browsers into buyers across all devices.',
    features: ['UI/UX Design', 'Development', 'E-commerce', 'Web Apps', 'SEO Optimization', 'CMS Integration'],
    benefits: [
      'Average 3x increase in conversion rates',
      'Mobile-first responsive design',
      'Lightning-fast performance (90+ PageSpeed)',
      'Built with Next.js for scalability'
    ],
    color: '#3B82F6',
    stats: { label: 'Sites Launched', value: '200+' },
  },
  {
    slug: 'social-media',
    number: '04',
    icon: Users,
    title: 'Social Media',
    headline: 'Build Communities That Care',
    description: 'Strategic social media management that grows your following and turns engagement into revenue. We handle content, community, and campaigns across all platforms.',
    features: ['Content Strategy', 'Creative Direction', 'Community Management', 'Analytics', 'Paid Social', 'Influencer Campaigns'],
    benefits: [
      'Consistent brand voice across all platforms',
      'Data-driven content that resonates',
      '24/7 community management & engagement',
      'Monthly reporting with actionable insights'
    ],
    color: '#10B981',
    stats: { label: 'Followers Grown', value: '2M+' },
  },
  {
    slug: 'animation',
    number: '05',
    icon: Zap,
    title: 'Animation',
    headline: 'Bring Your Brand to Life',
    description: 'Dynamic motion design that explains, entertains, and engages. From 2D explainers to complex motion graphics, we make the complex simple and captivating.',
    features: ['2D Animation', 'Motion Graphics', 'Explainers', 'Micro-interactions', 'Logo Animation', 'Lottie Files'],
    benefits: [
      'Explain complex products in 60 seconds',
      'Increase time-on-page by 40%',
      'Universal language - no translation needed',
      'Endless creative possibilities'
    ],
    color: '#F59E0B',
    stats: { label: 'Animations', value: '300+' },
  },
  {
    slug: 'content-strategy',
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    headline: 'Words That Work Harder',
    description: 'Strategic content that positions you as the authority in your space. We craft narratives that educate, engage, and convert your Guildford and UK audience.',
    features: ['SEO Content', 'Copywriting', 'Editorial', 'Storytelling', 'Blog Management', 'Email Campaigns'],
    benefits: [
      'Rank higher with SEO-optimized content',
      'Establish thought leadership in your industry',
      'Consistent publishing schedule',
      'Data-driven topic selection'
    ],
    color: '#EC4899',
    stats: { label: 'Articles Written', value: '1000+' },
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;
  
  return (
    <AnimatedContent
      direction="vertical"
      distance={80}
      duration={1}
      delay={0.1 * index}
      ease="power3.out"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full"
      >
        <Link href={`/services/${service.slug}/`}>
          <div className="relative h-full overflow-hidden rounded-3xl bg-gray-900 p-8 md:p-10">
            {/* Background hover effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
              style={{ backgroundColor: service.color }}
            />
            
            {/* Large number background */}
            <span 
              className="absolute right-6 top-6 text-8xl font-bold text-white/5 md:text-9xl"
              style={{ WebkitTextStroke: `1px ${service.color}30` }}
            >
              {service.number}
            </span>

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: service.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: service.color }}>
                      {service.number}
                    </span>
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors group-hover:border-white/40 group-hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </div>

              {/* Description */}
              <p className="mb-6 text-gray-400">
                {service.description}
              </p>

              {/* Features */}
              <div className="mb-6 flex flex-wrap gap-2">
                {service.features.slice(0, 4).map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-6">
                <TrendingUp className="h-4 w-4" style={{ color: service.color }} />
                <span className="text-sm text-white/60">
                  <strong className="text-white">{service.stats.value}</strong> {service.stats.label}
                </span>
              </div>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: service.color }}
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </Link>
      </motion.div>
    </AnimatedContent>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left - Content */}
            <div>
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                ease="power3.out"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/30 bg-[#C72C5B]/10 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-[#C72C5B]" />
                  <span className="text-sm font-medium text-[#C72C5B]">
                    Full-Service Creative Agency
                  </span>
                </div>
              </AnimatedContent>

              <AnimatedContent
                direction="vertical"
                distance={80}
                duration={1.2}
                delay={0.1}
                ease="power3.out"
              >
                <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                  Services That
                  <br />
                  <span className="text-[#C72C5B]">Drive Growth</span>
                </h1>
              </AnimatedContent>

              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1.2}
                delay={0.2}
                ease="power3.out"
              >
                <p className="mb-8 max-w-xl text-lg text-gray-400">
                  From concept to execution, we deliver end-to-end creative solutions 
                  that transform brands and accelerate business success across Guildford, 
                  Surrey, and the entire UK.
                </p>
              </AnimatedContent>

              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1.2}
                delay={0.3}
                ease="power3.out"
              >
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#C72C5B]" />
                    <span className="text-white/80">Guildford, Surrey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#C72C5B]" />
                    <span className="text-white/80">2-Week Turnaround</span>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            {/* Right - Stats */}
            <div className="grid grid-cols-2 gap-4">
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.2}
                ease="power3.out"
              >
                <div className="rounded-2xl bg-gray-900 p-6 text-center">
                  <div className="text-4xl font-bold text-[#C72C5B] md:text-5xl">6</div>
                  <div className="mt-2 text-sm text-gray-400">Core Services</div>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.3}
                ease="power3.out"
              >
                <div className="rounded-2xl bg-gray-900 p-6 text-center">
                  <div className="text-4xl font-bold text-[#C72C5B] md:text-5xl">200+</div>
                  <div className="mt-2 text-sm text-gray-400">Projects Delivered</div>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.4}
                ease="power3.out"
              >
                <div className="rounded-2xl bg-gray-900 p-6 text-center">
                  <div className="text-4xl font-bold text-[#C72C5B] md:text-5xl">97%</div>
                  <div className="mt-2 text-sm text-gray-400">Client Retention</div>
                </div>
              </AnimatedContent>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.5}
                ease="power3.out"
              >
                <div className="rounded-2xl bg-gray-900 p-6 text-center">
                  <div className="text-4xl font-bold text-[#C72C5B] md:text-5xl">5★</div>
                  <div className="mt-2 text-sm text-gray-400">Average Rating</div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Explore Our <span className="text-[#C72C5B]">Expertise</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Click on any service to learn more about how we can help your business grow.
            </p>
          </AnimatedContent>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                ease="power3.out"
              >
                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                  Why Guildford
                  <br />
                  <span className="text-[#C72C5B]">Chooses Us</span>
                </h2>
              </AnimatedContent>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.1}
                ease="power3.out"
              >
                <p className="text-lg text-gray-400">
                  We&apos;re not just another agency. We&apos;re your local creative partner 
                  with national reach, combining Guildford&apos;s creative energy with 
                  big-agency expertise.
                </p>
              </AnimatedContent>
            </div>

            <div className="space-y-4">
              {[
                'Local team with global brand experience',
                'Rapid turnaround without compromising quality',
                'Transparent pricing - no hidden fees',
                'Dedicated account manager for every client',
                'Data-driven creative that delivers ROI',
                'Flexible packages for startups to enterprises',
              ].map((item, index) => (
                <AnimatedContent
                  key={item}
                  direction="horizontal"
                  distance={40}
                  duration={0.8}
                  delay={0.1 * index}
                  ease="power3.out"
                >
                  <div className="flex items-center gap-4 rounded-xl bg-black/50 p-4">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[#C72C5B]" />
                    <span className="text-white">{item}</span>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Let&apos;s discuss how our services can help you achieve your business goals.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#C72C5B]/25 transition-all hover:bg-[#A3244A]"
            >
              Get a Free Consultation
              <ArrowUpRight className="h-5 w-5" />
            </motion.a>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
