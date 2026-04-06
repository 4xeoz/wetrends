'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services' },
  { href: '/#work', label: 'Work' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/blogs/', label: 'Blog' },
  { href: '/#team', label: 'Team' },
  { href: '/#contact', label: 'Contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Only track scroll on home page
    if (!isHomePage) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Determine if navbar should be light (white bg, black text)
  // Home page: light only when scrolled
  // Other pages: always light
  const isLight = !isHomePage || isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: isHomePage ? 2.5 : 0.3 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isLight
            ? 'bg-white shadow-lg backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-transparent.svg"
              alt="WETRENDS"
              width={40}
              height={40}
              className={`h-8 w-auto transition-all ${
                isLight ? 'brightness-0' : 'brightness-0 invert'
              }`}
            />
            <span
              className={`text-xl font-bold transition-colors ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              WETRENDS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-[#C72C5B] ${
                  isLight ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#C72C5B]"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/#contact">
              <Button
                className={`rounded-full px-6 transition-all ${
                  isLight
                    ? 'bg-[#C72C5B] text-white hover:bg-[#A3244A]'
                    : 'bg-white text-[#C72C5B] hover:bg-white/90'
                }`}
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-lg p-2 lg:hidden ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-white shadow-xl lg:hidden"
          >
            <nav className="flex flex-col p-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block border-b border-gray-100 py-4 text-lg font-medium text-gray-900 hover:text-[#C72C5B]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="mt-4 w-full rounded-full bg-[#C72C5B] py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
