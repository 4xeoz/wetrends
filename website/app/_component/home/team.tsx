'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Linkedin, Twitter } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const team = [
  {
    name: 'Eyad Cherifi',
    role: 'Founder & Creative Director',
    image: '/images/iyad_cherifi.webp',
    bio: 'Visionary leader with a passion for storytelling and brand building. 10+ years in creative industry.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Head of Strategy',
    image: '/images/person1.webp',
    bio: 'Data-driven strategist who turns insights into impactful campaigns that deliver ROI.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'James Anderson',
    role: 'Lead Designer',
    image: '/images/person2.webp',
    bio: 'Award-winning designer crafting visual experiences that captivate and convert.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Emily Chen',
    role: 'Video Production Lead',
    image: '/images/person3.webp',
    bio: 'Video wizard bringing stories to life through cinematic visuals and motion.',
    linkedin: '#',
    twitter: '#',
  },
];

export function Team() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <AnimatedContent
              key={member.name}
              direction="vertical"
              distance={100}
              duration={1}
              delay={0.1 * index}
              ease="power3.out"
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                {/* Image Container */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
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
                  
                  {/* Overlay with social links */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6"
                  >
                    <div className="flex gap-3">
                      <motion.a
                        href={member.linkedin}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-[#C72C5B]"
                      >
                        <Linkedin className="h-5 w-5" />
                      </motion.a>
                      <motion.a
                        href={member.twitter}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-[#C72C5B]"
                      >
                        <Twitter className="h-5 w-5" />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="mb-1 text-xl font-bold text-gray-900">
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
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 md:p-12">
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
