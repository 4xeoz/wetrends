import { auth } from '@/lib/auth/auth'
import React from 'react'

const authGate = async ({children} : {children : React.ReactNode}) => {
    const session = await auth()
    // if (!session) {
    //     return redirect('/auth/signin')
    // }
  return (
    <>{children}</>
  )
}

export default authGate