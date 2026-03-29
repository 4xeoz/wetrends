'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CardSwap, { Card } from '../../../components/ui/cardSwap';
import { Palette, Video, Globe, Users, Zap } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import AnimatedContent from "@/components/ui/animated-content";

/**
 * Showcase - Responsive section with background image
 */
const Showcase = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const showcaseItems = [
        {
            id: 1,
            title: "Design Excellence",
            description: "Creative visual identities that captivate and convert your audience",
            category: "Design",
            icon: Palette,
            videoSrc: "/videos/design-preview-wetrends.mp4",
            gradient: "from-purple-600/80 to-pink-600/80",
        },
        {
            id: 2,
            title: "Video Production",
            description: "Professional video content that tells your brand story",
            category: "Video",
            icon: Video,
            videoSrc: "/videos/video-preview-wetrends.mp4",
            gradient: "from-red-600/80 to-orange-600/80",
        },
        {
            id: 3,
            title: "Web Development",
            description: "Modern websites that drive engagement and growth",
            category: "Website",
            icon: Globe,
            videoSrc: "/videos/website-preview-wetrends.mp4",
            gradient: "from-blue-600/80 to-cyan-600/80",
        },
        {
            id: 4,
            title: "Social Media",
            description: "Strategic social content that builds communities",
            category: "Social",
            icon: Users,
            videoSrc: "/videos/social-preview-wetrends.mp4",
            gradient: "from-green-600/80 to-teal-600/80",
        },
        {
            id: 5,
            title: "Animations",
            description: "Dynamic motion graphics that bring brands to life",
            category: "Animation",
            icon: Zap,
            videoSrc: "/videos/animations-preview-wetrends.mp4",
            gradient: "from-indigo-600/80 to-purple-600/80",
        },
    ]

    return (
        <section id="work" className="bg-gray-900 text-white py-10 md:py-20 px-4 sm:px-6 lg:px-8 relative h-fit w-full overflow-hidden">
            <div className="max-w-7xl mx-auto h-full">
                {/* Background Image */}
                <Image
                    src="/images/Gradient 30.png"
                    alt="Showcase background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                />

                {/* Content Container */}
                <div>
                    <AnimatedContent
                        direction="vertical"
                        distance={80}
                        duration={1.2}
                        ease="power3.out"
                        animateOpacity={true}
                        threshold={0.1}
                        className="mb-8 md:mb-20 relative"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2">We Take care</h2>
                        <h3 className="text-3xl md:text-4xl lg:text-6xl font-serif italic font-bold text-white">of everything</h3>
                    </AnimatedContent>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start lg:items-center relative h-full max-w-6xl mx-auto">
                        {/* Left Column - Content */}
                        <div className="space-y-6 md:space-y-8 lg:ml-10 order-2 lg:order-1">
                            {/* Description */}
                            <AnimatedContent
                                direction="vertical"
                                distance={60}
                                duration={1.2}
                                delay={0.2}
                                ease="power3.out"
                                animateOpacity={true}
                                threshold={0.1}
                            >
                                <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed">
                                    We plug into your Slack, track the trends, script the stories, and hand back polished assets, so you
                                    never chase freelancers or juggle briefs again.
                                </p>
                            </AnimatedContent>

                            <AnimatedContent
                                direction="vertical"
                                distance={80}
                                duration={1.2}
                                delay={0.3}
                                ease="power3.out"
                                animateOpacity={true}
                                threshold={0.1}
                            >
                                {/* Testimonial Cards */}
                                <div className="space-y-4 md:space-y-6">
                                    {/* First Testimonial - Dark */}
                                    <div className="bg-black rounded-2xl p-5 md:p-6 lg:p-8 max-w-lg">
                                        <div className="flex items-start gap-3 md:gap-4 mb-4">
                                            <Image
                                                src="/images/person2.pn"
                                                alt="designs alton profile"
                                                width={48}
                                                height={48}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div>
                                                <h4 className="text-white font-semibold text-sm md:text-base">designs alton.</h4>
                                                <p className="text-gray-400 text-xs md:text-sm">Lead Software Engineer</p>
                                            </div>
                                        </div>
                                        <blockquote className="text-white text-sm md:text-base leading-relaxed">
                                            "Such a great team, they are friends more then business patterns, thank you.
                                            <br />
                                            <span className="font-bold">LOVE IT :)"</span>
                                        </blockquote>
                                    </div>

                                    {/* Second Testimonial - Light */}
                                    <div className="bg-white rounded-2xl p-5 md:p-6 lg:p-8 max-w-lg">
                                        <div className="flex items-start gap-3 md:gap-4 mb-4">
                                            <Image
                                                src="/images/person1.png"
                                                alt="Chris profile"
                                                width={48}
                                                height={48}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                                            />
                                            <div>
                                                <h4 className="text-gray-900 font-semibold text-sm md:text-base">designs alton.</h4>
                                                <p className="text-gray-500 text-xs md:text-sm">Lead Software Engineer</p>
                                            </div>
                                        </div>
                                        <blockquote className="text-gray-800 text-sm md:text-base leading-relaxed mb-4">
                                            "I never imagined I'd be praising a team like this, but their work truly impressed me. Every design wasn't just beautiful — it had purpose, built as part of a real sales funnel. They gave my brand a unique character that stands out from the competition."
                                        </blockquote>

                                        {/* Voice Over Progress Bar */}
                                        <div className="flex items-center gap-3">
                                            <audio
                                                ref={audioRef}
                                                src="/sounds/Chris_testimonia.mp3"
                                                preload="metadata"
                                            />
                                            <button 
                                                onClick={togglePlayPause}
                                                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors flex-shrink-0"
                                            >
                                                {isPlaying ? (
                                                    <div className="flex gap-1">
                                                        <div className="w-1 h-3 bg-white"></div>
                                                        <div className="w-1 h-3 bg-white"></div>
                                                    </div>
                                                ) : (
                                                    <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                                                )}
                                            </button>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer">
                                                <div 
                                                    className={`h-full bg-black rounded-full transition-all duration-100`} 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedContent>
                        </div>

                        {/* Right Column - CardSwap Component (Desktop) / Mobile Cards Grid */}
                        <AnimatedContent
                            direction="vertical"
                            distance={100}
                            duration={1.2}
                            delay={0.5}
                            ease="power3.out"
                            animateOpacity={true}
                            threshold={0.1}
                            className="order-1 lg:order-2 lg:mr-10"
                        >
                            {/* Desktop: CardSwap */}
                            <div className="hidden lg:block relative h-[500px] xl:h-[600px]">
                                {/* Wrapper handles overflow and rounded corners */}
                                <div className="absolute inset-0 overflow-hidden rounded-3xl bg-white">
                                    <CardSwap
                                        cardDistance={40}
                                        verticalDistance={50}
                                        delay={3000}
                                        skewAmount={0}
                                        easing="elastic"
                                    >
                                    {showcaseItems.map((item) => {
                                        const IconComponent = item.icon
                                        return (
                                            <Card key={item.id} className="overflow-hidden shadow-2xl shadow-black/50">
                                                {/* Video Background */}
                                                <video
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    poster={`/placeholder.svg?height=500&width=400&text=${item.category}`}
                                                    onError={(e) => console.error('Video error:', e)}
                                                    onLoadStart={() => console.log('Video loading:', item.videoSrc)}
                                                >
                                                    <source src={item.videoSrc} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>

                                                {/* Gradient Overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60`} />

                                                {/* Content Overlay */}
                                                <div className="absolute inset-0 p-6 flex flex-col justify-start text-white">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                                                                {item.category}
                                                            </Badge>
                                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                                <IconComponent className="w-5 h-5" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                                                            <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </CardSwap>
                                </div>
                            </div>

                            {/* Mobile/Tablet: Horizontal Scroll Cards */}
                            <div className="lg:hidden">
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                                    {showcaseItems.map((item) => {
                                        const IconComponent = item.icon
                                        return (
                                            <div 
                                                key={item.id} 
                                                className="flex-shrink-0 w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl shadow-black/30 relative snap-start"
                                            >
                                                {/* Video Background */}
                                                <video
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    poster={`/placeholder.svg?height=500&width=400&text=${item.category}`}
                                                >
                                                    <source src={item.videoSrc} type="video/mp4" />
                                                </video>

                                                {/* Gradient Overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60`} />

                                                {/* Content Overlay */}
                                                <div className="absolute inset-0 p-5 flex flex-col justify-start text-white">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                                                                {item.category}
                                                            </Badge>
                                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                                <IconComponent className="w-4 h-4" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                                                            <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Showcase;
