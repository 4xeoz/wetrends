import React from 'react';
import AnimatedContent from "@/components/ui/animated-content";

/**
 * SubHero - Full height section with CSS gradient background
 */
const SubHero = () => {
    return (
        <section className="relative min-h-screen bg-[#C72C5B] text-white py-10 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
            {/* CSS Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C72C5B] via-[#a8244a] to-[#8a1c3d]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.1),transparent_50%)]" />

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                {/* Mobile Layout - Stacked Cards */}
                <div className="md:hidden flex flex-col gap-6">
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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C72C5B] to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    E
                                </div>
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                            <blockquote className="text-gray-800 text-lg leading-relaxed italic">
                                <span className="text-[#C72C5B] font-serif italic font-bold">&ldquo;Brand identity</span> and{" "}
                                <span className="text-[#C72C5B] font-serif italic font-bold">story telling</span> is what will set you{" "}
                                <span className="">apart from others&rdquo;</span>
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
                        <div className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-5 shadow-lg border border-white/20">
                            <p className="text-lg leading-relaxed italic font-bold">
                                &ldquo;We embed like co-founders, treat every win as our own, safeguard your brand&apos;s identity, and drive
                                long-term growth not a one-off gig.&rdquo;
                            </p>
                        </div>
                    </AnimatedContent>
                </div>

                {/* Desktop Layout - Positioned Cards */}
                <div className='hidden md:flex items-center justify-center h-full w-full relative min-h-[80vh]'>
                    <AnimatedContent
                        direction="horizontal"
                        distance={150}
                        duration={1.2}
                        delay={0.3}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="absolute top-0 right-0 lg:top-8 lg:right-8 xl:right-16"
                    >
                        <div className="bg-white rounded-2xl p-6 py-10 shadow-lg max-w-xs transform rotate-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C72C5B] to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                    E
                                </div>
                                <div className="flex space-x-1">
                                    <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                            <blockquote className="text-gray-800 text-2xl leading-relaxed italic">
                                <span className="text-[#C72C5B] font-serif italic font-bold">&ldquo;Brand identity</span> and{" "}
                                <span className="text-[#C72C5B] font-serif italic font-bold">story telling</span> is what will set you{" "}
                                <span className="">apart from others&rdquo;</span>
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
                        className="absolute bottom-0 left-0 lg:bottom-16 lg:left-8 xl:left-16"
                    >
                        <div className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 py-10 shadow-lg max-w-sm transform -rotate-1 border border-white/20">
                            <p className="text-2xl leading-relaxed italic font-bold">
                                &ldquo;We embed like co-founders, treat every win as our own, safeguard your brand&apos;s identity, and drive
                                long-term growth not a one-off gig.&rdquo;
                            </p>
                        </div>
                    </AnimatedContent>
                </div>
            </div>
        </section>
    );
};

export default SubHero;
