"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Delay the animation start by 1.6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1900) // 1.6 seconds delay

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    initial: {
      height: "100vh",
    },
    animate: {
      height: "50vh",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const contentVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: custom * 0.1, // This adds staggered timing on top of the base 1.6s delay
      },
    }),
  }

  return (
    <motion.div
      className="relative overflow-hidden bg-wetrends text-white"
      variants={containerVariants}
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
    >
      {/* Simple background */}
      <div className="absolute inset-0 bg-wetrends bg-opacity-20 z-0"></div>

      <div className="container mx-auto px-4  relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* <motion.div
            className="inline-block px-4 py-1.5 rounded-full bg-white bg-opacity-10 text-white font-medium text-sm mb-6 backdrop-blur-sm"
            variants={contentVariants}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            custom={1}
          >
            UK-Based Digital Content Creation Agency
          </motion.div> */}

          <motion.h1
            className="text-7xl md:text-8xl lg:text-9xl tracking-tight mb-16"
            variants={contentVariants}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            custom={2}
          >
            <span className=" font-bold">You</span> create, <span className=" font-bold">We</span><span className="text-white"> elevate.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white text-opacity-90 mb-1 max-w-2xl"
            variants={contentVariants}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            custom={3}
          >
            We refine, enhance, and transform your content into high-quality digital assets. With expert editing, strategic design, we ensure your content stands out, and drives real impact.
          </motion.p>

          {/* <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={contentVariants}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            custom={4}
          >
            <Button className="bg-white hover:bg-gray-100 text-wetrends px-8 py-6 rounded-lg text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-6 rounded-lg text-lg"
            >
              Our Work
            </Button>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  )
}

