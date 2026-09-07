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

const supportedDataTableOperations = new Set([
  'insert',
  'get',
  'rowExists',
  'rowNotExists',
  'deleteRows',
  'update',
  'upsert',
]);

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

  for (const node of workflow.nodes.filter((item) => item.type === '@n8n/n8n-nodes-langchain.lmChatOpenAi')) {
    assert.ok(!Object.hasOwn(node.parameters.options || {}, 'temperature'), `${filename}/${node.name} must use Luna's default temperature`);
  }

  for (const node of workflow.nodes.filter((item) => item.type === 'n8n-nodes-base.telegram')) {
    assert.equal(node.parameters.additionalFields?.parse_mode, 'HTML', `${filename}/${node.name} must opt out of n8n's legacy Markdown fallback`);
    assert.equal(node.parameters.additionalFields?.appendAttribution, false, `${filename}/${node.name} must not append n8n attribution`);
  }

  for (const node of workflow.nodes.filter((item) => item.type === 'n8n-nodes-base.dataTable')) {
    assert.ok(supportedDataTableOperations.has(node.parameters.operation), `${filename}/${node.name} uses an unsupported Data Table operation`);
    for (const condition of node.parameters.filters?.conditions || []) {
      assert.ok(condition.keyName, `${filename}/${node.name} has a Data Table condition without a column`);
      assert.ok(condition.condition, `${filename}/${node.name} has a Data Table condition without an operator`);
    }
  }

  if (filename !== 'wetrends-telegram-review-v3.json') {
    assert.ok(!source.includes('published: true'), `${filename} may not publish content`);
  }
}

const contentWorkflowSource = read('automations/n8n/wetrends-content-engine-v3.json');
const contentWorkflow = JSON.parse(contentWorkflowSource);
const imageNode = contentWorkflow.nodes.find((node) => node.name === 'Generate Medium Blog Cover');
const queuedTopicNode = contentWorkflow.nodes.find((node) => node.name === 'Get Next Pending Topic');
const draftPackageNode = contentWorkflow.nodes.find((node) => node.name === 'Build Draft Package');
assert.ok(imageNode.parameters.jsonBody.includes('"gpt-image-2"'));
assert.ok(imageNode.parameters.jsonBody.includes('"medium"'));
assert.ok(imageNode.parameters.jsonBody.includes('"1536x1024"'));
assert.equal(queuedTopicNode.parameters.filters.conditions[0].keyValue, 'queued_london');
assert.ok(draftPackageNode.parameters.jsCode.includes(':topic:'), 'Drafts must retain their topic-row linkage');
assert.match(contentWorkflowSource, /automationStatus: 'review_ready'/);
assert.match(contentWorkflowSource, /Nothing is public until you approve/);

const contentTelegramNamesWithExternalText = new Set([
  'Send Draft Review to Telegram',
  'Send Quality Block to Telegram',
]);
for (const node of contentWorkflow.nodes.filter((item) => contentTelegramNamesWithExternalText.has(item.name))) {
  assert.ok(node.parameters.text.includes('.replaceAll("&", "&amp;")'), `${node.name} must HTML-escape external text`);
}
const qualityBlockText = contentWorkflow.nodes.find((node) => node.name === 'Send Quality Block to Telegram').parameters.text;
assert.ok(qualityBlockText.indexOf('.replaceAll("&", "&amp;")') < qualityBlockText.indexOf('.slice(0, 1800)'), 'Quality issues must be escaped before the Telegram length cap');

const reviewWorkflowSource = read('automations/n8n/wetrends-telegram-review-v3.json');
const reviewWorkflow = JSON.parse(reviewWorkflowSource);
assert.match(reviewWorkflowSource, /chatId === '6833948326'/);
assert.match(reviewWorkflowSource, /published: true/);
assert.ok(reviewWorkflow.nodes.find((node) => node.name === 'Publish Approved Draft').parameters.jsonBody.includes('"approved"'));
for (const nodeName of ['Confirm Publication', 'Confirm Rejection', 'Send Regenerated Cover']) {
  const node = reviewWorkflow.nodes.find((item) => item.name === nodeName);
  assert.ok(node.parameters.text.includes('.replaceAll("&", "&amp;")'), `${nodeName} must HTML-escape external text`);
}
const publishedTopicSync = reviewWorkflow.nodes.find((node) => node.name === 'Sync Published Topic Status');
const rejectedTopicSync = reviewWorkflow.nodes.find((node) => node.name === 'Sync Rejected Topic Status');
assert.equal(publishedTopicSync.parameters.columns.value.status, 'published');
assert.ok(publishedTopicSync.parameters.columns.value.published_url.includes('post.slug'));
assert.equal(publishedTopicSync.parameters.filters.conditions[0].keyName, 'id');
assert.equal(publishedTopicSync.onError, 'continueRegularOutput');
assert.equal(rejectedTopicSync.parameters.columns.value.status, 'rejected');
assert.equal(rejectedTopicSync.parameters.filters.conditions[0].keyName, 'id');
assert.equal(rejectedTopicSync.onError, 'continueRegularOutput');
assert.deepEqual(
  new Set(reviewWorkflow.connections['Publish Approved Draft'].main[0].map((edge) => edge.node)),
  new Set(['Confirm Publication', 'Sync Published Topic Status']),
  'Publication confirmation and topic sync must be independent branches',
);
assert.deepEqual(
  new Set(reviewWorkflow.connections['Reject Draft'].main[0].map((edge) => edge.node)),
  new Set(['Confirm Rejection', 'Sync Rejected Topic Status']),
  'Rejection confirmation and topic sync must be independent branches',
);

const topicPlanner = JSON.parse(read('automations/n8n/wetrends-topic-planner-v1.json'));
const topicParserNode = topicPlanner.nodes.find((node) => node.name === 'Validate Topic Plan');
assert.ok(topicParserNode.parameters.jsCode.includes("status: 'queued_london'"));
assert.equal(topicPlanner.nodes.find((node) => node.name === 'Insert Pending Topics').parameters.columns.value.status, 'queued_london');
assert.ok(topicPlanner.nodes.find((node) => node.name === 'Confirm Topic Queue').parameters.text.includes('.replaceAll("&", "&amp;")'));
const parsedTopics = new Function('$input', topicParserNode.parameters.jsCode)({
  first: () => ({
    json: {
      text: JSON.stringify([
        { topic: 'London event topic', keywords: 'event', icp_angle: 'buyers', intent: 'commercial' },
        { topic: 'London photoshoot topic', keywords: 'photoshoot', icp_angle: 'teams', intent: 'commercial' },
        { topic: 'London agency topic', keywords: 'agency', icp_angle: 'founders', intent: 'commercial' },
      ]),
    },
  }),
});
assert.deepEqual(parsedTopics.map((item) => item.json.status), ['queued_london', 'queued_london', 'queued_london']);

const authorityWorkflowSource = read('automations/n8n/wetrends-authority-scout-v1.json');
const growthWorkflowSource = read('automations/n8n/wetrends-growth-monitor-v1.json');
const authorityWorkflow = JSON.parse(authorityWorkflowSource);
const growthWorkflow = JSON.parse(growthWorkflowSource);
const authorityTelegramText = authorityWorkflow.nodes.find((node) => node.name === 'Send Authority Review Queue').parameters.text;
const growthTelegramText = growthWorkflow.nodes.find((node) => node.name === 'Send Weekly Growth Report').parameters.text;
assert.ok(authorityTelegramText.includes('.replaceAll("&", "&amp;")'));
assert.ok(growthTelegramText.includes('.replaceAll("&", "&amp;")'));
assert.ok(authorityTelegramText.indexOf('.replaceAll("&", "&amp;")') < authorityTelegramText.indexOf('.slice(0, 3200)'), 'Authority output must be escaped before the Telegram length cap');
assert.ok(growthTelegramText.indexOf('.replaceAll("&", "&amp;")') < growthTelegramText.indexOf('.slice(0, 3200)'), 'Growth output must be escaped before the Telegram length cap');
assert.ok(
  growthWorkflow.nodes.find((node) => node.name === 'Build Weekly Growth Brief').parameters.jsCode.includes('hasGa4ReportShape'),
  'Growth reporting must not mistake disabled-node passthrough data for GA4 evidence',
);
const growthBriefNode = growthWorkflow.nodes.find((node) => node.name === 'Build Weekly Growth Brief');
const gscPassthrough = { rows: [{ keys: ['event photographer london', '/events/'], clicks: 3, impressions: 80, ctr: 0.0375, position: 8.2 }] };
const growthBrief = new Function('$', growthBriefNode.parameters.jsCode)((name) => ({
  first: () => ({ json: name === 'Search Console 28-Day Report' || name === 'GA4 Landing Pages — Configure Property ID' ? gscPassthrough : { statusCode: 200 } }),
}));
assert.match(growthBrief[0].json.monitorPrompt, /GA4:\nNot configured or no valid GA4 runReport response/);

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
