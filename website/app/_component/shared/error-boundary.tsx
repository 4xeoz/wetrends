'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * State interface for the ErrorBoundary component
 * @interface ErrorBoundaryState
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean
  /** The error object that was caught, if any */
  error?: Error
}

/**
 * Props interface for the ErrorBoundary component
 * @interface ErrorBoundaryProps
 */
interface ErrorBoundaryProps {
  /** Child components to render when no error is present */
  children: React.ReactNode
  /** Custom error fallback component to render when an error occurs */
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

/**
 * ErrorBoundary - React class component that catches JavaScript errors in child components
 * 
 * This component implements React's error boundary pattern to gracefully handle
 * runtime errors and provide a fallback UI instead of crashing the entire application.
 * 
 * Features:
 * - Catches errors in child component tree
 * - Provides custom fallback UI
 * - Allows error recovery with reset functionality
 * - Logs errors for debugging
 * 
 * @example
 * <ErrorBoundary fallback={CustomErrorComponent}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initialize the error boundary with clean state
   * @param {ErrorBoundaryProps} props - Component props
   */
  constructor(props: ErrorBoundaryProps) {
    super(props)
    // Initial state - no errors
    this.state = { hasError: false }
  }

  /**
   * Static method called when a child component throws an error
   * Updates state to indicate an error has occurred
   * 
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state with error information
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to trigger error UI on next render
    return { hasError: true, error }
  }

  /**
   * Lifecycle method called after an error has been thrown by a descendant component
   * Used for error logging and reporting
   * 
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} errorInfo - Additional error information including component stack
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging purposes
    console.error('Error Boundary caught an error:', error, errorInfo)
    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
  }

  /**
   * Reset the error boundary state to allow recovery
   * Called when user clicks "Try Again" button
   */
  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  /**
   * Render method - shows error UI or normal children
   * @returns {React.ReactNode} Either error fallback or children
   */
  render() {
    // If an error has been caught, render the fallback UI
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    // No error - render children normally
    return this.props.children
  }
}

/**
 * DefaultErrorFallback - Default error UI component shown when an error occurs
 * 
 * Provides a user-friendly error message and recovery option
 * 
 * @param {Object} props - Component props
 * @param {Error} [props.error] - The error object
 * @param {() => void} props.resetError - Function to reset the error state
 * @returns {JSX.Element} Error fallback UI
 */
const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    {/* Error icon */}
    <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
    
    {/* Error title */}
    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
    
    {/* Error message - show specific error or generic message */}
    <p className="text-muted-foreground mb-6 max-w-md">
      {error?.message || 'An unexpected error occurred. Please try again.'}
    </p>
    
    {/* Recovery button */}
    <Button onClick={resetError} className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Try Again
    </Button>
  </div>
)

export default ErrorBoundary
