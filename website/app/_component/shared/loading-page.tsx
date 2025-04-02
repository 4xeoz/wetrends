"use client"

import React from 'react'
import { useState, useEffect } from "react"
import LoadingText from './loadign-text'
import LoadingDivs from './loading-animtion'


const loading_page = () => {

    const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 2400)

    return () => clearTimeout(timer) // Cleanup the timer
  }, [])
  return (
    <div className='z-50 sticky top-0'>

        {showLoading && (
            <>
                <LoadingText />
                <LoadingDivs />
            </>
        )}
    </div>
  )
}

export default loading_page