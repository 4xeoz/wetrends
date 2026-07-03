'use client'
import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import AnimatedContent from "@/components/ui/animated-content";

export default function Pricing() {
  return (
    <section className="relative bg-white py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <AnimatedContent
          direction="vertical"
          distance={50}
          duration={0.8}
          ease="power3.out"
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
            <span className="h-px w-8 bg-[#C72C5B]" />
            Partnerships
            <span className="h-px w-8 bg-[#C72C5B]" />
          </span>
          <h2 className="text-4xl font-bold text-[#0F0F0F] md:text-5xl">
            Let's Work <span className="font-serif italic text-[#C72C5B]">Together</span>
          </h2>
        </AnimatedContent>

        {/* Single Card */}
        <AnimatedContent
          direction="vertical"
          distance={40}
          duration={0.8}
          delay={0.1}
          ease="power3.out"
        >
          <div className="overflow-hidden rounded-3xl bg-[#0F0F0F]">
            {/* Top accent */}
            <div className="h-1 bg-[#C72C5B]" />
            
            <div className="p-8 md:p-12">
              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  Book a Free Consultation
                </h3>
                <p className="mx-auto mt-4 max-w-lg text-gray-400">
                  Whether you need a one-time project or ongoing support, 
                  let's discuss how we can help bring your ideas to life.
                </p>
              </div>

              {/* Services */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {['Software', 'Web Design', 'Video', 'Branding', 'Consulting'].map((item) => (
                  <span 
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center gap-4">
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white hover:text-[#0F0F0F]"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule a Call
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="text-sm text-gray-500">
                  No commitment required. 30 minutes, zero cost.
                </p>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Trust indicators */}
        <AnimatedContent
          direction="vertical"
          distance={30}
          duration={0.8}
          delay={0.2}
          ease="power3.out"
          className="mt-12 flex justify-center gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-[#0F0F0F]">48h</div>
            <div className="text-sm text-gray-500">First draft</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F0F0F]">No</div>
            <div className="text-sm text-gray-500">Contracts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F0F0F]">∞</div>
            <div className="text-sm text-gray-500">Revisions</div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
