/* In-memory payment contracts. No database connection or real Stripe requests. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const Stripe = require("stripe");

process.env.EVENT_LINK_SECRET = "client-payment-contract-secret-at-least-32-characters";
process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3217";
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_client_payment_contract";

const root = path.resolve(__dirname, "..");
const records = new Map();
const webhookEvents = new Set();
const sessions = new Map();
const idempotency = new Map();
const webhooks = new Stripe("sk_test_mock").webhooks;
let admin = true;
let createdSessions = 0;
let lastCheckoutInput;

function copy(value) { return value == null ? value : structuredClone(value); }
function matches(record, where) {
  return Object.entries(where).every(([key, value]) => {
    if (key === "OR") return value.some((branch) => matches(record, branch));
    if (value && typeof value === "object" && "isSet" in value)
      return Object.hasOwn(record, key) === value.isSet;
    if (value === null) return Object.hasOwn(record, key) && record[key] === null;
    return record[key] === value;
  });
}
function write(record, data) {
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "increment" in value)
      record[key] += value.increment;
    else record[key] = copy(value);
  }
  record.updatedAt = new Date();
}
const prisma = {
  clientPaymentRequest: {
    async create({ data }) {
      const id = (records.size + 1).toString(16).padStart(24, "0");
      const record = {
        id, currency: "gbp", status: "DRAFT", accessVersion: 1,
        publishedAt: null, paidAt: null, checkoutAttempt: 1,
        lastFailedSessionId: null,
        stripePaymentIntentId: null, createdAt: new Date(), updatedAt: new Date(),
        ...copy(data),
      };
      records.set(id, record);
      return copy(record);
    },
    async findUnique({ where }) { return copy(records.get(where.id) || null); },
    async findUniqueOrThrow({ where }) {
      const record = records.get(where.id);
      if (!record) throw new Error("Record not found");
      return copy(record);
    },
    async updateMany({ where, data }) {
      const record = records.get(where.id);
      if (!record || !matches(record, where)) return { count: 0 };
      write(record, data);
      return { count: 1 };
    },
  },
  stripeWebhookEvent: {
    async findUnique({ where }) {
      return webhookEvents.has(where.stripeEventId) ? { stripeEventId: where.stripeEventId } : null;
    },
    async create({ data }) {
      if (webhookEvents.has(data.stripeEventId)) throw new Error("Duplicate webhook event");
      webhookEvents.add(data.stripeEventId);
      return data;
    },
  },
};
const stripe = {
  webhooks,
  checkout: {
    sessions: {
      async create(input, options) {
        lastCheckoutInput = input;
        assert.match(options.idempotencyKey, /^client-payment-v3-[a-f\d]{24}-\d+$/);
        assert.equal(input.ui_mode, "embedded_page");
        assert.equal(input.redirect_on_completion, "always");
        assert.equal(input.adaptive_pricing.enabled, false);
        assert.deepEqual(input.payment_method_types, ["card"]);
        assert.equal(input.branding_settings.button_color, "#C72C5B");
        assert.equal(input.branding_settings.background_color, "#FFFFFF");
        assert.equal(input.branding_settings.border_style, "rounded");
        assert.equal(input.branding_settings.font_family, "inter");
        assert.equal(input.branding_settings.icon, undefined);
        assert.ok(input.return_url.includes("{CHECKOUT_SESSION_ID}"));
        if (idempotency.has(options.idempotencyKey))
          return copy(sessions.get(idempotency.get(options.idempotencyKey)));
        const id = `cs_test_client_${++createdSessions}`;
        const session = {
          id, client_secret: `cs_secret_${createdSessions}`,
          status: "open", payment_status: "unpaid",
          amount_total: input.line_items.reduce((sum, item) => sum + item.quantity * item.price_data.unit_amount, 0),
          currency: "gbp", customer_email: input.customer_email,
          client_reference_id: input.client_reference_id,
          metadata: input.metadata, payment_intent: `pi_test_client_${createdSessions}`,
        };
        sessions.set(id, session);
        idempotency.set(options.idempotencyKey, id);
        return copy(session);
      },
      async retrieve(id) {
        const session = sessions.get(id);
        if (!session) throw new Error("Unknown test session");
        return copy(session);
      },
      async expire(id) {
        const session = sessions.get(id);
        if (!session || session.status !== "open") throw new Error("Cannot expire session");
        session.status = "expired";
        return copy(session);
      },
    },
  },
};

const originalLoad = Module._load;
Module._load = function (name, parent, isMain) {
  if (name === "server-only") return {};
  if (name === "next/cache") return { revalidatePath() {} };
  if (name === "@/prisma/prisma") return { prisma };
  if (name === "@/lib/auth") return { auth: async () => admin ? { user: { id: "admin" } } : null };
  if (name === "@/lib/stripe") return { getStripe: () => stripe };
  if (name.startsWith("@/")) {
    const base = path.join(root, name.slice(2));
    name = [".ts", ".tsx", ".js"].map((extension) => base + extension)
      .find((file) => fs.existsSync(file)) || base;
  }
  return originalLoad.call(this, name, parent, isMain);
};
for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = (module, filename) => {
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      },
    });
    module._compile(compiled.outputText, filename);
  };
}

const policy = require("../lib/client-payments/policy.ts");
const access = require("../lib/client-payments/access.ts");
const eventAccess = require("../lib/events/access.ts");
const actions = require("../actions/client-payments.ts");
const { createClientPaymentCheckout } = require("../lib/client-payments/checkout.ts");
const { fulfillClientPaymentSession } = require("../lib/client-payments/fulfillment.ts");
const checkoutRoute = require("../app/api/pay/[token]/checkout/route.ts");
const webhookRoute = require("../app/api/webhooks/stripe/route.ts");

const validInput = {
  clientName: "Test Client", clientEmail: "CLIENT@example.invalid",
  projectTitle: "Brand and website", note: "Agreed outside WeTrends.",
  items: [
    { name: "Brand identity", description: "Design package", quantity: "2", unitPrice: "49.99" },
    { name: "Website", description: "Build package", quantity: "1", unitPrice: "100.00" },
  ],
};

async function createOpenRequest() {
  const saved = await actions.saveClientPayment(validInput);
  assert.ok(saved.paymentId);
  const published = await actions.publishClientPayment(saved.paymentId);
  assert.ok(published.url);
  return { id: saved.paymentId, token: published.url.split("/pay/")[1] };
}

async function postWebhook(type, session, id) {
  const payload = JSON.stringify({ id, type, data: { object: session } });
  const signature = webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET });
  return webhookRoute.POST(new Request("http://127.0.0.1:3217/api/webhooks/stripe", {
    method: "POST", headers: { "stripe-signature": signature }, body: payload,
  }));
}

async function main() {
  assert.equal(policy.parsePounds("49.99"), 4999);
  for (const invalid of ["", "0", "-1", "1.001", "1e2", "NaN"])
    assert.equal(policy.parsePounds(invalid), null);
  assert.equal(policy.normalisePaymentItems(validInput.items).total, 19998);
  assert.equal(policy.normalisePaymentItems([{ ...validInput.items[0], quantity: "101" }]), null);
  console.log("PASS server price and item validation");

  admin = false;
  await assert.rejects(() => actions.saveClientPayment(validInput), /sign in/i);
  await assert.rejects(() => actions.publishClientPayment("000000000000000000000001"), /sign in/i);
  await assert.rejects(() => actions.voidClientPayment("000000000000000000000001"), /sign in/i);
  admin = true;
  const invalid = await actions.saveClientPayment({ ...validInput, items: [{ ...validInput.items[0], unitPrice: "0" }] });
  assert.ok(invalid.error);
  console.log("PASS admin authorization and invalid draft rejection");

  const first = await createOpenRequest();
  const firstRecord = records.get(first.id);
  assert.equal(Object.hasOwn(firstRecord, "stripeCheckoutSessionId"), false);
  assert.equal(firstRecord.clientEmail, "client@example.invalid");
  assert.equal(firstRecord.total, 19998);
  assert.equal((await actions.saveClientPayment(validInput, first.id)).error.includes("Only drafts"), true);
  assert.equal((await access.getClientPaymentFromToken(first.token)).id, first.id);
  assert.equal(await access.getClientPaymentFromToken(first.token + "tamper"), null);
  assert.equal(access.verifyClientPaymentToken(eventAccess.createEventToken(first.id, 1)), null);
  assert.equal(access.verifyClientPaymentToken(access.createClientPaymentToken(first.id, 2)).accessVersion, 2);
  assert.equal(await access.getClientPaymentFromToken(access.createClientPaymentToken(first.id, 2)), null);
  console.log("PASS immutable published terms and signed access version");

  const routeUrl = `http://127.0.0.1:3217/api/pay/${first.token}/checkout`;
  const rejectedOrigin = await checkoutRoute.POST(new Request(routeUrl, {
    method: "POST", headers: { origin: "https://attacker.invalid" },
  }), { params: Promise.resolve({ token: first.token }) });
  assert.equal(rejectedOrigin.status, 403);
  const accepted = await checkoutRoute.POST(new Request(routeUrl, {
    method: "POST", headers: { origin: "http://127.0.0.1:3217" },
  }), { params: Promise.resolve({ token: first.token }) });
  assert.equal(accepted.status, 200);
  assert.equal((await accepted.json()).clientSecret, "cs_secret_1");
  assert.equal(accepted.headers.get("Cache-Control"), "private, no-store, max-age=0");
  assert.equal(lastCheckoutInput.line_items.length, 2);
  assert.equal(lastCheckoutInput.line_items[0].price_data.unit_amount, 4999);
  const reusable = sessions.get(firstRecord.stripeCheckoutSessionId);
  reusable.amount_total += 1;
  await assert.rejects(() => createClientPaymentCheckout(first.token), /does not match/);
  reusable.amount_total -= 1;
  assert.equal((await createClientPaymentCheckout(first.token)).clientSecret, "cs_secret_1");
  assert.equal(createdSessions, 1);
  console.log("PASS same-origin embedded checkout, server prices and session reuse");

  const firstSession = sessions.get(firstRecord.stripeCheckoutSessionId);
  await assert.rejects(() => fulfillClientPaymentSession({ ...firstSession, payment_status: "paid", amount_total: 1 }), /does not match/);
  await assert.rejects(() => fulfillClientPaymentSession({ ...firstSession, payment_status: "paid", id: "wrong" }), /does not match/);
  await assert.rejects(() => fulfillClientPaymentSession({ ...firstSession, payment_status: "paid", customer_email: "wrong@example.invalid" }), /does not match/);
  assert.equal(firstRecord.status, "OPEN");
  firstSession.payment_status = "paid";
  firstSession.status = "complete";
  assert.equal((await fulfillClientPaymentSession(copy(firstSession))).fulfilled, true);
  const paidAt = firstRecord.paidAt.getTime();
  assert.equal((await fulfillClientPaymentSession(copy(firstSession))).fulfilled, true);
  assert.equal(firstRecord.paidAt.getTime(), paidAt);
  assert.equal((await actions.voidClientPayment(first.id)).error.includes("Only unpaid"), true);
  console.log("PASS wrong session/amount/email rejection and idempotent paid transition");

  const second = await createOpenRequest();
  await createClientPaymentCheckout(second.token);
  const secondRecord = records.get(second.id);
  const expired = sessions.get(secondRecord.stripeCheckoutSessionId);
  expired.status = "expired";
  assert.equal((await postWebhook("checkout.session.expired", expired, "evt_expired_1")).status, 200);
  assert.equal(secondRecord.lastFailedSessionId, expired.id);
  assert.equal(secondRecord.checkoutAttempt, 2);
  await createClientPaymentCheckout(second.token);
  assert.notEqual(secondRecord.stripeCheckoutSessionId, expired.id);
  assert.equal((await postWebhook("checkout.session.expired", expired, "evt_expired_2")).status, 200);
  assert.notEqual(secondRecord.stripeCheckoutSessionId, null);
  const retried = sessions.get(secondRecord.stripeCheckoutSessionId);
  retried.payment_status = "paid";
  retried.status = "complete";
  assert.equal((await postWebhook("checkout.session.completed", retried, "evt_paid_1")).status, 200);
  assert.equal(secondRecord.status, "PAID");
  const duplicate = await postWebhook("checkout.session.completed", retried, "evt_paid_1");
  assert.equal((await duplicate.json()).duplicate, true);
  console.log("PASS expired retry, stale webhook guard and signed webhook completion");

  const third = await createOpenRequest();
  await createClientPaymentCheckout(third.token);
  const thirdRecord = records.get(third.id);
  const thirdSession = sessions.get(thirdRecord.stripeCheckoutSessionId);
  assert.equal((await actions.voidClientPayment(third.id)).message.includes("voided"), true);
  assert.equal(thirdRecord.status, "VOID");
  assert.equal(thirdSession.status, "expired");
  await assert.rejects(() => createClientPaymentCheckout(third.token), /unavailable/);
  console.log("PASS void expires open checkout and prevents new payment");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
