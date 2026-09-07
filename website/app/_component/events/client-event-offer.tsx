'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Gift,
  Images,
  Instagram,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { createDigitalCheckout, createEventReferralClaim } from '@/actions/events';
import { COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT, formatMoney, getCompleteStoryReferralPrice } from '@/lib/events/catalog';

type OfferJob = {
  clientName: string;
  eventTitle: string;
  eventType: string;
  eventDate: string | null;
  location: string | null;
  photographerName: string;
  photographerImage: string | null;
  partnerName: string | null;
  includedImageCount: number;
  fullGalleryPrice: number;
  retouchingPrice: number;
  extraCoverageMinutes: number;
  extraCoveragePrice: number;
  currency: string;
  selectedPackage: 'INCLUDED' | 'FULL' | null;
  status: string;
  galleryPublished: boolean;
};

type FinishChoice = 'STANDARD' | 'SIGNATURE';

export default function ClientEventOffer({
  token,
  job,
  cancelled,
  referralClaim,
}: {
  token: string;
  job: OfferJob;
  cancelled: boolean;
  referralClaim?: string | null;
}) {
  const [selectedPackage, setSelectedPackage] = useState<'INCLUDED' | 'FULL' | null>(null);
  const [finishChoice, setFinishChoice] = useState<FinishChoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralPromptOpen, setReferralPromptOpen] = useState(false);
  const [referralClaimState, setReferralClaimState] = useState<string | null>(referralClaim || null);
  const [referralUnlocked, setReferralUnlocked] = useState(Boolean(referralClaim));
  const [referralBusy, setReferralBusy] = useState(false);
  const [referralMessage, setReferralMessage] = useState('');
  const retouching = finishChoice === 'SIGNATURE';
  const readyToCheckout = selectedPackage !== null && finishChoice !== null;
  const activeStage = !selectedPackage ? 'collection' : !finishChoice ? 'finish' : 'review';
  const stageContentRef = useRef<HTMLDivElement>(null);
  const previousStageRef = useRef(activeStage);

  const discountedFullGalleryPrice = useMemo(
    () => referralUnlocked ? getCompleteStoryReferralPrice(job.fullGalleryPrice) : job.fullGalleryPrice,
    [job.fullGalleryPrice, referralUnlocked],
  );

  useEffect(() => {
    if (previousStageRef.current === activeStage) return;
    previousStageRef.current = activeStage;
    window.requestAnimationFrame(() => {
      stageContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [activeStage]);

  useEffect(() => {
    if (job.selectedPackage) return;
    const timer = window.setTimeout(() => setReferralPromptOpen(true), 520);
    return () => window.clearTimeout(timer);
  }, [job.selectedPackage]);

  const total = useMemo(() => {
    if (!selectedPackage) return 0;
    return (selectedPackage === 'FULL' ? discountedFullGalleryPrice : 0)
      + (retouching ? job.retouchingPrice : 0)
      + job.extraCoveragePrice;
  }, [discountedFullGalleryPrice, job.extraCoveragePrice, job.retouchingPrice, retouching, selectedPackage]);

  function choosePackage(value: 'INCLUDED' | 'FULL') {
    setSelectedPackage(value);
    setFinishChoice(null);
    setError('');
  }

  function chooseFinish(value: FinishChoice) {
    setFinishChoice(value);
    setError('');
  }

  function getReferralUrl(claim: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete('cancelled');
    url.searchParams.set('ref', claim);
    return url.toString();
  }

  async function ensureReferralClaim() {
    if (referralClaimState) return referralClaimState;
    const result = await createEventReferralClaim(token);
    if (!result.success) {
      setReferralMessage(result.message);
      return null;
    }
    setReferralClaimState(result.claim);
    setReferralUnlocked(true);
    return result.claim;
  }

  async function handleReferralAction(action: 'copy' | 'instagram' | 'whatsapp') {
    if (referralBusy) return;
    setReferralBusy(true);
    setReferralMessage('');
    try {
      const claim = await ensureReferralClaim();
      if (!claim) return;
      const url = getReferralUrl(claim);
      const shareText = `See our ${job.eventTitle} photographs with me. The Complete Story gallery has 30% off for family and friends: ${url}`;

      if (action === 'copy') {
        await copyText(url);
        setReferralMessage('Link copied — your 30% saving is unlocked.');
      } else if (action === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
        setReferralMessage('WhatsApp opened — your 30% saving is unlocked.');
      } else {
        await copyText(url);
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
        setReferralMessage('Link copied — paste it into your Instagram Story.');
      }
    } catch {
      setReferralMessage('We could not prepare that share. Try Copy link instead.');
    } finally {
      setReferralBusy(false);
    }
  }

  async function continueToCheckout() {
    if (!selectedPackage || !finishChoice) {
      setError('Choose your collection and finish before continuing.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await createDigitalCheckout(token, { package: selectedPackage, retouching });
      if (!result.success) {
        setError(result.message);
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError('We could not open checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const photographerImage = job.photographerImage?.startsWith('/')
    ? job.photographerImage
    : '/images/eddy-event-photographer-v2.png';

  if (job.selectedPackage) {
    return (
      <main className="min-h-screen bg-[#F8F5F3] text-[#0F0F0F]">
        <PrivateHeader />
        <section className="mx-auto flex min-h-[calc(100vh-74px)] max-w-3xl items-center px-4 py-16 sm:px-6">
          <div className="w-full rounded-[2rem] bg-white p-8 text-center shadow-[0_28px_90px_rgba(58,24,36,0.1)] sm:p-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#C72C5B] text-white">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Choices received</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">We’re on it, {job.clientName.split(' ')[0]}.</h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-black/55">
              Your {job.selectedPackage === 'FULL' ? 'Complete Story gallery' : `${job.includedImageCount}-image collection`} is confirmed. We’ll email you when it is ready.
            </p>
            {job.galleryPublished && (
              <Link href={`/gallery/${token}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white">
                Open your gallery <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F3] text-[#0F0F0F]">
      <PrivateHeader />
      <section className="relative isolate overflow-hidden border-b border-black/[0.06]">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/15 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#C72C5B] backdrop-blur">
              <LockKeyhole className="h-3.5 w-3.5" /> Private event link
            </span>
            <h1 className="mt-7 text-[clamp(3.5rem,8vw,7.3rem)] font-bold leading-[0.84] tracking-[-0.065em]">
              Hi, {job.clientName.split(' ')[0]}.
              <span className="mt-2 block font-serif text-[0.72em] font-normal italic text-[#C72C5B]">Keep the whole story.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-black/55">
              The shoot is wrapped. Choose how you’d like our in-house team to prepare your {job.eventTitle} photographs.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-black/50">
              <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[#C72C5B]" /> {job.eventType}</span>
              {job.eventDate && <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#C72C5B]" /> {new Date(job.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            </div>
          </div>

          <aside className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] bg-[#0F0F0F] p-3 text-white shadow-2xl shadow-[#6a1531]/20">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image src={photographerImage} alt={`${job.photographerName}, your photographer`} fill sizes="380px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F08BAB]">Your photographer</p>
                <p className="mt-2 text-2xl font-bold">{job.photographerName}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {cancelled && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
            Nothing was charged. Your choices are still here whenever you’re ready.
          </div>
        )}

        <div className="mb-12 grid grid-cols-3 gap-2 sm:gap-3">
          <StageIndicator
            number="01"
            label="Collection"
            active={!selectedPackage}
            complete={Boolean(selectedPackage)}
            onClick={selectedPackage ? () => {
              setSelectedPackage(null);
              setFinishChoice(null);
              setError('');
            } : undefined}
          />
          <StageIndicator
            number="02"
            label="Finish"
            active={Boolean(selectedPackage && !finishChoice)}
            complete={Boolean(finishChoice)}
            onClick={finishChoice ? () => {
              setFinishChoice(null);
              setError('');
            } : undefined}
          />
          <StageIndicator number="03" label="Review" active={readyToCheckout} complete={false} />
        </div>

        <div ref={stageContentRef} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {!selectedPackage && (
              <motion.section
                key="collection"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">01 · Choose your collection</p>
                  <h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">How much should we keep?</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <button
                    type="button"
                    aria-pressed={selectedPackage === 'INCLUDED'}
                    onClick={() => choosePackage('INCLUDED')}
                    className={`relative flex min-h-[22rem] flex-col rounded-[1.8rem] border-2 p-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B]/25 sm:p-8 ${selectedPackage === 'INCLUDED' ? 'border-[#C72C5B] bg-white shadow-[0_22px_60px_rgba(199,44,91,0.12)]' : 'border-black/10 bg-white/70 hover:-translate-y-1 hover:border-[#C72C5B]/45 hover:bg-white'}`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F5ECEF] text-[#C72C5B]"><Camera className="h-5 w-5" /></span>
                    <h3 className="mt-7 text-2xl font-bold sm:text-3xl">Included Collection</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">Our strongest {job.includedImageCount} photographs, professionally edited and ready to share.</p>
                    <div className="mt-auto pt-10">
                      <p className="text-2xl font-bold">Included</p>
                      {job.partnerName && <p className="mt-1 text-xs font-semibold text-[#C72C5B]">Courtesy of {job.partnerName}</p>}
                    </div>
                    {selectedPackage === 'INCLUDED' && <SelectedMark />}
                  </button>

                  <button
                    type="button"
                    aria-pressed={selectedPackage === 'FULL'}
                    onClick={() => choosePackage('FULL')}
                    className={`group relative min-h-[22rem] overflow-hidden rounded-[1.8rem] border-2 p-6 text-left text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B]/25 sm:p-8 ${selectedPackage === 'FULL' ? 'border-white/70 shadow-[0_28px_80px_rgba(143,24,63,0.35)] ring-4 ring-[#C72C5B]/20' : 'border-transparent shadow-[0_20px_60px_rgba(143,24,63,0.2)] hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(143,24,63,0.32)]'}`}
                  >
                    <Image src="/images/events-complete-package-mesh.png" alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="pointer-events-none scale-[1.04] object-cover blur-[2px] transition-transform duration-700 group-hover:scale-110" />
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(83,8,35,0.82),rgba(199,44,91,0.2)_52%,rgba(77,5,32,0.72))]" />
                    <span className="absolute right-5 top-5 z-10 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl sm:right-7 sm:top-7">Recommended</span>
                    <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-xl"><Images className="h-5 w-5" /></span>
                    <div className="relative z-10 mt-8 max-w-xl">
                      <h3 className="text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Complete Story</h3>
                      <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">Every photograph worth keeping, professionally edited in one complete private gallery.</p>
                    </div>
                    <div className="relative z-10 mt-12">
                      {referralUnlocked && (
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD0DD]">{COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT}% referral saving unlocked</p>
                      )}
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        {referralUnlocked && <span className="text-lg font-semibold text-white/50 line-through">{formatMoney(job.fullGalleryPrice, job.currency)}</span>}
                        <p className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{formatMoney(discountedFullGalleryPrice, job.currency)}</p>
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">One payment · yours to keep</p>
                    </div>
                    {selectedPackage === 'FULL' && <SelectedMark inverted />}
                  </button>
                </div>
              </motion.section>
            )}

            {selectedPackage && !finishChoice && (
              <motion.section
                key="finish"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">02 · Optional finish</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Choose your finish.</h2>
                </div>

                <div className={`grid gap-4 ${job.retouchingPrice > 0 ? 'md:grid-cols-2' : ''}`}>
                  <button
                    type="button"
                    aria-pressed={finishChoice === 'STANDARD'}
                    onClick={() => chooseFinish('STANDARD')}
                    className={`relative flex min-h-40 flex-col items-stretch justify-center gap-4 rounded-[1.6rem] border-2 p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B]/25 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6 ${finishChoice === 'STANDARD' ? 'border-[#C72C5B] bg-white shadow-lg shadow-[#C72C5B]/10' : 'border-black/10 bg-white/65 hover:border-[#C72C5B]/35 hover:bg-white'}`}
                  >
                    <span className="flex min-w-0 items-start gap-4 sm:items-center">
                      <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#F5ECEF] text-[#C72C5B]"><CheckCircle2 className="h-5 w-5" /></span>
                      <span>
                        <span className="block text-base font-bold sm:text-lg">Basic edit</span>
                        <span className="mt-1 block text-sm text-black/45">A quick colour and exposure pass. No detailed retouching.</span>
                      </span>
                    </span>
                    <span className="ml-16 pr-9 text-sm font-bold text-[#C72C5B] sm:ml-0">Included</span>
                    {finishChoice === 'STANDARD' && <SelectedMark />}
                  </button>

                  {job.retouchingPrice > 0 && (
                    <button
                      type="button"
                      aria-pressed={finishChoice === 'SIGNATURE'}
                      onClick={() => chooseFinish('SIGNATURE')}
                      className={`group relative flex min-h-40 flex-col items-stretch justify-center gap-4 overflow-hidden rounded-[1.6rem] border-2 p-5 text-left text-white transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B]/25 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6 ${finishChoice === 'SIGNATURE' ? 'border-white/70 shadow-[0_28px_80px_rgba(143,24,63,0.35)] ring-4 ring-[#C72C5B]/20' : 'border-transparent shadow-[0_20px_60px_rgba(143,24,63,0.2)] hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(143,24,63,0.32)]'}`}
                    >
                      <Image src="/images/events-complete-package-mesh.png" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="pointer-events-none absolute inset-0 z-0 scale-[1.08] object-cover blur-[2px] transition-transform duration-700 group-hover:scale-110" />
                      <span className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(83,8,35,0.86),rgba(199,44,91,0.2)_52%,rgba(77,5,32,0.76))]" />
                      <span className="relative z-10 flex min-w-0 items-start gap-4 sm:items-center">
                        <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-xl"><Sparkles className="h-5 w-5" /></span>
                        <span>
                          <span className="block text-base font-bold sm:text-lg">Signature Retouching</span>
                          <span className="mt-1 block text-sm text-white/75">Detailed finishing for your favourite portraits.</span>
                        </span>
                      </span>
                      <span className="relative z-10 ml-16 pr-9 text-sm font-bold sm:ml-0">+{formatMoney(job.retouchingPrice, job.currency)}</span>
                      {finishChoice === 'SIGNATURE' && <SelectedMark />}
                    </button>
                  )}
                </div>
              </motion.section>
            )}

            {readyToCheckout && selectedPackage && finishChoice && (
              <motion.section
                key="review"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="rounded-[2rem] bg-[#12090D] p-6 text-white shadow-[0_28px_90px_rgba(52,12,28,0.18)] sm:p-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-center lg:gap-12"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F08BAB]">03 · Review & continue</p>
                  <div className="mt-6 max-w-xl space-y-4 border-b border-white/10 pb-6 text-sm">
                    <SummaryRow label={selectedPackage === 'FULL' ? (referralUnlocked ? `Complete Story · ${COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT}% off` : 'Complete Story') : `Included ${job.includedImageCount}`} amount={selectedPackage === 'FULL' ? discountedFullGalleryPrice : 0} currency={job.currency} included={selectedPackage === 'INCLUDED'} dark />
                    {retouching && <SummaryRow label="Signature Retouching" amount={job.retouchingPrice} currency={job.currency} dark />}
                    {!retouching && <SummaryRow label="Basic edit" amount={0} currency={job.currency} included dark />}
                    {job.extraCoveragePrice > 0 && job.extraCoverageMinutes > 0 && <SummaryRow label={`Additional coverage · ${job.extraCoverageMinutes} min`} amount={job.extraCoveragePrice} currency={job.currency} dark />}
                  </div>
                  <div className="mt-6 flex max-w-xl items-end justify-between">
                    <span className="text-sm font-bold text-white/60">Total</span>
                    <span className="text-4xl font-bold tracking-[-0.04em]">{formatMoney(total, job.currency)}</span>
                  </div>
                </div>

                <div className="mt-8 lg:mt-0">
                  {error && <p role="alert" className="mb-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</p>}
                  <button type="button" disabled={loading} onClick={continueToCheckout} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#12090D] disabled:cursor-wait disabled:opacity-60">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</> : <>{total > 0 ? 'Continue to secure payment' : 'Confirm my collection'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                  </button>
                  <div className="mt-5 space-y-2 text-xs text-white/45">
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#F08BAB]" /> Exact total shown before payment</p>
                    <p className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-[#F08BAB]" /> Secure checkout powered by Stripe</p>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ReferralPrompt
        open={referralPromptOpen}
        unlocked={referralUnlocked}
        busy={referralBusy}
        message={referralMessage}
        onClose={() => setReferralPromptOpen(false)}
        onAction={handleReferralAction}
      />
    </main>
  );
}

function PrivateHeader() {
  return (
    <header className="flex h-[74px] items-center justify-between border-b border-black/[0.06] bg-white px-4 sm:px-8">
      <Link href="/events" className="text-sm font-black tracking-[-0.02em]">WETRENDS</Link>
      <span className="inline-flex items-center gap-2 text-xs font-semibold text-black/40"><LockKeyhole className="h-3.5 w-3.5" /> Private link</span>
    </header>
  );
}

function StageIndicator({
  number,
  label,
  active,
  complete,
  onClick,
}: {
  number: string;
  label: string;
  active: boolean;
  complete: boolean;
  onClick?: () => void;
}) {
  const classes = `w-full rounded-2xl border px-3 py-3 text-left transition sm:px-4 ${active ? 'border-[#C72C5B] bg-[#FFF2F5]' : complete ? 'border-[#C72C5B]/15 bg-white hover:border-[#C72C5B]/35' : 'border-black/[0.06] bg-white/40'}`;
  const content = (
    <div className="flex items-center gap-2">
      <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-black ${active || complete ? 'bg-[#C72C5B] text-white' : 'bg-black/[0.06] text-black/35'}`}>{complete ? <Check className="h-3 w-3" /> : number}</span>
      <span className={`hidden text-xs font-bold sm:block ${active || complete ? 'text-black/70' : 'text-black/30'}`}>{label}</span>
      {onClick && <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-[0.14em] text-[#C72C5B] sm:block">Change</span>}
    </div>
  );

  if (!onClick) {
    return <div className={classes} aria-current={active ? 'step' : undefined}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={`Change ${label}`} aria-current={active ? 'step' : undefined}>
      {content}
    </button>
  );
}

function SelectedMark({ inverted = false }: { inverted?: boolean }) {
  return <span className={`absolute bottom-5 right-5 z-20 grid h-9 w-9 place-items-center rounded-full shadow-lg ${inverted ? 'bg-white text-[#C72C5B]' : 'bg-[#C72C5B] text-white'}`}><Check className="h-4 w-4" /></span>;
}

function SummaryRow({ label, amount, currency, included = false, dark = false }: { label: string; amount: number; currency: string; included?: boolean; dark?: boolean }) {
  return (
    <div className="flex justify-between gap-5">
      <span className={dark ? 'text-white/55' : 'text-black/55'}>{label}</span>
      <span className="font-bold">{included ? 'Included' : formatMoney(amount, currency)}</span>
    </div>
  );
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('Clipboard access was unavailable');
}

function ReferralPrompt({
  open,
  unlocked,
  busy,
  message,
  onClose,
  onAction,
}: {
  open: boolean;
  unlocked: boolean;
  busy: boolean;
  message: string;
  onClose: () => void;
  onAction: (action: 'copy' | 'instagram' | 'whatsapp') => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="referral-prompt"
          initial={{ opacity: 0, y: -28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-label="Referral discount offer"
          className="fixed inset-x-4 top-[5.5rem] z-50 mx-auto max-h-[calc(100vh-7rem)] max-w-xl overflow-y-auto rounded-[1.7rem] bg-[#12090D] text-white shadow-[0_28px_100px_rgba(52,12,28,0.35)]"
        >
          <Image src="/images/events-complete-package-mesh.png" alt="" fill sizes="560px" className="pointer-events-none absolute inset-0 object-cover opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(48,4,21,0.95),rgba(199,44,91,0.3)_55%,rgba(37,3,16,0.9))]" />
          <div className="relative p-5 sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/15 text-[#FFD0DD] backdrop-blur-xl"><Gift className="h-5 w-5" /></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Share with family</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white" aria-label="Close referral offer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#F08BAB]">{unlocked ? 'Discount unlocked' : 'A little extra for your people'}</p>
            <h2 className="mt-2 max-w-md text-3xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-4xl">
              {unlocked ? <>30% off is yours.</> : <>Share the gallery.<br /><span className="font-serif font-normal italic text-[#F08BAB]">Save 30%.</span></>}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
              {unlocked ? 'Your Complete Story price now includes the referral saving.' : 'Send the private link to someone you love. Your Complete Story package gets 30% off after you share.'}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <ReferralActionButton icon={<Copy className="h-4 w-4" />} label="Copy link" busy={busy} onClick={() => onAction('copy')} />
              <ReferralActionButton icon={<Instagram className="h-4 w-4" />} label="Instagram Story" busy={busy} onClick={() => onAction('instagram')} />
              <ReferralActionButton icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" busy={busy} onClick={() => onAction('whatsapp')} />
            </div>

            {message && <p role="status" className="mt-4 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white/85">{message}</p>}
            <button type="button" onClick={onClose} className="mt-5 text-xs font-bold text-white/55 underline decoration-white/25 underline-offset-4 transition hover:text-white">
              {unlocked ? 'Close' : 'Maybe later'}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ReferralActionButton({
  icon,
  label,
  busy,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy}
      className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2 text-center text-[10px] font-bold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-60 sm:text-xs"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );
}
