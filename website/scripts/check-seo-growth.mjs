import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowDirectory = path.join(websiteRoot, 'automations', 'n8n');

const read = (relativePath) => fs.readFileSync(path.join(websiteRoot, relativePath), 'utf8');
const workflowFiles = fs.readdirSync(workflowDirectory).filter((filename) => filename.endsWith('.json')).sort();

assert.equal(workflowFiles.length, 5, 'Expected five independently deployable workflows');

const forbiddenSecrets = [
  /8687500307:[A-Za-z0-9_-]+/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\btvly-[A-Za-z0-9_-]{10,}\b/,
  /\bn8n_wt_[A-Za-z0-9_-]+\b/,
];

for (const filename of workflowFiles) {
  const source = fs.readFileSync(path.join(workflowDirectory, filename), 'utf8');
  const workflow = JSON.parse(source);
  const nodeNames = new Set(workflow.nodes.map((node) => node.name));

  assert.equal(workflow.active, false, `${filename} must import inactive`);
  assert.equal(nodeNames.size, workflow.nodes.length, `${filename} has duplicate node names`);
  assert.ok(workflow.nodes.length > 1, `${filename} is unexpectedly empty`);
  assert.ok(!forbiddenSecrets.some((pattern) => pattern.test(source)), `${filename} contains a secret-like value`);

  for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
    assert.ok(nodeNames.has(sourceName), `${filename} connection source ${sourceName} is missing`);
    for (const groups of Object.values(outputs)) {
      for (const group of groups) {
        for (const edge of group) assert.ok(nodeNames.has(edge.node), `${filename} connection target ${edge.node} is missing`);
      }
    }
  }

  for (const node of workflow.nodes.filter((item) => item.type === 'n8n-nodes-base.httpRequest')) {
    assert.ok(String(node.parameters.url).startsWith('https://') || String(node.parameters.url).startsWith('=https://'), `${filename}/${node.name} must use HTTPS`);
  }

  for (const node of workflow.nodes.filter((item) => item.type === 'n8n-nodes-base.code')) {
    assert.doesNotThrow(() => new Function(node.parameters.jsCode), `${filename}/${node.name} contains invalid JavaScript`);
  }

  if (filename !== 'wetrends-telegram-review-v3.json') {
    assert.ok(!source.includes('published: true'), `${filename} may not publish content`);
  }
}

const contentWorkflowSource = read('automations/n8n/wetrends-content-engine-v3.json');
const contentWorkflow = JSON.parse(contentWorkflowSource);
const imageNode = contentWorkflow.nodes.find((node) => node.name === 'Generate Medium Blog Cover');
assert.ok(imageNode.parameters.jsonBody.includes('"gpt-image-2"'));
assert.ok(imageNode.parameters.jsonBody.includes('"medium"'));
assert.ok(imageNode.parameters.jsonBody.includes('"1536x1024"'));
assert.match(contentWorkflowSource, /automationStatus: 'review_ready'/);
assert.match(contentWorkflowSource, /Nothing is public until you approve/);

const reviewWorkflowSource = read('automations/n8n/wetrends-telegram-review-v3.json');
assert.match(reviewWorkflowSource, /chatId === '6833948326'/);
assert.match(reviewWorkflowSource, /published: true/);
assert.ok(JSON.parse(reviewWorkflowSource).nodes.find((node) => node.name === 'Publish Approved Draft').parameters.jsonBody.includes('"approved"'));

const createRoute = read('app/api/blog/route.ts');
const updateRoute = read('app/api/blog/[id]/route.ts');
const qualityRoute = read('app/api/blog/quality/route.ts');
const mediaRoute = read('app/api/blog/media/route.ts');
const provider = read('components/providers/posthog-provider.tsx');
const eventWork = read('app/(main)/events/work/page.tsx');

assert.match(createRoute, /New API posts must be created as drafts/);
assert.match(createRoute, /evaluateBlogDraft/);
assert.match(updateRoute, /explicit approved status in this request/);
assert.match(updateRoute, /Draft no longer passes the publication quality gate/);
assert.match(qualityRoute, /validateApiKey/);
assert.match(mediaRoute, /validateApiKey/);
assert.match(mediaRoute, /wetrends\/blog/);
assert.match(provider, /const CONSENT_KEY = "wetrends_analytics_consent"/);
assert.match(provider, /NEXT_PUBLIC_GA_MEASUREMENT_ID/);
assert.match(eventWork, /robots: \{ index: false, follow: true \}/);
assert.ok(fs.existsSync(path.join(websiteRoot, 'app/(main)/photoshoots/page.tsx')), 'Dedicated photoshoots page is missing');

const highRiskPublicFiles = [
  'app/layout.tsx',
  'app/(main)/blogs/page.tsx',
  'app/(main)/case-studies/page.tsx',
  'app/(main)/services/[slug]/service-detail.tsx',
  'lib/faq-data.ts',
  'lib/site-profile.ts',
];
for (const filename of highRiskPublicFiles) {
  const source = read(filename);
  assert.doesNotMatch(source, /based in Guildford|Guildford-based|Guildford studio|based in London|London-based|our London office|our London studio/i, `${filename} contains an unverified base claim`);
  assert.doesNotMatch(source, /\b(?:best|number one|#1|award[- ]winning)\b|leading (?:creative|digital|agency)/i, `${filename} contains an unsupported superlative`);
}

console.log(`SEO/GEO growth contract passed: ${workflowFiles.length} workflows and website safety gates verified.`);
