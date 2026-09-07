'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateEventLeadStatus } from '@/actions/events';

type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';

export default function AdminLeadStatus({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  return (
    <div className="inline-flex items-center gap-2">
      <select
        aria-label="Lead status"
        aria-busy={loading}
        value={current}
        disabled={loading}
        onChange={async (event) => {
          const next = event.target.value as LeadStatus;
          setLoading(true);
          const previous = current;
          setCurrent(next);
          const result = await updateEventLeadStatus(leadId, next).catch(() => ({ success: false as const }));
          if (!result.success) setCurrent(previous);
          setLoading(false);
        }}
        className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-[#C72C5B] disabled:opacity-50"
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CONVERTED">Converted</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C72C5B]" aria-hidden="true" />}
    </div>
  );
}
