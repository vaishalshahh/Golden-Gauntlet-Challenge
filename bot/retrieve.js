// Finds the policy passage that best matches a question.

import { tokenize } from './text.js';

const isCurrent = (doc) => doc.status !== 'superseded';

export function buildIndex(docs) {
  const entries = docs.filter(isCurrent).flatMap((doc) =>
    doc.passages.map((passage) => ({
      doc,
      passage,
      tokens: new Set([...tokenize(passage.text), ...tokenize(passage.heading)]),
    })),
  );

  // Rare words ("deadline", "mileage") say more about a passage than common ones ("expense", "trip").
  const docFrequency = new Map();
  for (const entry of entries) for (const t of entry.tokens) docFrequency.set(t, (docFrequency.get(t) || 0) + 1);
  const weight = (t) => Math.log(1 + entries.length / docFrequency.get(t));

  return { entries, weight };
}

/** Passage with the highest weighted word overlap wins; earlier documents win ties. */
export function search(index, questionTokens, { language } = {}) {
  const wanted = [...new Set(questionTokens)];
  let best = { score: 0, matched: 0 };
  for (const entry of index.entries) {
    if (language && entry.doc.language !== language) continue;
    let score = 0;
    let matched = 0;
    for (const t of wanted) {
      if (!entry.tokens.has(t)) continue;
      score += index.weight(t);
      matched++;
    }
    if (score > best.score) best = { ...entry, score, matched };
  }
  return best;
}
