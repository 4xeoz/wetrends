import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import ErrorBoundary from '../shared/error-boundary'
import { LoadingWrapper } from '../shared/loading-wrapper'

interface AuthGateProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

// Debug logging utility - works in both Vercel and local dev
const debugLog = (stage: string, data: any) => {
  const timestamp = new Date().toISOString()
  console.log(`[AuthGate ${timestamp}] ${stage}:`, JSON.stringify(data, null, 2))
}

const AuthGate = async ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/sign-in',
  fallback 
}: AuthGateProps) => {
  const startTime = Date.now()
  debugLog('START', { requireAuth, redirectTo })

  try {
    const session = await auth()
    const authTime = Date.now() - startTime

    debugLog('SESSION_FETCHED', {
      hasSession: !!session,
      userId: session?.user?.id || 'none',
      userEmail: session?.user?.email || 'none',
      requireAuth,
      fetchTimeMs: authTime
    })

    // Check if auth is required but user not authenticated
    if (requireAuth && !session) {
      debugLog('AUTH_REQUIRED_REDIRECT', { redirectTo })
      redirect(redirectTo)
    }

    debugLog('RENDERING', { 
      withErrorBoundary: true,
      withLoadingWrapper: true 
    })

    return (
      <ErrorBoundary>
        <LoadingWrapper fallback={fallback}>
          {children}
        </LoadingWrapper>
      </ErrorBoundary>
    )
  } catch (error) {
    const errorTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : 'no stack'

    debugLog('ERROR', {
      message: errorMessage,
      stack: errorStack,
      timeMs: errorTime,
      requireAuth
    })

    // Only redirect to error page on critical failures, not redirects
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }

    redirect('/error')
  }
}

export default AuthGate

// Protect a route - redirects unauthenticated users to sign-in
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGate requireAuth={true}>
    {children}
  </AuthGate>
)

// Public route - renders for any user (authenticated or not)
export const PublicRoute: React.FC<{ 
  children: React.ReactNode
  redirectTo?: string 
}> = ({ children, redirectTo = '/me' }) => (
  <AuthGate requireAuth={false}>
    {children}
  </AuthGate>
)