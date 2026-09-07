import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminEventCreateForm from '@/app/_component/events/admin-event-create-form';
import { prisma } from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead: leadId } = await searchParams;
  const lead = leadId && /^[a-f\d]{24}$/i.test(leadId)
    ? await prisma.eventLead.findUnique({ where: { id: leadId } })
    : null;

  return (
    <div className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/me/events" className="inline-flex items-center gap-2 text-xs font-bold text-black/50"><ArrowLeft className="h-4 w-4" /> Event Studio</Link>
        <header className="mb-8 mt-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">New event</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Create the private offer.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/50">Set only what this client should see. Prices entered here become the server-side source for checkout.</p></header>
        <AdminEventCreateForm initial={lead ? {
          leadId: lead.id,
          clientName: lead.name,
          clientEmail: lead.email,
          clientPhone: lead.phone,
          eventTitle: `${lead.eventType} photographs`,
          eventType: lead.eventType,
          eventDate: lead.eventDate.toISOString().slice(0, 10),
          location: lead.location,
        } : undefined} />
      </div>
    </div>
  );
}
