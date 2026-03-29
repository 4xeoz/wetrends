import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import CTASection from "../../../components/ui/cta-section";
import AnimatedContent from "@/components/ui/animated-content";

/**
 * WhyLoveUs - Responsive section highlighting why customers love the brand
 */
const WhyLoveUs = () => {
    return (
        <section className="bg-white text-white py-10 md:py-20 px-4 sm:px-6 lg:px-8 relative h-fit w-full overflow-hidden">
            <div className="max-w-7xl mx-auto h-full">
                {/* Header */}
                <AnimatedContent
                    direction="vertical"
                    distance={80}
                    duration={1.2}
                    ease="power3.out"
                    threshold={0.1}
                >
                    <div className="text-wetrends text-3xl md:text-4xl lg:text-6xl space-y-2 md:space-y-5 mb-6 md:mb-10">
                        <h1 className="font-bold">Why Founders </h1>
                        <h1 className="font-serif italic font-bold">Love Us</h1>
                    </div>
                </AnimatedContent>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {/* Left Column - Stats & CTA */}
                    <div className="lg:col-span-1 flex flex-col gap-6 md:gap-10 order-2 lg:order-1">
                        <AnimatedContent
                            direction="vertical"
                            distance={60}
                            duration={1.2}
                            delay={0.2}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                            className="py-4 md:py-10"
                        >
                            <p className="text-base md:text-lg text-black font-semibold lg:w-2/3">
                                "97% of partners renew after the first month."
                            </p>
                        </AnimatedContent>
                        
                        <AnimatedContent
                            direction="vertical"
                            distance={60}
                            duration={1.2}
                            delay={0.3}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                        >
                            <CTASection />
                        </AnimatedContent>
                    </div>
                    
                    {/* Right Column - Description & Cards */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <AnimatedContent
                            direction="vertical"
                            distance={80}
                            duration={1.2}
                            delay={0.25}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                            className="py-4 md:py-10"
                        >
                            <p className="text-xl md:text-2xl lg:text-4xl text-black leading-relaxed">
                                Discover our work, where live-trend creativity fuels
                                measurable growth, turning raw ideas into scroll-stopping
                                assets. We craft visuals and copy that captivate, convert, and
                                cement brand relationships across every channel.
                            </p>
                        </AnimatedContent>
                        
                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-10">
                            {/* Card 1 - Radar & Strategy */}
                            <AnimatedContent
                                direction="vertical"
                                distance={100}
                                duration={1.2}
                                delay={0.35}
                                ease="power3.out"
                                animateOpacity={true}
                                threshold={0.1}
                            >
                                <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 lg:h-80">
                                    <Image
                                        src="/images/Gradient 27.png"
                                        alt="Radar & Strategy background"
                                        fill
                                        className="object-cover"
                                        quality={90}
                                    />
                                    <div className="relative z-10 p-5 md:p-6 lg:p-8 h-full flex flex-col justify-center items-center text-center text-white">
                                        <div className="flex justify-center mb-4 md:mb-6">
                                            <Star className="w-10 h-10 md:w-12 md:h-12 fill-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">
                                                Radar & Strategy
                                            </h4>
                                            <p className="text-sm lg:text-base leading-relaxed opacity-90">
                                                We scan live culture data each week and agree on the
                                                winning idea in one call.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>

                            {/* Card 2 - Hands-Free Production */}
                            <AnimatedContent
                                direction="vertical"
                                distance={100}
                                duration={1.2}
                                delay={0.45}
                                ease="power3.out"
                                animateOpacity={true}
                                threshold={0.1}
                            >
                                <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 lg:h-80">
                                    <Image
                                        src="/images/Gradient 28.png"
                                        alt="Hands-Free Production background"
                                        fill
                                        className="object-cover"
                                        quality={90}
                                    />
                                    <div className="relative z-10 p-5 md:p-6 lg:p-8 h-full flex flex-col justify-center items-center text-center text-white">
                                        <div className="flex justify-center mb-4 md:mb-6">
                                            <Star className="w-10 h-10 md:w-12 md:h-12 fill-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">
                                                Hands-Free Production
                                            </h4>
                                            <p className="text-sm lg:text-base leading-relaxed opacity-90">
                                                We design, edit and format the approved concept into
                                                publish-ready creative
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>

                            {/* Card 3 - Launch & Optimize */}
                            <AnimatedContent
                                direction="vertical"
                                distance={100}
                                duration={1.2}
                                delay={0.55}
                                ease="power3.out"
                                animateOpacity={true}
                                threshold={0.1}
                            >
                                <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 lg:h-80">
                                    <Image
                                        src="/images/Gradient 29.png"
                                        alt="Launch & Optimize background"
                                        fill
                                        className="object-cover"
                                        quality={90}
                                    />
                                    <div className="relative z-10 p-5 md:p-6 lg:p-8 h-full flex flex-col justify-center items-center text-center text-white">
                                        <div className="flex justify-center mb-4 md:mb-6">
                                            <Star className="w-10 h-10 md:w-12 md:h-12 fill-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">
                                                Launch & Optimize
                                            </h4>
                                            <p className="text-sm lg:text-base leading-relaxed opacity-90">
                                                You publish, we monitor then refine next week's sprint
                                                for compounding growth.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyLoveUs;
