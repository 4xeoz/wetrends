"use client"
import { useInView } from "react-intersection-observer"
import { delay, motion } from "framer-motion"

const Loading = () => {
  const [loadingRef] = useInView({
    triggerOnce: true,
  })

  // Container variants
  const containerVariants = {
    
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
    hidden: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.6,
      },
    },
  }

  // Child variants
  const divVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    hidden: {
      y: "-100vh",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div ref={loadingRef} className="z-40 absolute top-0 left-0 w-screen h-screen ">
      <motion.div variants={containerVariants} initial="visible" animate="hidden" className="flex w-full h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            variants={divVariants}
            className="bg-wetrends-700 w-full h-full"
            // Don't add initial or animate here - let the parent control it
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Loading

