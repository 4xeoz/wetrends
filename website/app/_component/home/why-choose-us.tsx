"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Zap, DollarSign, Clock } from "lucide-react"

export default function WhyChooseUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const reasons = [
    {
      icon: <Zap className="h-8 w-8 text-wetrends" />,
      title: "Cutting-Edge Technology",
      description: "Our skilled team uses advanced tools and AI technologies to streamline production",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-wetrends" />,
      title: "Unbeatable Value",
      description: "Agency-level results for a fraction of the usual cost—without compromising quality",
    },
    {
      icon: <Clock className="h-8 w-8 text-wetrends" />,
      title: "Seamless Process",
      description: "Focus on running your business while we handle all your content needs",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 bg-wetrends text-white" ref={ref}>
      <div className="container_md mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto">
            WeTrends delivers premium-quality content at unbeatable value
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-lg"
              variants={itemVariants}
            >
              <div className="bg-white p-3 rounded-lg inline-block mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-white text-opacity-90">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

