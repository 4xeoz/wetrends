// Static server component — zero JS, instant render
import { GraduationCap, Star, Zap, MapPin } from 'lucide-react';

const stats = [
  { icon: GraduationCap, value: '200+', label: 'Graduates served' },
  { icon: Star, value: '5.0 ★', label: 'Average rating' },
  { icon: Zap, value: '48 hours', label: 'Guaranteed delivery' },
  { icon: MapPin, value: 'Guildford', label: 'University of Surrey' },
];

export default function CinematographyTrust() {
  return (
    <section className="border-y border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-gray-100 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-6 py-8 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
                <Icon className="h-4 w-4 text-[#C72C5B]" />
              </div>
              <p className="text-xl font-black text-[#0F0F0F]">{value}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
