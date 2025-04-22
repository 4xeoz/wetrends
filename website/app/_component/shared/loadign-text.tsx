"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"

const Loading = () => {
  const [loadingRef, inView] = useInView({
    triggerOnce: true,
  })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [inView])

  const divVariants = {
    hidden: {
      y: 0,
      opacity: 1,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      y: -50,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div
      ref={loadingRef}
      className="z-50 absolute top-0 left-0 w-screen h-screen flex items-center justify-center"
    >
      <AnimatePresence>
        {isVisible && (
            <motion.div
            variants={divVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full text-center"
            >
            <div className="relative  w-[20rem] h-[20rem] mx-auto flex items-center justify-center">
              <Image
              src="/images/logo-transparent.svg"
              alt="WeTrends Logo"
              layout="fill"
              objectFit="contain"
              />
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Loading

