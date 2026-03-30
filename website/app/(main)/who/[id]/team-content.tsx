'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Award } from 'lucide-react';
import { TeamMember } from '@/lib/team-data';

interface TeamMemberContentProps {
  member: TeamMember;
}

export function TeamMemberContent({ member }: TeamMemberContentProps) {
  return (
    <>
      {/* Full Bio Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
          >
            About {member.name.split(' ')[0]}
          </motion.h2>
          <div className="prose prose-invert prose-lg max-w-none">
            {member.fullBio.split('\n\n').map((paragraph, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-300 mb-6 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Achievements */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6">Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-[#C72C5B]/20 text-[#C72C5B] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#C72C5B]" />
                Key Achievements
              </h3>
              <ul className="space-y-4">
                {member.achievements.map((achievement, index) => (
                  <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-2 h-2 bg-[#C72C5B] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Work with {member.name.split(' ')[0]}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mb-8 max-w-xl mx-auto"
          >
            Ready to bring your brand vision to life? Get in touch to discuss your project with our team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-[#C72C5B] hover:bg-[#A3244A] text-white px-8 py-4 rounded-full font-medium transition-colors"
            >
              Start a Project
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
