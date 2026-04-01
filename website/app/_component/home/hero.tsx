'use client';
import React from "react";
import Link from "next/link";
import { ArrowDown, Play, Award, TrendingUp, Users, Star, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

/**
 * Hero - Rich hero section with solid background, no gradients
 * Includes trust signals, stats, and multiple CTAs
 */
const Hero = () => {
    const stats = [
        { icon: TrendingUp, value: "200+", label: "Projects Delivered" },
        { icon: Users, value: "50+", label: "Happy Clients" },
        { icon: Award, value: "15+", label: "Industry Awards" },
        { icon: Star, value: "5.0", label: "Google Rating" },
    ];

    const trustLogos = [
        "TechStart UK", "GreenLeaf", "Surrey Wellness", "FinanceHub", "Guildford Cafe Co"
    ];

    return (
        <section className="relative -mt-[72px] min-h-screen w-full overflow-hidden bg-[#C72C5B] pt-[72px]">
            {/* Decorative geometric shapes - solid colors only */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Top right circle */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white"
                />
                {/* Bottom left square */}
                <motion.div 
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 0.08, rotate: 0 }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    className="absolute -left-20 bottom-20 h-64 w-64 bg-white"
                />
                {/* Small dots pattern */}
                <div className="absolute right-20 top-1/3 grid grid-cols-4 gap-4">
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ duration: 0.5, delay: 1 + i * 0.05 }}
                            className="h-2 w-2 rounded-full bg-white"
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen flex-col">
                {/* Top Bar - Location & Quick Info */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8 "
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2 text-white/80">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">Guildford, Surrey • Serving UK Businesses</span>
                        </div>
                        <div className="hidden items-center gap-6 text-sm text-white/80 sm:flex">
                            <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                Available for Projects
                            </span>
                            <span>Free Consultation</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Main Content */}
                <div className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            {/* Left Column - Main Copy */}
                            <div className="order-2 lg:order-1">
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
                                >
                                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                                    <span className="text-sm font-medium text-white">
                                        Creative Agency of the Year 2024
                                    </span>
                                </motion.div>

                                {/* Main Title */}
                                <motion.h1 
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                                >
                                    Your Brand&apos;s
                                    <br />
                                    <span className="font-serif italic">
                                        Growth Partner
                                    </span>
                                    <br />
                                    <span className="text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl">
                                        in Guildford & Surrey
                                    </span>
                                </motion.h1>

                                {/* Description */}
                                <motion.p 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="mb-8 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl"
                                >
                                    Video production, brand identity, web design & social media. 
                                    We create digital assets that ship fast and drive real results. 
                                    No hand-offs, no fluff, just work that works.
                                </motion.p>

                                {/* CTAs */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="mb-10 flex flex-wrap items-center gap-4"
                                >
                                    <Link
                                        href="/#contact"
                                        className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-base font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl md:px-8 md:text-lg"
                                    >
                                        Start Your Project
                                        <motion.span
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C72C5B] text-white"
                                            whileHover={{ scale: 1.1, rotate: 45 }}
                                        >
                                            <ArrowDown className="h-4 w-4 rotate-[-135deg]" />
                                        </motion.span>
                                    </Link>
                                    
                                    <Link
                                        href="/services/"
                                        className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                                    >
                                        <Play className="h-4 w-4" />
                                        View Our Services
                                    </Link>
                                </motion.div>

                                {/* Trust Bar */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="flex flex-wrap items-center gap-4 text-sm text-white/70"
                                >
                                    <span>Trusted by:</span>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        {trustLogos.slice(0, 3).map((logo) => (
                                            <span key={logo} className="font-medium text-white/90">{logo}</span>
                                        ))}
                                        <span className="text-white/50">+{trustLogos.length - 3} more</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column - Stats & Visual */}
                            <div className="order-1 lg:order-2">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="relative"
                                >
                                    {/* Main visual card */}
                                    <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm md:p-8">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {stats.map((stat, index) => (
                                                <motion.div
                                                    key={stat.label}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                                    className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm md:p-6"
                                                >
                                                    <stat.icon className="mx-auto mb-2 h-6 w-6 text-white/60" />
                                                    <div className="text-2xl font-bold text-white md:text-3xl">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-xs text-white/70 md:text-sm">
                                                        {stat.label}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Quick services list */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 1 }}
                                            className="mt-6 border-t border-white/20 pt-6"
                                        >
                                            <p className="mb-3 text-sm font-medium text-white/60">Our Services:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {["Video Production", "Brand Identity", "Web Design", "Social Media", "Animation"].map((service) => (
                                                    <Link
                                                        key={service}
                                                        href={`/services/${service.toLowerCase().replace(' ', '-')}/`}
                                                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                                                    >
                                                        {service}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Floating testimonial card */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 1.2 }}
                                        className="absolute -bottom-6 -left-6 hidden max-w-xs rounded-2xl bg-white p-4 shadow-2xl lg:block"
                                    >
                                        <div className="mb-2 flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="mb-2 text-sm text-gray-700">
                                            &ldquo;WeTrends transformed our entire digital presence. The ROI has been incredible.&rdquo;
                                        </p>
                                        <p className="text-xs font-semibold text-gray-900">Sarah M. • Marketing Director</p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="flex justify-center pb-8"
                >
                    <Link
                        href="#services"
                        className="flex flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
                        aria-label="Scroll to services section"
                    >
                        <span className="text-xs uppercase tracking-widest">Explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30"
                        >
                            <ArrowDown className="h-4 w-4" />
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
