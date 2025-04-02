"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/actions/contact"

// This is where you'd import your server action
// import { submitContactForm } from "@/app/actions"

export default function ContactForm() {
  // Form state with single object
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  type FormErrors = {
    name?: string
    email?: string
    message?: string
  }

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)


  // Animation reference
  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true, amount: 0.3 })

  // Simple handler for all inputs
  function handleChange(e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    
    // Update form and clear errors in one step
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  // Basic form validation
  function validateForm() {
    const newErrors : FormErrors = {}
    
    // Check required fields
    if (!formState.name.trim()) newErrors.name = "Name is required"
    
    // Email validation with simple regex
    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formState.message.trim()) newErrors.message = "Message is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if no errors
  }

  // Form submission handler
  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Log the data to console before sending
      console.log("Submitting form data:", formState)
      
      try {
        // Call the server action
        const result = await submitContactForm(formState)
        
        if (result.success) {
          // Handle success
          setIsSubmitting(false)
          setIsSubmitted(true)
          setFormState({ name: "", email: "", message: "" })
          
          // Reset success message after 5 seconds
          setTimeout(() => setIsSubmitted(false), 5000)
        } else {
          // Handle validation errors from server
          setIsSubmitting(false)
          
          if ("errors" in result) {
            setErrors(result.errors)
          } 
          
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        setIsSubmitting(false)
      }
    }
  }

  // Simplified animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="py-20 bg-gray-50" ref={formRef} id="contact">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or ready to elevate your content? Reach out to us.
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="bg-white rounded-lg shadow-sm p-8 md:p-10"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
          >
            {/* Success Message */}
            {isSubmitted ? (
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
              </motion.div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <motion.div variants={fadeIn}>
                    <Label htmlFor="name" className="text-base">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500 mt-1" : "mt-1"}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </motion.div>

                  {/* Email Field */}
                  <motion.div variants={fadeIn}>
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500 mt-1" : "mt-1"}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </motion.div>

                  {/* Message Field */}
                  <motion.div variants={fadeIn}>
                    <Label htmlFor="message" className="text-base">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      className={errors.message ? "border-red-500 min-h-[150px] mt-1" : "min-h-[150px] mt-1"}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={fadeIn}>
                    <Button
                      type="submit"
                      className="w-full bg-wetrends hover:bg-wetrends-700 text-white py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}