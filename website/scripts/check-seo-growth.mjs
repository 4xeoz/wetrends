import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

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

const expectedCredentialReferences = new Map([
  ['OpenAI - WeTrends SEO', ['openAiApi', 'Lrj5HIOGIlIosZun']],
  ['Tavily API', ['httpHeaderAuth', 'gfHlHQLfbKFj5Voi']],
  ['WeTrends Blog API', ['httpHeaderAuth', 'jNOBFrsMFwW2ovdd']],
  ['Google account', ['googleOAuth2Api', 'dsiuhHcD0Kq1Ahao']],
  ['Telegram account', ['telegramApi', '7jUWAXImCuClzxG5']],
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

  for (const node of workflow.nodes.filter((item) => item.credentials)) {
    for (const [credentialType, reference] of Object.entries(node.credentials)) {
      const expected = expectedCredentialReferences.get(reference.name);
      assert.ok(expected, `${filename}/${node.name} uses an unknown credential reference ${reference.name}`);
      assert.deepEqual(
        [credentialType, reference.id],
        expected,
        `${filename}/${node.name} credential ${reference.name} does not match the verified n8n record`,
      );
    }
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
const contentInventoryNode = contentWorkflow.nodes.find((node) => node.name === 'Fetch Content Inventory');
const duplicateGuardNode = contentWorkflow.nodes.find((node) => node.name === 'Duplicate Guard');
assert.ok(imageNode.parameters.jsonBody.includes('"gpt-image-2"'));
assert.ok(imageNode.parameters.jsonBody.includes('"medium"'));
assert.ok(imageNode.parameters.jsonBody.includes('"1536x1024"'));
assert.equal(queuedTopicNode.parameters.filters.conditions[0].keyValue, 'queued_london');
assert.ok(draftPackageNode.parameters.jsCode.includes(':topic:'), 'Drafts must retain their topic-row linkage');
assert.equal(contentInventoryNode.parameters.url, 'https://wetrends.co.uk/api/blog/inventory/');
assert.equal(contentInventoryNode.parameters.genericAuthType, 'httpHeaderAuth');
assert.ok(duplicateGuardNode.parameters.jsCode.includes('post.discoveryReady'));
assert.ok(duplicateGuardNode.parameters.jsCode.includes('top.containment >= 0.7'));
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
const openTopicQueueNode = topicPlanner.nodes.find((node) => node.name === 'Read Open London Topics');
const plannerBriefNode = topicPlanner.nodes.find((node) => node.name === 'Build Topic Planner Brief');
const plannerInventoryNode = topicPlanner.nodes.find((node) => node.name === 'Fetch Content Inventory');
assert.ok(topicParserNode.parameters.jsCode.includes("status: 'queued_london'"));
assert.equal(openTopicQueueNode.parameters.matchType, 'anyCondition');
assert.equal(openTopicQueueNode.parameters.returnAll, true);
assert.equal(openTopicQueueNode.alwaysOutputData, true);
assert.deepEqual(new Set(openTopicQueueNode.parameters.filters.conditions.map((condition) => condition.keyValue)), new Set(['queued_london', 'review_ready', 'quality_blocked']));
assert.equal(topicPlanner.nodes.find((node) => node.name === 'Insert Pending Topics').parameters.columns.value.status, 'queued_london');
assert.equal(plannerInventoryNode.parameters.url, 'https://wetrends.co.uk/api/blog/inventory/');
assert.equal(plannerInventoryNode.parameters.genericAuthType, 'httpHeaderAuth');
assert.ok(topicPlanner.nodes.find((node) => node.name === 'Confirm Topic Queue').parameters.text.includes('.replaceAll("&", "&amp;")'));
assert.equal(topicPlanner.connections['Read Search Opportunities'].main[0][0].node, 'Read Open London Topics');
assert.equal(topicPlanner.connections['Read Open London Topics'].main[0][0].node, 'Build Topic Planner Brief');
const plannerBrief = new Function('$', '$input', plannerBriefNode.parameters.jsCode)(
  (name) => ({ first: () => ({ json: name === 'Fetch Content Inventory' ? { posts: [{ title: 'Published topic', url: 'https://wetrends.co.uk/blogs/published-topic/', discoveryReady: false }] } : { rows: [{ keys: ['event photographer london', '/events/'], impressions: 80, position: 8.2 }] } }) }),
  { all: () => [{ json: { topic: 'Open London event guide', status: 'queued_london' } }] },
);
assert.match(plannerBrief[0].json.plannerPrompt, /OPEN LONDON TOPICS:\n- Open London event guide \[queued_london\]/);
assert.match(plannerBrief[0].json.plannerPrompt, /Published topic \| https:\/\/wetrends\.co\.uk\/blogs\/published-topic\//);
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
assert.ok(growthTelegramText.indexOf('.replaceAll("&", "&amp;")') < growthTelegramText.indexOf('.slice(0, 3150)'), 'Growth output must be escaped before the Telegram length cap');
assert.ok(
  growthWorkflow.nodes.find((node) => node.name === 'Build Weekly Growth Brief').parameters.jsCode.includes('hasGa4ReportShape'),
  'Growth reporting must not mistake disabled-node passthrough data for GA4 evidence',
);
assert.ok(
  growthWorkflow.nodes.find((node) => node.name === 'Build Weekly Growth Brief').parameters.jsCode.includes('hasPublishedAuditShape'),
  'Growth reporting must validate the published-content audit response',
);
const publishedAuditNode = growthWorkflow.nodes.find((node) => node.name === 'Audit Published Content');
const ga4Node = growthWorkflow.nodes.find((node) => node.name === 'GA4 Landing Pages');
assert.equal(publishedAuditNode.parameters.url, 'https://wetrends.co.uk/api/blog/audit/?limit=20');
assert.equal(publishedAuditNode.parameters.authentication, 'genericCredentialType');
assert.equal(publishedAuditNode.credentials.httpHeaderAuth.name, 'WeTrends Blog API');
assert.equal(growthWorkflow.connections['Check Photoshoots Page'].main[0][0].node, 'Audit Published Content');
assert.equal(growthWorkflow.connections['Audit Published Content'].main[0][0].node, 'Search Console 28-Day Report');
assert.equal(ga4Node.parameters.url, 'https://analyticsdata.googleapis.com/v1beta/properties/553107339:runReport');
assert.notEqual(ga4Node.disabled, true);
assert.equal(growthWorkflow.connections['Search Console 28-Day Report'].main[0][0].node, 'GA4 Landing Pages');
const growthBriefNode = growthWorkflow.nodes.find((node) => node.name === 'Build Weekly Growth Brief');
const gscPassthrough = { rows: [{ keys: ['event photographer london', '/events/'], clicks: 3, impressions: 80, ctr: 0.0375, position: 8.2 }] };
const growthBrief = new Function('$', growthBriefNode.parameters.jsCode)((name) => ({
  first: () => ({ json: name === 'Search Console 28-Day Report' || name === 'GA4 Landing Pages' ? gscPassthrough : { statusCode: 200 } }),
}));
assert.match(growthBrief[0].json.monitorPrompt, /GA4:\nNot configured or no valid GA4 runReport response/);
assert.equal(growthBrief[0].json.contentMode, 'AUDIT_UNAVAILABLE');

const createRoute = read('app/api/blog/route.ts');
const updateRoute = read('app/api/blog/[id]/route.ts');
const qualityRoute = read('app/api/blog/quality/route.ts');
const mediaRoute = read('app/api/blog/media/route.ts');
const inventoryRoute = read('app/api/blog/inventory/route.ts');
const publishedAuditRoute = read('app/api/blog/audit/route.ts');
const blogActions = read('actions/blog.ts');
const adminBlogPage = read('app/(auth)/(admin)/me/blog/page.tsx');
const homePage = read('app/(main)/page.tsx');
const llmIndexRoute = read('app/llms.txt/route.ts');
const automationState = read('lib/blog-automation-state.ts');
const automationStateJavaScript = ts.transpileModule(automationState, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const automationStateModule = await import(`data:text/javascript;base64,${Buffer.from(automationStateJavaScript).toString('base64')}`);
const {
  getAutomationTransitionError,
  getPublishedAutomationDisposition,
  isCreatableAutomationState,
} = automationStateModule;
const publishedAuditState = read('lib/published-content-audit.ts');
const publishedAuditJavaScript = ts.transpileModule(publishedAuditState, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const publishedAuditModule = await import(`data:text/javascript;base64,${Buffer.from(publishedAuditJavaScript).toString('base64')}`);
const blogQualitySource = read('lib/blog-quality.ts');
const blogQualityJavaScript = ts.transpileModule(blogQualitySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const blogQualityModule = await import(`data:text/javascript;base64,${Buffer.from(blogQualityJavaScript).toString('base64')}`);
const provider = read('components/providers/posthog-provider.tsx');
const posthogAnalytics = read('lib/analytics/posthog.ts');
const cloudinaryAdmin = read('lib/cloudinary-admin.ts');
const blogCover = read('app/_component/blogs/blog-cover.tsx');
const blogContent = read('lib/blog-content.ts');
const eventWork = read('app/(main)/events/work/page.tsx');
const privacyPage = read('app/(main)/privacy/page.tsx');
const sitemap = read('app/sitemap.ts');
const caseStudySource = read('lib/case-studies-data.ts');
const caseStudyJavaScript = ts.transpileModule(caseStudySource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const caseStudyModule = await import(`data:text/javascript;base64,${Buffer.from(caseStudyJavaScript).toString('base64')}`);

assert.match(createRoute, /New API posts must be created as drafts/);
assert.match(createRoute, /cannot start in an approved, rejected or published state/);
assert.match(createRoute, /evaluateBlogDraft/);
assert.match(updateRoute, /explicit approved status in this request/);
assert.match(updateRoute, /getAutomationTransitionError/);
assert.match(updateRoute, /getPublishedAutomationDisposition/);
assert.match(updateRoute, /Published posts are read-only through the automation API/);
assert.match(updateRoute, /idempotent: true/);
assert.match(updateRoute, /Published posts cannot be deleted through the automation API/);
assert.match(updateRoute, /const session = await auth\(\)/);
assert.match(automationState, /cannot unpublish an already-published post/);
assert.match(automationState, /Only a review-ready draft can be rejected/);
assert.match(automationState, /Only a review-ready draft can receive a regenerated cover/);
assert.match(updateRoute, /Draft no longer passes the publication quality gate/);
assert.match(qualityRoute, /validateApiKey/);
assert.match(mediaRoute, /validateApiKey/);
assert.match(inventoryRoute, /validateApiKey/);
assert.match(inventoryRoute, /where: \{ published: true \}/);
assert.match(inventoryRoute, /discoveryReady: Boolean/);
assert.match(inventoryRoute, /'Cache-Control': 'private, no-store'/);
assert.match(publishedAuditRoute, /validateApiKey/);
assert.match(publishedAuditRoute, /auditPublishedContent/);
assert.match(blogActions, /const discoveryReadyWhere/);
assert.match(blogActions, /automationStatus: 'published'/);
assert.match(blogActions, /qualityScore: \{ gte: 80 \}/);
assert.match(blogActions, /sourceUrls: \{ isEmpty: false \}/);
assert.match(blogActions, /Page retrieval must be read-only/);
assert.doesNotMatch(blogActions, /views:\s*\{\s*increment:/);
assert.match(adminBlogPage, /legacy opens/);
assert.match(adminBlogPage, /Use consented GA4 reporting for traffic decisions/);
assert.match(homePage, /getDiscoveryReadyPosts\(3\)/);
assert.match(llmIndexRoute, /getDiscoveryReadyPosts\(\)/);
assert.match(mediaRoute, /wetrends\/blog/);
assert.match(provider, /const CONSENT_KEY = "wetrends_analytics_consent"/);
assert.match(provider, /NEXT_PUBLIC_GA_MEASUREMENT_ID/);
assert.match(provider, /clearAnalyticsIdentifiers/);
assert.match(provider, /next === "denied"/);
assert.match(provider, /href="\/privacy\/"/);
assert.match(posthogAnalytics, /autocapture: false/);
assert.match(posthogAnalytics, /disable_session_recording: true/);
assert.match(posthogAnalytics, /capture_heatmaps: false/);
assert.match(posthogAnalytics, /capture_dead_clicks: false/);
assert.match(posthogAnalytics, /capture_performance: false/);
assert.match(posthogAnalytics, /capture_exceptions: false/);
assert.match(posthogAnalytics, /disable_surveys: true/);
assert.match(posthogAnalytics, /disable_product_tours: true/);
assert.match(cloudinaryAdmin, /const publicCredentials =/);
assert.match(cloudinaryAdmin, /const eventCredentials =/);
assert.match(cloudinaryAdmin, /A partial credential set must never be combined with another account/);
assert.match(cloudinaryAdmin, /publicCredentials\.cloudName && publicCredentials\.apiKey && publicCredentials\.apiSecret/);
assert.match(cloudinaryAdmin, /eventCredentials\.cloudName && eventCredentials\.apiKey && eventCredentials\.apiSecret/);
assert.match(blogCover, /isHero \? \(/);
assert.match(blogCover, /<h1 className=/);
assert.match(blogContent, /Drop the content's own <h1>; the page renders the post title/);
assert.match(privacyPage, /team@wetrends\.co\.uk/);
assert.match(privacyPage, /Google Analytics and PostHog/);
assert.match(privacyPage, /Information Commissioner/);
assert.match(sitemap, /\$\{baseUrl\}\/privacy\//);
assert.match(eventWork, /robots: \{ index: false, follow: true \}/);
assert.ok(fs.existsSync(path.join(websiteRoot, 'app/(main)/photoshoots/page.tsx')), 'Dedicated photoshoots page is missing');

assert.equal(isCreatableAutomationState('drafted'), true);
assert.equal(isCreatableAutomationState('quality_blocked'), true);
assert.equal(isCreatableAutomationState('review_ready'), true);
assert.equal(isCreatableAutomationState('approved'), false);
assert.equal(isCreatableAutomationState('rejected'), false);
assert.equal(isCreatableAutomationState('published'), false);
assert.equal(getAutomationTransitionError({ published: true, automationStatus: 'published' }, { published: false, automationStatus: 'rejected' })?.status, 409);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'drafted' }, { published: false, automationStatus: 'rejected' })?.status, 409);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'review_ready' }, { published: false, automationStatus: 'rejected' }), null);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'rejected' }, { published: false, automationStatus: 'rejected' }), null);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'drafted' }, { published: false, automationStatus: 'review_ready' })?.status, 409);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'review_ready' }, { published: false, automationStatus: 'review_ready' }), null);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'review_ready' }, { published: false, automationStatus: 'approved' })?.status, 400);
assert.equal(getAutomationTransitionError({ published: false, automationStatus: 'review_ready' }, { published: true, automationStatus: 'approved' }), null);
assert.equal(
  getPublishedAutomationDisposition(
    { published: false, automationStatus: 'review_ready' },
    { published: true, automationStatus: 'approved' },
  ),
  'mutable',
);
assert.equal(
  getPublishedAutomationDisposition(
    { published: true, automationStatus: 'published' },
    { published: true, automationStatus: 'approved' },
  ),
  'idempotent',
);
assert.equal(
  getPublishedAutomationDisposition(
    { published: true, automationStatus: 'published' },
    { published: true, automationStatus: 'approved', title: 'Mutated live title' },
  ),
  'blocked',
);

const repeatedQualitySentence = 'A useful production brief connects the audience, channel, constraints and measurable decision. ';
const qualityContent = `<h1>London event production planning</h1><p>Start with a clear outcome and use the <a href="https://wetrends.co.uk/events/">event production service</a> to shape the brief.</p>${[1, 2, 3, 4]
  .map((section) => `<h2>Planning section ${section}</h2><p>${repeatedQualitySentence.repeat(22)}</p>`)
  .join('')}`;
const validQualityDraft = {
  title: 'London Event Production Planning',
  slug: 'london-event-production-planning',
  excerpt: 'A practical way to build a focused event production brief.',
  content: qualityContent,
  featuredImage: 'https://res.cloudinary.com/example/image/upload/editorial.webp',
  featuredImageAlt: 'Editorial event production planning concept',
  featuredImageKind: 'ai_supporting',
  published: false,
  metaTitle: 'London Event Production Planning',
  metaDescription: 'Build a focused London event production brief around audience, assets and measurable decisions.',
  keywords: ['London event production'],
  campaign: 'events',
  contentType: 'guide',
  primaryServiceUrl: 'https://wetrends.co.uk/events/',
  sourceUrls: ['https://example.com/research'],
  automationStatus: 'drafted',
};
assert.equal(blogQualityModule.evaluateBlogDraft(validQualityDraft).pass, true);
assert.ok(
  blogQualityModule.evaluateBlogDraft({ ...validQualityDraft, content: `${qualityContent}<p>TODO: add client quote.</p>` }).issues.some((issue) => issue.code === 'placeholder_text'),
);
assert.ok(
  blogQualityModule.evaluateBlogDraft({ ...validQualityDraft, content: `${qualityContent}<p>Results improved by 40%.</p>` }).issues.some((issue) => issue.code === 'statistic_source_missing'),
);
assert.ok(
  blogQualityModule.evaluateBlogDraft({ ...validQualityDraft, content: `${qualityContent}<p>We helped a client increase sales.</p>` }).issues.some((issue) => issue.code === 'first_party_claim_review'),
);
assert.ok(
  !blogQualityModule.evaluateBlogDraft({ ...validQualityDraft, content: `${qualityContent}<p><a href="https://example.com/research">Research</a> reports a 40% change.</p>` }).issues.some((issue) => issue.code === 'statistic_source_missing'),
);
assert.equal(
  getPublishedAutomationDisposition(
    { published: true, automationStatus: 'published' },
    { featuredImage: 'https://example.com/replacement.webp' },
  ),
  'blocked',
);

const samplePublishedAudit = publishedAuditModule.auditPublishedContent([
  {
    id: 'legacy-1',
    title: 'Guaranteed 40% growth in Guildford',
    slug: 'guaranteed-growth-guildford',
    excerpt: 'An unsupported outcome.',
    content: '<h2>Claim</h2><p>Guaranteed growth.</p>',
    sourceUrls: [],
  },
]);
assert.equal(samplePublishedAudit.totalPublished, 1);
assert.equal(samplePublishedAudit.reviewRequired, 1);
assert.equal(samplePublishedAudit.riskCounts.claim_evidence_review, 1);
assert.equal(samplePublishedAudit.riskCounts.guildford_transition_review, 1);
assert.equal(samplePublishedAudit.riskCounts.invalid_h1_count, 1);

for (const study of caseStudyModule.caseStudies) {
  const hasAnyHeadlineMetricField = Boolean(study.metric || study.metricLabel || study.metricEvidence);
  if (hasAnyHeadlineMetricField) {
    assert.ok(study.metric, `${study.slug} has headline evidence but no metric`);
    assert.ok(study.metricLabel, `${study.slug} has a headline metric but no label`);
    assert.ok(study.metricEvidence?.window?.trim(), `${study.slug} headline metric needs a measurement window`);
    assert.ok(study.metricEvidence?.source?.trim(), `${study.slug} headline metric needs a traceable source`);
    if (/[+−-]?\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*[×x]/i.test(study.metric)) {
      assert.ok(study.metricEvidence?.baseline?.trim(), `${study.slug} relative headline metric needs a baseline`);
    }
  }

  for (const result of study.results) {
    assert.ok(result.window?.trim(), `${study.slug}/${result.label} needs a measurement window`);
    assert.ok(result.source?.trim(), `${study.slug}/${result.label} needs a traceable source`);
    if (/[+−-]?\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*[×x]/i.test(result.value)) {
      assert.ok(result.baseline?.trim(), `${study.slug}/${result.label} relative result needs a baseline`);
    }
  }

  if (study.testimonial) {
    assert.ok(study.testimonial.approvalReference?.trim(), `${study.slug} testimonial needs a client approval reference`);
  }
}

const highRiskPublicFiles = [
  'app/layout.tsx',
  'app/llms.txt/route.ts',
  'app/_component/home/blog-preview.tsx',
  'app/_component/home/case-studies.tsx',
  'app/_component/home/subHero.tsx',
  'app/_component/home/team.tsx',
  'app/_component/cinematography/booking-form.tsx',
  'app/_component/cinematography/hero.tsx',
  'app/_component/cinematography/packages.tsx',
  'app/(main)/blogs/page.tsx',
  'app/(main)/case-studies/page.tsx',
  'app/(main)/case-studies/[slug]/case-study-detail.tsx',
  'app/(main)/cinematography/page.tsx',
  'app/(main)/questions/questions-page.tsx',
  'app/(main)/services/[slug]/service-detail.tsx',
  'lib/case-studies-data.ts',
  'lib/faq-data.ts',
  'lib/site-profile.ts',
  'lib/team-data.ts',
];
for (const filename of highRiskPublicFiles) {
  const source = read(filename);
  assert.doesNotMatch(source, /based in Guildford|Guildford-based|Guildford studio|based in London|London-based|our London office|our London studio/i, `${filename} contains an unverified base claim`);
  assert.doesNotMatch(source, /\b(?:best|number one|#1|award[- ]winning|guarantee(?:d|s)?)\b|leading (?:creative|digital|agency)/i, `${filename} contains an unsupported superlative or guarantee`);
}

const teamData = read('lib/team-data.ts');
assert.doesNotMatch(teamData, /Fortune 500|Creative Review Top|D&AD|Ogilvy|Pentagram|BBC|Channel 4|Sunday Times|Droga5|Wieden\+Kennedy|Staff Pick|\b\d+\+\b|\b\d+%\b/i, 'Team profiles contain an unverified authority claim');
assert.doesNotMatch(teamData, /https:\/\/(?:www\.)?(?:linkedin|twitter)\.com\/(?:in\/)?(?:eddy|sarah|zack|meryem|ash|rebecca|jullia)\b/i, 'Team profiles contain placeholder social links');
const teamSection = read('app/_component/home/team.tsx');
assert.doesNotMatch(teamSection, />\s*(?:12|30\+|50\+)\s*</, 'Team section contains an unsupported numeric proof claim');
const homeServices = read('app/_component/home/services.tsx');
assert.doesNotMatch(homeServices, /\b(?:award[- ]winning|high[- ]converting|expert social media)\b/i, 'Homepage services contain unsupported authority or outcome language');
const homepageProofSource = [
  read('app/_component/home/blog-preview.tsx'),
  read('app/_component/home/case-studies.tsx'),
  read('app/_component/home/subHero.tsx'),
  homeServices,
].join('\n');
assert.doesNotMatch(
  homepageProofSource,
  /unstoppable growth|numbers that came out|expert tips|high[- ]converting|expert social media/i,
  'Homepage contains unsupported outcome or authority language',
);
const serviceDetail = read('app/(main)/services/[slug]/service-detail.tsx');
const publicProofSource = `${serviceDetail}\n${caseStudySource}`;
assert.doesNotMatch(
  publicProofSource,
  /TechStart UK|GreenLeaf Solutions|Surrey Wellness|Guildford Cafe Co|SaaS Co|FinanceHub UK|Sarah Mitchell|James Anderson|Emily Chen|Michael Brown|Lisa Park|David Wilson|Dr\. Marco Silva/i,
  'Public proof contains a placeholder testimonial identity',
);
assert.doesNotMatch(
  caseStudySource,
  /\+180%|\+320%|15k\+|admin time per patient|startup investment recovered|page three|97 PageSpeed|average parent rating/i,
  'Case studies contain a previously identified unsupported outcome claim',
);

console.log(`SEO/GEO growth contract passed: ${workflowFiles.length} workflows and website safety gates verified.`);
