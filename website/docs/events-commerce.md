# Events commerce system

## Objective

Turn an event enquiry into a private, personalised offer; collect any digital upgrade payment; deliver a private gallery; and sell physical prints through a second checkout.

## Commercial rules

- Every delivered photograph includes standard professional editing.
- The included collection contains the strongest 10 images unless the job overrides that number.
- The complete gallery is the primary paid upgrade.
- Signature Retouching is optional and covers detailed portrait work beyond the standard edit.
- Additional coverage is displayed as a separate line item only when the client already agreed to the time and rate.
- A partner contribution is described as value already included, never as a discount invented at checkout.
- Framed prints are offered after the gallery is published, when the client can see the photographs they are buying.
- Customer pricing is £9.99 for 6×4 and £31.99 for 8×12, plus £5.99 tracked UK delivery per order.

## Customer journey

1. The public Events form creates a structured lead.
2. An administrator creates an event job and sets the client, photographer, included collection, upgrade price, retouching price, and any agreed additional coverage.
3. The system creates a signed private link. The link can be revoked by rotating the job access version.
4. The client chooses the included collection or complete gallery, optionally adds Signature Retouching, and reviews the exact total.
5. A zero-total order confirms immediately. A paid order redirects to Stripe Checkout.
6. Stripe webhook events are signature-verified and processed idempotently. The success page may reconcile a paid Checkout Session, but it is not the only fulfilment path.
7. The administrator uploads and publishes the gallery, then sends the gallery-ready email.
8. The client browses the gallery, then either continues to print formats or skips to downloads.
9. Print clients choose formats first, then select photographs, sizes, and quantities. Download-only clients select individual photographs or select all.
10. Downloads pause at a lightweight sharing prompt before the ZIP begins. Shared private links restart at the gallery viewing step.
11. Stripe Checkout collects print payment, UK shipping address, and delivery charge.
12. The administrator fulfils and marks the print order dispatched.

## Routes

### Public and client

- `/events/` and its specialist pages: acquisition and structured enquiry.
- `/events/client/[token]/`: personalised offer and digital order.
- `/events/client/[token]/confirmed/`: digital order result.
- `/gallery/[token]/`: private gallery viewing step; clients continue before making selections.
- `/gallery/[token]/prints/`: branded print-format mockups with a bottom-positioned skip-to-downloads path.
- `/gallery/[token]/prints/select/`: photograph, size and quantity selection before Stripe address and payment.
- `/gallery/[token]/download/`: download-only photograph selection with select-all and a share-before-download prompt.
- `/gallery/[token]/done/`: final download state after the ZIP starts.
- `/gallery/[token]/order-confirmed/`: final print-payment state after Stripe redirects back.

### Administrator

- `/me/events/`: leads, event jobs, and revenue status.
- `/me/events/new/`: create a personalised event job.
- `/me/events/[id]/`: event offer, private link, gallery, email, and orders.
- `/me/print-orders/`: print production queue.

## Data and security boundaries

- Next.js Server Actions own authenticated mutations and checkout creation.
- Prisma and MongoDB remain the application source of truth.
- Stripe is the source of truth for paid payment status. Prices are calculated from server-side job and print product data.
- Every order stores an immutable item and price snapshot.
- Client links use an HMAC signature and an access version. Raw reusable secrets are not stored in the database.
- Stripe and Resend secrets remain server-only environment variables.
- Gallery asset access is checked against the client token and purchased package before an asset is returned.
- New event photographs are stored in the private company Google Drive Shared Drive and are streamed through the authenticated gallery proxy. Drive file IDs are never exposed as customer-facing URLs.
- Webhook event IDs and email idempotency keys prevent duplicate fulfilment and duplicate transactional email.
- Client pages are excluded from indexing and from the sitemap.

## Email delivery

- Event email is sent as `WeTrends <events@wetrends.co.uk>` and replies go to the aligned `events@wetrends.co.uk` address. Both values remain configurable through `RESEND_FROM_EMAIL` and `RESEND_REPLY_TO_EMAIL`.
- The initial offer keeps the branded sales template. Confirmations, gallery-ready messages, and dispatch updates use a shorter personal template with no promotional footer and no more than one primary link.
- Every event email uses a clear summary, a compact details card when needed, numbered next steps, and a single action with a short note explaining what the link does. The plain-text alternative mirrors the same guidance.
- Paid digital confirmations use payment-confirmed wording, a receipt-style item summary, and no upgrade language. Every event email also includes a plain-text alternative for clients whose mail apps do not render HTML.

## Payment environments

- Preview deployments use Stripe sandbox keys and a sandbox webhook destination.
- Production uses a separate live restricted key with Checkout Sessions write access, the live publishable key, and a separate live webhook signing secret.
- Stripe must be able to reach `/api/webhooks/stripe` without Vercel Authentication or another deployment-level login screen.
- Provider credentials stay in local ignored environment files and Vercel environment variables; they are never committed.

## Company Drive structure

- Shared Drive: `Production` (`0AO9MCWQQ6NACUk9PVA`)
- Events root: `WeTrends Events` (`1dPGpL8YkdlHkQzzjIsmZNb5h5WkFEAA0`)
- Root folders: `00 · Templates`, `01 · Active Events`, `02 · Delivered Galleries`, `03 · Print Fulfilment`, and `99 · Archive`.
- The template contains `01 · Originals`, `02 · Edited Gallery`, `03 · Print Ready`, and `04 · Client Delivery`. When Drive credentials are connected, the admin upload flow creates the same per-event folders under `01 · Active Events` and places new edited photographs in `02 · Edited Gallery`.
- The Drive browser session is not an API credential. Production needs a Google service account or Workspace OAuth credential with access to this Shared Drive, stored only in `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON` (or the separate email/private-key variables) and the two non-secret folder IDs.

## Verification

- Schema generation and database push.
- TypeScript, production build, and diff checks.
- Public enquiry creates a structured lead.
- Included collection confirms without contacting Stripe.
- Complete gallery creates a Stripe test Checkout Session and reconciles a completed payment.
- A signed Stripe event reaches the hosted Vercel webhook with HTTP 200, and duplicate processing does not duplicate fulfilment or email.
- Gallery access rejects invalid or revoked tokens.
- Included clients cannot retrieve assets outside their allowance.
- Authenticated Drive assets are returned only through the private gallery proxy with no-store cache headers and a filename that matches the delivered media type.
- Print checkout validates product IDs, quantities, asset access, and shipping collection.
- Transactional test email is delivered to the authorised test address.
- Mobile and desktop browser walkthroughs cover offer, confirmation, gallery, print basket, and admin pages.
