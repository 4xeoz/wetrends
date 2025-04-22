"use client";
import { motion } from "framer-motion";
import React from "react";
import { useInView } from "framer-motion";
import { set } from "date-fns";


export default function Story() {

    const ref = React.useRef(null);
    const [isInView, setIsInView] = React.useState(true);
    const InView = useInView(ref, {
        initial: true,
        amount: 0.5, 

      });
      

    React.useEffect(() => {
        if (!InView) {
            setIsInView(false);
        }
    }, [InView]);

  return (
    <motion.section
        ref={ref}
        animate={{ height: isInView ? "100vh" : "0vh" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-screen bg-wetrends-600 flex justify-center items-center snap-start"
        >
          <h1 className="text-9xl">We Listen First.</h1>
        </div>
      ))}
    </motion.section>
  );
}