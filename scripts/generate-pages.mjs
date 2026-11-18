#!/usr/bin/env node
// Usage: node scripts/generate-pages.mjs "Matt" "Aunt Jane"
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const names = process.argv.slice(2);
if (!names.length) {
  console.error('Usage: node scripts/generate-pages.mjs "Matt" "Aunt Jane"');
  process.exit(1);
}
// Set this when hosting somewhere other than the project's GitHub Pages URL.
const base = new URL(process.env.SITE_URL || 'https://romellem.github.io/secret-santa/');
if (!base.pathname.endsWith('/')) base.pathname += '/';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const temp = mkdtempSync(path.join(tmpdir(), 'santa-preview-'));
const renderer = path.join(temp, 'render');
try {
execFileSync('clang', ['-fobjc-arc', '-framework', 'AppKit', path.join(root, 'scripts', 'preview-image.m'), '-o', renderer], { stdio: 'inherit' });
for (const input of names) {
  const name = input.trim().replace(/^\p{L}/u, c => c.toLocaleUpperCase());
  const slug = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Cannot make a URL from ${JSON.stringify(input)}`);
  const dir = path.join(root, 'docs', 'n', slug);
  mkdirSync(dir, { recursive: true });
  execFileSync(renderer, [name, path.join(dir, 'preview.png')], { stdio: 'inherit' });
  const image = new URL(`n/${slug}/preview.png`, base).href;
  let html = readFileSync(path.join(root, 'docs', 'individual', 'index.html'), 'utf8');
  html = html.replace('<title>Secret Santa</title>', `<title>Secret Santa for ${escape(name)}</title><meta property="og:title" content="Secret Santa for ${escape(name)}"><meta property="og:description" content="A little holiday surprise is waiting for you."><meta property="og:type" content="website"><meta property="og:image" content="${escape(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">`);
  html = html.replaceAll('../styles.css', '../../styles.css').replaceAll('../vendor/', '../../vendor/').replaceAll('../js/', '../../js/');
  writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Created docs/n/${slug}/ for ${name}`);
}

} finally { rmSync(temp, { recursive: true, force: true }); }
