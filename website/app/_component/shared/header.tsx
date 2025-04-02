"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit3 } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import SignOutButton from "../auth/signOutButton"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Edit3 className={`h-6 w-6 ${isScrolled ? "text-wetrends" : "text-white"}`} />
            <span className={isScrolled ? "text-foreground" : "text-white"}>WeTrends</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="#services"
              className={`transition-colors hover:text-wetrends ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className={`transition-colors hover:text-wetrends ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              How It Works
            </Link>
            <Link
              href="#why-choose-us"
              className={`transition-colors hover:text-wetrends ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Why Choose Us
            </Link>
            <Link
              href="#contact"
              className={`transition-colors hover:text-wetrends ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {!isLoading && (
              <>
                {session ? (
                  <>
                    <Button asChild size="sm" className="hidden md:inline-flex bg-wetrends hover:bg-wetrends-700">
                      <Link href="/dashboard">My Dashboard</Link>
                    </Button>
                    <div className="hidden md:inline-flex">
                      <SignOutButton className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3" />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className={`hidden md:inline-flex ${
                        !isScrolled ? "border-white text-white hover:bg-white hover:bg-opacity-10" : ""
                      }`}
                    >
                      <Link href="/sign-in">Log in</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="hidden md:inline-flex bg-wetrends hover:bg-wetrends-700 text-white"
                    >
                      <Link href="/sign-in">Sign up</Link>
                    </Button>
                  </>
                )}
              </>
            )}

            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className={isScrolled ? "text-foreground" : "text-white"} />
              ) : (
                <Menu className={isScrolled ? "text-foreground" : "text-white"} />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 pt-20 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-6 items-center">
              <Link
                href="#services"
                className="text-xl font-medium text-gray-700 hover:text-wetrends"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#how-it-works"
                className="text-xl font-medium text-gray-700 hover:text-wetrends"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#why-choose-us"
                className="text-xl font-medium text-gray-700 hover:text-wetrends"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Why Choose Us
              </Link>
              <Link
                href="#contact"
                className="text-xl font-medium text-gray-700 hover:text-wetrends"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {!isLoading && (
                <>
                  {session ? (
                    <>
                      <Button asChild size="lg" className="w-full bg-wetrends hover:bg-wetrends-700 text-white">
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          My Dashboard
                        </Link>
                      </Button>
                      <SignOutButton className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4" />
                    </>
                  ) : (
                    <>
                      <Button asChild size="lg" variant="outline" className="w-full">
                        <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                      <Button asChild size="lg" className="w-full bg-wetrends hover:bg-wetrends-700 text-white">
                        <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

