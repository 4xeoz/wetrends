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
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Sparkles
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = {
  'video-production': {
    icon: Video,
    title: 'Video Production',
    headline: 'Cinematic Stories That Stop The Scroll',
    description: 'From concept to final cut, we create video content that captures attention and drives meaningful engagement across all platforms. Our Guildford studio combines creative excellence with technical expertise.',
    color: '#C72C5B',
    features: ['Brand Films', 'Social Content', 'Motion Graphics', 'Commercials', 'Documentary Style', 'Product Videos', 'Event Coverage', 'Aerial/Drone'],
    process: [
      { step: '01', title: 'Discovery', description: 'We learn your brand, goals, and audience to craft the perfect concept.' },
      { step: '02', title: 'Pre-Production', description: 'Scriptwriting, storyboarding, location scouting, and crew assembly.' },
      { step: '03', title: 'Production', description: 'Professional filming with cinema-grade equipment and experienced crew.' },
      { step: '04', title: 'Post-Production', description: 'Editing, color grading, sound design, and motion graphics.' },
    ],
    benefits: [
      { title: '1200% More Shares', description: 'Video content generates 1200% more shares than text and images combined.' },
      { title: '87% Conversion Boost', description: 'Including video on landing pages can increase conversions by 87%.' },
      { title: 'Better Retention', description: 'Viewers retain 95% of a message when watching video vs 10% reading text.' },
    ],
    stats: { value: '500+', label: 'Videos Produced' },
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
    color: '#8B5CF6',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Packaging', 'Brand Strategy', 'Naming', 'Typography', 'Color Systems'],
    process: [
      { step: '01', title: 'Research', description: 'Deep dive into your market, competitors, and target audience.' },
      { step: '02', title: 'Strategy', description: 'Define your brand positioning, personality, and key messages.' },
      { step: '03', title: 'Design', description: 'Create visual concepts that bring your brand strategy to life.' },
      { step: '04', title: 'Rollout', description: 'Implement across all touchpoints with comprehensive guidelines.' },
    ],
    benefits: [
      { title: 'Increased Recognition', description: 'Consistent branding increases revenue by an average of 33%.' },
      { title: 'Customer Trust', description: '59% of consumers prefer to buy from brands they recognize.' },
      { title: 'Premium Pricing', description: 'Strong brands can command prices 20-30% higher than competitors.' },
    ],
    stats: { value: '150+', label: 'Brands Launched' },
    testimonial: {
      quote: "The brand identity WeTrends created for us perfectly captures who we are. We've seen a 40% increase in brand recognition since the rebrand launched.",
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
    color: '#3B82F6',
    features: ['UI/UX Design', 'Development', 'E-commerce', 'Web Apps', 'SEO Optimization', 'CMS Integration', 'Performance', 'Analytics'],
    process: [
      { step: '01', title: 'Discovery', description: 'Understand your business goals, users, and technical requirements.' },
      { step: '02', title: 'Design', description: 'Create beautiful, intuitive designs focused on user experience.' },
      { step: '03', title: 'Development', description: 'Build with clean code using Next.js, React, and modern technologies.' },
      { step: '04', title: 'Launch', description: 'Rigorous testing, optimization, and deployment to your domain.' },
    ],
    benefits: [
      { title: '3x Conversions', description: 'Our clients see an average 3x increase in conversion rates.' },
      { title: '90+ PageSpeed', description: 'Lightning-fast load times for better SEO and user experience.' },
      { title: 'Mobile First', description: 'Over 60% of traffic is mobile - we design for thumb-friendly interaction.' },
    ],
    stats: { value: '200+', label: 'Sites Launched' },
    testimonial: {
      quote: "Our new website from WeTrends increased online enquiries by 250%. The design is stunning and the performance is incredible - we rank #1 for our key terms.",
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
    color: '#10B981',
    features: ['Content Strategy', 'Creative Direction', 'Community Management', 'Analytics', 'Paid Social', 'Influencer Campaigns', 'Video Content', 'Reporting'],
    process: [
      { step: '01', title: 'Strategy', description: 'Develop a tailored strategy aligned with your business goals.' },
      { step: '02', title: 'Creation', description: 'Produce thumb-stopping content that reflects your brand voice.' },
      { step: '03', title: 'Publishing', description: 'Post at optimal times with compelling captions and hashtags.' },
      { step: '04', title: 'Optimization', description: 'Analyze performance and continuously refine for better results.' },
    ],
    benefits: [
      { title: '2M+ Followers Grown', description: 'We\'ve helped clients grow over 2 million engaged followers.' },
      { title: '4.2x ROI Average', description: 'Our social campaigns deliver an average 4.2x return on investment.' },
      { title: '24/7 Management', description: 'Round-the-clock monitoring and engagement with your community.' },
    ],
    stats: { value: '2M+', label: 'Followers Grown' },
    testimonial: {
      quote: "WeTrends took our Instagram from 500 to 50,000 followers in 6 months. Their content strategy is unmatched - they truly understand what resonates with our audience.",
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
    color: '#F59E0B',
    features: ['2D Animation', 'Motion Graphics', 'Explainers', 'Micro-interactions', 'Logo Animation', 'Lottie Files', 'Character Design', 'UI Animation'],
    process: [
      { step: '01', title: 'Script', description: 'Craft a compelling narrative that communicates your message clearly.' },
      { step: '02', title: 'Storyboard', description: 'Visualize every scene to ensure the story flows perfectly.' },
      { step: '03', title: 'Design', description: 'Create distinctive visual styles that match your brand identity.' },
      { step: '04', title: 'Animate', description: 'Bring designs to life with smooth, engaging motion.' },
    ],
    benefits: [
      { title: 'Explain in 60 Seconds', description: 'Complex products explained simply through animated storytelling.' },
      { title: '40% More Engagement', description: 'Animated content increases time-on-page by an average of 40%.' },
      { title: 'Universal Appeal', description: 'Animation transcends language barriers for global audiences.' },
    ],
    stats: { value: '300+', label: 'Animations' },
    testimonial: {
      quote: "The explainer video WeTrends created helped us reduce support tickets by 60%. Customers finally understand our product, and sales have increased dramatically.",
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
    color: '#EC4899',
    features: ['SEO Content', 'Copywriting', 'Editorial', 'Storytelling', 'Blog Management', 'Email Campaigns', 'White Papers', 'Case Studies'],
    process: [
      { step: '01', title: 'Research', description: 'Identify high-value topics your audience is searching for.' },
      { step: '02', title: 'Outline', description: 'Structure content for maximum engagement and SEO value.' },
      { step: '03', title: 'Write', description: 'Craft compelling copy that informs, entertains, and converts.' },
      { step: '04', title: 'Optimize', description: 'SEO refinement, internal linking, and performance tracking.' },
    ],
    benefits: [
      { title: '3x Organic Traffic', description: 'Our SEO content strategy triples organic traffic on average.' },
      { title: 'Thought Leadership', description: 'Position your brand as the go-to expert in your industry.' },
      { title: 'Evergreen Results', description: 'Quality content continues driving traffic for years.' },
    ],
    stats: { value: '1000+', label: 'Articles Written' },
    testimonial: {
      quote: "Since WeTrends took over our content strategy, our organic traffic has grown 400%. We now rank for over 200 competitive keywords in our industry.",
      author: "David Wilson",
      role: "CMO, FinanceHub UK"
    },
    localFocus: 'We understand the Surrey business landscape and create content that resonates locally while building national authority.',
  },
};

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = services[slug as keyof typeof services];
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link 
            href="/services/"
            className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden py-12 md:py-24">
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
                <div 
                  className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
                  style={{ borderColor: `${service.color}30`, backgroundColor: `${service.color}10` }}
                >
                  <Icon className="h-4 w-4" style={{ color: service.color }} />
                  <span className="text-sm font-medium" style={{ color: service.color }}>
                    {service.title}
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
                <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                  {service.headline.split(' ').slice(0, -2).join(' ')}
                  <br />
                  <span style={{ color: service.color }}>
                    {service.headline.split(' ').slice(-2).join(' ')}
                  </span>
                </h1>
              </AnimatedContent>

              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1.2}
                delay={0.2}
                ease="power3.out"
              >
                <p className="mb-8 max-w-xl text-lg text-gray-600">
                  {service.description}
                </p>
              </AnimatedContent>

              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1.2}
                delay={0.3}
                ease="power3.out"
              >
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="/#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-all"
                    style={{ backgroundColor: service.color }}
                  >
                    Get a Quote
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.a>
                  
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-gray-600">
                    <MapPin className="h-4 w-4" style={{ color: service.color }} />
                    <span className="text-sm">Guildford, Surrey</span>
                  </div>
                </div>
              </AnimatedContent>
            </div>

            {/* Right - Stats Card */}
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1}
              delay={0.3}
              ease="power3.out"
            >
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-12">
                <div className="mb-8 text-center">
                  <div className="text-6xl font-bold md:text-7xl" style={{ color: service.color }}>
                    {service.stats.value}
                  </div>
                  <div className="mt-2 text-gray-600">{service.stats.label}</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">2-Week Average Turnaround</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">100% Satisfaction Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">5-Star Average Rating</span>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
            className="mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              What We <span style={{ color: service.color }}>Offer</span>
            </h2>
            <p className="max-w-2xl text-gray-600">
              Comprehensive {service.title.toLowerCase()} services tailored to your specific needs.
            </p>
          </AnimatedContent>

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
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div 
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: service.color }} />
                  </div>
                  <span className="font-medium text-gray-900">{feature}</span>
                </motion.div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Our <span style={{ color: service.color }}>Process</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              A proven four-step approach that delivers exceptional results every time.
            </p>
          </AnimatedContent>

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
                <div className="relative h-full rounded-2xl border border-gray-200 bg-white p-6">
                  <div 
                    className="mb-4 text-5xl font-bold text-gray-100"
                  >
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  
                  {index < 3 && (
                    <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 lg:flex">
                      <ArrowUpRight className="h-3 w-3 text-gray-400" />
                    </div>
                  )}
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                ease="power3.out"
              >
                <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                  Results That
                  <br />
                  <span style={{ color: service.color }}>Speak Volumes</span>
                </h2>
              </AnimatedContent>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.1}
                ease="power3.out"
              >
                <p className="text-lg text-gray-600">
                  Our {service.title.toLowerCase()} services deliver measurable business impact. 
                  Here&apos;s what you can expect when you work with us.
                </p>
              </AnimatedContent>
            </div>

            <div className="space-y-6">
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
                    whileHover={{ x: 8 }}
                    className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6"
                  >
                    <div 
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <TrendingUp className="h-6 w-6" style={{ color: service.color }} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local Focus Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <AnimatedContent
                  direction="vertical"
                  distance={60}
                  duration={1}
                  ease="power3.out"
                >
                  <div className="mb-4 inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: service.color }} />
                    <span className="text-sm font-medium text-gray-500">Local Service</span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                    Proudly Serving
                    <br />
                    <span style={{ color: service.color }}>Guildford & Surrey</span>
                  </h2>
                  <p className="text-gray-600">
                    {service.localFocus}
                  </p>
                </AnimatedContent>
              </div>
              
              <AnimatedContent
                direction="vertical"
                distance={60}
                duration={1}
                delay={0.2}
                ease="power3.out"
              >
                <div className="flex flex-wrap gap-3">
                  {['Guildford', 'Woking', 'Farnham', 'Dorking', 'Reigate', 'Cobham', 'Esher', 'Leatherhead'].map((town) => (
                    <span 
                      key={town}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
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

      {/* Testimonial Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
          >
            <div 
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${service.color}15` }}
            >
              <span className="text-3xl" style={{ color: service.color }}>"</span>
            </div>
            
            <blockquote className="mb-8 text-2xl font-medium text-gray-900 md:text-3xl">
              {service.testimonial.quote}
            </blockquote>
            
            <div>
              <div className="font-semibold text-gray-900">{service.testimonial.author}</div>
              <div className="text-sm" style={{ color: service.color }}>{service.testimonial.role}</div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32" style={{ backgroundColor: service.color }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Let&apos;s discuss your {service.title.toLowerCase()} project. 
              Free consultation for Guildford & Surrey businesses.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold shadow-lg transition-all hover:bg-gray-100"
              style={{ color: service.color }}
            >
              Start Your Project
              <ArrowUpRight className="h-5 w-5" />
            </motion.a>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
