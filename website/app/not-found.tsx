"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#C72C5B]/5 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 max-w-md"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Oops! <span className="text-[#C72C5B]">Page Not Found</span>
              </h1>
              <p className="text-gray-600 md:text-xl">
                The page you&apos;re looking for seems to have wandered off. Let&apos;s get you back on track.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button asChild size="lg" className="gap-2 bg-[#C72C5B] hover:bg-[#A3244A]">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/blogs">
                  <Search className="h-4 w-4" />
                  Browse Our Blog
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-gray-500 mt-8"
            >
              <p>Error Code: 404 - Page Not Found</p>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 WeTrends. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-4 w-4 inline mr-1" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
