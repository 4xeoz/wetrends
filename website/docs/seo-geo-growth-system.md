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

## System flow

```text
GSC + GA4 + site inventory
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

## Automation boundaries

- Content may be researched, scored, drafted, illustrated and saved automatically.
- New articles remain drafts until an explicit Telegram approval.
- A publish action must use the exact CMS post ID returned when the draft was created. It must never publish by title alone.
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
- campaign-specific CTA;
- image alt text and asset provenance;
- no placeholder text, Markdown fences or script tags;
- draft-only CMS state.

## Measurement

The browser sends the same deliberate events to consented analytics destinations:

- `portfolio_view`
- `start_quote`
- `photoshoot_booking_start`
- `generate_lead` only after a successful server response
- `booking_confirmed`
- `project_won`

Recommended dimensions are `service_line`, `content_id`, `lead_source` and `target_location`. Lead and sale events include a GBP value only when it is known or explicitly modelled.

GA4 and PostHog remain disabled until the visitor grants analytics consent. Admin and authentication routes are excluded.

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

- GA4 property ID and web-stream measurement ID.
- Production Cloudinary server credentials.
- Verified OpenAI API organisation access for GPT Image models.
- n8n credentials for OpenAI, Google, Telegram, Tavily and the WeTrends API.
- Genuine portfolio images and usage permission for proof-led case studies.
