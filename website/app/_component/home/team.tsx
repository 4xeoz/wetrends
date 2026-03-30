'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { teamMembers } from '@/lib/team-data';

const team = teamMembers;

export function Team() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white py-20 md:py-32 flex items-center">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-16 text-center md:mb-20">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
          >
            <span className="mb-4 inline-block rounded-full bg-[#C72C5B]/10 px-4 py-1.5 text-sm font-medium text-[#C72C5B]">
              Our Team
            </span>
          </AnimatedContent>
          
          <AnimatedContent
            direction="vertical"
            distance={80}
            duration={1.2}
            delay={0.1}
            ease="power3.out"
          >
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              Meet The
              <span className="ml-2 font-serif italic text-[#C72C5B]">Creatives</span>
            </h2>
          </AnimatedContent>
          
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1.2}
            delay={0.2}
            ease="power3.out"
          >
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              A passionate team of strategists, designers, and storytellers 
              dedicated to bringing your brand vision to life.
            </p>
          </AnimatedContent>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" id="team">
          {team.map((member, index) => (
            <AnimatedContent
              key={member.id}
              direction="vertical"
              distance={100}
              duration={1}
              delay={0.1 * index}
              ease="power3.out"
            >
              <Link href={`/who/${member.id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="group relative cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-100">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="aspect-[3/4] w-full"
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        quality={60}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                    </motion.div>
                    
                    {/* Overlay with view profile */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60"
                    >
                      <span className="flex items-center gap-2 text-white font-medium">
                        View Profile
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="mb-1 text-xl font-bold text-gray-900 group-hover:text-[#C72C5B] transition-colors">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-[#C72C5B]">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </AnimatedContent>
          ))}
        </div>

        {/* Join the team CTA */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.5}
          ease="power3.out"
          className="mt-20 text-center"
        >
          <div className="rounded-2xl bg-gray-900 p-8 md:p-12">
            <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              Want to Join Our Team?
            </h3>
            <p className="mb-6 text-gray-300">
              We&apos;re always looking for talented creatives to join our growing team.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              View Open Positions
            </motion.a>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
