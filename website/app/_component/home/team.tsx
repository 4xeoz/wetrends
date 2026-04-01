'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Twitter, ArrowUpRight, Quote, Sparkles } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { teamMembers } from '@/lib/team-data';

const team = teamMembers;

// Featured team member (first one)
const featuredMember = team[0];
const otherMembers = team.slice(1);

export function Team() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={containerRef}
      id="team"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Background Pattern */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#C72C5B]/10" />
        <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-[#8B5CF6]/10" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <AnimatedContent
              direction="vertical"
              distance={60}
              duration={1}
              ease="power3.out"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/30 bg-[#C72C5B]/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#C72C5B]" />
                <span className="text-sm font-medium text-[#C72C5B]">
                  The Creative Minds
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
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
                Meet The
                <br />
                <span className="font-serif italic text-[#C72C5B]">Team</span>
              </h2>
            </AnimatedContent>
          </div>

          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1.2}
            delay={0.2}
            ease="power3.out"
          >
            <p className="max-w-md text-lg text-gray-600">
              A passionate collective of strategists, designers, and storytellers
              dedicated to transforming brands across Guildford, Surrey, and beyond.
            </p>
          </AnimatedContent>
        </div>

        {/* Featured Member - Large Card */}
        <AnimatedContent
          direction="vertical"
          distance={100}
          duration={1.2}
          delay={0.2}
          ease="power3.out"
          className="mb-12"
        >
          <Link href={`/who/${featuredMember.id}/`}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-xl"
            >
              <div className="grid lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-80 lg:h-[500px]">
                  <Image
                    src={featuredMember.image}
                    alt={featuredMember.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:to-transparent" />

                  {/* View Profile Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-900">
                      View Profile
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-4 flex items-center gap-2 text-[#C72C5B]">
                    <span className="text-sm font-medium">Founder & Creative Director</span>
                  </div>

                  <h3 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                    {featuredMember.name}
                  </h3>

                  <p className="mb-6 text-gray-600">
                    {featuredMember.fullBio.split('\n\n')[0]}
                  </p>

                  {/* Skills */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {featuredMember.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="mb-6 space-y-2">
                    {featuredMember.achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C72C5B]" />
                        {achievement}
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <motion.a
                      href={featuredMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#C72C5B] hover:text-white"
                    >
                      <Linkedin className="h-4 w-4" />
                    </motion.a>
                    <motion.a
                      href={featuredMember.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#C72C5B] hover:text-white"
                    >
                      <Twitter className="h-4 w-4" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </AnimatedContent>

        {/* Other Team Members - Horizontal Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {otherMembers.map((member, index) => (
            <AnimatedContent
              key={member.id}
              direction="vertical"
              distance={80}
              duration={1}
              delay={0.1 * index}
              ease="power3.out"
            >
              <Link href={`/who/${member.id}/`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group h-full overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900">
                        View Profile
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="mb-1 block text-sm text-[#C72C5B]">
                      {member.role}
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-[#C72C5B] transition-colors">
                      {member.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {member.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                      <motion.a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
                      >
                        <Linkedin className="h-3 w-3" />
                      </motion.a>
                      <motion.a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-[#C72C5B] hover:text-white"
                      >
                        <Twitter className="h-3 w-3" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </AnimatedContent>
          ))}
        </div>

        {/* Team Philosophy Quote */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.4}
          ease="power3.out"
          className="mt-16"
        >
          <div className="relative rounded-3xl bg-[#C72C5B] p-8 md:p-12 lg:p-16">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-white/10 md:h-24 md:w-24" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                  We believe in creative partnerships, not vendor relationships.
                </h3>
                <p className="text-white/80">
                  When you work with WeTrends, you get a dedicated team that treats your brand
                  like their own. We embed ourselves in your vision and work tirelessly to bring it to life.
                </p>
              </div>

              <div className="flex flex-wrap justify-start gap-4 lg:justify-end">
                <motion.a
                  href="/#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#C72C5B] transition-colors hover:bg-gray-100"
                >
                  Work With Us
                  <ArrowUpRight className="h-4 w-4" />
                </motion.a>
                <motion.a
                  href="/services/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Our Services
                </motion.a>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Join the team CTA */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.5}
          ease="power3.out"
          className="mt-12 text-center"
        >
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 md:p-12">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              Want to Join Our Team?
            </h3>
            <p className="mb-6 max-w-xl mx-auto text-gray-600">
              We&apos;re always looking for talented creatives who are passionate about
              building exceptional brands. Check out our open positions.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#A3244A]"
            >
              View Open Positions
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
