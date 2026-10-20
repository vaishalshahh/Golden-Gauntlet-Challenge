#!/usr/bin/env node
// Runs a golden set through Lumi and scores every answer.
//
//   npm run gauntlet -- golden/my.golden.json
//   npm run gauntlet -- golden/my.golden.json --out results.md
//   npm run gauntlet -- golden/my.golden.json --category privacy
//   npm run gauntlet -- golden/my.golden.json --strict    (exit code 1 if any case fails, for CI)

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ask } from '../bot/index.js';
import { CHECKS } from './checks.js';

function parseArgs(argv) {
  const opts = { file: null, out: null, category: null, strict: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') opts.out = argv[++i];
    else if (a === '--category') opts.category = argv[++i];
    else if (a === '--strict') opts.strict = true;
    else if (!opts.file) opts.file = a;
  }
  return opts;
}

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(2);
}

function loadGoldenSet(file) {
  let cases;
  try {
    // Strip the byte-order mark some Windows editors add, or JSON.parse rejects the file.
    cases = JSON.parse(readFileSync(resolve(file), 'utf8').replace(/^﻿/, ''));
  } catch (err) {
    fail(`Could not read ${file}: ${err.message}`);
  }
  if (!Array.isArray(cases)) fail('A golden set must be a JSON array of cases.');
  const seen = new Set();
  cases.forEach((c, i) => {
    const where = `case #${i + 1}${c && c.id ? ` (${c.id})` : ''}`;
    if (!c || typeof c !== 'object') fail(`${where} is not an object.`);
    if (!c.id) fail(`${where} needs an "id".`);
    if (seen.has(c.id)) fail(`Duplicate id "${c.id}".`);
    seen.add(c.id);
    if (!c.question) fail(`${where} needs a "question".`);
    if (!c.expect || typeof c.expect !== 'object' || !Object.keys(c.expect).length) {
      fail(`${where} needs an "expect" block with at least one check.`);
    }
    for (const name of Object.keys(c.expect)) {
      if (!CHECKS[name]) fail(`${where} uses unknown check "${name}". Available: ${Object.keys(CHECKS).join(', ')}`);
    }
  });
  return cases;
}

function runCase(c) {
  const result = ask(c.question);
  const failures = [];
  for (const [name, expected] of Object.entries(c.expect)) {
    try {
      const reason = CHECKS[name](expected, result.answer);
      if (reason) failures.push(`${name}: ${reason}`);
    } catch (err) {
      failures.push(`${name}: check could not run (${err.message}). Fix this case's "expect" value`);
    }
  }
  return { ...c, category: c.category || 'uncategorised', answer: result.answer, failures, passed: failures.length === 0 };
}

function summarise(results) {
  const byCategory = new Map();
  for (const r of results) {
    const s = byCategory.get(r.category) || { passed: 0, total: 0 };
    s.total++;
    if (r.passed) s.passed++;
    byCategory.set(r.category, s);
  }
  const passed = results.filter((r) => r.passed).length;
  return { byCategory, passed, total: results.length };
}

const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

function printConsole(results, summary) {
  console.log('');
  for (const r of results) {
    console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.id}  [${r.category}]  ${r.question}`);
    if (!r.passed) {
      console.log(`      Lumi: ${r.answer}`);
      for (const f of r.failures) console.log(`      ✖ ${f}`);
    }
  }
  console.log('\nBy category');
  for (const [cat, s] of summary.byCategory) {
    console.log(`  ${cat.padEnd(24)} ${String(s.passed).padStart(3)}/${String(s.total).padEnd(3)} ${pct(s.passed, s.total)}%`);
  }
  console.log(`\nOverall: ${summary.passed}/${summary.total} passed (${pct(summary.passed, summary.total)}%)\n`);
}

function toMarkdown(file, results, summary) {
  const lines = [
    `# Gauntlet results: ${file}`,
    '',
    `**Overall:** ${summary.passed}/${summary.total} passed (${pct(summary.passed, summary.total)}%)`,
    '',
    '| Category | Passed | Total | % |',
    '|---|---|---|---|',
    ...[...summary.byCategory].map(([cat, s]) => `| ${cell(cat)} | ${s.passed} | ${s.total} | ${pct(s.passed, s.total)}% |`),
    '',
    '| ID | Category | Result | Question | Lumi answered | Failed checks |',
    '|---|---|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${cell(r.id)} | ${cell(r.category)} | ${r.passed ? 'PASS' : 'FAIL'} | ${cell(r.question)} | ${cell(r.answer)} | ${cell(r.failures.join('; ') || 'none')} |`,
    ),
    '',
  ];
  return lines.join('\n');
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.file) fail('Usage: npm run gauntlet -- <golden-set.json> [--out results.md] [--category name] [--strict]');

let cases = loadGoldenSet(opts.file);
if (opts.category) cases = cases.filter((c) => (c.category || 'uncategorised') === opts.category);
if (!cases.length) fail('No cases to run.');

const results = cases.map(runCase);
const summary = summarise(results);
printConsole(results, summary);

if (opts.out) {
  writeFileSync(resolve(opts.out), toMarkdown(opts.file, results, summary), 'utf8');
  console.log(`Wrote ${opts.out}\n`);
}

// Failing cases are the expected outcome of a good golden set, so only --strict turns them into an error.
process.exit(opts.strict && summary.passed !== summary.total ? 1 : 0);
