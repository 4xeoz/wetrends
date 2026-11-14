import { createHmac, timingSafeEqual } from "node:crypto";

const idPattern = /^[a-f\d]{24}$/i;

function signature(encoded: string, secret: string) {
  if (secret.length < 32) throw new Error("Meeting link secret is not configured");
  return createHmac("sha256", secret).update(`meeting-invitation:${encoded}`).digest("base64url");
}

export function createMeetingInvitationToken(id: string, accessVersion: number, secret: string) {
  if (!idPattern.test(id) || !Number.isSafeInteger(accessVersion) || accessVersion < 1) {
    throw new Error("Invalid meeting invitation reference");
  }
  const encoded = Buffer.from(`${id}.${accessVersion}`).toString("base64url");
  return `${encoded}.${signature(encoded, secret)}`;
}

export function verifyMeetingInvitationToken(token: string, secret: string) {
  if (token.length > 256) return null;
  const [encoded, provided, ...extra] = token.split(".");
  if (!encoded || !provided || extra.length) return null;
  const expected = Buffer.from(signature(encoded, secret));
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const [id, version, ...remaining] = Buffer.from(encoded, "base64url").toString("utf8").split(".");
  const accessVersion = Number(version);
  if (!idPattern.test(id) || remaining.length || !Number.isSafeInteger(accessVersion) || accessVersion < 1) return null;
  return { id, accessVersion };
}
