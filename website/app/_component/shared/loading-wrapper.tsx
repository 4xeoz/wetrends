import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

/**
 * Props interface for the LoadingWrapper component
 * @interface LoadingWrapperProps
 */
interface LoadingWrapperProps {
  /** Child components to render once loading is complete */
  children: React.ReactNode
  /** Custom loading fallback component to show during loading */
  fallback?: React.ReactNode
  /** Additional CSS classes to apply to the loading fallback */
  className?: string
}

/**
 * LoadingWrapper - Wrapper component that provides loading states for async components
 * 
 * Uses React Suspense to handle loading states and provides sensible defaults
 * for loading UI while child components are being loaded.
 * 
 * @param {LoadingWrapperProps} props - Component props
 * @returns {JSX.Element} Suspense wrapper with loading fallback
 * 
 * @example
 * <LoadingWrapper fallback={<CustomLoader />}>
 *   <AsyncComponent />
 * </LoadingWrapper>
 * 
 * @example
 * // Using default skeleton loader
 * <LoadingWrapper>
 *   <LazyLoadedContent />
 * </LoadingWrapper>
 */
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  fallback,
  className
}) => (
  <Suspense fallback={fallback || <SpinnerLoader className={className} />}>
    {children}
  </Suspense>
)

/**
 * DefaultLoadingSkeleton - Default skeleton loading component
 * 
 * Provides a basic skeleton UI with multiple skeleton elements
 * to simulate content loading.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Skeleton loading UI
 */
const DefaultLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`space-y-4 ${className}`}>
    {/* Title skeleton - 75% width */}
    <Skeleton className="h-8 w-3/4" />
    {/* Full width content skeleton */}
    <Skeleton className="h-4 w-full" />
    {/* Partial width content skeleton */}
    <Skeleton className="h-4 w-2/3" />
  </div>
)

/**
 * SpinnerLoader - Animated spinner loading component
 * 
 * Simple spinning loader for inline loading states or buttons.
 * 
 * @param {Object} props - Component props
 * @param {number} [props.size=24] - Size of the spinner in pixels
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Spinner loading UI
 * 
 * @example
 * <SpinnerLoader size={16} className="text-blue-500" />
 */
export const SpinnerLoader: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className 
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    {/* Animated spinning icon */}
    <Loader2 className={`h-${size} w-${size} animate-spin`} />
  </div>
)

/**
 * PageLoader - Full page loading component
 * 
 * Centered loading spinner for entire page loading states.
 * Takes up the full viewport height and centers the loading indicator.
 * 
 * @returns {JSX.Element} Full page loading UI
 * 
 * @example
 * // Show while entire page is loading
 * {isLoading ? <PageLoader /> : <PageContent />}
 */
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[100svh]">
    <div className="text-center">
      {/* Large spinner for page-level loading */}
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
      {/* Loading text */}
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)
