# WeTrends SEO, GEO and demand system

Status: implementation source of truth

## Objective

Generate qualified London and UK enquiries for three commercial tracks without publishing unsupported claims or mass-produced doorway content:

1. Events — corporate events, launches, awards and celebrations.
2. Photoshoots — portraits, personal brands, teams, products and graduation.
3. Agency — web, brand, production, social, animation and content strategy.

Traffic is a diagnostic metric. The optimisation target is qualified leads and won-project value by service line.

## Location transition rule

WeTrends is transitioning from Guildford to London. Until a real London address and Google Business Profile are verified, public copy may say that WeTrends serves London, Surrey and UK clients, but must not claim a physical London office. The site must not publish London coordinates or a London postal address that has not been verified.

The same rule applies to social-preview images and personal connect cards. Their current wording says that WeTrends serves London, Surrey and the UK; it does not imply a verified London office.

## Public proof rule

Team biographies, structured data and sales copy may contain only roles, experience and outcomes that the owner can substantiate. Placeholder awards, employers, revenue figures, social profiles and numeric proof are removed rather than indexed. Genuine credentials can be restored later with their source or owner confirmation.

Case-study outcomes fail closed: a measured result needs a traceable source and measurement window, and a relative change also needs its baseline. A testimonial needs a named client-approval record before it can render. When that evidence is unavailable, the page shows the verified project scope and deliverables instead of a decorative number or quote.

## System flow

```text
GSC + GA4 + site and published-content inventory
        |
opportunity scoring and campaign routing
        |
source-backed research and duplicate checks
        |
draft article + SEO metadata + conversion CTA
        |
image router (real portfolio proof or GPT Image 2 supporting cover)
        |
quality, claim and link gates
        |
CMS draft + Telegram review
        |
explicit approve / regenerate / reject action
        |
publish verification + sitemap check
        |
weekly performance feedback and backlink opportunity queue
```

## Runtime components

All imported workflows use the `Europe/London` timezone and must remain inactive until the preview-deployment gates below pass.

| Workflow | Schedule | Responsibility |
| --- | --- | --- |
| Topic Planner | Sunday 18:00 | Uses the published site index and Search Console evidence to propose exactly one events, one photoshoots and one agency opportunity. It writes only new topics. |
| Content Engine | Monday, Wednesday and Friday 09:00 | Consumes one London topic, checks duplication, researches sources, creates the draft and medium GPT Image 2 cover, applies the website quality gate and sends the private review message. |
| Telegram Review | Event driven | Accepts commands only from the configured private chat. It can approve, reject or regenerate a cover; only the explicit approve path may request publication. |
| Authority Scout | Tuesday 10:00 | Finds and scores relevant authority opportunities, drafts a suggested approach and sends a review queue. It never sends outreach. |
| Growth Monitor | Monday 08:00 | Checks public technical surfaces, the authenticated legacy-content audit, Search Console and GA4 before sending the weekly decision report. It reports `RECOVERY` while published posts still need evidence review. |

### Canonical n8n workflow registry

The generated JSON files in `automations/n8n/` remain the implementation source of truth. These are the canonical imported safety copies in the current n8n project:

| Workflow | n8n workflow ID | Imported state |
| --- | --- | --- |
| Topic Planner | `LzR6taoMpC3k68Qw` | Inactive safety copy |
| Content Engine | `Vuc77VC0jfE12Pob` | Inactive safety copy |
| Telegram Review | `h63iI564uWZSD2tT` | Inactive 24-node restored safety copy |
| Authority Scout | `fhis4BW52hTkOoLK` | Inactive safety copy |
| Growth Monitor | `TVEVL2vFZDPxsM9i` | Inactive safety copy |

Older similarly named workflows are preserved as historical copies and are not rollout targets. The legacy `WeTrends SEO + GEO Smart Draft System v2 (London)` workflow (`ieJd5NrbwH130x09`) is still published and draft-only. At cutover, deactivate that scheduler before activating the new Content Engine so two workflows cannot consume the topic queue or create parallel drafts. Do not make that cutover until the preview deployment and draft-only end-to-end gates pass.

### Legacy published-content recovery

The authenticated `GET /api/blog/audit/` endpoint is read-only. It inventories every published post, reports missing sources, provenance, campaign routing, CTA, metadata and quality scores, and flags outcome language for evidence review. It returns titles, slugs and risk codes for the highest-priority items but never returns article bodies to Telegram.

Run the same audit locally with `npm run audit:published-content`. The monitor may recommend consolidation, correction or removal, but it cannot edit, unpublish or delete legacy posts. Those actions require a separately approved remediation decision because they can affect existing rankings and URLs.

Legacy posts remain reachable and stay in the existing sitemap during this review, so this implementation does not silently remove URLs or destroy accumulated signals. They are excluded from promotional surfaces—homepage recommendations, `llms.txt` article listings and related-post modules—unless they carry `automationStatus = published`, a quality score of at least 80, campaign and content-type routing, a primary service CTA, a sourced image with alt text and provenance, and at least one source URL.

### Topic queue contract

The shared n8n Data Table is named `blog_topics`. Existing legacy rows are preserved. New London-first planner rows use `status = queued_london`, and the Content Engine consumes only that status. This prevents the historic Guildford/Surrey `pending` backlog from entering the London rollout accidentally.

The automated state path is:

```text
queued_london -> duplicate
queued_london -> quality_blocked
queued_london -> review_ready -> approved -> published
queued_london -> review_ready -> rejected
```

Changing or bulk-migrating legacy `pending` rows requires a separate content review; it is not an activation step.

### Credential contract

n8n stores the secret values; exported workflow JSON contains credential references only:

- `OpenAI - WeTrends SEO` for Luna text work and GPT Image 2;
- `Google account` with read-only Search Console and Analytics scopes;
- `Telegram account` for the private review chat;
- `Tavily API` for research and opportunity discovery;
- `WeTrends Blog API` for the authenticated draft, media and quality endpoints.

The workflow generator pins the current WeTrends n8n credential record IDs as non-secret references and the contract test verifies every node's type, name and ID. If a credential is recreated, update the generator deliberately and re-run the contract before importing; this prevents n8n from silently selecting the first credential of the same type.

Telegram send nodes use explicit HTML mode, escape dynamic external text and disable n8n attribution. This avoids Telegram rejecting AI output that contains legacy-Markdown control characters.

## Automation boundaries

- Content may be researched, scored, drafted, illustrated and saved automatically.
- New articles remain drafts until an explicit Telegram approval.
- A publish action must use the exact CMS post ID returned when the draft was created. It must never publish by title alone.
- Each queued topic has a stable automation run key and deterministic slug. If n8n retries after the CMS committed a draft but before the response or topic update completed, the create endpoint returns the same private draft instead of creating another one.
- Published posts are read-only to the automation API. An exact two-field replay of an already-successful approval is a no-op success, while any attempt to change live copy, metadata or media is rejected.
- The automation API may delete only unpublished drafts. Human administrators retain the separate session-authenticated deletion path for any deliberate live-content decision.
- Reject and regenerate commands apply only to review-ready drafts. The automation API cannot unpublish an article that is already live.
- Backlink discovery, qualification and outreach copy may be automated. Outreach is not sent without approval.
- AI images are supporting editorial art. They must never be presented as photographs of a real WeTrends client, venue, event or result.
- Event and photoshoot case studies require genuine portfolio assets and attributable facts.
- A source URL is required for every non-obvious statistic or time-sensitive factual claim.

## Content record

Every queued opportunity carries:

- `campaign`: `events`, `photoshoots` or `agency`
- `page_type`: `commercial`, `case_study`, `guide`, `comparison` or `answer`
- `buyer_stage`: `problem`, `solution` or `supplier`
- `primary_service_url`
- `primary_cta`
- `target_location`
- `proof_assets`
- `source_urls`
- `expected_lead_value`
- `status`
- `cms_post_id`
- `quality_score`
- `approval_token`

## Quality gates

A draft is reviewable only when all applicable checks pass:

- unique topic and canonical intent;
- title no longer than 60 characters;
- meta description no longer than 155 characters;
- one H1 and a useful answer-first introduction;
- valid internal links to existing pages;
- no invented quotes, clients, rankings, reviews, awards or office address;
- source-backed statistics;
- a source link in the same paragraph as every percentage or multiplier;
- campaign-specific CTA;
- image alt text and asset provenance;
- no placeholder text, Markdown fences or script tags;
- no first-party client or outcome claim in automated non-case-study content;
- draft-only CMS state.

The raw draft contains one H1 so the quality gate can validate its structure. At render time the content copy is removed and the page template emits the post title as the single visible H1; blog cards keep non-heading title text so they do not pollute the surrounding page hierarchy.

Planning and duplicate checks use the protected published-content inventory, not `llms.txt`. Every live title can block a near-duplicate, including legacy posts under review, but only evidence-ready inventory entries may be suggested as internal links. `llms.txt` remains the public, trust-filtered generative index.

## Measurement

The browser sends the same deliberate events to consented analytics destinations:

- `portfolio_view`
- `start_quote`
- `photoshoot_booking_start`
- `generate_lead` only after a successful server response
- `booking_confirmed`
- `project_won`

Recommended dimensions are `service_line`, `content_id`, `lead_source` and `target_location`. Lead and sale events include a GBP value only when it is known or explicitly modelled.

GA4 and PostHog remain disabled until the visitor grants analytics consent. Admin and authentication routes are excluded. PostHog records only the deliberate page-view, page-leave and conversion events above; autocapture, session replay, heatmaps, dead-click detection, Web Vitals, exception capture, surveys and product tours are disabled explicitly.

The historical `BlogPost.views` field is frozen and labelled `legacy opens` in the admin interface. Its old server-side increment ran during metadata rendering, crawlers and static builds, so it is not valid audience evidence. Consented GA4 page views and deliberate conversion events are the source of truth going forward; historical values must not be compared with GA4 as if they share a definition.

## Backlink programme

The authority workflow prioritises:

1. unlinked WeTrends or image-credit mentions;
2. client, venue, planner and supplier case-study collaborations;
3. London business, production and event directories with editorial review;
4. podcast, expert-commentary and original-data opportunities;
5. broken or outdated resource replacement where WeTrends has a genuinely better asset.

Paid-link networks, automated guest-post blasts, reciprocal-link farms and irrelevant directories are rejected.

## Rollout gates

1. Local schema, lint, type and contract tests.
2. Preview deployment and browser/API checks.
3. One draft-only end-to-end n8n execution.
4. One Telegram regeneration test and one approval test on a non-production test post.
5. Production promotion only after the preview checks pass.
6. Observe the first scheduled cycle before enabling automatic publish actions.

## Known external prerequisites

- GA4 property `553107339` and the `WeTrends Website` web stream (`15735914465`) were created on 7 September 2026. Its measurement ID is `G-8L4SZJWV8R`; set that value as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in each Vercel environment before deployment.
- The owner accepted the Google Analytics service and required data-processing terms on 7 September 2026.
- A complete Cloudinary server credential triplet is configured for both Production and Preview. Blog media prefers the dedicated public triplet when present and otherwise uses the complete event triplet atomically; it never combines a cloud name and key from different accounts. Preview upload and delivery still require an end-to-end test.
- Verified OpenAI API organisation access for GPT Image models.
- n8n credentials for OpenAI, Google, Telegram, Tavily and the WeTrends API.
- Genuine portfolio images and usage permission for proof-led case studies.
- Confirmation of the controller's full legal/contact identity and a precise retention schedule before treating the privacy notice as legally final.
