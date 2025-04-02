'use client'

import React from 'react'
import { signOut } from 'next-auth/react'

const SignOutButton = ({ className } : { className : any}) => {
  const handleSignOut = async () => {
    localStorage.clear()
    await signOut()
  }

  return (
    <button 
      type="button" 
      onClick={handleSignOut}
      className={className}
    >
      Sign out
    </button>
  )
}

export default SignOutButton