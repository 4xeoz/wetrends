/* Integration contracts: real isolated Mongo transactions, mocked external providers.
   Run: DATABASE_URL=mongodb://127.0.0.1:28027/wetrends_recovery_test?replicaSet=rs0\&directConnection=true node scripts/check-gallery-recovery.cjs */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { PrismaClient } = require("@prisma/client");
const Stripe = require("stripe");

const database = new URL(process.env.DATABASE_URL || "mongodb://invalid/");
if (
  !["localhost", "127.0.0.1"].includes(database.hostname) ||
  !database.pathname.startsWith("/wetrends_recovery_test")
) {
  throw new Error(
    "Tests require a local database named wetrends_recovery_test. Never use a customer database.",
  );
}
process.env.EVENT_LINK_SECRET =
  "recovery-contract-test-secret-at-least-32-characters";
process.env.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3217";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_recovery_test";
const root = path.resolve(__dirname, "..");
const prisma = new PrismaClient();
let admin = true;
let failEmail = false;
let emailCalls = 0;
let driveFetches = 0;
let createCalls = 0;
let simulatedTimeout = false;
const sent = new Map();
const sessions = new Map();
const idempotency = new Map();
const driveImagesByFolder = new Map();
const stripe = {
  webhooks: new Stripe("sk_test_mock").webhooks,
  checkout: {
    sessions: {
      async retrieve(id) {
        assert.ok(sessions.has(id), "Unknown checkout");
        return sessions.get(id);
      },
      async create(input, options) {
        createCalls++;
        if (!idempotency.has(options.idempotencyKey)) {
          const id = `cs_test_recovery_${sessions.size + 1}`;
          const session = {
            id,
            status: "open",
            payment_status: "unpaid",
            amount_total: input.line_items[0].price_data.unit_amount,
            currency: input.line_items[0].price_data.currency,
            customer_email: input.customer_email,
            client_reference_id: input.client_reference_id,
            metadata: input.metadata,
            payment_intent: "pi_test_mock",
            url: `https://checkout.stripe.com/test/${id}`,
          };
          sessions.set(id, session);
          idempotency.set(options.idempotencyKey, id);
          assert.ok(input.success_url.includes("{CHECKOUT_SESSION_ID}"));
        }
        if (simulatedTimeout) {
          simulatedTimeout = false;
          throw new Error("Mock network timeout after creation");
        }
        return sessions.get(idempotency.get(options.idempotencyKey));
      },
    },
  },
};

// Transpile source in memory. No generated fixtures, production flags or source edits.
const originalLoad = Module._load;
Module._load = function (name, parent, isMain) {
  if (name === "server-only") return {};
  if (name === "next/cache") return { revalidatePath() {} };
  if (name === "@/prisma/prisma") return { prisma };
  if (name === "@/lib/auth")
    return {
      auth: async () =>
        admin ? { user: { id: "111111111111111111111111" } } : null,
    };
  if (name === "@/lib/stripe") return { getStripe: () => stripe };
  if (name === "@/lib/resend")
    return {
      getResend: () => ({
        emails: {
          send: async (input, options) => {
            emailCalls++;
            assert.equal(input.to, "recovery-test@example.invalid");
            assert.ok(
              input.text.includes("days") ||
                input.text.includes("Available until"),
            );
            assert.ok(!input.text.includes("upgrade"));
            const html = require("react-dom/server").renderToStaticMarkup(
              input.react,
            );
            assert.equal(
              (html.match(/<a\b/g) || []).length,
              1,
              "Transactional recovery emails need one clear link",
            );
            assert.ok(
              !html.includes("Event photography across Surrey and London"),
            );
            if (failEmail)
              return { error: { message: "Mock email unavailable" } };
            if (!sent.has(options.idempotencyKey))
              sent.set(options.idempotencyKey, {
                id: `mock-email-${sent.size + 1}`,
                input,
              });
            return { data: { id: sent.get(options.idempotencyKey).id } };
          },
        },
      }),
    };
  if (name === "@/lib/google-drive")
    return {
      ensureRecoveryDriveFolder: async ({ recoveryId }) =>
        `private-recovery-folder-${recoveryId}`,
      listRecoveryDriveImages: async (folderId) =>
        driveImagesByFolder.get(folderId) || [
          {
            id: "private-drive-photo",
            name: "birthday.jpg",
            mimeType: "image/jpeg",
          },
        ],
      uploadGoogleDriveFile: async () => ({ id: "private-upload-photo" }),
      downloadGoogleDriveFile: async () => {
        driveFetches++;
        return new Response(new Uint8Array([0xff, 0xd8, 0xff]), {
          headers: { "content-type": "image/jpeg" },
        });
      },
    };
  if (name.startsWith("@/")) {
    const base = path.join(root, name.slice(2));
    name =
      [".ts", ".tsx", ".js"]
        .map((extension) => base + extension)
        .find((file) => fs.existsSync(file)) || base;
  }
  return originalLoad.call(this, name, parent, isMain);
};
for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = (module, filename) => {
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    module._compile(compiled.outputText, filename);
  };
}

const policy = require("../lib/recovery/policy.ts");
const access = require("../lib/recovery/access.ts");
const eventsAccess = require("../lib/events/access.ts");
const actions = require("../actions/recovery.ts");
const { createRecoveryCheckout } = require("../lib/recovery/checkout.ts");
const { fulfillRecoverySession } = require("../lib/recovery/fulfillment.ts");
const imageRoute = require("../app/api/recovery/[token]/assets/[assetId]/route.ts");
const uploadRoute = require("../app/api/admin/recoveries/upload/route.ts");
const checkoutRoute = require("../app/api/recovery/[token]/checkout/route.ts");
const webhookRoute = require("../app/api/webhooks/stripe/route.ts");
const testId = Date.now();
const checks = [];
async function check(name, test) {
  await test();
  checks.push(name);
  console.log(`PASS ${name}`);
}

async function main() {
  await check(
    "fee validation rejects zero, fractions, negative and excessive fees",
    async () => {
      for (const invalid of ["0", "-1", "1.001", "1000.01", "1e2", "NaN", ""])
        assert.equal(policy.parseRecoveryFee(invalid), null);
      assert.equal(policy.parseRecoveryFee("0.50"), 50);
      assert.equal(policy.parseRecoveryFee("19.99"), 1999);
    },
  );
  await check(
    "admin create/edit/upload/import/email actions require authentication",
    async () => {
      admin = false;
      await assert.rejects(() => actions.saveRecovery({}), /sign in/);
      await assert.rejects(
        () => actions.prepareRecoveryDrive("111111111111111111111111"),
        /sign in/,
      );
      await assert.rejects(
        () => actions.importRecoveryDrive("111111111111111111111111"),
        /sign in/,
      );
      await assert.rejects(
        () => actions.syncRecoveryDrive("111111111111111111111111"),
        /sign in/,
      );
      await assert.rejects(
        () => actions.emailRecovery("111111111111111111111111"),
        /sign in/,
      );
      const result = await uploadRoute.POST(
        new Request("http://127.0.0.1:3217/api/admin/recoveries/upload", {
          method: "POST",
        }),
      );
      assert.equal(result.status, 401);
      admin = true;
    },
  );
  const draft = await actions.saveRecovery({
    clientName: "Test client",
    clientEmail: "recovery-test@example.invalid",
    eventTitle: `Recovery contract ${testId}`,
    fee: "19.99",
  });
  assert.ok(draft.recoveryId);
  const id = draft.recoveryId;
  const token = access.createRecoveryToken(id, 1);
  await check(
    "draft gallery is inaccessible and purpose-scoped tokens cannot cross galleries",
    async () => {
      assert.equal(await access.getRecoveryFromToken(token), null);
      assert.equal(
        access.verifyRecoveryToken(eventsAccess.createEventToken(id, 1)),
        null,
      );
      assert.equal(eventsAccess.verifyEventToken(token), null);
      assert.equal(access.verifyRecoveryToken(token + "tampered"), null);
      assert.equal(
        (await actions.emailRecovery(id)).error,
        "Upload or import the recovered photographs before sending.",
      );
    },
  );
  await check(
    "Drive import is repeatable without duplicating images",
    async () => {
      await actions.prepareRecoveryDrive(id);
      assert.equal(
        (await actions.importRecoveryDrive(id)).message,
        "1 photograph imported.",
      );
      assert.equal(
        (await actions.importRecoveryDrive(id)).message,
        "0 photographs imported.",
      );
    },
  );
  const asset = await prisma.recoveryAsset.findFirstOrThrow({
    where: { recoveryId: id },
  });
  const imageRequest = new Request(
    `http://127.0.0.1:3217/api/recovery/${token}/assets/${asset.id}`,
  );
  const imageParams = { params: Promise.resolve({ token, assetId: asset.id }) };
  await check(
    "invitation is logged; published terms are frozen and unpaid files stay locked",
    async () => {
      assert.equal(
        (await actions.emailRecovery(id)).message,
        "Recovery email sent.",
      );
      assert.ok(
        (
          await actions.saveRecovery(
            {
              clientName: "Test",
              clientEmail: "recovery-test@example.invalid",
              eventTitle: "changed",
              fee: "0.50",
            },
            id,
          )
        ).error,
      );
      assert.ok((await actions.importRecoveryDrive(id)).error);
      driveImagesByFolder.set(`private-recovery-folder-${id}`, [
        { id: "private-drive-photo", name: "birthday.jpg", mimeType: "image/jpeg" },
        { id: "private-drive-photo-2", name: "cake.png", mimeType: "image/png" },
      ]);
      assert.equal(
        (await actions.syncRecoveryDrive(id)).message,
        "1 new photograph added. The fee and access end date are unchanged. Refresh the client gallery to see them.",
      );
      assert.equal(
        (await actions.syncRecoveryDrive(id)).message,
        "No new supported photographs found. Upload JPEG, PNG or WebP files directly into this ticket’s Photographs folder, then sync again.",
      );
      const syncedReady = await prisma.galleryRecovery.findUniqueOrThrow({
        where: { id },
      });
      assert.equal(syncedReady.status, "READY");
      assert.equal(syncedReady.feeAmount, 1999);
      assert.equal(
        await prisma.recoveryAsset.count({ where: { recoveryId: id } }),
        2,
      );
      assert.equal(
        (await imageRoute.GET(imageRequest, imageParams)).status,
        404,
      );
      assert.equal(driveFetches, 0);
    },
  );
  await check("cross-origin checkout is rejected", async () => {
    assert.equal(
      policy.isRecoverySameOrigin(
        new Request("http://localhost:3217/api/recovery", {
          headers: { origin: "http://127.0.0.1:3217", host: "127.0.0.1:3217" },
        }),
      ),
      true,
    );
    assert.equal(
      policy.isRecoverySameOrigin(
        new Request("http://internal/api/recovery", {
          headers: {
            origin: "https://wetrends.co.uk",
            host: "wetrends.co.uk",
            "x-forwarded-proto": "https",
          },
        }),
      ),
      true,
    );
    const response = await checkoutRoute.POST(
      new Request("http://127.0.0.1:3217/api/recovery/token/checkout", {
        method: "POST",
        headers: { origin: "https://untrusted.example" },
      }),
      { params: Promise.resolve({ token }) },
    );
    assert.equal(response.status, 403);
  });
  await check(
    "concurrent checkout clicks use the server fee and one Stripe session",
    async () => {
      const result = await Promise.all([
        createRecoveryCheckout(token),
        createRecoveryCheckout(token),
        createRecoveryCheckout(token),
      ]);
      assert.ok(result.every((item) => item.url === result[0].url));
      assert.equal(sessions.size, 1);
      assert.equal(
        await prisma.recoveryOrder.count({ where: { recoveryId: id } }),
        1,
      );
    },
  );
  let order = await prisma.recoveryOrder.findUniqueOrThrow({
    where: { recoveryId: id },
  });
  let session = sessions.get(order.stripeCheckoutSessionId);
  await check(
    "unpaid return and wrong amount/session/email cannot unlock images",
    async () => {
      assert.equal((await fulfillRecoverySession(session)).fulfilled, false);
      await assert.rejects(
        () =>
          fulfillRecoverySession({
            ...session,
            payment_status: "paid",
            amount_total: 50,
          }),
        /terms/,
      );
      await assert.rejects(
        () =>
          fulfillRecoverySession({
            ...session,
            payment_status: "paid",
            id: "cs_other",
          }),
        /stored order/,
      );
      await assert.rejects(
        () =>
          fulfillRecoverySession({
            ...session,
            payment_status: "paid",
            customer_email: "other@example.invalid",
          }),
        /terms/,
      );
      assert.equal(
        (await imageRoute.GET(imageRequest, imageParams)).status,
        404,
      );
    },
  );
  await check(
    "expired checkout retries once; stale webhook cannot cancel the replacement",
    async () => {
      const old = { ...session, status: "expired" };
      sessions.set(old.id, old);
      await Promise.all([
        createRecoveryCheckout(token),
        createRecoveryCheckout(token),
      ]);
      order = await prisma.recoveryOrder.findUniqueOrThrow({
        where: { recoveryId: id },
      });
      assert.equal(order.checkoutAttempt, 2);
      assert.notEqual(order.stripeCheckoutSessionId, old.id);
      const event = {
        id: `evt_recovery_expired_${testId}`,
        object: "event",
        type: "checkout.session.expired",
        data: { object: old },
      };
      const payload = JSON.stringify(event);
      const signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET,
      });
      const response = await webhookRoute.POST(
        new Request("http://127.0.0.1:3217/api/webhooks/stripe", {
          method: "POST",
          headers: { "stripe-signature": signature },
          body: payload,
        }),
      );
      assert.equal(response.status, 200);
      assert.equal(
        (
          await prisma.recoveryOrder.findUniqueOrThrow({
            where: { id: order.id },
          })
        ).status,
        "CHECKOUT_PENDING",
      );
      session = sessions.get(order.stripeCheckoutSessionId);
    },
  );
  await check(
    "payment unlocks even if email fails, and failed email retries without resetting expiry",
    async () => {
      session.payment_status = "paid";
      session.status = "complete";
      failEmail = true;
      await assert.rejects(
        () => fulfillRecoverySession(session),
        /confirmation email needs retry/,
      );
      const paid = await access.getRecoveryFromToken(token);
      assert.ok(policy.canDownloadRecovery(paid));
      assert.equal(
        paid.expiresAt.getTime() - paid.paidAt.getTime(),
        14 * 86_400_000,
      );
      failEmail = false;
      await Promise.all([
        fulfillRecoverySession(session),
        fulfillRecoverySession(session),
      ]);
      const again = await access.getRecoveryFromToken(token);
      assert.equal(again.expiresAt.getTime(), paid.expiresAt.getTime());
      assert.equal(again.paidAt.getTime(), paid.paidAt.getTime());
      const before = emailCalls;
      await fulfillRecoverySession(session);
      assert.equal(emailCalls, before);
    },
  );
  await check(
    "paid files stream privately; expired, refunded, rotated and foreign assets are denied",
    async () => {
      const response = await imageRoute.GET(imageRequest, imageParams);
      assert.equal(response.status, 200);
      assert.equal(
        response.headers.get("cache-control"),
        "private, no-store, max-age=0",
      );
      assert.equal(response.headers.get("content-type"), "image/jpeg");
      const paid = await access.getRecoveryFromToken(token);
      assert.equal(policy.canDownloadRecovery(paid, paid.expiresAt), false);
      driveImagesByFolder.set(`private-recovery-folder-${id}`, [
        { id: "private-drive-photo", name: "birthday.jpg", mimeType: "image/jpeg" },
        { id: "private-drive-photo-2", name: "cake.png", mimeType: "image/png" },
        { id: "private-drive-photo-3", name: "family.webp", mimeType: "image/webp" },
      ]);
      assert.equal(
        (await actions.syncRecoveryDrive(id)).message,
        "1 new photograph added. The fee and access end date are unchanged. Refresh the client gallery to see them.",
      );
      const paidAfterSync = await access.getRecoveryFromToken(token);
      assert.equal(paidAfterSync.status, "PAID");
      assert.equal(paidAfterSync.feeAmount, paid.feeAmount);
      assert.equal(paidAfterSync.expiresAt.getTime(), paid.expiresAt.getTime());
      assert.equal(
        await prisma.recoveryAsset.count({ where: { recoveryId: id } }),
        3,
      );
      const lateAsset = await prisma.recoveryAsset.findFirstOrThrow({
        where: { recoveryId: id, driveFileId: "private-drive-photo-3" },
      });
      assert.equal(
        (
          await imageRoute.GET(
            imageRequest,
            {
              params: Promise.resolve({ token, assetId: lateAsset.id }),
            },
          )
        ).status,
        200,
      );
      await prisma.galleryRecovery.update({
        where: { id },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      assert.ok((await actions.syncRecoveryDrive(id)).error);
      assert.equal(
        (await imageRoute.GET(imageRequest, imageParams)).status,
        404,
      );
      await prisma.galleryRecovery.update({
        where: { id },
        data: { expiresAt: paid.expiresAt },
      });
      await prisma.recoveryOrder.update({
        where: { id: order.id },
        data: { status: "REFUNDED" },
      });
      assert.equal(
        (await imageRoute.GET(imageRequest, imageParams)).status,
        404,
      );
      await prisma.recoveryOrder.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });
      assert.equal(
        (
          await imageRoute.GET(imageRequest, {
            params: Promise.resolve({
              token,
              assetId: "111111111111111111111111",
            }),
          })
        ).status,
        404,
      );
      await prisma.galleryRecovery.update({
        where: { id },
        data: { accessVersion: 2 },
      });
      assert.equal(await access.getRecoveryFromToken(token), null);
    },
  );
  await check(
    "Stripe timeout after creation is recoverable without a second session",
    async () => {
      const other = await actions.saveRecovery({
        clientName: "Test",
        clientEmail: "recovery-test@example.invalid",
        eventTitle: `Timeout contract ${testId}`,
        fee: "7.50",
      });
      await actions.prepareRecoveryDrive(other.recoveryId);
      await actions.importRecoveryDrive(other.recoveryId);
      await actions.emailRecovery(other.recoveryId);
      const otherToken = access.createRecoveryToken(other.recoveryId, 1);
      const before = sessions.size;
      simulatedTimeout = true;
      await assert.rejects(() => createRecoveryCheckout(otherToken), /timeout/);
      const url = await createRecoveryCheckout(otherToken);
      assert.ok(url.url.startsWith("https://checkout.stripe.com/"));
      assert.equal(sessions.size, before + 1);
      const paidOrder = await prisma.recoveryOrder.findUniqueOrThrow({
        where: { recoveryId: other.recoveryId },
      });
      const paidSession = sessions.get(paidOrder.stripeCheckoutSessionId);
      paidSession.payment_status = "paid";
      paidSession.status = "complete";
      await Promise.all([
        fulfillRecoverySession(paidSession),
        fulfillRecoverySession(paidSession),
        fulfillRecoverySession(paidSession),
      ]);
      const paid = await access.getRecoveryFromToken(otherToken);
      assert.equal(
        paid.expiresAt.getTime() - paid.paidAt.getTime(),
        14 * 86_400_000,
      );
      const event = {
        id: `evt_recovery_paid_${testId}`,
        object: "event",
        type: "checkout.session.completed",
        data: { object: paidSession },
      };
      const payload = JSON.stringify(event);
      const signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET,
      });
      for (let attempt = 0; attempt < 2; attempt++) {
        const response = await webhookRoute.POST(
          new Request("http://127.0.0.1:3217/api/webhooks/stripe", {
            method: "POST",
            headers: { "stripe-signature": signature },
            body: payload,
          }),
        );
        assert.equal(response.status, 200);
      }
      assert.equal(
        (await access.getRecoveryFromToken(otherToken)).expiresAt.getTime(),
        paid.expiresAt.getTime(),
      );
    },
  );
  await check(
    "explicit admin email resend sends again without extending paid access",
    async () => {
      const before = await prisma.galleryRecovery.findUniqueOrThrow({
        where: { id },
      });
      const delivered = sent.size;
      assert.equal(
        (await actions.emailRecovery(id)).message,
        "Gallery email confirmed sent.",
      );
      assert.equal(sent.size, delivered + 1);
      const after = await prisma.galleryRecovery.findUniqueOrThrow({
        where: { id },
      });
      assert.equal(after.expiresAt.getTime(), before.expiresAt.getTime());
    },
  );
  console.log(
    JSON.stringify({
      passed: checks.length,
      providers: "mocked",
      database: "isolated local MongoDB",
      checkoutCalls: createCalls,
      deliveredEmails: sent.size,
    }),
  );
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
