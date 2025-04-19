"use client"

import { delay, motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    initial: { height: "100vh" },
    animate: { 
      height: "40vh",
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const contentVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: custom * 0.1
      }
    })
  }

  const logoVariants = {
    initial: { 
      opacity: 0,
      x: 100,
      y: -100,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.1
      }
    }
  }

  return (
    <motion.div
      className="relative text-white w-full"
      variants={containerVariants}
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
    >
      <div className="w-full h-full relative">
        <div className="flex flex-col gap-10 items-start justify-end h-full w-full sm:w-[70%] md:w-[60%] lg:w-[50%] p-4 sm:p-6 md:p-8 lg:p-10 relative">
          <motion.h1
            className="text-8xl lg:text-[10rem] xl:text-[15rem] font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-[10rem] xl:leading-[15rem]"
            variants={contentVariants}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            custom={2}
          >
            <p>Wanna</p> <p className="text-nowrap">Go Trend?</p>
          </motion.h1>
        </div>

        <motion.div
          variants={logoVariants}
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          className="absolute right-0 top-0 w-[80%] h-[50%] xl:w-[40%] xl:h-[40rem] pointer-events-none"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-full h-full rotate-[20deg]">
              <Image
                src="/images/logo-transparent.svg"
                alt="WeTrends Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

