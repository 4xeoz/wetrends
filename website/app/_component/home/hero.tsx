'use client';
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import AnimatedContent from "@/components/ui/animated-content";

/**
 * Hero - Responsive hero section with Next.js Image
 */
const Hero = () => {

    return (
        <div className="bg-wetrend pb-10 md:pb-20 px-4 sm:px-6 lg:px-8 text-white relative min-h-[600px] md:h-fit md:max-h-[1300px] w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Background Image using Next.js Image */}
                <Image
                    src="/images/background 1.png"
                    alt="Hero background"
                    fill
                    className="object-cover z-0"
                    priority
                    quality={90}
                    sizes="100vw"
                />

                {/* Ellipse Images Stacked with Stagger Animation */}
                <AnimatedContent
                    direction="vertical"
                    distance={500}
                    duration={1.8}
                    delay={1.8}
                    ease="power3.out"
                    className="absolute inset-0 z-10"
                    animateOpacity={true}
                    threshold={0}
                >
                    <Image
                        src="/images/Ellipse 1.png"
                        alt="Ellipse 1.png"
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="100vw"
                    />
                </AnimatedContent>

                <AnimatedContent
                    direction="vertical"
                    distance={500}
                    duration={1.8}
                    delay={2}
                    ease="power3.out"
                    className="absolute inset-0 z-10"
                    animateOpacity={true}
                    threshold={0}
                >
                    <Image
                        src="/images/Ellipse 2.png"
                        alt="Ellipse 2"
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="100vw"
                    />
                </AnimatedContent>

                <AnimatedContent
                    direction="vertical"
                    distance={500}
                    duration={1.8}
                    delay={2.2}
                    ease="power3.out"
                    className="absolute inset-0 z-10"
                    animateOpacity={true}
                    threshold={0}
                >
                    <Image
                        src="/images/Ellipse 3.png"
                        alt="Ellipse 3"
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="100vw"
                    />
                </AnimatedContent>

                

                {/* Content Container */}
                <div className="relative z-20 flex flex-col items-center justify-center min-h-[400px] md:h-fit md:max-h-[1300px] py-8 md:py-0">
                    <div className="hidden 2xl:h-[20vh] xl:h-[10vh] md:block"></div>
                    <div className="text-center text-white px-4">
                        <AnimatedContent
                            direction="vertical"
                            distance={80}
                            reverse={true}
                            delay={4}
                            duration={1.2}
                            ease="power3.out"
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[160px] 2xl:text-[220px] font-bold mb-4 md:mb-8">
                                WETRENDS
                            </h1>
                        </AnimatedContent>

                        {/* Centered Content */}
                        <div className="space-y-6 md:space-y-12 mt-8 md:mt-16 max-w-4xl mx-auto">
                            {/* Main Tagline */}
                            <AnimatedContent
                                direction="vertical"
                                distance={60}
                                reverse={true}
                                delay={4.15}
                                duration={1.2}
                                ease="power3.out"
                            >
                                <div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                        Your Brand's
                                        <span className="font-serif italic font-bold text-white"> Growth</span> Partner
                                    </h2>
                                </div>
                            </AnimatedContent>

                            {/* Location Tag */}
                            <AnimatedContent
                                direction="vertical"
                                distance={40}
                                reverse={true}
                                delay={4.25}
                                duration={1}
                                ease="power3.out"
                            >
                                <p className="text-white/80 text-sm md:text-base uppercase tracking-widest font-medium">
                                    Guildford, Surrey • Serving Businesses Across the UK
                                </p>
                            </AnimatedContent>

                            {/* Description */}
                            <AnimatedContent
                                direction="vertical"
                                distance={60}
                                reverse={true}
                                delay={4.3}
                                duration={1.2}
                                ease="power3.out"
                            >
                                <p className="text-white/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto px-2 md:px-0">
                                    Unlock the partnership that plans, produces and iterates digital
                                    assets until the numbers move. No hand-offs, no fluff, just work
                                    that ships.
                                </p>
                            </AnimatedContent>

                            {/* CTA Button */}
                            <AnimatedContent
                                direction="vertical"
                                distance={60}
                                reverse={true}
                                delay={4.45}
                                duration={1.2}
                                ease="power3.out"
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <Link
                                        href="#contact"
                                        className="flex items-center justify-center bg-white text-[#C72C5B] w-12 h-12 md:w-16 md:h-16 rounded-full font-semibold hover:bg-white/90 transition-colors duration-200 shadow-lg custom-bounce"
                                    >
                                        <ArrowDown color="#C72C5B" className="w-5 h-5 md:w-6 md:h-6" />
                                    </Link>
                                </div>
                            </AnimatedContent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
