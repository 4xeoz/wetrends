import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Simple wrapper component props
 */
interface WrapperProps {
  /** Content to wrap */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Wrapper - Simple container component for consistent layout
 * 
 * A basic wrapper that centers content with responsive padding.
 * Keeps things simple and focuses on the most common use case.
 * 
 * @param props - Component props
 * @returns Centered container element
 * 
 * @example
 * <Wrapper>
 *   <Content />
 * </Wrapper>
 */
const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export default Wrapper

/**
 * Page wrapper for full page layouts
 * Adds minimum height to fill the screen
 */
export const PageWrapper: React.FC<WrapperProps> = ({ children, className }) => (
  <Wrapper className={cn('min-h-[100svh] py-8', className)}>
    {children}
  </Wrapper>
)

/**
 * Section wrapper for page sections
 * Adds vertical spacing between sections
 */
export const SectionWrapper: React.FC<WrapperProps> = ({ children, className }) => (
  <section className={cn('py-12', className)}>
    <Wrapper>{children}</Wrapper>
  </section>
)