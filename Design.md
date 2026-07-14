# WeTrends — Design System (As-Built)

> This documents what is actually live in the codebase today, verified against the source — not an aspirational brief. Every token and pattern below was checked against `app/`, `components/`, `tailwind.config.ts`, and `globals.css` before being written down. Where the marketing site and the admin dashboard diverge, both are covered separately.

---

## 1. Brand & Philosophy

High-end creative agency energy: cinematic, bold, confident, no clutter. The formula that repeats across every marketing page:

- Dark sections (`#0F0F0F` / `#050505`) alternate with clean white sections
- Big, tight typography carries the hierarchy — not color or decoration
- Small uppercase labels in brand pink mark the start of every section
- Glass-morphism (translucent white on dark) is the only "chrome" allowed
- Motion is purposeful and consistent — one easing curve, used everywhere

The **admin dashboard** (`/me/*`) intentionally breaks from this — it's a plain shadcn/ui utility interface (sidebar, default button variants, system colors). Internal tools don't need to be cinematic; keep that split.

---

## 2. Tech Stack (verified)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate` + `@tailwindcss/typography` |
| UI primitives | shadcn/ui (`new-york` style) — used as-is in `/me/*`, hand-styled everywhere on the marketing site |
| Animation | Framer Motion (imported as `motion/react`) + GSAP 3 `ScrollTrigger` + Lenis (smooth scroll) |
| Icons | Lucide React |
| Fonts | Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), system serif for italic accents |
| Data | Prisma + MongoDB |
| Auth | NextAuth (`lib/auth.ts`), credentials + Google, with login rate-limiting (5 attempts / 15 min lockout) |

---

## 3. Design Tokens

### 3.1 Colors

**The one accent color used in practice is `#C72C5B`.** It appears 50+ times across the codebase — in CTAs, hover states, labels, italic headline words, borders, and schema. It is hardcoded per-use, not pulled from a Tailwind token.

The `tailwind.config.ts` also defines a `wetrends` palette (`DEFAULT: #bc2a50`, 50–950 shades) and wires `--primary` to `346 64% 45%` (≈ `#bc2a50`) via CSS variables. This palette backs shadcn primitives (`bg-primary`, `.gradient-text`) and the admin dashboard, but **no marketing-page component reads from it directly** — they all hardcode `#C72C5B`. Treat `#C72C5B` as the true brand accent; treat `wetrends`/`--primary` as the muted sibling that only surfaces in shadcn defaults.

| Token | Value | Where |
|---|---|---|
| Brand accent | `#C72C5B` | CTAs, labels, italic words, hover states, links, borders — the whole marketing site |
| Accent hover (darker) | `#A3244A` | Button hover states |
| shadcn primary / `wetrends-600` | `#bc2a50` | CSS variable `--primary`, admin dashboard, `.gradient-text` utility |
| Headline on light | `#0F0F0F` | Near-black, never pure black |
| Dark section bg (deepest) | `#050505` | Hero, SubHero |
| Dark section bg (cards/overlays) | `#0F0F0F` | Cards, service CTAs, footer-adjacent blocks |
| Light section bg | `#ffffff` | Alternating light sections |
| Muted text on dark | `text-white/60`, `/70` | Body copy, descriptions |
| Glass border on dark | `border-white/10` | Pills, cards |
| Glass fill on dark | `bg-white/5`, `bg-white/[0.03]` | Pills, cards |
| Light borders | `border-gray-100`, `border-gray-200` | Card borders, dividers on white |
| Muted text on light | `text-gray-500`, `text-gray-600` | Body copy on white sections |

### 3.2 Typography

```tsx
// app/layout.tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

- **Headlines:** `font-bold`, tight leading — `leading-[0.9]` to `leading-none` on hero-scale type, `leading-[1.2]` on article H1s.
- **Accent words inside headlines:** `font-serif italic text-[#C72C5B]` — e.g. "Building Brands That *Actually Stick*."
- **Section labels:** `text-sm font-medium uppercase tracking-widest text-[#C72C5B]`, usually paired with a `h-px w-8 bg-[#C72C5B]` rule.
- **Body:** `text-base sm:text-lg leading-relaxed` — `text-white/60` on dark, `text-gray-600`/`text-gray-700` on light.
- **Numbers / index markers:** `font-mono` (e.g. `01`, `02` service numbers).
- **Headline scale:** `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` (up to `xl:text-8xl` on the biggest hero moments).
- **Article body (blog posts):** Tailwind Typography (`prose prose-lg`) with heavy per-element overrides — see §5.3.

### 3.3 Spacing & Layout

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (marketing pages). Article content narrows to `max-w-[720px]` for readability.
- Section padding: `py-16 md:py-24` or `py-24 md:py-32` depending on section weight.
- Two-column grids: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16`.
- Card grids: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (blog, case studies, related posts).
- Full-height sections: `h-[100svh]` for hero; `min-h-[100svh]` for full pages (team member, questions).
- Border radius: `rounded-2xl` is the default card radius site-wide; `rounded-full` for every pill/button.

---

## 4. Motion System

### 4.1 The signature easing curve

```
cubic-bezier(0.22, 1, 0.36, 1)
```

Used 27+ times directly in Framer Motion `transition.ease`, and as `power3.out` in GSAP (the closest built-in equivalent). Snappy start, long elegant deceleration. This is non-negotiable — every scroll reveal and most hover transitions use one of these two.

### 4.2 Reusable scroll-reveal wrapper

`components/ui/animated-content.tsx` wraps GSAP + ScrollTrigger:

```tsx
<AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
  <h2>...</h2>
</AnimatedContent>
```

Wraps nearly every heading, card, and section block across the marketing site. Fires once (`scrollTrigger: { once: true }`), never replays.

### 4.3 Hover patterns

- **Primary buttons:** pill shape, inner circular icon that rotates 45° on hover (`group-hover:rotate-45`).
- **List rows (services, FAQ):** background wipe `scaleX: 0 → 1`, `originX: 0`, `duration: 0.4`.
- **Cards:** `whileHover={{ y: -4 }}` to `{ y: -6 }`, `duration: 0.2–0.3`.

### 4.4 Ambient / continuous motion

- Scroll indicators: `animate={{ y: [0, 8, 0] }}` infinite.
- Marquee (case studies): `animate={{ x: [0, -1000] }}`, linear, infinite, `duration: 20`.
- Aurora orbs (SubHero): custom `drift1`/`drift2` keyframes, 20–25s ease-in-out infinite.

### 4.5 Reading-progress bar (blog posts — new)

```tsx
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
// fixed top-0, h-1, bg-[#C72C5B], origin-left, scaleX
```

Added when the blog reading experience was rebuilt. Same spring-physics approach as the rest of the site's motion, just applied to a scroll-linked progress indicator instead of a reveal.

---

## 5. Component Patterns

### 5.1 Primary CTA button

```tsx
<a className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105">
  Start Your Project
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#C72C5B] transition-transform group-hover:rotate-45">
    <ArrowDownRight className="h-3.5 w-3.5" />
  </span>
</a>
```

### 5.2 Glass card / pill (dark sections only)

```tsx
<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">…</div>
<div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">…</div>
```

### 5.3 Section label

```tsx
<div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
  <span className="h-px w-8 bg-[#C72C5B]" />
  What We Do
</div>
```

### 5.4 Navigation (verified — homepage and sub-pages differ)

`app/_component/shared/navigation.tsx` is genuinely stateful, not just a static bar:

- **Homepage only:** transparent over the hero, flips to `bg-white border-b border-gray-100 backdrop-blur-md` once `scrollY > 100`. Logo and text invert (white ↔ `brightness-0`/black) with the same flip. Entrance is delayed `2.5s` so it appears after the loading screen + hero choreography finish.
- **Every other page** (`/blogs`, `/services`, `/questions`, `/who/[id]`, etc.): always light — `isLight = !isHomePage || isScrolled`. No transparent state, no delay (`0.3s` fade-in). This is deliberate: sub-pages don't have a full-bleed dark hero to sit on top of.
- Nav links get an underline wipe on hover (`h-0.5 bg-[#C72C5B]`, `width: 0 → 100%`).

### 5.5 Typographic blog cover art (new — replaces missing featured images)

`app/_component/blogs/blog-cover.tsx`. Since posts are AI-generated via n8n and don't always have a real featured image, every post gets a generated cover instead: a dark gradient (rotates through 4 presets keyed by post index), two blurred color orbs, a faint watermark logo, and the post title itself rendered as large bold white type. Category name appears as a small uppercase pink label above the title. Same component powers both the compact card size (blog list, related posts) and the hero size (post detail page) via a `size="card" | "hero"` prop.

### 5.6 Blog post reading experience (rebuilt)

`app/_component/blogs/blog-post-content.tsx` + `lib/blog-content.ts`. Server-enriches raw HTML before render:

- Strips the content's own `<h1>` (page template renders the title).
- Adds `id` attributes to every `<h2>`/`<h3>` and extracts a table of contents (`In this article`, scroll-spy active state via `IntersectionObserver`).
- Auto-links the first mention of each service name to its service page (max one link per destination, never inside headings).
- Ends with a keyword-matched service CTA card (dark `#0F0F0F` block) and a "Keep Reading" grid of 3 related posts (scored by shared category + keyword overlap).
- Share row: LinkedIn / X / copy-link (not a single generic share button).

Article typography (`prose prose-lg`):
```
prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:scroll-mt-24
prose-h2:text-[1.5rem] sm:prose-h2:text-[1.75rem]
prose-p:leading-[1.75] prose-p:text-gray-700
prose-a:font-semibold prose-a:text-[#C72C5B] prose-a:no-underline hover:prose-a:underline
prose-blockquote:border-l-4 prose-blockquote:border-[#C72C5B] prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-xl
```

### 5.7 FAQ accordion (`/questions`)

Single-open accordion, chevron rotates 180° when expanded, height animates `0 → auto` via Framer Motion (`AnimatePresence`). FAQ content lives in `lib/faq-data.ts` (shared with the `FAQPage` JSON-LD emitted server-side) rather than inline in the component.

### 5.8 Card grids (services, case studies)

Both listing pages (`/services`, `/case-studies`) use the same shape: a bordered white card (`border-gray-200`, `rounded-2xl`), a small pink uppercase eyebrow, a bold title, a metric or description, and an arrow-out link treatment (`ArrowUpRight`, translates on hover). Service cards on `/services` additionally carry a looping muted `<video>` background revealed on hover.

---

## 6. Signature "Wow" Effects

These are the load-bearing, hard-to-copy moments — keep them intact even when other content changes.

### 6.1 Loading screen
Full-screen black overlay, inverted white logo centered, thin progress bar fills over ~1.5–2.2s, exits with `y: '-100%'` on the signature easing curve. Page content stays `visibility: hidden` until it completes.

### 6.2 SubHero sticky-scroll expansion
The homepage centerpiece. A card expands from `85%/75%` to `100%/100%` (width/height) with shrinking border-radius as the user scrolls through a `120svh` container with a `sticky top-0` inner section. Two drifting radial-gradient "aurora" orbs in brand pink/red, an SVG noise-turbulence overlay at `opacity-[0.03]`, and mouse-parallax floating pills (spring-smoothed, desktop only).

### 6.3 CardSwap 3D slider (services home preview)
GSAP-driven 3D card stack (`perspective-[900px]`, `preserve-3d`). Every 3000ms the front card drops with elastic easing while the rest advance in Z-space. Each card: looping muted video background + solid color overlay + white text.

### 6.4 Hero entrance choreography
Background scale `1.1→1` + fade (1.5s) → blur circle scales in (1.2s) → headline words animate in with `rotateX: -80→0` + `y: 60→0`, staggered 0.1s each → description blurs in (`blur(10px)→0`) → CTA springs in (`stiffness: 300, damping: 20`).

### 6.5 Team section wipe reveal
Left image reveals via GSAP `clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)`. Giant low-opacity typographic watermarks behind the text; stroke-only (`WebkitTextStroke`) word treatment for emphasis.

### 6.6 Case studies marquee
Infinite linear-scroll strip of giant alternating bold/serif-italic text at the bottom of the case studies grid, `duration: 20`, `repeat: Infinity`.

---

## 7. Page Inventory (current routes)

| Route | Pattern notes |
|---|---|
| `/` | Full wow-effect sequence: Hero → SubHero → CaseStudies → HomeFaq → Team → Services → BlogPreview → Contact |
| `/services` | Video-preview card grid + 4-step process section, dark background throughout |
| `/services/[slug]` | Static per-service page, `Service` + `BreadcrumbList` JSON-LD |
| `/case-studies` | Listing grid, `CollectionPage` schema |
| `/case-studies/[slug]` | Long-form single case study |
| `/blogs` | Category-filterable grid, typographic cover art |
| `/blogs/[slug]` | See §5.6 — TOC, related posts, service CTA, share row |
| `/questions` | FAQ accordion + "topics we cover" grid, `FAQPage` schema |
| `/who/[id]` | Team member profile, `Person` schema |
| `/cinematography` | Booking-oriented page with its own `Event`-style schema |
| `/me/*` | Admin dashboard — shadcn/ui defaults, sidebar layout, no marketing styling |

---

## 8. Asset Strategy

- Photos: `.webp` where possible, `object-cover` for full-bleed backgrounds, stored in `/public/images/`.
- Video: short looping `.mp4` (5–10s) in `/public/videos/`, always `muted loop playsInline autoPlay`.
- Blog posts have no reliable featured-image pipeline (AI-generated content) — the typographic cover (§5.5) is the real fallback, not an edge case.
- Blog images elsewhere are URL-based (`components/ui/image-url-input.tsx`) — Cloudinary/upload was removed in favor of pasting a hosted URL.

---

## 9. Responsive & Accessibility

- Mobile-first; all grids collapse to 1 column below `lg`.
- Desktop-only effects degrade gracefully: mouse-parallax pills → static flex-wrap row; CardSwap → horizontal scroll-snap cards (`overflow-x-auto snap-x`).
- Dark/light section alternation is preserved at every breakpoint.
- Respect `prefers-reduced-motion` — GSAP/Framer animations should be skippable (verify this is actually wired up if adding new heavy animation).

---

## 10. Checklist for New Pages/Components

- [ ] `#C72C5B` is the only accent color used directly (not `wetrends-600`/`--primary`, which are the shadcn/admin fallback).
- [ ] Headlines use `leading-[0.9]` or tighter; italic accent words use `font-serif italic text-[#C72C5B]`.
- [ ] Scroll reveals use `power3.out` (GSAP) or `[0.22, 1, 0.36, 1]` (Framer) — no other easing.
- [ ] CTAs are pill-shaped with a rotating circular icon.
- [ ] New marketing pages alternate dark/light sections; new admin pages use shadcn defaults, not marketing tokens.
- [ ] If the page can render user/AI-generated content without images, does it need a typographic-cover-style fallback like §5.5?
- [ ] New content types get their own JSON-LD block (see `/blogs`, `/questions`, `/who`, `/services` for the pattern) — every content page in this codebase has one.
