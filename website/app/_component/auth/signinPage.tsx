"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/actions/auth";

// Separate component that uses useSearchParams
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/me";

  const [errors, setErrors] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);
    // Inject callbackUrl so the server action can use it if needed
    formData.set('callbackUrl', callbackUrl);

    try {
      const result = await login(formData);
      // If result is returned, it means redirect did NOT happen — show error
      if (result?.error) {
        setErrors(result.error);
        setIsPending(false);
      }
      // If no result (undefined), NEXT_REDIRECT was thrown and navigation is in progress
      // Keep isPending=true so spinner shows during redirect
    } catch {
      setErrors("An error occurred during sign in");
      setIsPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-[#C72C5B] to-[#A3244A]" />
        
        <div className="p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C72C5B] to-[#A3244A] shadow-lg shadow-[#C72C5B]/30 mb-4"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-slate-900 mb-1"
            >
              Admin Login
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500"
            >
              Welcome back to WeTrends
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@wetrends.co.uk"
                  autoComplete="email"
                  required
                  className="h-14 pl-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 rounded-xl transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-14 pl-12 pr-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#C72C5B] focus:ring-[#C72C5B]/20 rounded-xl transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {errors && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <Alert className="bg-rose-50 border-rose-200 text-rose-700 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <AlertDescription>{errors}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-gradient-to-r from-[#C72C5B] to-[#A3244A] hover:from-[#B5264F] hover:to-[#921F3F] text-white font-semibold text-lg rounded-xl shadow-lg shadow-[#C72C5B]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-slate-100"
          >
            <p className="text-center text-slate-400 text-sm">
              Protected area. Authorized personnel only.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Back to Site Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-6"
      >
        <Link
          href="/"
          className="text-slate-400 hover:text-slate-600 text-sm transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to website</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Loading fallback for Suspense
function SignInFormSkeleton() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse mb-4" />
          <div className="h-8 bg-slate-100 rounded w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-32 mb-8 animate-pulse" />
          <div className="w-full space-y-4">
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-slate-100 rounded-xl mt-4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C72C5B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <Suspense fallback={<SignInFormSkeleton />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
