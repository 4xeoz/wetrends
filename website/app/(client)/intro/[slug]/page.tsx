import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteProfile } from "@/lib/site-profile";
import { driveEmbedUrl, driveOpenUrl, getIntroRecipient, introSender, introVideo } from "@/lib/intro-pages";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipient = getIntroRecipient(slug);
  if (!recipient) return { title: "WeTrends", robots: { index: false, follow: false } };
  const title = `${recipient.subject}, for ${recipient.firstName}`;
  return {
    title,
    description: "A short film about who we are and what we make.",
    robots: { index: false, follow: false, noarchive: true },
    openGraph: { title, description: "A short film about who we are and what we make.", images: [{ url: introVideo.thumbnailPath, width: 1200, height: 675 }] },
    twitter: { card: "summary_large_image", title, images: [introVideo.thumbnailPath] },
  };
}

export default async function IntroPage({ params }: Props) {
  const { slug } = await params;
  const recipient = getIntroRecipient(slug);
  if (!recipient) notFound();

  const mailto = `mailto:${introSender.email}?subject=${encodeURIComponent(`Re: ${recipient.subject}`)}`;

  return <main className="flex min-h-svh flex-col overflow-x-hidden bg-[#F3F0EA] text-[#1B1819]">
    <header className="px-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1384px] items-center justify-between gap-4 border-b border-[#1B1819]/15 py-3 sm:py-4">
        <Link href="/" aria-label="WeTrends home" className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className="h-8 w-auto brightness-0" />
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B1819]/55">A private introduction</p>
      </div>
    </header>

    <div className="mx-auto flex w-full max-w-[1384px] flex-1 flex-col px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pt-8">
      <div className="wt-client-welcome-enter grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A52249] sm:text-xs"><span aria-hidden="true" className="h-px w-8 bg-[#A52249]" />For {recipient.firstName}</p>
          <h1 className="mt-4 text-[clamp(2.6rem,5.6vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.07em]">Hi {recipient.firstName},<br /><span className="font-serif font-normal italic tracking-[-0.06em] text-[#A52249]">{recipient.headlineAccent}</span></h1>
        </div>
        <p className="max-w-xl text-base leading-7 text-[#1B1819]/70 sm:text-lg sm:leading-8">{recipient.personalLine}</p>
      </div>

      <section aria-label="Introduction film" className="wt-client-showcase-enter mt-7 sm:mt-8 lg:mt-7">
        <div className="mx-auto w-full lg:w-[min(100%,max(640px,calc((100svh-480px)*16/9)))]">
          <div className="relative aspect-video w-full overflow-hidden bg-[#21191C] shadow-[0_30px_80px_-30px_rgba(60,10,25,0.45)]">
            <iframe
              title="WeTrends introduction film"
              src={driveEmbedUrl(introVideo.driveFileId)}
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="eager"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-[#1B1819]/60">
            <p>{introVideo.duration} · best with sound on</p>
            <a href={driveOpenUrl(introVideo.driveFileId)} target="_blank" rel="noopener noreferrer" className="underline decoration-[#1B1819]/30 underline-offset-4 transition hover:text-[#A52249] hover:decoration-[#A52249]">Video not playing? Open it directly</a>
          </div>
        </div>
      </section>

      <div className="wt-client-welcome-enter mx-auto mt-7 flex w-full flex-wrap items-center gap-x-6 gap-y-4 lg:w-[min(100%,max(640px,calc((100svh-480px)*16/9)))]" style={{ animationDelay: "250ms" }}>
        <a href={mailto} className="inline-flex min-h-14 w-full items-center justify-center bg-[#1B1819] px-9 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A52249] active:translate-y-0 sm:w-auto">{recipient.ctaLabel}</a>
        <p className="text-xs leading-5 text-[#1B1819]/55">{recipient.ctaNote} {siteProfile.name}.</p>
      </div>
    </div>
  </main>;
}
