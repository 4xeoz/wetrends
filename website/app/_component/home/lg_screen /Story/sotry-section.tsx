"use client"

import { useRef } from "react"
import { TextAnimate } from "@/components/magicui/text-animate"
import { motion, useScroll, useTransform } from "framer-motion"

const StorySection = ({
  header,
  paragraph,
  images,
}: {
  header: string
  paragraph: string
  images?: string[]
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-40vw", "0vw", "40vw"])
  const xforImage1 = useTransform(scrollYProgress, [0, 0.5, 1], ["-40vw", "0vw", "40vw"])
  const xforImage2 = useTransform(scrollYProgress, [0, 0.5, 1], ["20vw", "0vw", "-20vw"])
  const xforImage3 = useTransform(scrollYProgress, [0, 0.5, 1], ["0vw", "0vw", "0vw"])
  const xforImage4 = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0])

  // Responsive positions for different screen sizes
  const RANDOM_POSITIONS = [
    { top: "10%", left: "15%" },
    { top: "65%", left: "60%" },
    { top: "25%", left: "75%" },
    { top: "70%", left: "20%" },
  ]

  // Medium screen specific positions
  const MEDIUM_POSITIONS = [
    { top: "12%", left: "20%" },
    { top: "60%", left: "65%" },
    { top: "30%", left: "70%" },
    { top: "65%", left: "25%" },
  ]

  // Add a floating animation for each image
  const floatVariants = [
    {
      animate: {
        y: [0, -20, 0, 20, 0],
        rotate: [0, 2, 0, -2, 0],
        transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, 15, 0, -15, 0],
        rotate: [0, -3, 0, 3, 0],
        transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, -10, 0, 10, 0],
        rotate: [0, 4, 0, -4, 0],
        transition: { duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      },
    },
    {
      animate: {
        y: [0, 10, 0, -10, 0],
        rotate: [0, -2, 0, 2, 0],
        transition: { duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      },
    },
  ]

  return (
    <section ref={ref} className="relative w-full min-h-screen">
      <div className="container min-h-screen flex items-left justify-center flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-5 md:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl text-white font-bold">
          <TextAnimate
            animation="slideUp"
            by="word"
            style={{
              textShadow: "-5px 5px 1rem rgba(0, 0, 0, 0.5)",
            }}
          >
            {header}
          </TextAnimate>
        </h1>
        <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-5xl text-white">
          <TextAnimate
            animation="slideUp"
            by="word"
            style={{
              textShadow: "-5px 5px 0.5rem rgba(0, 0, 0, 0.5)",
            }}
          >
            {paragraph}
          </TextAnimate>
        </h1>
      </div>

      {/* Extra large screen layout (xl and up) */}
      <div className="hidden xl:block">
        {RANDOM_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="h-64 w-64 absolute rounded-xl"
            style={{
              x: x,
              top: pos.top,
              left: pos.left,
              zIndex: 10 - i,
            }}
          >
            <motion.div
              variants={floatVariants[i % floatVariants.length]}
              animate="animate"
              className="w-full h-full flex items-center justify-center"
            >
              <motion.img
                src={`/images/wetrends icons ${i + 1}.png`}
                alt={`Random ${i}`}
                className="object-contain w-full h-full drop-shadow-2xl filter"
                style={{
                  filter: "drop-shadow(-30px 30px 2rem rgba(0, 0, 0, 0.5))",
                  x: i === 0 ? xforImage1 : i === 1 ? xforImage2 : i === 2 ? xforImage3 : xforImage4,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Large screen layout (lg to xl) - optimized for 1320 x 832 */}
      <div className="hidden lg:block xl:hidden">
        {RANDOM_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="h-40 w-40 absolute rounded-xl"
            style={{
              x: x,
              top: pos.top,
              left: pos.left,
              zIndex: 10 - i,
            }}
          >
            <motion.div
              variants={floatVariants[i % floatVariants.length]}
              animate="animate"
              className="w-full h-full flex items-center justify-center"
            >
              <motion.img
                src={`/images/wetrends icons ${i + 1}.png`}
                alt={`Random ${i}`}
                className="object-contain w-full h-full drop-shadow-xl filter"
                style={{
                  filter: "drop-shadow(-25px 25px 1.8rem rgba(0, 0, 0, 0.5))",
                  x: i === 0 ? xforImage1 : i === 1 ? xforImage2 : i === 2 ? xforImage3 : xforImage4,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Medium screen layout (md to lg) */}
      <div className="hidden md:block lg:hidden">
        {MEDIUM_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className="h-40 w-40 absolute rounded-xl"
            style={{
              x: x,
              top: pos.top,
              left: pos.left,
              zIndex: 10 - i,
            }}
          >
            <motion.div
              variants={floatVariants[i % floatVariants.length]}
              animate="animate"
              className="w-full h-full flex items-center justify-center"
            >
              <motion.img
                src={`/images/wetrends icons ${i + 1}.png`}
                alt={`Random ${i}`}
                className="object-contain w-full h-full drop-shadow-xl filter"
                style={{
                  filter: "drop-shadow(-20px 20px 1.5rem rgba(0, 0, 0, 0.5))",
                  x: i === 0 ? xforImage1 : i === 1 ? xforImage2 : i === 2 ? xforImage3 : xforImage4,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Small screen layout (sm to md) */}
      <div className="hidden sm:block md:hidden">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute h-36 w-36 rounded-xl"
            style={{
              top: `${15 + i * 18}%`,
              left: i % 2 === 0 ? "15%" : "65%",
              zIndex: 10 - i,
            }}
          >
            <motion.div
              variants={floatVariants[i % floatVariants.length]}
              animate="animate"
              className="w-full h-full flex items-center justify-center"
            >
              <motion.img
                src={`/images/wetrends icons ${i + 1}.png`}
                alt={`Random ${i}`}
                className="object-contain w-full h-full drop-shadow-lg filter"
                style={{
                  filter: "drop-shadow(-15px 15px 1.2rem rgba(0, 0, 0, 0.5))",
                  x: i === 0 ? xforImage1 : i === 1 ? xforImage2 : i === 2 ? xforImage3 : xforImage4,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Mobile layout (below sm) */}
      <div className="sm:hidden absolute inset-0 overflow-hidden pointer-events-none">
        <div className="relative h-full w-full">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute h-24 w-24"
              style={{
                top: `${15 + i * 20}%`,
                left: i % 2 === 0 ? "10%" : "70%",
                zIndex: 10 - i,
              }}
            >
              <motion.div
                variants={floatVariants[i % floatVariants.length]}
                animate="animate"
                className="w-full h-full flex items-center justify-center"
              >
                <motion.img
                  src={`/images/wetrends icons ${i + 1}.png`}
                  alt={`Random ${i}`}
                  className="object-contain w-full h-full drop-shadow-xl filter"
                  style={{
                    filter: "drop-shadow(-10px 10px 1rem rgba(0, 0, 0, 0.5))",
                    x: i === 0 ? xforImage1 : i === 1 ? xforImage2 : i === 2 ? xforImage3 : xforImage4,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StorySection
