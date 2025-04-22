import Image from "next/image"
import Link from "next/link"
import { WordRotate } from "@/components/magicui/word-rotate";


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
    <section className="min-h-screen flex items-center py-20 px-4">
      <div className="container ">

        <div className="text-center my-40">
          <h2 className="text-6xl  w-full text-left">Meet Our Team</h2>
        </div>

        <div className="grid gap-10 md:grid-cols-4 ">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="relative overflow-hidden flex items-end p-8"
                style={{
                  aspectRatio: "2/3",
                }}
              >
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                <div className="absolute inset-1 flex flex-col justify-end p-4">
                  <h3 className="text-white text-2xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-white text-xl font-medium">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-left mt-40 flex flex-col gap-4">
            <h2 className="text-6xl  w-full text-left">to help you</h2>
          <h2 className="text-6xl  w-full text-left">elevate your brands’</h2>
        </div>

        <div>
            <WordRotate
            className="text-9xl text-wetrends"
            words={["Impact", "Growth", "Success"]}
            
            />
        </div>

       
      </div>
    </section>
  )
}
