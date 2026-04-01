'use client';
import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

/**
 * Hero - Clean hero section with solid background color
 */
const Hero = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#C72C5B] flex items-center justify-center">
            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center text-white">
                    {/* Main Title */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[160px] 2xl:text-[220px] font-bold mb-4 md:mb-8"
                    >
                        WETRENDS
                    </motion.h1>

                    {/* Centered Content */}
                    <div className="space-y-6 md:space-y-12 mt-8 md:mt-16 max-w-4xl mx-auto">
                        {/* Main Tagline */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                                Your Brand&apos;s
                                <span className="font-serif italic font-bold"> Growth</span> Partner
                            </p>
                        </motion.div>

                        {/* Location Tag */}
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white/80 text-sm md:text-base uppercase tracking-widest font-medium"
                        >
                            Guildford, Surrey • Serving Businesses Across the UK
                        </motion.p>

                        {/* Description */}
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto px-2 md:px-0"
                        >
                            Unlock the partnership that plans, produces and iterates digital
                            assets until the numbers move. No hand-offs, no fluff, just work
                            that ships.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <Link
                                    href="#contact"
                                    className="flex items-center justify-center bg-white text-[#C72C5B] w-12 h-12 md:w-16 md:h-16 rounded-full font-semibold hover:bg-white/90 transition-colors duration-200 shadow-lg custom-bounce"
                                    aria-label="Scroll to contact section"
                                >
                                    <ArrowDown color="#C72C5B" className="w-5 h-5 md:w-6 md:h-6" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
