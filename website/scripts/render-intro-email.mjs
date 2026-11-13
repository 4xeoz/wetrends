#!/usr/bin/env node
// Fill emails/intro-video-email.html for one recipient from lib/intro-recipients.json.
// Usage: node scripts/render-intro-email.mjs <slug> [--base https://wetrends.co.uk] [--out file.html] [--text]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
if (!slug) { console.error("usage: render-intro-email.mjs <slug> [--base URL] [--out file] [--text]"); process.exit(1); }

const data = JSON.parse(readFileSync(join(root, "lib/intro-recipients.json"), "utf8"));
const r = data.recipients.find((x) => x.slug === slug);
if (!r) { console.error(`no recipient "${slug}" in lib/intro-recipients.json`); process.exit(1); }
const base = (opt("base", "https://wetrends.co.uk")).replace(/\/$/, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pageUrl = `${base}/intro/${r.slug}/`;
const vars = {
  SUBJECT: r.subject, FIRST_NAME: r.firstName, BUSINESS: r.business, PERSONAL_LINE: r.personalLine, HEADLINE_ACCENT: r.headlineAccent, CLOSING_LINE: r.closingLine, DURATION: data.video.duration,
  PAGE_URL: pageUrl, THUMBNAIL_URL: `${base}${data.video.thumbnailPath}`,
  LOGO_URL: `${base}/images/email/wetrends-brand-mesh.png`,
  SENDER_NAME: data.sender.name, SENDER_ROLE: data.sender.role, SENDER_PHONE: data.sender.phone, SENDER_SITE: data.sender.site,
};

let out;
if (args.includes("--text")) {
  out = `Subject: ${r.subject}\n\nHi ${r.firstName},\n\n${r.personalLine}\n\nThe film runs for about ${data.video.duration} and is best with sound on:\n${pageUrl}\n\n${r.closingLine}\n\n${data.sender.name}\n${data.sender.role}\n${data.sender.phone ? data.sender.phone + "\n" : ""}${data.sender.site}\n`;
} else {
  out = readFileSync(join(root, "emails/intro-video-email.html"), "utf8")
    .replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, k, body) => (vars[k] ? body : ""))
    .replace(/\{\{(\w+)\}\}/g, (_, k) => { if (!(k in vars)) throw new Error(`unknown token {{${k}}}`); return esc(vars[k]); });
}
const file = opt("out");
if (file) { writeFileSync(file, out); console.error(`wrote ${file} (${Buffer.byteLength(out)} bytes)`); } else process.stdout.write(out);
