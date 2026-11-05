# Client payment requests

## Decision (2 November 2026; updated 5 November 2026)

WeTrends agrees scope and commercial terms with clients outside the website. An
administrator then creates an itemised **payment request** in the private admin
area and shares its signed WeTrends link through the existing conversation. The
client opens the link to a personalized welcome with a panel of six moving
portfolio reels, continues to a document-style summary
of the exact services, quantities and prices, then uses “Agree and continue” to
open embedded Stripe Checkout on a separate payment step. That action is an
acknowledgement before payment, not a stored acceptance or electronic signature;
terms were agreed outside the website. The client then returns to a branded
payment result. Stripe handles
card data. This feature does not create or email a formal numbered invoice,
calculate VAT, or replace the company's accounting documents. Staff provide
any required invoice separately.

## Contract and lifecycle

- An admin enters client name/email, project title, optional context and 1–12
  GBP line items. The server parses decimal pounds to integer pence and computes
  the total; the browser never supplies the amount to Stripe.
- Drafts can be edited. Publishing freezes the agreed terms and produces a
  purpose-scoped, signed private URL. The admin copies and shares the link;
  this version sends no automatic email.
- A published request can be voided by an admin before payment. Voiding first
  expires any open Stripe Checkout Session. Paid requests cannot be voided here;
  refunds remain an explicit Stripe/accounting operation outside this flow.
- The published link opens the welcome step. The offer step shows the itemised
  agreement and total; only the checkout step loads the embedded card form.
  The welcome gives the introduction and offer button room before the portfolio
  panel on narrow screens; the panel may continue below the first viewport.
  Reels can be opened for viewing; motion pauses on hover or keyboard focus and
  respects reduced-motion settings. A connected, typographic three-step timeline
  carries through welcome, offer and checkout. The welcome uses a warm paper
  canvas and a dark portfolio panel; its entrance and step progress animations
  are decorative and respect reduced motion.
  Direct checkout links remain valid because acknowledgement is not stored or
  required by the payment API. Paid and voided requests open their result page;
  paid clients can still view the read-only offer from their result page.
  The pages and API use no-store, noindex and no-referrer;
  private URLs are excluded from GA4 and PostHog.
- The payment and result screens use the existing WeTrends logo image and
  app-icon asset instead of recreating brand marks or decorative icons in
  markup. Stripe Checkout uses a white surface, rounded corners, and the
  raspberry button color with a white label. Stripe does not allow a per-session
  `icon` for `embedded_page` Checkout; the WeTrends page carries the logo.
  Keep the visual preview button labelled so it cannot look like an empty bar.
- A server-created Checkout Session uses the immutable item snapshot, GBP,
  client email, a request reference and a stable idempotency key. Adaptive
  Pricing is disabled for this flow so the charged currency matches the GBP
  agreement. The key includes a Checkout parameter version so a corrected
  request does not conflict with parameters Stripe stored under an older key.
  MongoDB records may omit the optional session ID, so the claim condition
  accepts both a missing field and an explicit null.
  Repeated clicks reuse an open session; an expired attempt can be retried.
- The signed Stripe webhook is the primary source for payment completion. It
  checks the stored session, request ID, amount, currency and email before an
  idempotent paid transition. The return page may reconcile the same Stripe
  session but never treats a redirect alone as proof of payment.
- The result page shows confirmed, pending or unsuccessful states with clear
  next actions. Card declines can also be corrected in Stripe's embedded form.
  Motion is decorative and respects reduced-motion settings.

## Release and verification

Validate and generate the Prisma client, run TypeScript and focused lint, run
`yarn check:client-payments` for the mocked payment contracts, test
the request/payment state transitions and wrong-session/amount rejection, then
walk through desktop and mobile screens in Stripe test mode. The production
MongoDB collection/index must be reviewed and created before activation; never
use destructive schema flags. Reuse the existing restricted Stripe Checkout key,
publishable key and signed webhook. Do not claim live payment verification from
mocked tests or local rendering.

The 5 November route extension does not change the payment API, signed token,
database schema, Stripe configuration or agreed amounts. Before release, pass
the focused payment checks, TypeScript and route lint; check the production
build; and walk the published link through welcome, offer and checkout without
submitting a real payment. If the route or checkout fails, restore the preceding
production deployment and recheck the published link.
