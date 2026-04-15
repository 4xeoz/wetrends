'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const floatingPills = [
  { label: 'Creative', top: '18%', left: '10%', delay: 0 },
  { label: 'Strategic', top: '25%', right: '12%', delay: 0.8 },
  { label: 'Technical', bottom: '20%', left: '15%', delay: 1.6 },
];

function FloatingPill({
  pill,
  index,
  parallaxX,
  parallaxY,
}: {
  pill: typeof floatingPills[0];
  index: number;
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  const moveX = useTransform(parallaxX, [-0.5, 0.5], [-18 - index * 6, 18 + index * 6]);
  const moveY = useTransform(parallaxY, [-0.5, 0.5], [-14 - index * 4, 14 + index * 4]);

  return (
    <motion.div
      style={{
        top: pill.top,
        left: pill.left,
        right: pill.right,
        bottom: pill.bottom,
        x: moveX,
        y: moveY,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }}
      className="absolute"
    >
      <div
        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium tracking-wide text-white/80 backdrop-blur-md"
        style={{ animation: `floatY ${4 + index * 0.6}s ease-in-out infinite`, animationDelay: `${pill.delay}s` }}
      >
        {pill.label}
      </div>
    </motion.div>
  );
}

const services = [
  {
    slug: 'video-production',
    number: '01',
    icon: Video,
    title: 'Video Production',
    headline: 'Cinematic Stories That Captivate',
    description: 'From concept to final cut, we create video content that stops the scroll and drives engagement.',
    video: '/videos/video-preview-wetrends.mp4',
  },
  {
    slug: 'brand-identity',
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    headline: 'Make Your Brand Unforgettable',
    description: 'Distinctive visual identities that capture your essence and resonate with your audience.',
    video: '/videos/design-preview-wetrends.mp4',
  },
  {
    slug: 'web-design',
    number: '03',
    icon: Globe,
    title: 'Web Design',
    headline: 'Websites That Convert Visitors',
    description: 'High-performing digital experiences built for results across all devices.',
    video: '/videos/website-preview-wetrends.mp4',
  },
  {
    slug: 'social-media',
    number: '04',
    icon: Users,
    title: 'Social Media',
    headline: 'Build Communities That Care',
    description: 'Strategic social media management that grows your following and turns engagement into revenue.',
    video: '/videos/social-preview-wetrends.mp4',
  },
  {
    slug: 'animation',
    number: '05',
    icon: Zap,
    title: 'Animation',
    headline: 'Bring Your Brand to Life',
    description: 'Dynamic motion design that explains, entertains, and engages every viewer.',
    video: '/videos/animations-preview-wetrends.mp4',
  },
  {
    slug: 'content-strategy',
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    headline: 'Words That Work Harder',
    description: 'Strategic content that positions you as the authority in your space.',
    video: '/videos/design-preview-wetrends.mp4',
  },
];

function ServiceRow({
  service,
  index,
}: {
  service: typeof services[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <AnimatedContent
      direction="horizontal"
      distance={60}
      duration={0.8}
      delay={0.1 * index}
      ease="power3.out"
    >
      <Link href={`/services/${service.slug}/`} className="block">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden border-b border-white/10 py-8 md:py-10"
        >
          {/* Hover background wipe */}
          <motion.div
            className="absolute inset-0 bg-[#C72C5B]"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '0%' : '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Video preview on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay"
            animate={{ opacity: isHovered ? 0.3 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <video
              src={service.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </motion.div>

          <div className="relative z-10 flex items-center justify-between gap-4 md:gap-8">
            {/* Left: Number + Icon + Title */}
            <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
              <span className="text-sm font-mono text-white/40 md:text-base">
                {service.number}
              </span>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-colors group-hover:border-white/40 group-hover:bg-white/10 md:h-12 md:w-12"
              >
                <Icon className="h-4 w-4 text-white md:h-5 md:w-5" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white transition-transform group-hover:translate-x-2 md:text-3xl lg:text-4xl">
                  {service.title}
                </h3>
                <p className="mt-1 hidden max-w-md text-sm text-white/50 transition-colors group-hover:text-white/80 md:block">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Right: Arrow */}
            <motion.div
              animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#C72C5B] md:h-14 md:w-14"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45 md:h-6 md:w-6" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </AnimatedContent>
  );
}

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const width = useTransform(scrollYProgress, [0, 0.7], ['90%', '100%']);
  const height = useTransform(scrollYProgress, [0, 0.7], ['80%', '100%']);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ['2rem', '0rem']);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { stiffness: 60, damping: 20 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  return (
    <main className="min-h-[100svh] bg-white">
      {/* Dark Expanding Hero */}
      <section ref={containerRef} className="relative z-20 h-[110svh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-white">
          <motion.div
            style={{ width, height, borderRadius, opacity: cardOpacity }}
            className="relative overflow-hidden bg-[#050505] text-white will-change-[width,height,border-radius]"
            onMouseMove={handleMouseMove}
          >
            {/* Aurora orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute -right-[20%] -top-[20%] h-[70svw] w-[70svw] rounded-full opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(199,44,91,0.4) 0%, transparent 70%)',
                  animation: 'drift1 22s ease-in-out infinite',
                }}
              />
              <div
                className="absolute -bottom-[30%] -left-[10%] h-[60svw] w-[60svw] rounded-full opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(188,42,80,0.3) 0%, transparent 70%)',
                  animation: 'drift2 28s ease-in-out infinite',
                }}
              />
            </div>

            {/* Noise */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Floating pills */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {floatingPills.map((pill, index) => (
                <FloatingPill
                  key={pill.label}
                  pill={pill}
                  index={index}
                  parallaxX={parallaxX}
                  parallaxY={parallaxY}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col px-6 pb-8 pt-24 md:px-10 md:pb-12 lg:px-16">
              <div className="mx-auto w-full max-w-7xl flex-1">
                <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
                  <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B]">
                    What We Do
                  </p>
                </AnimatedContent>

                <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.2} ease="power3.out">
                  <h1 className="text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.85] tracking-tight">
                    <span className="block text-white">Services</span>
                    <span className="block font-serif italic text-[#C72C5B]">Built to Perform.</span>
                  </h1>
                </AnimatedContent>

                <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4} ease="power3.out">
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg">
                    End-to-end creative solutions that transform brands and accelerate business success. One team. One vision. Zero compromise.
                  </p>
                </AnimatedContent>

                {/* Services List */}
                <div className="mt-10 md:mt-14">
                  {services.map((service, index) => (
                    <ServiceRow key={service.slug} service={service} index={index} />
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mx-auto w-full max-w-7xl border-t border-white/10 pt-6 md:pt-8">
                <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.6} ease="power3.out">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-white/50">
                      Not sure what you need? Let&apos;s figure it out together.
                    </p>
                    <Link
                      href="/#contact"
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#C72C5B] transition-transform hover:scale-105"
                    >
                      Book a Call
                      <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </AnimatedContent>
              </div>
            </div>

            {/* Keyframes */}
            <style jsx>{`
              @keyframes drift1 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(-8%, 6%) scale(1.08); }
              }
              @keyframes drift2 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(6%, -8%) scale(1.05); }
              }
              @keyframes floatY {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                How We Work
              </span>
              <h2 className="text-4xl font-bold text-[#0F0F0F] md:text-5xl lg:text-6xl">
                Simple Process.
                <br />
                <span className="font-serif italic text-[#C72C5B]">Stunning Results.</span>
              </h2>
            </AnimatedContent>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Discover', desc: 'We dive deep into your brand, goals, and audience.' },
              { step: '02', title: 'Design', desc: 'We craft concepts that bring your vision to life.' },
              { step: '03', title: 'Develop', desc: 'We build, film, animate, and write with precision.' },
              { step: '04', title: 'Deliver', desc: 'We launch, optimize, and support your growth.' },
            ].map((item, index) => (
              <AnimatedContent
                key={item.step}
                direction="vertical"
                distance={50}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <div className="group relative h-full rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg md:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#0F0F0F] md:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#C72C5B] transition-all duration-500 group-hover:w-full rounded-b-2xl" />
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Start?
            </h2>
            <p className="mb-8 text-lg text-white/60">
              Tell us what you&apos;re building. We&apos;ll handle the rest.
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
