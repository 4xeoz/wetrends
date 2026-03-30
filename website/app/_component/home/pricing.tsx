import React from 'react';
import { Check, Star, Zap, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import AnimatedContent from "@/components/ui/animated-content";

/**
 * Pricing - Full height section with CSS gradients
 */
const Pricing = () => {
    return (
        <section className="relative min-h-screen text-black py-10 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center bg-gray-50">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(199,44,91,0.03),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.02),transparent_50%)]" />

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                {/* Content Container */}
                <div>
                    <AnimatedContent
                        direction="vertical"
                        distance={80}
                        duration={1.2}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="mb-6 md:mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2">Results</h2>
                        <h3 className="text-3xl md:text-4xl lg:text-6xl font-serif italic font-bold">Come First</h3>
                    </AnimatedContent>

                    {/* Description - Full Width */}
                    <AnimatedContent
                        direction="vertical"
                        distance={60}
                        duration={1.2}
                        delay={0.1}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="mb-8 md:mb-12"
                    >
                        <p className="text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl">
                            Results come first. Pick the partnership level that matches your workload and move the metrics, not just make pretty files.
                        </p>
                    </AnimatedContent>

                    {/* 3 Pricing Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 h-full max-w-7xl mx-auto">

                        {/* Card 1 - Core */}
                        <AnimatedContent
                            direction="vertical"
                            distance={100}
                            duration={1.2}
                            delay={0.2}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.2}
                        >
                            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col border-2 border-gray-300 rounded-2xl bg-white">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6 md:mb-8">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">TrendOps™ Core</h2>
                                        <p className="text-gray-600 text-xs md:text-sm">Give us the plan—get the polished assets.</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center group hover:bg-gray-400 transition-colors duration-200 cursor-pointer flex-shrink-0">
                                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 mb-4 md:mb-6"></div>

                                {/* Pricing */}
                                <div className="mb-4 md:mb-6">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl md:text-4xl font-bold text-gray-900">£249</span>
                                            <span className="text-gray-600 text-sm md:text-base">/mo</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-2 md:px-3 py-1 text-xs md:text-sm rounded-full">
                                            Starter
                                        </Badge>
                                    </div>
                                    <span className="text-gray-400 line-through text-base md:text-lg">£750</span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300 mb-4 md:mb-6"></div>

                                {/* Features */}
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm md:text-base">You supply strategy, scripts, rough footage</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm md:text-base">We edit, design & format for every channel</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm md:text-base">48-h turnaround on one active request</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm md:text-base">Unlimited revisions until you&apos;re happy</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>

                        {/* Card 2 - Growth */}
                        <AnimatedContent
                            direction="vertical"
                            distance={100}
                            duration={1.2}
                            delay={0.3}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                            className="relative"
                        >
                            {/* Creative Dark Metallic Background */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(199,44,91,0.15),transparent_50%)]" />
                            <div className="absolute inset-0 rounded-2xl opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
                            
                            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col text-white">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6 md:mb-8">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold mb-2">TrendOps™ Growth</h2>
                                        <p className="text-white/80 text-xs md:text-sm">We find the angles, script them, and ship the assets.</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group hover:bg-wetrends/80 transition-colors duration-200 cursor-pointer flex-shrink-0">
                                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/20 mb-4 md:mb-6"></div>

                                {/* Pricing */}
                                <div className="mb-4 md:mb-6">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text">£349</span>
                                            <span className="text-white/70 text-sm md:text-base">/mo</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-wetrends/20 text-white border border-wetrends/30 px-2 md:px-3 py-1 text-xs md:text-sm rounded-full backdrop-blur-sm">
                                            Popular
                                        </Badge>
                                    </div>
                                    <span className="text-white/50 line-through text-base md:text-lg">£1059</span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/20 mb-4 md:mb-6"></div>

                                {/* Features */}
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Weekly Trend Radar & competitor scan</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">We draft scripts / storyboards for approval</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">We design, edit & size for every channel</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">48-h turnaround on 1 active request</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Monthly performance insight & tweaks</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-wetrends flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Unlimited revisions until you&apos;re thrilled</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>

                        {/* Card 3 - Enterprise - Gets the Gradient Background */}
                        <AnimatedContent
                            direction="vertical"
                            distance={100}
                            duration={1.2}
                            delay={0.4}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                            className="relative"
                        >
                            {/* Gradient Background */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C72C5B] via-purple-600 to-blue-600" />
                            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
                            <div className="absolute inset-0 bg-black/10 rounded-2xl" />
                            
                            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col text-white">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6 md:mb-8">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold mb-2">TrendOps™ Enterprise</h2>
                                        <p className="text-white/90 text-xs md:text-sm">Bespoke creative partnership for scaling brands.</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group hover:bg-white/50 transition-colors duration-200 cursor-pointer flex-shrink-0">
                                        <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/30 mb-4 md:mb-6"></div>

                                {/* Contact Us CTA instead of Pricing */}
                                <div className="mb-4 md:mb-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <a 
                                            href="#contact" 
                                            className="group inline-flex items-center gap-2 md:gap-3 bg-white text-[#C72C5B] px-4 md:px-6 py-2.5 md:py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 text-sm md:text-base"
                                        >
                                            Contact Us
                                            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                        </a>
                                        <Badge variant="secondary" className="bg-white/20 text-white border border-white/30 px-2 md:px-3 py-1 text-xs md:text-sm rounded-full backdrop-blur-sm">
                                            Enterprise
                                        </Badge>
                                    </div>
                                    <p className="text-white/70 text-xs md:text-sm mt-3">Custom pricing tailored to your needs</p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/30 mb-4 md:mb-6"></div>

                                {/* Features */}
                                <div className="space-y-3 md:space-y-4 flex-1">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base"><strong>Everything in Growth, plus:</strong></span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Dedicated creative team</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Unlimited active requests</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Same-day priority turnaround</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Weekly strategy calls</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">Full brand system & guidelines</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
