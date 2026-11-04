import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getAppUrl } from "@/lib/events/access";
import { prisma } from "@/prisma/prisma";
import { paymentIdPattern } from "./policy";

function signature(encoded: string) {
  const secret = process.env.EVENT_LINK_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("EVENT_LINK_SECRET must contain at least 32 characters");
  return createHmac("sha256", secret)
    .update(`client-payment:${encoded}`)
    .digest("base64url");
}

export function createClientPaymentToken(id: string, accessVersion: number) {
  const encoded = Buffer.from(`${id}.${accessVersion}`).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifyClientPaymentToken(token: string) {
  const [encoded, provided, ...rest] = token.split(".");
  if (!encoded || !provided || rest.length || token.length > 256) return null;
  const expected = Buffer.from(signature(encoded));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const [id, version, ...extra] = Buffer.from(encoded, "base64url")
    .toString("utf8").split(".");
  const accessVersion = Number(version);
  if (
    !paymentIdPattern.test(id) || extra.length ||
    !Number.isSafeInteger(accessVersion) || accessVersion < 1
  ) return null;
  return { id, accessVersion };
}

export function getClientPaymentUrl(id: string, accessVersion: number) {
  return `${getAppUrl()}/pay/${createClientPaymentToken(id, accessVersion)}`;
}

export async function getClientPaymentFromToken(token: string) {
  const claim = verifyClientPaymentToken(token);
  if (!claim) return null;
  const payment = await prisma.clientPaymentRequest.findUnique({ where: { id: claim.id } });
  if (!payment || payment.status === "DRAFT" || payment.accessVersion !== claim.accessVersion)
    return null;
  return payment;
}
