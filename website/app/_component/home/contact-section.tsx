"use client"
import React from 'react'
import ContactForm from './contact-form'
import { useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'

const contact_section = () => {
    const ref = React.useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
    const bachgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  return (
    <motion.section ref={ref}  className='container h-screen flex items-center justify-center' >

        
        <div className='grid grid-cols-2 gap-4 p-10 w-screen'>


            <div className=' h-full w-full flex flex-col gap-10 text-white'>
                <h1 className='text-8xl text-white'>Let's Connect</h1>
                <h1 className='text-4xl text-wetrends bg-white p-5 w-fit'>Free trail for new clients</h1>
                <div>
                    <ul className='list-disc pl-5 text-xl ' >
                        <li>Dedicated designer</li>
                        <li>One brief focus at a time</li>
                        <li>Unlimited design requests & revisions</li>
                        <li>Project managed dashboard</li>
                        <li>Available Monday to Friday</li>
                        <li>Flexibility to pause anytime</li>
                    </ul>
                </div>
            </div>

            <div>
                <ContactForm />
            </div>


        </div>

    </motion.section>
  )
}

export default contact_section