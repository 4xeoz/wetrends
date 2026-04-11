// Static — no client JS needed, no animations. Renders instantly.
import { GraduationCap, Star, Zap, MapPin } from 'lucide-react';

const stats = [
  { icon: GraduationCap, value: '200+', label: 'Graduates served' },
  { icon: Star, value: '5.0 ★', label: 'Average rating' },
  { icon: Zap, value: '48h', label: 'Delivery guaranteed' },
  { icon: MapPin, value: 'Guildford', label: 'University of Surrey' },
];

export default function CinematographyTrust() {
  return (
    <section className="border-b border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C72C5B]/8 border border-[#C72C5B]/12">
                <Icon className="h-4 w-4 text-[#C72C5B]" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
