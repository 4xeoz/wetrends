'use client';

import { X, ImageIcon } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

interface ImageUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

/**
 * Paste-a-URL field for the (now removed) featured-image upload flow.
 * Used only for social-share previews (Open Graph) — blog pages themselves
 * render a title-based cover, not this image.
 */
export function ImageUrlInput({ value, onChange, label = 'Featured Image' }: ImageUrlInputProps) {
  return (
    <div>
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="pl-9"
          />
        </div>
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={() => onChange('')}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-gray-500">
        Used for social-share previews only — paste a link to an already-hosted image.
      </p>
      {value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-40 w-full object-cover" />
        </div>
      )}
    </div>
  );
}
