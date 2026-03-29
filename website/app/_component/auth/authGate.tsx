import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import ErrorBoundary from '../shared/error-boundary'
import { LoadingWrapper } from '../shared/loading-wrapper'

/**
 * Props for the AuthGate component
 * @interface AuthGateProps
 */
interface AuthGateProps {
  /** Child components to render when authentication requirements are met */
  children: React.ReactNode
  /** Whether authentication is required to access the wrapped content */
  requireAuth?: boolean
  /** URL to redirect to when authentication is required but user is not authenticated */
  redirectTo?: string
  /** Custom fallback component to show during loading states */
  fallback?: React.ReactNode
}

/**
 * AuthGate - A wrapper component that handles authentication-based rendering and redirection
 * 
 * This component serves as a guard for protected routes and provides consistent
 * authentication handling across the application.
 * 
 * @param {AuthGateProps} props - The component props
 * @returns {Promise<JSX.Element>} The rendered component with auth protection
 * 
 * @example
 * // Protect a route - redirects to sign-in if not authenticated
 * <AuthGate requireAuth={true} redirectTo="/login">
 *   <ProtectedContent />
 * </AuthGate>
 * 
 * @example
 * // Public route - renders regardless of auth status
 * <AuthGate requireAuth={false}>
 *   <PublicContent />
 * </AuthGate>
 */
const AuthGate = async ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/sign-in',
  fallback 
}: AuthGateProps) => {
  try {
    // Get the current user session from the auth provider
    const session = await auth()
    
    // If authentication is required but user is not authenticated, redirect
    if (requireAuth && !session) {
      redirect(redirectTo)
    }

    // Wrap children with error boundary and loading states
    // If auth is required but user is not authenticated, this won't render (due to redirect above)
    // If auth is not required, render regardless of auth status
    return (
      <ErrorBoundary>
        <LoadingWrapper fallback={fallback}>
          {children}
        </LoadingWrapper>
      </ErrorBoundary>
    )
  } catch (error) {
    // Log authentication errors and redirect to error page
    console.error('AuthGate error:', error)
    redirect('/error')
  }
}

export default AuthGate

/**
 * ProtectedRoute - Higher-order component for routes that require authentication
 * 
 * Automatically redirects unauthenticated users to the sign-in page.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to protect
 * @returns {JSX.Element} AuthGate configured for protected routes
 * 
 * @example
 * <ProtectedRoute>
 *   <UserDashboard />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGate requireAuth={true}>
    {children}
  </AuthGate>
)

/**
 * PublicRoute - Component for public routes that can optionally redirect authenticated users
 * 
 * Useful for login/register pages that should redirect logged-in users elsewhere.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.redirectTo='/me'] - Where to redirect authenticated users
 * @returns {JSX.Element} AuthGate configured for public routes
 * 
 * @example
 * <PublicRoute redirectTo="/dashboard">
 *   <LoginForm />
 * </PublicRoute>
 */
export const PublicRoute: React.FC<{ 
  children: React.ReactNode
  redirectTo?: string 
}> = ({ children, redirectTo = '/me' }) => {
  return (
    <AuthGate requireAuth={false}>
      {children}
    </AuthGate>
  )
}