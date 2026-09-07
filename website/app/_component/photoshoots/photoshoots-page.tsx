import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Check, ImageIcon, MapPin, Sparkles, Users } from 'lucide-react';
import ContactForm from '@/app/_component/home/contact-form';

const shootTypes = [
  {
    title: 'Personal brands',
    copy: 'A useful bank of portraits, working shots and campaign crops for your website, press and social channels.',
    icon: Sparkles,
  },
  {
    title: 'Teams and headshots',
    copy: 'Consistent individual and group photography that still feels like the people behind the business.',
    icon: Users,
  },
  {
    title: 'Products and campaigns',
    copy: 'Planned hero, detail and format variations shaped around where the images will actually be used.',
    icon: ImageIcon,
  },
  {
    title: 'Graduation',
    copy: 'Relaxed individual, family and cinematic coverage in Surrey, London and agreed university locations.',
    icon: Camera,
  },
];

const steps = [
  ['01', 'Purpose first', 'We agree the audience, channels, crops and must-have shots before choosing the visual treatment.'],
  ['02', 'Plan the room', 'Location, light, styling, access, timings and permissions are turned into one practical shoot plan.'],
  ['03', 'Direct the shoot', 'Clear, calm direction keeps expressions natural and makes efficient use of everyone’s time.'],
  ['04', 'Deliver for use', 'You receive an agreed edit with useful web, social and high-resolution versions.'],
];

export default function PhotoshootsPage() {
  return (
    <main className="min-h-[100svh] bg-[#F7F5F3] pt-[72px]">
      <section className="overflow-hidden border-b border-black/10 bg-[#0F0F0F] text-white">
        <div className="mx-auto grid min-h-[78svh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F08BAB]">
              <MapPin className="h-4 w-4" /> London · Surrey · UK
            </span>
            <h1 className="mt-7 max-w-4xl text-[clamp(3.2rem,8vw,7.2rem)] font-bold leading-[0.84] tracking-[-0.06em]">
              Photos with a job to do.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl">
              Portraits, teams, products and personal brands—planned around the places your images need to work, not just the day of the shoot.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#photoshoot-enquiry" className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#A3244A]">
                Plan a photoshoot <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/cinematography/" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">
                Graduation packages
              </Link>
            </div>
          </div>

          <figure className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#C72C5B]">
            <Image
              src="/images/Jullia.png"
              alt="Illustrative studio portrait showing a warm editorial direction"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/65 px-4 py-3 text-xs leading-relaxed text-white/80 backdrop-blur">
              Illustrative visual direction. Real client work is published only with permission and clearly identified.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Choose the outcome</span>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#0F0F0F] sm:text-6xl">One production partner. Four useful formats.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {shootTypes.map(({ title, copy, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-black/10 bg-white p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C72C5B]/10 text-[#C72C5B]"><Icon className="h-6 w-6" /></div>
              <h3 className="mt-8 text-2xl font-bold text-[#0F0F0F]">{title}</h3>
              <p className="mt-3 leading-relaxed text-black/55">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">A calmer process</span>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#0F0F0F] sm:text-5xl">Fewer surprises. More usable images.</h2>
              <p className="mt-5 leading-relaxed text-black/55">The shoot is treated as production: every frame has an intended use, owner and delivery format.</p>
            </div>
            <ol className="space-y-3">
              {steps.map(([number, title, copy]) => (
                <li key={number} className="grid gap-3 rounded-2xl border border-black/10 p-5 sm:grid-cols-[50px_180px_1fr] sm:items-start">
                  <span className="font-mono text-sm font-bold text-[#C72C5B]">{number}</span>
                  <strong className="text-[#0F0F0F]">{title}</strong>
                  <span className="text-sm leading-relaxed text-black/55">{copy}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-[#C72C5B] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {['Clear usage and deliverables in the quote', 'AI supporting visuals never presented as client work', 'Real galleries published only with client permission'].map((item) => (
            <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-relaxed"><Check className="mt-0.5 h-5 w-5 shrink-0" /> {item}</p>
          ))}
        </div>
      </section>

      <section id="photoshoot-enquiry" className="scroll-mt-24 bg-[#0F0F0F] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F08BAB]">Start with the brief</span>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">What do the photos need to achieve?</h2>
            <p className="mt-5 leading-relaxed text-white/55">Tell us the audience, deadline and where the images will appear. We will come back with the smallest sensible shoot plan.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <ContactForm defaultService="Photoshoots" source="photoshoots_page" />
          </div>
        </div>
      </section>
    </main>
  );
}
