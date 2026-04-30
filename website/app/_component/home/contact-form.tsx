'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { submitContactForm } from '@/actions/contact';

const steps = [
  { id: 1, title: 'What is your name?', field: 'name' },
  { id: 2, title: 'What is your email?', field: 'email' },
  { id: 3, title: 'What do you need?', field: 'service' },
  { id: 4, title: 'Tell us about your project', field: 'message' },
];

const services = [
  'Video Production',
  'Brand Identity',
  'Web Design',
  'Social Media',
  'Animation',
  'Content Strategy',
  'Other',
];

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleServiceSelect(service: string) {
    setFormData((prev) => ({ ...prev, service }));
    setErrors((prev) => ({ ...prev, service: '' }));
  }

  function validateStep(step: number) {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    if (step === 3 && !formData.service) {
      newErrors.service = 'Please select a service';
    }
    if (step === 4 && !formData.message.trim()) {
      newErrors.message = 'Please tell us about your project';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', service: '', message: '' });
        setCurrentStep(1);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setIsSubmitting(false);
        if ('errors' in result) {
          setErrors(result.errors as Record<string, string>);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  }

  const currentStepData = steps[currentStep - 1];

  if (isSubmitted) {
    return (
      <div className="py-10 text-center sm:py-16">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[#C72C5B] sm:mb-6 sm:h-16 sm:w-16" />
        <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          Message Sent
        </h3>
        <p className="text-base text-white/60 sm:text-lg">
          We will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between sm:mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-white/40">
          Step {currentStep} of {steps.length}
        </p>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentStep >= step.id ? 'w-6 bg-[#C72C5B]' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="mb-8 text-2xl font-bold text-white sm:mb-10 sm:text-3xl md:text-4xl">
        {currentStepData.title}
      </h3>

      {/* Form Content */}
      <form
        onSubmit={
          currentStep === steps.length ? handleSubmit : (e) => e.preventDefault()
        }
      >
        {/* Step 1: Name */}
        {currentStep === 1 && (
          <div>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`h-auto border-0 border-b bg-transparent px-0 pb-4 text-2xl font-bold text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-3xl ${
                errors.name ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Your name"
              autoFocus
            />
            {errors.name && (
              <p className="mt-3 text-sm text-red-400">{errors.name}</p>
            )}
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
              className={`h-auto border-0 border-b bg-transparent px-0 pb-4 text-2xl font-bold text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-3xl ${
                errors.email ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="you@company.com"
              autoFocus
            />
            {errors.email && (
              <p className="mt-3 text-sm text-red-400">{errors.email}</p>
            )}
          </div>
        )}

        {/* Step 3: Service */}
        {currentStep === 3 && (
          <div>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceSelect(service)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    formData.service === service
                      ? 'bg-[#C72C5B] text-white'
                      : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
            {errors.service && (
              <p className="mt-4 text-sm text-red-400">{errors.service}</p>
            )}
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
              className={`min-h-[120px] resize-none border-0 border-b bg-transparent px-0 pb-4 text-lg text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-xl ${
                errors.message ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="Tell us about your project, goals, and timeline..."
              autoFocus
            />
            {errors.message && (
              <p className="mt-3 text-sm text-red-400">{errors.message}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center gap-4 sm:mt-12">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="ml-auto rounded-full bg-[#C72C5B] px-8 py-6 text-base font-bold text-white hover:bg-[#A3244A]"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto rounded-full bg-white px-8 py-6 text-base font-bold text-[#0F0F0F] hover:bg-white/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending
                </span>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
