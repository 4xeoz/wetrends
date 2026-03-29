import React from 'react';
import Image from 'next/image';
import AnimatedContent from "@/components/ui/animated-content";

/**
 * SubHero - Responsive secondary hero section with key features
 */
const SubHero = () => {
    return (
        <section className="bg-wetrends text-white py-10 md:py-20 px-4 sm:px-6 lg:px-8 relative min-h-[600px] md:h-screen md:max-h-[1300px] w-full overflow-hidden">
            <div className="max-w-7xl mx-auto h-full">
                {/* Background Image - Shown on all screens */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/MacBook-Pro-16.png"
                        alt="MacBook Pro background"
                        fill
                        className="object-cover opacity-30 md:opacity-100"
                        priority
                        quality={90}
                        sizes="100vw"
                    />
                </div>

                {/* Mobile Layout - Stacked Cards */}
                <div className="md:hidden relative z-20 flex flex-col gap-6">
                    {/* Top Quote Card */}
                    <AnimatedContent
                        direction="vertical"
                        distance={50}
                        duration={1}
                        delay={0.1}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                    >
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg transform rotate-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <Image
                                    src="/images/iyad_cherifi.jpeg"
                                    alt="Eyad Cherifi"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-10 h-10 flex-shrink-0"
                                    unoptimized
                                />
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                            <blockquote className="text-gray-800 text-lg leading-relaxed italic">
                                <span className="text-wetrends font-serif italic font-bold">"Brand identity</span> and{" "}
                                <span className="text-wetrends font-serif italic font-bold">story telling</span> is what will set you{" "}
                                <span className="">apart from others</span>"
                            </blockquote>
                        </div>
                    </AnimatedContent>

                    {/* Bottom Quote Card */}
                    <AnimatedContent
                        direction="vertical"
                        distance={50}
                        duration={1}
                        delay={0.2}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                    >
                        <div className="bg-wetrends/95 backdrop-blur-sm text-white rounded-2xl p-5 shadow-lg border border-white/20">
                            <p className="text-lg leading-relaxed italic font-bold">
                                "We embed like co-founders, treat every win as our own, safeguard your brand's identity, and drive
                                long-term growth not a one-off gig."
                            </p>
                        </div>
                    </AnimatedContent>
                </div>

                {/* Desktop Layout - Positioned Cards */}
                <div className='hidden md:flex items-center justify-center h-full w-full relative'>
                    <AnimatedContent
                        direction="horizontal"
                        distance={150}
                        duration={1.2}
                        delay={0.3}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="absolute top-0 right-0 lg:top-8 lg:right-8 xl:right-16 z-20"
                    >
                        <div className="bg-white rounded-2xl p-6 py-10 shadow-lg max-w-xs transform rotate-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <Image
                                    src="/images/iyad_cherifi.jpeg"
                                    alt="Eyad Cherifi"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-12 h-12 flex-shrink-0"
                                    unoptimized
                                />
                                <div className="flex space-x-1">
                                    <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                            <blockquote className="text-gray-800 text-2xl leading-relaxed italic">
                                <span className="text-wetrends font-serif italic font-bold">"Brand identity</span> and{" "}
                                <span className="text-wetrends font-serif italic font-bold">story telling</span> is what will set you{" "}
                                <span className="">apart from others</span>"
                            </blockquote>
                        </div>
                    </AnimatedContent>

                    {/* Quote card - bottom left */}
                    <AnimatedContent
                        direction="horizontal"
                        distance={150}
                        reverse={true}
                        duration={1.2}
                        delay={0.1}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="absolute bottom-0 left-0 lg:bottom-16 lg:left-8 xl:left-16 z-20"
                    >
                        <div className="bg-wetrends text-white rounded-2xl p-6 py-10 shadow-lg max-w-sm transform -rotate-1">
                            <p className="text-2xl leading-relaxed italic font-bold">
                                "We embed like co-founders, treat every win as our own, safeguard your brand's identity, and drive
                                long-term growth not a one-off gig."
                            </p>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </section>
    );
};

export default SubHero;
