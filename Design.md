# WeTrends Website — Vibe Guide

> **Goal:** Build a site that feels like WeTrends: cinematic, bold, confident, and premium. This document gives guardrails, not a paint-by-numbers recipe. Stay inside the vibe; be creative inside the frame.

---

## 1. Overview & Philosophy

- **Vibe:** High-end creative agency. Cinematic, bold, and confident.
- **Visual formula:** Dark sections alternate with clean white sections. Big typography. Small uppercase labels in brand pink. Glass-morphism on dark backgrounds. No clutter.
- **Motion philosophy:** Everything enters with purpose. One signature easing curve drives most of the site. Scroll reveals feel expensive. Load sequences are choreographed.

### 1.1 Creative Freedom (Keep These, Change the Rest)

**Non-negotiables (keep for the same feel):**
- Alternating dark/light sections
- Large, tight headlines
- Brand pink accents for labels and italic words
- Glass on dark backgrounds
- Purposeful motion with a single easing curve

**Flexible (change freely):**
- Section content, copy, and imagery
- Number of sections and their exact order
- Specific animation timings and delays
- Exact components, layouts, and grid patterns

---

## 2. Tech Stack

Recommended stack (use as a baseline; swap only if you know why):

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 15+** (App Router, React 19, TypeScript) |
| Styling | **Tailwind CSS 3.4+** |
| UI Base | **shadcn/ui** (`new-york` style, `neutral` base color) |
| Animation | **Framer Motion** (`motion/react`) + **GSAP 3.13+** (`ScrollTrigger`) + **Lenis** (smooth scroll) |
| Icons | **Lucide React** |
| Fonts | **Geist Sans** (body) + **Geist Mono** (numbers/code) + system **serif** (italic accents) |

---

## 3. Design Tokens

### 3.1 Colors

Add this custom palette to `tailwind.config.ts` (or map to your own palette if you keep the same contrast and saturation):

```ts
colors: {
  wetrends: {
    DEFAULT: "#bc2a50",
    50: "#fdf2f5",
    100: "#fbe6eb",
    200: "#f5ccd8",
    300: "#eda4ba",
    400: "#e37395",
    500: "#d44e78",
    600: "#bc2a50",
    700: "#9e1f41",
    800: "#851c39",
    900: "#721c36",
    950: "#400b1a",
  },
}
```

**Semantic usage (guidelines, not absolutes):**

| Element | Color |
|---------|-------|
| Accent / CTAs | `#C72C5B` (brighter brand pink) |
| Headlines on light | `#0F0F0F` |
| Dark section bg | `#050505` (SubHero), `#0F0F0F` (cards/overlays) |
| Light section bg | `#ffffff` |
| Muted text on dark | `text-white/60` |
| Glass borders | `border-white/10` |
| Glass fills | `bg-white/5` |
| Light borders | `border-gray-200` |

### 3.2 Typography

**Font loading (`app/layout.tsx`):**
```tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
```

**Rules (bendable with care):**
- **Headlines:** `font-bold`, extremely tight line-height: `leading-[0.9]` or `leading-none`.
- **Accent words in headlines:** `font-serif italic text-[#C72C5B]`.
- **Section labels:** `text-sm font-medium uppercase tracking-widest text-[#C72C5B]`.
- **Body:** `text-base sm:text-lg leading-relaxed text-white/60` (dark) or `text-gray-600` (light).
- **Numbers/IDs:** `font-mono`.

**Responsive headline scale (use or adjust by one step):**
```
text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
```

### 3.3 Spacing & Layout

- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Section padding:** `py-20 md:py-28` or `py-24 md:py-32`.
- **Two-column grids:** `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16`.
- **Full-height sections:** `h-[100svh] min-h-[600px]` for hero. `min-h-screen` for team.

---

## 4. The Signature Easing Curve

**Use this cubic-bezier for most transitions:**

```ts
[0.22, 1, 0.36, 1]
```

It creates a snappy start with a long, elegant deceleration. Apply it to Framer Motion `transition.ease`, GSAP eases (`power3.out`), and CSS transitions. You can vary durations, but keep the curve.

---

## 5. Animation Patterns

### 5.1 Scroll Reveals (GSAP)

Create a reusable wrapper component (`components/ui/animated-content.tsx`), or implement an equivalent reveal system. The pattern matters more than the exact code.

```tsx
'use client';
import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedContent({
  children,
  distance = 60,
  direction = 'vertical',
  duration = 1.2,
  ease = 'power3.out',
  delay = 0,
  threshold = 0.1,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const axis = direction === 'horizontal' ? 'x' : 'y';
    const startPct = (1 - threshold) * 100;

    gsap.fromTo(el,
      { [axis]: distance, opacity: 0 },
      {
        [axis]: 0, opacity: 1, duration, ease, delay,
        scrollTrigger: { trigger: el, start: `top ${startPct}%`, once: true }
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [distance, direction, duration, ease, delay, threshold]);

  return <div ref={ref} className={className}>{children}</div>;
}
```

Use it to wrap every major block:
```tsx
<AnimatedContent distance={60} duration={1} delay={0.2}>
  <h2>...</h2>
</AnimatedContent>
```

### 5.2 Page-Load Stagger

Hero load sequence guidelines (keep the rhythm, tweak the details):
1. Background image scales `1.1 → 1` + opacity fade (`duration: 1.5`).
2. Giant blur circle scales in.
3. Each word animates with `rotateX: -80 → 0` + `y: 60 → 0`.
4. Description blurs in (`filter: blur(10px) → blur(0px)`).
5. CTA button springs in with `type: "spring"`.

Stagger words by `0.1s` delays.

### 5.3 Hover Effects

- **Buttons:** Pill button with inner circular icon. Icon rotates `45°` on hover (`group-hover:rotate-45`).
- **List items:** Background wipe `scaleX: 0 → 1` with `originX: 0` (`duration: 0.4`).
- **Cards:** `whileHover={{ y: -6 }}` with `transition={{ duration: 0.3 }}`.

### 5.4 Continuous Ambient Motion

- **Scroll indicator:** `animate={{ y: [0, 8, 0] }}` infinite.
- **Floating elements:** Custom `floatY` keyframe (`translateY(0) → translateY(-12px)`), durations `4s–6s`.
- **Marquee:** `animate={{ x: [0, -1000] }}` linear infinite.

---

## 6. Component Patterns

### 6.1 Primary CTA Button

```tsx
<a
  href="/#contact"
  className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
>
  Start Your Project
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#C72C5B] transition-transform group-hover:rotate-45">
    <ArrowDownRight className="h-3.5 w-3.5" />
  </span>
</a>
```

### 6.2 Glass Card / Pill

```tsx
<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
  {/* content */}
</div>
```

Pill variant:
```tsx
<div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
  <Icon className="h-4 w-4 text-[#C72C5B]" />
  <span className="text-xs font-medium text-white/80">Label</span>
</div>
```

### 6.3 Section Label

```tsx
<div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
  <span className="h-px w-8 bg-[#C72C5B]" />
  What We Do
</div>
```

---

## 7. Page Structure (Home)

Suggested narrative flow (reorder or swap sections to fit the story):

```tsx
<Hero />        {/* 100svh, background image/video, big headline */}
<SubHero />     {/* Sticky scroll expansion, manifesto, dark bg */}
<CaseStudies /> {/* Grid + infinite marquee */}
<Team />        {/* Split image + typography watermarks */}
<Services />    {/* List + CardSwap video slider */}
<BlogPreview /> {/* 3-col blog cards + newsletter CTA */}
<Contact />     {/* Background image + centered glass form */}
```

---

## 8. The "Wow" Effects (Signature Ideas)

### 8.1 Loading Screen

Before anything is visible, show a full-screen black overlay:
- Inverted white logo centered.
- Thin horizontal progress bar that fills over `1.5s–2.2s`.
- Exit: slide up `y: '-100%'` with the signature easing `[0.22, 1, 0.36, 1]`.
- Hide page content (`visibility: hidden`) until loading completes.

### 8.2 SubHero Sticky Scroll Expansion

This is the centerpiece effect. If you replace it, choose something equally bold and slow-burning.

**Container (example structure):**
```tsx
<section className="relative z-20 h-[120svh]">
  <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-white">
```

**Expanding card (example mapping):**
```tsx
const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'start start'] });
const width = useTransform(scrollYProgress, [0, 0.7], ['85%', '100%']);
const height = useTransform(scrollYProgress, [0, 0.7], ['75%', '100%']);
const borderRadius = useTransform(scrollYProgress, [0, 0.5], ['2rem', '0rem']);
const opacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
```

**Aurora orbs (inline styles):**
```tsx
// Orb 1 — top left, pink
<div style={{
  background: 'radial-gradient(circle, rgba(199,44,91,0.35) 0%, transparent 70%)',
  animation: 'drift1 20s ease-in-out infinite',
}} />

// Orb 2 — bottom right, deeper red
<div style={{
  background: 'radial-gradient(circle, rgba(188,42,80,0.3) 0%, rgba(80,20,40,0.1) 50%, transparent 70%)',
  animation: 'drift2 25s ease-in-out infinite',
}} />
```

Keyframes:
```css
@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10%, 5%) scale(1.1); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-5%, -10%) scale(1.05); }
}
```

**Mouse parallax pills (optional):**
- Track mouse with `useMotionValue`.
- Convert to spring with `{ stiffness: 60, damping: 20 }`.
- Pass spring values into `useTransform` to move floating pills `-20px` to `+20px`.

**Noise overlay:**
```tsx
<div
  className="pointer-events-none absolute inset-0 opacity-[0.03]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }}
/>
```

**Content formula (swap copy, keep the hierarchy):**
- Small uppercase label: `The Manifesto`
- Giant headline: **"Engineered"** (white) + **"to Stand Out."** (italic serif `#C72C5B`)
- Subtext centered, `max-w-2xl`, `text-white/60`.
- Bottom CTA on a subtle top border (`border-t border-white/10`).

### 8.3 CardSwap 3D Slider

Build or use a GSAP-based card stack component with these specs (or create a different, equally tactile slider):
- Parent needs `perspective-[900px]` and `preserve-3d`.
- Cards stack. Every `3000ms`, the front card drops down with **elastic easing**, remaining cards slide forward in Z-space, and the dropped card returns to the back.
- Each card contains a looping `<video>` background + solid color overlay (`opacity: 0.6`) + white text content.

### 8.4 Hero Entrance Sequence

Choreography (keep the beats, flex the timings):
1. `motion.div` background: `scale: 1.1 → 1`, `opacity: 0 → 1`, `duration: 1.5`.
2. Giant blur circle: `scale: 0.8 → 1`, `opacity: 0 → 1`, `duration: 1.2`.
3. Headline words:
   - `initial: { y: 60, opacity: 0, rotateX: -80 }`
   - `animate: { y: 0, opacity: 1, rotateX: 0 }`
   - `duration: 0.8`, stagger `0.1s`.
4. Description: `filter: blur(10px) → blur(0px)`, `y: 30 → 0`, `duration: 0.9`.
5. CTA: `type: "spring", stiffness: 300, damping: 20`.

### 8.5 Team Section Wipe Reveal

- Left image reveals via GSAP `clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)`.
- Add giant typographic watermarks (e.g., "08", "TM") at `opacity: 0.05` behind the text.
- Use a **stroke-only** word effect:
```tsx
<span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
  Squad
</span>
```

### 8.6 Case Studies Marquee

Infinite horizontal scroll at the bottom:
```tsx
<motion.div
  className="flex whitespace-nowrap"
  animate={{ x: [0, -1000] }}
  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
>
  <span className="text-6xl md:text-8xl font-bold text-black">WORK</span>
  <span className="mx-4 h-4 w-4 rounded-full bg-[#C72C5B]" />
  <span className="text-6xl md:text-8xl font-serif italic text-black">Speaks</span>
  {/* repeat the pattern */}
</motion.div>
```

### 8.7 Smart Navigation

- On homepage: **transparent** until scroll passes `100px`, then becomes a white `backdrop-blur-md` bar.
- Logo/text colors invert on scroll (white → black).
- Delay the nav entrance by `2.5s` on homepage so it appears after the loading screen + hero animation.

---

## 9. Asset Strategy

### Images
- Use `.webp` for all photos. Full-bleed backgrounds should be `object-cover`.
- Place assets in `/public/images/`.
- Use Unsplash sparingly for secondary pages only.

### Videos
- Keep 5 short looping `.mp4` clips (~5–10s) in `/public/videos/` for the CardSwap sliders.
- Always include `muted loop playsInline autoPlay`.

### Patterns
- **Dot pattern** (optional) via `radial-gradient` in CSS.
- **Noise texture** via inline SVG `feTurbulence` (see Section 8.2).

---

## 10. Responsive Rules

- **Mobile first.** All grids collapse to `1 col` below `lg`.
- **Hide desktop-only effects** below `md`:
  - Mouse-parallax floating pills → replace with a simple flex-wrap row of pills.
  - CardSwap → replace with horizontal scroll snap cards (`overflow-x-auto snap-x`).
- **Scale down typography aggressively** on small screens using the standard `text-4xl sm:text-5xl md:text-6xl ...` scale.
- **Preserve the dark/light section rhythm** at all breakpoints.

---

## 11. Accessibility & Performance

- Respect `prefers-reduced-motion`: disable GSAP/Framer Motion animations if true.
- Use `will-change-transform` and `will-change-opacity` on heavy animated elements.
- Lazy-load below-fold images.
- Use `content-visibility: auto` on sections for rendering performance.

---

## 12. Summary Checklist

Before calling the design complete, verify:

- [ ] Brand pink (`#C72C5B`) is used for primary accents, labels, and italic headline words.
- [ ] Every headline uses `leading-[0.9]` or tighter.
- [ ] Every scroll reveal uses `power3.out` (GSAP) or `[0.22, 1, 0.36, 1]` (Framer Motion).
- [ ] The SubHero has sticky scroll expansion + aurora orbs + noise texture.
- [ ] The Hero has a choreographed word-by-word load animation.
- [ ] CTAs are pill-shaped with a rotating circular icon.
- [ ] There is a full-screen loading overlay with a progress bar.
- [ ] Sections alternate between white and near-black backgrounds.
- [ ] Navigation is transparent on hero, then becomes a blurred white bar on scroll.
