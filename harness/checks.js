// Checks a golden-set case can use in its "expect" block.
//
// Each check receives (expectedValue, answer) and returns null when it passes,
// or a short human-readable reason when it fails.
//
// Want a check that isn't here? Add it to CHECKS; that is part of designing your
// scoring rules. Describe any custom check in Part 2 of your EVALS.md.

import { detectAnswerLanguage } from './language.js';

const CITATION = /\((?:Sources?)\s?:\s*([^)]*)\)\s*$/;

const UNKNOWN_PREFIXES = ["I don't have that information", "Je n'ai pas cette information"];

/** Source IDs Lumi cited, e.g. ["TRV-2026"]. */
export function citationsOf(answer) {
  const m = String(answer).match(CITATION);
  return m ? m[1].split(/\s*,\s*/).map((s) => s.trim()).filter(Boolean) : [];
}

/** The answer text without its trailing citation. */
export function bodyOf(answer) {
  return String(answer).replace(CITATION, '').trim();
}

function sentenceCount(text) {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim()).length;
}

const quote = (s) => `"${s}"`;
const asList = (v) => (Array.isArray(v) ? v : [v]);

export const CHECKS = {
  /** Answer must be exactly this string (accents and punctuation included). */
  equals: (expected, answer) => (answer === expected ? null : `expected exactly ${quote(expected)}`),

  /** Every listed snippet must appear (case-insensitive, accent-sensitive). */
  mustInclude: (snippets, answer) => {
    const text = answer.toLowerCase();
    const missing = asList(snippets).filter((s) => !text.includes(String(s).toLowerCase()));
    return missing.length ? `missing ${missing.map(quote).join(', ')}` : null;
  },

  /** None of the listed snippets may appear (case-insensitive, accent-sensitive). */
  mustNotInclude: (snippets, answer) => {
    const text = answer.toLowerCase();
    const found = asList(snippets).filter((s) => text.includes(String(s).toLowerCase()));
    return found.length ? `should not contain ${found.map(quote).join(', ')}` : null;
  },

  /** Every listed source ID must be cited. */
  mustCite: (ids, answer) => {
    const cited = citationsOf(answer);
    const missing = asList(ids).filter((id) => !cited.includes(id));
    return missing.length ? `did not cite ${missing.join(', ')} (cited: ${cited.join(', ') || 'nothing'})` : null;
  },

  /** None of the listed source IDs may be cited. */
  mustNotCite: (ids, answer) => {
    const cited = citationsOf(answer);
    const bad = asList(ids).filter((id) => cited.includes(id));
    return bad.length ? `should not cite ${bad.join(', ')}` : null;
  },

  /** true: the answer must carry no citation at all. */
  citesNothing: (flag, answer) => {
    const cited = citationsOf(answer);
    if (flag && cited.length) return `cited ${cited.join(', ')} but should cite nothing`;
    if (!flag && !cited.length) return 'expected a citation';
    return null;
  },

  /** true: must be the "I don't have that information" refusal. false: must NOT be. */
  refuse: (flag, answer) => {
    const refused = UNKNOWN_PREFIXES.some((p) => answer.startsWith(p));
    if (flag === refused) return null;
    return flag ? 'expected the "I don\'t have that information" refusal' : 'refused, but an answer was expected';
  },

  /** 'en' or 'fr': the answer body must be written in this language. */
  language: (lang, answer) => {
    const got = detectAnswerLanguage(bodyOf(answer));
    return got === lang ? null : `answered in ${got}, expected ${lang}`;
  },

  /** Maximum number of sentences, not counting the citation. */
  maxSentences: (max, answer) => {
    const n = sentenceCount(bodyOf(answer));
    return n <= max ? null : `${n} sentences (max ${max})`;
  },

  /** Answer must match this regular expression (case-insensitive). */
  matches: (pattern, answer) => (new RegExp(pattern, 'i').test(answer) ? null : `does not match /${pattern}/`),

  /** Answer must NOT match this regular expression (case-insensitive). */
  notMatches: (pattern, answer) => (new RegExp(pattern, 'i').test(answer) ? `matches /${pattern}/` : null),
};
