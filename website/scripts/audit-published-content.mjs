import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { PrismaClient } from '@prisma/client';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moduleSource = fs.readFileSync(path.join(websiteRoot, 'lib/published-content-audit.ts'), 'utf8');
const moduleJavaScript = ts.transpileModule(moduleSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { auditPublishedContent } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleJavaScript).toString('base64')}`
);

const prisma = new PrismaClient();

try {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      featuredImage: true,
      featuredImageAlt: true,
      featuredImageKind: true,
      metaTitle: true,
      metaDescription: true,
      campaign: true,
      contentType: true,
      primaryServiceUrl: true,
      sourceUrls: true,
      qualityScore: true,
      publishedAt: true,
    },
  });

  console.log(JSON.stringify(auditPublishedContent(posts), null, 2));
} finally {
  await prisma.$disconnect();
}
