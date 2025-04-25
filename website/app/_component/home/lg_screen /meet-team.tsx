import Image from "next/image"
import { WordRotate } from "@/components/magicui/word-rotate"

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Emma Thompson",
      role: "Creative Director",
      bio: "With over 10 years in digital media, Emma leads our creative vision and ensures every project exceeds expectations.",
      image: "/images/profile1.png",
    },
    {
      name: "James Wilson",
      role: "Head of Video Production",
      bio: "James brings cinematic quality to every project with his background in film and television production.",
      image: "/images/profile2.png",
    },
    {
      name: "Sarah Chen",
      role: "Design Lead",
      bio: "Sarah's eye for aesthetics and brand identity helps transform content into visually stunning experiences.",
      image: "/images/profile1.png",
    },
    {
      name: "Michael Rodriguez",
      role: "Marketing Strategist",
      bio: "Michael specializes in content distribution strategies that maximize reach and engagement.",
      image: "/images/profile2.png",
    },
  ]

  return (
    <section className="min-h-screen flex items-center py-12 sm:py-16 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center my-16 sm:my-24 md:my-32 lg:my-40">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full text-left font-bold">Meet Our Team</h2>
        </div>

        <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="relative overflow-hidden flex items-end p-4 sm:p-6 md:p-8"
                style={{
                  aspectRatio: "2/3",
                }}
              >
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-1 flex flex-col justify-end p-3 sm:p-4">
                  <h3 className="text-white text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">{member.name}</h3>
                  <p className="text-white text-base sm:text-xl font-medium">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-left mt-16 sm:mt-24 md:mt-32 lg:mt-40 flex flex-col gap-2 sm:gap-3 md:gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full text-left">to help you</h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-full text-left">elevate your brands'</h2>
        </div>

        <div className="mt-4 sm:mt-6">
          <WordRotate
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-wetrends font-bold"
            words={["Impact", "Growth", "Success"]}
          />
        </div>
      </div>
    </section>
  )
}
