import { ContactRound, MessageCircle } from 'lucide-react';
import { EDDY_PROFILE } from '@/lib/connect-profile';

export function ConnectActions({ variant }: { variant: 'business' | 'events' }) {
  const isBusiness = variant === 'business';
  const message = isBusiness
    ? 'Hi Eddy, I found your WeTrends card and would like to discuss a project.'
    : 'Hi Eddy, I am planning an event and would like to check availability.';
  const actions = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/${EDDY_PROFILE.whatsappNumber}?text=${encodeURIComponent(message)}`,
      icon: MessageCircle,
      external: true,
      style: 'bg-[#20B85A] text-white ring-[#20B85A]/20 hover:bg-[#189A4A]',
    },
    {
      label: 'Save contact',
      href: '/connect/eddy/contact.vcf/',
      icon: ContactRound,
      external: false,
      download: 'eddy-wetrends.vcf',
      style: 'bg-white text-[#171214] ring-black/10 hover:text-[#C72C5B]',
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3" aria-label="Contact Eddy">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          download={action.download}
          className={`inline-flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-bold shadow-sm ring-1 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] sm:min-h-12 sm:flex-row sm:gap-2 sm:rounded-2xl sm:px-2 sm:text-sm ${action.style}`}
        >
          <action.icon className="h-3.5 w-3.5 flex-none sm:h-4 sm:w-4" />
          <span>{action.label}</span>
        </a>
      ))}
    </div>
  );
}
