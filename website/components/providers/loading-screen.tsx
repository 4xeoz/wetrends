'use client';

import { useState, useEffect } from 'react';

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if there's an active session - if so, skip loading screen
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        const session = await res.json();
        if (session?.user) {
          // User is authenticated, skip loading screen
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log('Session check failed, proceeding with loading screen');
      }

      // No session, proceed with loading animation
      const duration = 400;
      const interval = 20;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min((currentStep / steps) * 100, 100);
        setProgress(newProgress);

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 100);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    checkSession();
  }, []);

  // Force hide loading screen after 10 seconds as fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading screen timeout - forcing close');
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const loadingScreenStyle = {
    opacity: isLoading ? 1 : 0,
    visibility: isLoading ? 'visible' as const : 'hidden' as const,
    transition: 'opacity 0.5s ease-out',
  };

  const contentStyle = {
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.5s ease-in',
  };

  return (
    <>
      {/* Loading Screen */}
      <div
        style={loadingScreenStyle}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950"
      >
        {/* Logo */}
        <div className="mb-16 animate-fade-in">
          <h1 className="bg-gradient-to-r from-white via-[#C72C5B] to-white bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            WETRENDS
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-64 md:w-72">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#C72C5B] via-purple-500 to-[#C72C5B] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-center text-xs tracking-widest text-white/40 uppercase">
            Loading...
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle} className="transition-opacity duration-500">
        {children}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
