"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"


export default function Navbar() {

  return (
    <header className="bg-wetrends ">
      <div className="container flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center gap-3 font-bold text-2xl">
        <img src="/images/logo-transparent.svg" alt="WeTrends Logo" className="h-10 w-10" />
        <span className="text-white">WeTrends</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/about" className="text-white hover:underline">
        About
        </Link>
        <Link href="/contact" className="text-white hover:underline">
        Contact
        </Link>
      </nav>
      </div>
    </header>
  )
}

