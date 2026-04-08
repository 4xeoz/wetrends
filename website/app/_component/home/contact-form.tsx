"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, ArrowRight, ArrowLeft, User, Mail, MessageSquare, Briefcase } from "lucide-react"
import { submitContactForm } from "@/actions/contact"

const steps = [
  { id: 1, title: "What's your name?", icon: User, field: "name" },
  { id: 2, title: "What's your email?", icon: Mail, field: "email" },
  { id: 3, title: "What service do you need?", icon: Briefcase, field: "service" },
  { id: 4, title: "Tell us about your project", icon: MessageSquare, field: "message" },
]

const services = [
  "Video Production",
  "Brand Identity", 
  "Web Design",
  "Social Media",
  "Animation",
  "Content Strategy",
  "Other"
]

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function handleServiceSelect(service: string) {
    setFormData((prev) => ({ ...prev, service }))
    setErrors((prev) => ({ ...prev, service: "" }))
  }

  function validateStep(step: number) {
    const newErrors: Record<string, string> = {}
    
    if (step === 1 && !formData.name.trim()) {
      newErrors.name = "Please enter your name"
    }
    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Please enter your email"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
    }
    if (step === 3 && !formData.service) {
      newErrors.service = "Please select a service"
    }
    if (step === 4 && !formData.message.trim()) {
      newErrors.message = "Please tell us about your project"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: "", email: "", service: "", message: "" })
        setCurrentStep(1)
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        setIsSubmitting(false)
        if ("errors" in result) {
          setErrors(result.errors as Record<string, string>)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  const currentStepData = steps[currentStep - 1]
  const IconComponent = currentStepData.icon

  if (isSubmitted) {
    return (
      <div className="text-center py-6 sm:py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#C72C5B] rounded-full mb-4 sm:mb-6">
          <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white">Message Sent!</h3>
        <p className="text-base sm:text-lg text-white/70">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  currentStep >= step.id 
                    ? "bg-[#C72C5B] text-white" 
                    : "bg-white/10 text-white/40"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-6 sm:w-12 md:w-20 h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                    currentStep > step.id ? "bg-[#C72C5B]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-white/50 text-xs sm:text-sm">Step {currentStep} of {steps.length}</p>
      </div>

      {/* Form Content */}
      <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => e.preventDefault()}>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#C72C5B] flex-shrink-0">
              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{currentStepData.title}</h3>
          </div>

          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${errors.name ? "border-red-400" : "border-white/20"} bg-white/5 text-white text-lg h-14 placeholder:text-white/40`}
                placeholder="John Smith"
                autoFocus
              />
              {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
            </div>
          )}

          {/* Step 2: Email */}
          {currentStep === 2 && (
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? "border-red-400" : "border-white/20"} bg-white/5 text-white text-lg h-14 placeholder:text-white/40`}
                placeholder="john@example.com"
                autoFocus
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
            </div>
          )}

          {/* Step 3: Service */}
          {currentStep === 3 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceSelect(service)}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all duration-300 ${
                      formData.service === service
                        ? "border-[#C72C5B] bg-[#C72C5B]/20 text-white"
                        : "border-white/20 text-white/70 hover:border-white/40"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{service}</span>
                  </button>
                ))}
              </div>
              {errors.service && <p className="text-red-400 text-xs sm:text-sm mt-2 sm:mt-3">{errors.service}</p>}
            </div>
          )}

          {/* Step 4: Message */}
          {currentStep === 4 && (
            <div>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`${errors.message ? "border-red-400" : "border-white/20"} bg-white/5 text-white text-lg min-h-[150px] placeholder:text-white/40`}
                placeholder="Tell us about your project, goals, and timeline..."
                autoFocus
              />
              {errors.message && <p className="text-red-400 text-sm mt-2">{errors.message}</p>}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="px-4 sm:px-6 py-5 sm:py-6 border-white/20 text-white hover:bg-white/10 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-[#C72C5B] hover:bg-[#A3244A] text-white py-5 sm:py-6 text-sm sm:text-base font-bold"
            >
              Continue
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-white hover:bg-white/90 text-[#0F0F0F] py-5 sm:py-6 text-sm sm:text-base font-bold"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">Sending...</span>
                  <span className="sm:hidden">Send...</span>
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">Send Message</span>
                  <span className="sm:hidden">Send</span>
                  <Send className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
