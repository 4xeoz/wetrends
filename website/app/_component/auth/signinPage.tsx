"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/actions/auth";

// Separate component that uses useSearchParams
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/me";
  
  const [errors, setErrors] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.user) {
          setIsAuthenticated(true);
          router.push(callbackUrl);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [router, callbackUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Use server action for login
      const result = await login(formData);
      console.log("[Login Client] Result:", result);
      
      // Check if login was successful
      if (result && result.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrors("Invalid email or password");
      }
    } catch (error) {
      console.error("[Login Client] Error:", error);
      setErrors("An error occurred during sign in");
    } finally {
      setIsPending(false);
    }
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white mb-1">
          Welcome Back
        </h2>
        <p className="text-white/50 text-sm">
          Sign in to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80 text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@wetrends.co.uk"
              autoComplete="email"
              required
              className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 rounded-xl"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80 text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errors && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-[#C72C5B] hover:bg-[#A3244A] text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-white/40 text-sm">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </motion.div>
  );
}

// Loading fallback for Suspense
function SignInFormSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-pulse">
      <div className="h-8 bg-white/10 rounded mb-8 mx-auto w-32" />
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="h-12 bg-white/10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-20" />
          <div className="h-12 bg-white/10 rounded-xl" />
        </div>
        <div className="h-12 bg-white/10 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#C72C5B]/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C72C5B] mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            WeTrends
          </h1>
          <p className="text-white/60">Admin Dashboard</p>
        </motion.div>

        {/* Login Form with Suspense */}
        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>

        {/* Back to Site Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="/"
            className="text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            ← Back to website
          </a>
        </motion.div>
      </div>
    </div>
  );
}
