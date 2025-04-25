"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const sliderDivVariants = {
    initial: {
      height: "100vh",
    },
    animate: {
      height: isInView ? "50vh" : "100vh",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div ref={ref} className="h-full flex justify-center items-center relative">
      <Image src="/images/Background-pattern.png" alt="WeTrends Hero" fill className="object-cover absolute" priority />

      <motion.div variants={sliderDivVariants} initial="initial" animate="animate" className="relative bg-black z-10" />

      <div className="container flex flex-col justify-center items-center z-0 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="items-start w-full">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-white text-left w-full sm:w-3/4 md:w-2/3 lg:w-[60%] xl:w-[50%] leading-tight tracking-tight font-bold">
            We Listen First.
          </h1>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-24 2xl:mt-32 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full px-0 sm:px-4 md:px-8 lg:px-16 xl:px-28 2xl:px-52 gap-6 sm:gap-4">
          <p className="w-full sm:w-60 md:w-64 lg:w-72 xl:w-80 text-sm sm:text-base md:text-lg text-white leading-relaxed opacity-90">
            We take the time to understand your goals, pinpoint your target audience and bring your design vision to
            life.
          </p>

          <Button
            className="bg-white text-black rounded-full text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 lg:p-10 w-full sm:w-auto font-medium"
            variant="default"
          >
            See More
          </Button>
        </div>
      </div>
    </div>
  )
}
