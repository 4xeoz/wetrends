"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Edit3, Video, Image, FileText, Instagram, Youtube } from "lucide-react"

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Rest of the component remains the same

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const services = [
    {
      icon: <Video className="h-8 w-8 text-wetrends" />,
      title: "Video Editing",
      description: "Professional editing of your raw footage into polished videos",
    },
    {
      icon: <Image className="h-8 w-8 text-wetrends" />,
      title: "Visual Design",
      description: "Eye-catching graphics and visuals that align with your brand",
    },
    {
      icon: <Edit3 className="h-8 w-8 text-wetrends" />,
      title: "Content Creation",
      description: "Unlimited digital asset creation through our queue system",
    },
    {
      icon: <FileText className="h-8 w-8 text-wetrends" />,
      title: "Marketing Strategy",
      description: "Personalized 1:1 advisory sessions to position your business",
    },
    {
      icon: <Instagram className="h-8 w-8 text-wetrends" />,
      title: "Social Media",
      description: "Content optimized for various social media platforms",
    },
    {
      icon: <Youtube className="h-8 w-8 text-wetrends" />,
      title: "YouTube Optimization",
      description: "Thumbnails, titles, and descriptions that drive engagement",
    },
  ]

  return (
    <section className="py-20 bg-gray-50" ref={ref} id="services">
      {/* Rest of the component remains the same */}
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We transform your raw content into polished, high-quality digital assets
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="bg-wetrends-50 p-3 rounded-lg inline-block mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

