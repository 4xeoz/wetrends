# Paid gallery recovery

An admin can recover an expired delivery, upload the photographs again, set a
one-time recovery fee and email a private payment link. This is a separate
delivery, including when the original EventJob has been removed. The fee covers
finding and uploading photographs again; it does not repurchase the original
photography service. Only upload photographs the client was entitled to receive.
Nothing automatically promises that deleted originals can be recovered.

Default decision: restored access lasts **14 days from confirmed payment**.
No files are automatically deleted, and existing event galleries are unaffected.
The original gallery code has no automatic two-week retention enforcement; that
policy needs a separate implementation before describing it as automated.

## Admin journey

`/me/recoveries` → New recovery → client name, email, event title, recovery fee
(£0.50–£1,000) → upload JPEG/PNG/WebP images → Send recovery email.
An existing event can prefill client details. Private Google Drive storage uses
`Events / 04 · Gallery Recoveries / <title> · <recovery ID> / Photographs`.
Admin can edit a draft, preview uploads, see payment/expiry and email logs, and
resend the invitation or paid-gallery email. Fees, recipient and uploads are
frozen when made ready, so checkout cannot pay an outdated price. Create a new
recovery for a corrected delivery; files are never deleted by this feature.

## Client journey and contracts

`/recover/[token]` explains the fee, photo count and access window. It exposes no
photographs or Drive identifiers before payment. Stripe Checkout uses a server
fee snapshot. An unpaid return URL never unlocks access. Both the signed webhook
and return page reconcile a Stripe-retrieved session; fulfillment checks stored
session, recovery/order metadata, amount, currency and configured client email.
Payment atomically marks order/gallery paid, starts the window once and emails
the download link. Duplicate fulfillment never extends access.

Paid clients select photographs or select all and download a ZIP. Image routes
validate token version, paid order and expiry on every request; no public Drive
URLs. Next Image optimization is disabled for recovery photographs to avoid a
shared image cache bypass. Pages/APIs use no-store, noindex and no-referrer.
Anyone holding the private link has the same access: share it intentionally.

Recovery pages are excluded from analytics so private access tokens are not sent
to PostHog or GA4. Middleware rejects recovery image URLs passed to `/_next/image`
as well as using unoptimized previews; this prevents manual optimizer requests
from caching images past expiry.

One order per recovery plus Stripe idempotency handles repeated clicks/timeouts.
Expired checkouts retry with a new attempt. Payment emails have stable keys and
sent-log checks; failed sends retry without replaying payment. Logs record email
acceptance, not inbox delivery.

## Verification and release

Run Prisma validation/generation, TypeScript, scoped ESLint, recovery contract
tests, build and local desktop/mobile walkthroughs. Test locked/paid/expired
images, tampered/cross-purpose tokens, checkout retry, wrong amount/session,
duplicate fulfillment and failed email retry. Tests use an isolated Mongo replica
set and mocked Stripe/Drive/Resend; no customer records or real payments.
Before live activation run `prisma db push` without destructive flags against the
intended database; only new recovery collections/indexes are added. Existing
Stripe webhook and Resend/Drive credentials are reused. Check real providers in
Stripe test mode before claiming live payment verification.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/me/recoveries`, `/new`, `/[id]` | Admin session | List, create, upload, send and monitor |
| `/api/admin/recoveries/upload` POST | Admin session, same origin | Small image uploads, up to 4 MB |
| `/api/admin/recoveries/[id]/assets/[assetId]` GET | Admin session | Draft preview |
| `/recover/[token]` | Signed, purpose-scoped private link | Fee, payment reconciliation, downloads |
| `/api/recovery/[token]/checkout` POST | Valid ready recovery, same origin | Server-priced checkout |
| `/api/recovery/[token]/assets/[assetId]` GET | Paid, unexpired recovery | Private preview / `?download=1` original |
| `/api/webhooks/stripe` POST | Stripe signature | Payment fulfillment and session expiry |

Tests: with a local Mongo replica set on port 28027, run
`DATABASE_URL='mongodb://127.0.0.1:28027/wetrends_recovery_test?replicaSet=rs0&directConnection=true' node scripts/check-gallery-recovery.cjs`.
The test script refuses non-local or non-test databases, mocks provider requests,
keeps test records in that isolated database and never sends real emails.
