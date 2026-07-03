'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteQrLink } from '@/actions/qr';
import { useRouter } from 'next/navigation';

export default function QrDeleteButton({ id, label }: { id: string; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    await deleteQrLink(id);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          {deleting ? '…' : 'Delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:border-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${label}`}
      className="flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
