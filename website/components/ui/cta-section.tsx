import React from "react";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  ctaText?: string;
  teamText?: string;
  className?: string;
}

/**
 * CTASection - Reusable call-to-action component with team avatars
 */
const CTASection: React.FC<CTASectionProps> = ({
  ctaText = "Let's talk",
  teamText = "dedicated team of strategists",
  className = "",
}) => {
  return (
    <div className={className}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900">{ctaText}</span>
          <ArrowRight className="w-6 h-6 text-gray-900" />
        </div>
      </div>
      <hr className="my-4 border-black w-1/3" />
      <div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 w-1/3">{teamText}</span>
            <div className="flex -space-x-2">
            <img
              src="/images/iyad_cherifi.webp"
              alt="Iyad Cherifi"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="/images/becca_ralph.webp"
              alt="Becca Ralph"
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
