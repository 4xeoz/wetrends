import { notFound } from 'next/navigation';
import { getTeamMemberById, getAllTeamMembers } from '@/lib/team-data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Mail, Award } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const members = getAllTeamMembers();
  return members.map((member) => ({
    id: member.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const member = getTeamMemberById(id);

  if (!member) {
    return {
      title: 'Team Member Not Found | WeTrends',
      robots: { index: false },
    };
  }

  return {
    title: `${member.name} - ${member.role} | WeTrends Team`,
    description: member.bio,
    alternates: {
      canonical: `https://wetrends.co.uk/who/${member.id}/`,
    },
    openGraph: {
      title: `${member.name} - ${member.role} | WeTrends`,
      description: member.bio,
      url: `https://wetrends.co.uk/who/${member.id}/`,
      type: 'profile',
      locale: 'en_GB',
      siteName: 'WeTrends',
      images: member.image ? [
        {
          url: member.image,
          width: 800,
          height: 1000,
          alt: `${member.name} - ${member.role} at WeTrends`,
        }
      ] : undefined,
    },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#0F0F0F]">
      {/* Hero Section */}
      <section className="relative pt-[72px]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* Back Link */}
          <Link
            href="/#team"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#C72C5B]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Link>

          <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-20">
            {/* Image */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] bg-gray-100 lg:mx-0 lg:max-w-md">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <span className="mb-3 text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                {member.role}
              </span>
              <h1 className="text-5xl font-bold leading-none md:text-6xl lg:text-7xl">
                {member.name}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
                {member.bio}
              </p>

              {/* Email */}
              <a
                href="mailto:team@wetrends.co.uk"
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-[#0F0F0F] transition-all hover:border-[#C72C5B] hover:bg-[#C72C5B] hover:text-white"
              >
                <Mail className="h-4 w-4" />
                team@wetrends.co.uk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="border-t border-gray-100 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            About <span className="font-serif italic text-[#C72C5B]">{member.name}</span>
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-600">
            {member.fullBio.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Achievements */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            {/* Skills */}
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">Expertise</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#C72C5B]/30 bg-[#C72C5B]/10 px-4 py-2 text-sm font-bold text-[#C72C5B]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
                <Award className="h-6 w-6 text-[#C72C5B]" />
                Key Achievements
              </h3>
              <ul className="mt-6 space-y-4">
                {member.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C72C5B]" />
                    <span className="text-lg">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            Work with <span className="font-serif italic text-[#C72C5B]">{member.name}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Ready to bring your brand vision to life? Get in touch to discuss your project with our team.
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-colors hover:bg-[#A3244A]"
          >
            Start a Project
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
