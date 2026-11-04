# Client payment requests

## Decision (2 November 2026)

WeTrends agrees scope and commercial terms with clients outside the website. An
administrator then creates an itemised **payment request** in the private admin
area and shares its signed WeTrends link through the existing conversation. The
client reviews the exact services, quantities and prices on `wetrends.co.uk`,
enters card details in Stripe Checkout embedded on that page, and returns to a
branded payment result. Stripe handles card data. This feature does not create
or email a formal numbered invoice, calculate VAT, or replace the company's
accounting documents. Staff provide any required invoice separately.

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
- The client page shows the itemised agreement and total before loading the
  embedded card form. The page and API use no-store, noindex and no-referrer;
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
  agreement. Repeated
  clicks reuse an open session; an expired attempt can be retried.
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
mocked tests or local rendering. This work does not publish or deploy the site.
