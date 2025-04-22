"use client"
import Image from "next/image"
import { Ripple } from "@/components/magicui/ripple";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { motion } from "framer-motion"
import { use } from "react";
import { useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";


export default function Hero() {


  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, amount: 0.5} )

  const sliderDivVariants = {
    initial: { 
      height: '100vh',
    },
    animate: {
      height: isInView ? '40vh' : '100vh',
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  


  return (

      <div ref={ref} className="h-full flex justify-center items-center relative">
        
        <Image src="/images/Background-pattern.png" alt="WeTrends Hero" fill className=" object-cover absolute" />

        <motion.div  variants={sliderDivVariants} initial='initial' animate='animate'   className="relative bg-black z-10"/>

        <div className="container flex flex-col justify-center items-center z-0 ">
          <div className=" items-start w-full">
            <h1 className=" text-9xl text-white text-left w-[50%]"> 
              We Listen First.
            </h1>         
          </div>

          <div className=" mt-32 flex justify-between w-full px-52">
            <p className="w-80 text-white">We take the time to understand your goals, pinpoint your target audience and bring your design vision to life.</p>

            <Button className="bg-white text-black rounded-full text-2xl p-10" variant="default">
              See More
            </Button>
          </div>
          
          
          

        </div>
      </div>

  )
}

