import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getAppUrl } from "@/lib/events/access";
import { prisma } from "@/prisma/prisma";
import { objectIdPattern } from "./policy";

function signature(encoded: string) {
  const secret = process.env.EVENT_LINK_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("EVENT_LINK_SECRET must contain at least 32 characters");
  return createHmac("sha256", secret)
    .update(`gallery-recovery:${encoded}`)
    .digest("base64url");
}

export function createRecoveryToken(id: string, accessVersion: number) {
  const encoded = Buffer.from(`${id}.${accessVersion}`).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifyRecoveryToken(token: string) {
  const [encoded, provided, ...rest] = token.split(".");
  if (!encoded || !provided || rest.length || token.length > 256) return null;
  const expected = Buffer.from(signature(encoded));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    return null;
  const [id, version, ...extra] = Buffer.from(encoded, "base64url")
    .toString("utf8")
    .split(".");
  const accessVersion = Number(version);
  if (
    !objectIdPattern.test(id) ||
    extra.length ||
    !Number.isSafeInteger(accessVersion) ||
    accessVersion < 1
  )
    return null;
  return { id, accessVersion };
}

export function getRecoveryUrl(id: string, accessVersion: number) {
  return `${getAppUrl()}/recover/${createRecoveryToken(id, accessVersion)}`;
}

export async function getRecoveryFromToken(token: string) {
  const claim = verifyRecoveryToken(token);
  if (!claim) return null;
  const recovery = await prisma.galleryRecovery.findUnique({
    where: { id: claim.id },
    include: { order: true, _count: { select: { assets: true } } },
  });
  if (
    !recovery ||
    recovery.status === "DRAFT" ||
    recovery.accessVersion !== claim.accessVersion
  )
    return null;
  return recovery;
}
