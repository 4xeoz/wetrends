const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { hasLocalMatch } = require('next/dist/shared/lib/match-local-pattern');
const { hasRemoteMatch } = require('next/dist/shared/lib/match-remote-pattern');

const root = path.resolve(__dirname, '..');
const compiled = ts.transpileModule(fs.readFileSync(path.join(root, 'next.config.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const configModule = {};
new Function('exports', 'require', compiled.outputText)(configModule, require);
const images = configModule.default.images;

function rasterFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? rasterFiles(filename) : /\.(png|jpe?g|webp|gif|avif)$/i.test(entry.name) ? [filename] : [];
  });
}

const publicRoot = path.join(root, 'public');
const files = rasterFiles(publicRoot);
assert.ok(files.length > 0, 'Public image inventory must not be empty');
for (const filename of files) {
  const url = '/' + path.relative(publicRoot, filename).split(path.sep).join('/');
  assert.ok(hasLocalMatch(images.localPatterns, url), `Public image rejected: ${url}`);
}
assert.ok(hasLocalMatch(images.localPatterns, '/images/events-mesh-light.png?v=brand-magenta'));
assert.ok(hasLocalMatch(images.localPatterns, '/_next/static/media/photo.123.png'));

for (const url of [
  '/api/recovery/private-token/assets/photo',
  '/api/recovery/private-token/assets/photo?download=1',
  '/api/admin/recoveries/recovery/assets/photo',
  '/images/../api/recovery/private-token/assets/photo',
  '/images/%2e%2e/api/recovery/private-token/assets/photo',
]) {
  assert.equal(hasLocalMatch(images.localPatterns, url), false, `Private source allowed: ${url}`);
}
for (const hostname of ['wetrends.co.uk', 'www.wetrends.co.uk', '127.0.0.1']) {
  assert.equal(hasRemoteMatch([], images.remotePatterns, new URL(`https://${hostname}/api/recovery/private-token/assets/photo`)), false);
}
for (const hostname of ['images.unsplash.com', 'res.cloudinary.com']) {
  assert.ok(hasRemoteMatch([], images.remotePatterns, new URL(`https://${hostname}/photo.jpg`)));
}
console.log(JSON.stringify({ passed: true, publicRasterImages: files.length, privateLocalAndRemoteSources: 'blocked' }));
