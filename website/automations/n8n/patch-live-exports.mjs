import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [contentPath, plannerPath, exceptionsPath, outputDirectory] = process.argv.slice(2);
if (![contentPath, plannerPath, exceptionsPath, outputDirectory].every(Boolean)) {
  throw new Error('Usage: node patch-live-exports.mjs <content.json> <planner.json> <exceptions.json> <output-directory>');
}

const canonicalDirectory = path.dirname(fileURLToPath(import.meta.url));
const load = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'));
const content = load(contentPath);
const planner = load(plannerPath);
const exceptions = load(exceptionsPath);
const canonicalContent = load(path.join(canonicalDirectory, 'wetrends-content-engine-v3.json'));
const canonicalExceptions = load(path.join(canonicalDirectory, 'wetrends-telegram-review-v3.json'));

const oldTail = new Set([
  'Mark Topic Review Ready', 'Prepare Review-Ready Draft1',
  '- Create Review-Ready Draft1', 'Send Draft Review to Telegram1', 'Safety Contract',
]);
for (const name of oldTail) {
  if (content.nodes.filter((node) => node.name === name).length !== 1) {
    throw new Error(`Expected exactly one live Content Engine node named ${name}`);
  }
}
if (content.connections['Normalise Final Draft']?.main?.[0]?.[0]?.node !== 'Prepare Review-Ready Draft1') {
  throw new Error('The live draft handoff has changed; refusing to replace its graph.');
}
const slugNode = content.nodes.find((node) => node.name === 'Build Draft Package');
const brokenSlug = ".replace(/^-|-$/g, '').slice(0, 90);";
if (!slugNode?.parameters?.jsCode?.includes(brokenSlug)) {
  throw new Error('The live slug code has changed; inspect it before patching.');
}
slugNode.parameters.jsCode = slugNode.parameters.jsCode.replace(
  brokenSlug,
  ".replace(/^-|-$/g, '').slice(0, 90).replace(/-+$/g, '');\n  if (!slug) throw new Error('Topic did not produce a URL-safe slug.');",
);

const newTail = new Set([
  'Check Draft Quality', 'Quality Pass?', 'Prepare Review-Ready Draft',
  'Create Review-Ready Draft', 'Publish Automatic Draft', 'Publication Succeeded?',
  'Mark Topic Published', 'Confirm Automatic Publication', 'Report Publication Failure',
  'Prepare Quality-Blocked Draft', 'Create Quality-Blocked Draft',
  'Mark Topic Quality Blocked', 'Send Quality Block to Telegram', 'Safety Contract',
]);
const replacementNodes = canonicalContent.nodes.filter((node) => newTail.has(node.name));
if (replacementNodes.length !== newTail.size) throw new Error('The canonical automatic branch is incomplete.');
content.nodes = [...content.nodes.filter((node) => !oldTail.has(node.name)), ...replacementNodes];
for (const name of ['Normalise Final Draft', ...oldTail]) delete content.connections[name];
for (const [name, edges] of Object.entries(canonicalContent.connections)) {
  if (name === 'Normalise Final Draft' || newTail.has(name)) content.connections[name] = edges;
}

const topicScoring = planner.nodes.find((node) => node.name === 'Score and Select Topic Candidates');
const oldDigestLine = '2. It creates a private draft and sends it to Telegram for review.';
const oldCommandsLine = '3. Use the commands in the draft message: <code>/approve ID</code>, <code>/regenerate ID</code> or <code>/reject ID</code>.';
if (!topicScoring?.parameters?.jsCode?.includes(oldDigestLine) || !topicScoring.parameters.jsCode.includes(oldCommandsLine)) {
  throw new Error('The live Topic Discovery digest changed; inspect it before patching.');
}
topicScoring.parameters.jsCode = topicScoring.parameters.jsCode
  .replace(oldDigestLine, '2. It publishes the article if the website quality check passes; otherwise the draft stays private.')
  .replace(oldCommandsLine, '3. Telegram reports the result. Manual commands remain available for private exceptions.');
const plannerNote = planner.nodes.find((node) => node.name === 'Topic Discovery Setup Notes');
if (!plannerNote?.parameters?.content?.includes('creates the reviewed drafts')) {
  throw new Error('The live Topic Discovery setup note changed; inspect it before patching.');
}
plannerNote.parameters.content = plannerNote.parameters.content.replace(
  'creates the reviewed drafts', 'publishes only drafts that pass the website quality check',
);

const liveContract = exceptions.nodes.find((node) => node.name === 'Approval Contract');
const canonicalContract = canonicalExceptions.nodes.find((node) => node.name === 'Approval Contract');
if (!liveContract || !canonicalContract) throw new Error('The exception contract note is missing.');
liveContract.parameters.content = canonicalContract.parameters.content;

function verifyGraph(label, workflow) {
  const names = new Set(workflow.nodes.map((node) => node.name));
  if (names.size !== workflow.nodes.length) throw new Error(`${label} has duplicate node names.`);
  const ids = new Set(workflow.nodes.map((node) => node.id));
  if (ids.size !== workflow.nodes.length) throw new Error(`${label} has duplicate node IDs.`);
  for (const [source, outputs] of Object.entries(workflow.connections)) {
    if (!names.has(source)) throw new Error(`${label} has a missing source node: ${source}`);
    for (const groups of Object.values(outputs)) {
      for (const group of groups) {
        for (const edge of group) if (!names.has(edge.node)) throw new Error(`${label} has a missing destination node: ${edge.node}`);
      }
    }
  }
}

const outputs = [
  ['content-engine-auto-publish.json', content],
  ['topic-planner-auto-publish.json', planner],
  ['telegram-exceptions.json', exceptions],
];
for (const [filename, workflow] of outputs) {
  verifyGraph(filename, workflow);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(workflow, null, 2)}\n`);
  console.log(`${filename}: ${workflow.nodes.length} nodes, graph valid`);
}
