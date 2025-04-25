"use client"
import React from "react"
import ContactForm from "./contact-form"
import { useScroll, useTransform } from "framer-motion"
import { motion } from "framer-motion"

const ContactSection = () => {
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const bachgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  return (
    <motion.section
      ref={ref}
      className="container py-16 md:py-24 lg:py-32 min-h-[80vh] flex items-center justify-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto">
        <div className="h-full w-full flex flex-col gap-6 md:gap-8 lg:gap-10 text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white font-bold">Let's Connect</h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-wetrends bg-white p-3 sm:p-4 lg:p-5 w-fit">
            Free trial for new clients
          </h2>
          <div>
            <ul className="list-disc pl-5 text-base sm:text-lg md:text-xl space-y-2">
              <li>Dedicated designer</li>
              <li>One brief focus at a time</li>
              <li>Unlimited design requests & revisions</li>
              <li>Project managed dashboard</li>
              <li>Available Monday to Friday</li>
              <li>Flexibility to pause anytime</li>
            </ul>
          </div>
        </div>

        <div className="mb-8 md:mb-0">
          <ContactForm />
        </div>
      </div>
    </motion.section>
  )
}

export default ContactSection
