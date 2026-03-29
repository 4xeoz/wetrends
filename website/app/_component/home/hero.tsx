'use client';
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import AnimatedContent from "@/components/ui/animated-content";

/**
 * Hero - Responsive hero section with Next.js Image
 */
const Hero = () => {
    const logoRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const logo = logoRef.current;
        if (!logo) return;

        // Skip complex animation on mobile for better performance
        if (window.innerWidth < 768) {
            gsap.set(logo, { opacity: 1, scale: 1, x: 0, y: 0 });
            return;
        }

        // Get the logo's current position to calculate offset from viewport center
        const rect = logo.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        // Calculate how far to move from current position to viewport center
        const deltaX = viewportCenterX - (rect.left + rect.width / 2);
        const deltaY = viewportCenterY - (rect.top + rect.height / 2);

        // Create timeline for sequential animations
        const tl = gsap.timeline();

        // Step 1: Fade in from bottom at original position
        tl.fromTo(logo, 
            {
                opacity: 0,
                y: deltaY + 150, // Start below the viewport center
                scale: 4,
                x: deltaX,
            },
            {
                opacity: 1,
                y: deltaY,
                scale: 5,
                x: deltaX,
                duration: 0.4,
                ease: "power2.out"
            }
        )
        // Step 2: Wait 1 second
        .to({}, { duration: 1 })
        // Step 4: Scale back down and return to original position
        .to(logo, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 1.8,
            ease: "power3.inOut"
        });

        return () => {
            tl.kill();
        };
    }, []);

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

                {/* Header */}
                <div className="relative z-30 flex items-center justify-between py-4 md:py-6 px-2 sm:px-4 lg:px-8">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
                        <Image
                            ref={logoRef}
                            src="/images/logo-transparent.svg"
                            alt="WETRENDS Logo"
                            width={150}
                            height={40}
                            priority
                            className="h-6 md:h-8 w-auto"
                        />
                        <AnimatedContent
                            direction="vertical"
                            distance={50}
                            reverse={true}
                            delay={3}
                        >
                            <h1 className="text-lg md:text-2xl font-bold text-white">WETRENDS</h1>
                        </AnimatedContent>
                    </div>

                    {/* CTA Button */}
                    <AnimatedContent
                        direction="vertical"
                        distance={60}
                        reverse={true}
                        delay={3.15}
                        duration={1.2}
                        ease="power3.out"
                    >
                        <Link href="#contact">
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-[#C72C5B] rounded-full px-4 md:px-8 py-4 md:py-8 text-sm md:text-lg font-bold bg-transparent border-2 md:border-4"
                            >
                                <span className="hidden sm:inline">Contact Us</span>
                                <span className="sm:hidden">Contact</span>
                            </Button>
                        </Link>
                    </AnimatedContent>
                </div>

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
