"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FaqSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
      <div className="container px-4 sm:px-6 md:px-8 mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto text-left mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Everything you need to know about our services and how we work
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            <FaqItem
              question="What is WeTrends?"
              answer="WeTrends began as a pioneering digital content creation agency in the Middle East, revolutionizing the industry by combining human expertise with AI and cutting-edge technologies. After being acquired, the agency has now established itself in the UK under a fresh brand identity. Our mission is to permanently transform how content is created in the UK market by leveraging this unique blend of human creativity and technological innovation."
            />

            <FaqItem
              question="How much does WeTrends cost?"
              answer="WeTrends charges a flat fee of £245 per month for their services, which includes unlimited design requests and revisions."
            />

            <FaqItem
              question="What services does WeTrends offer?"
              answer={
                <div>
                  <p className="mb-4">WeTrends offers:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Unlimited digital asset creation</li>
                    <li>Marketing strategies</li>
                    <li>Personalized 1:1 advisory sessions</li>
                    <li>Social media graphics</li>
                    <li>Website design</li>
                    <li>Brand identity maintenance</li>
                    <li>Posters, flyers, and banners</li>
                  </ul>
                </div>
              }
            />

            <FaqItem
              question="Who is WeTrends ideal for?"
              answer={
                <div>
                  <p className="mb-4">WeTrends is perfect for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Growing businesses</li>
                    <li>Startups</li>
                    <li>Personal brands</li>
                    <li>E-commerce ventures</li>
                    <li>Influencers building their presence</li>
                    <li>Any business seeking consistent, high-quality digital content</li>
                  </ul>
                </div>
              }
            />

            <FaqItem
              question="What makes WeTrends different from traditional agencies?"
              answer={
                <div>
                  <p className="mb-4">
                    WeTrends leverages cutting-edge AI technologies and a highly skilled professional team to
                    revolutionize the design industry. Our innovative approach maximizes both productivity and quality
                    while minimizing costs, making us 10x more efficient than traditional agencies. We offer:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Advanced AI-powered design automation</li>
                    <li>Streamlined workflows for rapid delivery</li>
                    <li>Expert designers augmented by technology</li>
                    <li>Complete brand consistency through smart systems</li>
                    <li>Transparent, all-inclusive pricing</li>
                    <li>Industry-leading turnaround times</li>
                  </ul>
                </div>
              }
            />

            <FaqItem
              question="Is there a limit to design revisions?"
              answer="No, WeTrends offers unlimited revisions until the client is 100% satisfied with the results."
            />

            <FaqItem
              question="What makes WeTrends cost-effective?"
              answer="Instead of hiring an expensive in-house designer or multiple freelancers, WeTrends provides agency-level results with unlimited designs and revisions for a single monthly fee, making it more cost-effective than traditional solutions."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface FaqItemProps {
  question: string
  answer: React.ReactNode
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="flex justify-between items-center w-full p-4 sm:p-5 md:p-6 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 pr-4">{question}</h3>
        <ChevronDown
          className={`flex-shrink-0 h-5 w-5 text-wetrends-600 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 sm:p-5 md:p-6 pt-0 bg-white text-gray-700 text-sm sm:text-base md:text-lg">{answer}</div>
      </div>
    </div>
  )
}
