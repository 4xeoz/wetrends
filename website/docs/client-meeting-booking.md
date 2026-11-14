# Private client meeting booking

## Decision (14 November 2026)

WeTrends staff set recurring weekly hours in UK time and choose one call
length. No weekday is enabled by default. The site generates those times for
the next 180 days and refreshes the horizon as it approaches. Updating weekly
hours preserves booked calls; future slots outside the new hours close.

To block time, staff use a two-step flow: select one or more calendar days,
then select the unavailable call times on each day. The calendar allows dates
through the same date in the next London calendar month. Only future open
occurrences are selectable; booked times cannot be blocked. A manually blocked
time stays closed while it remains within the weekly schedule. This one-month
limit applies to manual closures; the client booking horizon remains 180 days.

Staff can also limit an individual open invitation to selected London calendar
dates in that same one-month window. The booking page and booking action both
enforce the invitation's dates. Changing one invitation does not close shared
slots or change any other client's link. A missing or empty date list means the
invitation can use all open dates.

Staff create a separate signed link for each existing client. After creation,
they can review a branded invitation email and explicitly send it to the
address on the invitation, or copy the link into their existing conversation.
Creating a link never sends email automatically. The email send time is saved
on the invitation, and a later resend is an explicit staff action. The client
flow starts at day selection, then time selection, then confirmation. It does
not collect an agenda or introduce the client to the business. The page uses
the WeTrends logo, brand palette, and existing light mesh asset, with large
mobile touch targets. The link is a bearer credential and should not be put on
a public page. The site does not create a video room or sync an external
calendar; staff send the call link separately.

Each invitation can book once. Booking changes the invitation and the chosen
slot together in a MongoDB transaction so two clients cannot claim one time and
one invitation cannot claim multiple times. The site sends a transactional
confirmation email to the invitation's stored address after the database commit.
If email delivery fails, the booking stays confirmed and the client and admin
screens say so. The admin can restore a manually blocked unbooked slot or
revoke an unbooked invitation. Existing bookings are preserved for manual
changes.
An expected transaction write conflict is retried once, then rechecked against
the current invitation and slot state.

The optional invitation ID on an unbooked slot is indexed without `@unique`:
MongoDB's ordinary unique index permits only one missing/null value. The
transaction enforces the one-booking rule. See the
[MongoDB unique-index behaviour](https://www.mongodb.com/docs/v8.0/core/index-unique/#missing-document-field-in-a-unique-single-field-index).

All displayed and entered times use `Europe/London`; UTC is stored. Start times
missing or repeated at a UK clock change are omitted. Slots require at least
one hour's notice and can be booked at most 180 days ahead. No payment is
collected in this flow.

## Data and access

- `MeetingAvailability` stores weekly hours and call length.
- `MeetingSlot` holds generated times and booking snapshots; explicit
  unavailable exceptions are kept as closed occurrences.
- `MeetingInvitation` holds client details, link version, invitation status,
  optional allowed booking dates, and the last successful invitation-email
  send time. The optional JSON date list does not require a MongoDB index or a
  collection-wide backfill; existing invitations without it remain unrestricted.
- The invitation token is HMAC signed with the existing `EVENT_LINK_SECRET`
  using a meeting-specific purpose, and the route uses no-store/noindex and
  no-referrer. Analytics must exclude private booking URLs.
- Admin operations require a signed-in staff session. Client details and booked
  times are visible only in the admin area or to someone holding that client's
  private link. A revoked link cannot book.
- Invitation links are shared by staff. The custom email includes one private
  booking link and no onboarding or marketing copy. An authenticated admin
  action sends it through Resend and records the send time. A confirmation
  email is sent separately only after a successful booking.
- MongoDB can omit an optional timestamp when it is not set. Prisma reads both
  omitted and explicit `null` values as `null`, but a `field: null` filter only
  matches explicit `null`; send-time compare-and-set queries must also match
  `isSet: false`. If Resend accepts an email but its invitation status cannot
  be confirmed, tell staff the email may already have been accepted and ask
  them to refresh before retrying.

## Release and verification

Before production activation, review the MongoDB schema and indexes. Do not run
a full production `db push`: the existing database contains unrelated indexes.
The Prisma-generated meeting indexes are applied idempotently to only the
`MeetingSlot` and `MeetingInvitation` collections before staff can save hours.
In a safe test environment, select multiple dates and times within the one-month
staff window, save them, and restore a blocked time. Confirm booked and
out-of-window times cannot be blocked. Limit one open invitation to selected
dates and verify another invitation still shows the shared open dates; confirm
the server rejects a slot outside the allowed dates. Create a private
invitation, verify creation sends no email, then review and send the custom
invitation email to its stored address. Confirm the sent time appears in the
admin list, a manual resend is accepted, and the link opens the booking stages.
Walk an existing client through confirmation email, verify two simultaneous
attempts for one slot, and check a revoked link.
If any gate fails after release, restore the prior deployment and leave the
booking route unavailable until records and email status are reconciled.
