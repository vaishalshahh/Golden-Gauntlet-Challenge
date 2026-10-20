// Loads Northern Lumen's policy documents from /policies and splits them into passages.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const POLICY_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'policies');

const META_LINE = /^(ID|Language|Effective|Status|Owner|Replaces|Superseded by):\s*(.+)$/;
const COMMENT = /<!--\s*([\s\S]*?)\s*-->/g;

export function loadPolicies(dir = POLICY_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => parsePolicy(file, readFileSync(join(dir, file), 'utf8')));
}

export function parsePolicy(file, raw) {
  const meta = {};
  const notes = [];
  const passages = [];
  let title = '';
  let heading = '';

  // HTML comments are author notes, not policy text.
  const body = raw.replace(COMMENT, (_, text) => {
    notes.push(text.replace(/\s+/g, ' ').trim());
    return '';
  });

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('# ')) {
      title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      heading = line.slice(3).trim();
      continue;
    }
    const m = line.match(META_LINE);
    if (m) {
      meta[m[1].toLowerCase().replace(' ', '_')] = m[2].trim();
      continue;
    }
    passages.push({ text: line.replace(/^[-*]\s+/, '').replace(/\*\*/g, ''), heading, order: passages.length });
  }

  return {
    file,
    id: meta.id,
    language: meta.language,
    status: meta.status,
    effective: meta.effective,
    title,
    meta,
    notes,
    passages,
  };
}
