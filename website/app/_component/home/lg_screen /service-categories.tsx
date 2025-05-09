"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ServiceCategoryProps {
  title: string
  videoSrc: string
  description: string
  index: number
}

function ServiceCategory({ title, videoSrc, description, index }: ServiceCategoryProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const isSmallScreen = useMediaQuery("(max-width: 768px)")

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isSmallScreen ? 0 : isEven ? -50 : 50, y: isSmallScreen ? 50 : 0 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: isSmallScreen ? 0 : isEven ? -50 : 50, y: isSmallScreen ? 50 : 0 }
      }
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex w-full items-center ${
        isSmallScreen ? "justify-center" : isEven ? "justify-start" : "justify-end"
      } mb-8 md:mb-16 relative`}
    >
      <Card
        className={`w-full rounded-none ${
          isSmallScreen ? "mx-auto" : isEven ? "mr-auto" : "ml-auto"
        } max-w-full md:max-w-2xl border-0 shadow-none bg-inherit z-10`}
      >
        <div className="flex flex-col">
          <div className="relative shadow-lg md:shadow-2xl" style={{ aspectRatio: "4/3" }}>
            <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <CardContent className="flex flex-col p-0 pt-4 md:pt-6">
            <h3 className="mb-1 md:mb-2 text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="text-sm md:text-base text-muted-foreground">{description}</p>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}

export function ServiceCategories() {
  const categories = [
    {
      title: "Design",
      videoSrc: "/videos/design-preview-wetrends.mp4",
      description:
        "Professional graphic design services for all your branding and marketing needs. We transform your ideas into visually stunning assets.",
    },
    {
      title: "Animation",
      videoSrc: "/videos/animations-preview-wetrends.mp4",
      description:
        "Eye-catching animations that bring your ideas to life and engage your audience. From simple motion graphics to complex character animations.",
    },
    {
      title: "Social",
      videoSrc: "/videos/social-preview-wetrends.mp4",
      description:
        "Compelling social media content that drives engagement and builds your community. We help you maintain a consistent presence across platforms.",
    },
    {
      title: "Video",
      videoSrc: "/videos/video-preview-wetrends.mp4",
      description:
        "Professional video production and editing to tell your brand's story effectively. From concept to final cut, we ensure your message resonates.",
    },
    {
      title: "Website",
      videoSrc: "/videos/website-preview-wetrends.mp4",
      description:
        "Custom website design and development that showcases your brand beautifully. We create responsive, user-friendly websites that convert visitors.",
    },
  ]

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-60 bg-wetrends-50">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="my-10 sm:my-20 md:my-40 text-left w-full"
        >
          <h2 className="text-3xl sm:text-5xl md:text-7xl max-w-full md:max-w-[800px] w-full text-left font-bold">
            We are really good at
          </h2>
        </motion.div>
        <div className="flex flex-col gap-16 sm:gap-32 md:gap-48 ">
          {categories.map((category, index) => (
            <ServiceCategory
              key={category.title}
              title={category.title}
              videoSrc={category.videoSrc}
              description={category.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
