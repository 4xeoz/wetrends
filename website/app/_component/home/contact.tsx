import React from 'react';
import ContactForm from './contact-form';
import { Linkedin, Instagram } from 'lucide-react';

/**
 * Contact - Responsive section with contact form
 */
const Contact = () => {
    return (
        <section id="contact" className="bg-gradient-to-bl from-[#BC2A50] to-[#891735] text-white py-10 md:py-20 px-4 sm:px-6 lg:px-8 relative min-h-[600px] md:h-screen md:max-h-[1300px] w-full overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-center relative">
                {/* Content Container */}
                <div className="w-full">
                    <div className="mb-8 md:mb-20 relative">
                        <h3 className="text-3xl md:text-4xl lg:text-6xl font-serif italic font-bold text-white">Contact Us</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start relative h-full max-w-6xl mx-auto">

                        {/* Left Column - Content */}
                        <div className="space-y-6 md:space-y-8 lg:ml-10 order-2 lg:order-1">
                            {/* Description */}
                            <p className="text-base md:text-lg text-white/90 leading-relaxed lg:w-3/4">
                                Drop us a note, one of our founders will reply within 24 hours and show you how WeTrends can plug straight into your brand.
                            </p>
                            
                            {/* Email Us Section */}
                            <div>
                                <h4 className="text-lg md:text-xl font-semibold mb-2">Email Us</h4>
                                <a href="mailto:wetrends.uk@gmail.com" className="text-white/90 hover:text-white transition-colors duration-200 underline underline-offset-4 text-sm md:text-base">
                                    wetrends.uk@gmail.com
                                </a>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex space-x-3 md:space-x-4">
                                <a href="https://www.instagram.com/wetrends.uk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://www.linkedin.com/company/wetrends-uk/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                    <Linkedin className="w-4 h-4" fill="currentColor" />
                                </a>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="lg:mr-10 order-1 lg:order-2">
                            <div className="relative h-full w-full">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
