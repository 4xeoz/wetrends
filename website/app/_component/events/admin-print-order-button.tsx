'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { markPrintOrderFulfilled } from '@/actions/events';

export default function AdminPrintOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError('');
          const result = await markPrintOrderFulfilled(orderId).catch(() => ({ success: false as const, message: 'Update failed.' }));
          if (!result.success) setError(result.message || 'Update failed.');
          else router.refresh();
          setLoading(false);
        }}
        className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        Mark dispatched
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
