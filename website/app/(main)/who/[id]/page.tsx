import { notFound } from 'next/navigation';
import { getTeamMemberById, getAllTeamMembers } from '@/lib/team-data';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Twitter, Mail, ArrowLeft, Award } from 'lucide-react';
import { TeamMemberContent } from './team-content';

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
    };
  }
  
  return {
    title: `${member.name} - ${member.role} | WeTrends`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = getTeamMemberById(id);
  
  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[#C72C5B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.3),transparent)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Back Link */}
          <Link 
            href="/#team"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Content */}
            <div>
              <span className="inline-block text-white/60 text-sm uppercase tracking-wider mb-4">
                {member.role}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {member.name}
              </h1>
              <p className="text-xl text-white/80 max-w-xl">
                {member.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4 mt-8">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative aspect-[3/4] max-w-md lg:max-w-none mx-auto lg:mx-0">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover rounded-2xl"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <TeamMemberContent member={member} />
    </main>
  );
}
