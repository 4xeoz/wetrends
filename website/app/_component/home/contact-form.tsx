"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/actions/contact"

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

  // Simple handler for all inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target

    // Update form and clear errors in one step
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Basic form validation
  function validateForm() {
    const newErrors: FormErrors = {}

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
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

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
            setErrors(result.errors as FormErrors)
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        setIsSubmitting(false)
      }
    }
  }

  return (
    <section
      className="h-full flex items-center justify-center"
    >
      <div className="w-full">
        {/* Form Container */}
        <div>
          <div className="w-full min-h-[300px] md:h-96 flex items-center justify-center">
            {/* Success Message */}
            {isSubmitted ? (
              <div className="text-center py-6 md:py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 md:mb-6">
                  <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Message Sent!</h3>
                <p className="text-base md:text-xl text-white/80">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-4 md:space-y-8">
                  {/* Name Field */}
                  <div>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`${
                        errors.name ? "border-red-400" : "border-white/30"
                      } bg-white/10 text-white text-base md:text-lg h-12 md:h-14 placeholder:text-white/50`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-200 text-xs md:text-sm mt-2">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`${
                        errors.email ? "border-red-400" : "border-white/30"
                      } bg-white/10 text-white text-base md:text-lg h-12 md:h-14 placeholder:text-white/50`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-200 text-xs md:text-sm mt-2">{errors.email}</p>}
                  </div>

                  {/* Message Field */}
                  <div>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      className={`${
                        errors.message ? "border-red-400" : "border-white/30"
                      } bg-white/10 text-white text-base md:text-lg min-h-[120px] md:min-h-[180px] placeholder:text-white/50`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-red-200 text-xs md:text-sm mt-2">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-white hover:bg-white/90 text-black py-5 md:py-7 text-sm font-medium rounded-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-wetrends"
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
                          Send 
                          <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
