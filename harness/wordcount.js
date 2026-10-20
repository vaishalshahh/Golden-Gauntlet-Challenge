#!/usr/bin/env node
// Counts words the same way the AI Hub Portal does when you upload, so you know
// before submitting whether your EVALS.md fits.
//
//   npm run wordcount -- EVALS.md
//
// The portal splits on whitespace, so every "|" and "---" in a markdown table
// counts as a word. Text you type in the upload form's notes box counts too.

import { readFileSync } from 'node:fs';

const LIMIT = 2500;
const file = process.argv[2] || 'EVALS.md';

let text;
try {
  text = readFileSync(file, 'utf8').replace(/^﻿/, '');
} catch (err) {
  console.error(`\n✖ Could not read ${file}: ${err.message}\n`);
  process.exit(2);
}

const words = text.trim() ? text.trim().split(/\s+/).length : 0;
const tableTokens = text.trim().split(/\s+/).filter((w) => /^\|+$/.test(w) || /^\|?:?-{3,}/.test(w)).length;

console.log(`\n${file}: ${words.toLocaleString('en-US')} words (limit ${LIMIT.toLocaleString('en-US')})`);
console.log(`  of which table separators ("|", "---"): ${tableTokens.toLocaleString('en-US')}`);
if (words <= LIMIT) {
  console.log(`  ✓ Fits, with ${(LIMIT - words).toLocaleString('en-US')} words to spare (keep room for any upload notes).\n`);
} else {
  console.log(`  ✖ Over by ${(words - LIMIT).toLocaleString('en-US')} words. The portal will reject this upload.\n`);
}
