import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn("text-sm font-medium transition-colors hover:text-primary", className)}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

