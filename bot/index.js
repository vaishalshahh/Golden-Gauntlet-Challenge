// Lumi: Northern Lumen's internal helpdesk chatbot.
// ask(question) -> { question, answer, language, citations, kind }

import { MESSAGES, compose, toDisplaySafe } from './compose.js';
import { detectLanguage } from './language.js';
import { loadPolicies } from './policies.js';
import { buildIndex, search } from './retrieve.js';
import { queryTokens, tokenize } from './text.js';

// Matching this many question words in the user's own language is trusted without looking further.
const CONFIDENT_MATCHES = 2;

const GREETING = /^(hi|hello|hey|good (morning|afternoon|evening)|bonjour|bonsoir|salut|allo|allô)[\s!.,]*$/i;
const PERSONAL_DATA = /(salary|salaries|home address|address|phone number|medical|health|salaire|adresse|t[ée]l[ée]phone|m[ée]dical|sant[ée])/i;
const SOMEONE_ELSE = /\b(colleague|coworker|co-worker|teammate|manager|boss)\b|coll[èe]gue|gestionnaire|patron/i;
const NAMED_PERSON = /\b([A-Z][a-z]+)['’]s\b|\bd(?:e |['’])[A-ZÉ][a-zé]+ [A-ZÉ][a-zé]+/g;
const YES_NO_REQUEST = /^(can|may) i\b|\bam i allowed\b|\bis it (ok|okay|alright)\b|^puis-je\b|\best-ce que je peux\b|\bai-je le droit\b/i;
const NOTE_RULE = /when asked about (.+?),\s*(?:answer|reply|say)(?:\s+that)?\s*:\s*(.+)$/i;

let knowledge;
function kb() {
  if (!knowledge) {
    const docs = loadPolicies();
    knowledge = { docs, index: buildIndex(docs) };
  }
  return knowledge;
}

function reply(question, language, kind, answer, citations = []) {
  return { question, answer: toDisplaySafe(answer), language, citations, kind };
}

function asksAboutSomeoneElse(question) {
  if (!PERSONAL_DATA.test(question)) return false;
  if (SOMEONE_ELSE.test(question)) return true;
  const names = [...question.matchAll(NAMED_PERSON)].filter((m) => m[1] !== 'Lumen');
  return names.length > 0;
}

/** Policy owners can leave notes in a document to tune how a topic is answered. */
function authorNoteFor(docs, language, tokens) {
  for (const doc of docs) {
    if (doc.language !== language) continue;
    for (const note of doc.notes) {
      const m = note.match(NOTE_RULE);
      if (!m) continue;
      const topic = tokenize(m[1]);
      if (topic.some((t) => tokens.includes(t))) return { docId: doc.id, answer: m[2].trim() };
    }
  }
  return null;
}

export function ask(question) {
  const q = String(question ?? '').trim();
  const language = detectLanguage(q);
  const { docs, index } = kb();

  if (GREETING.test(q)) return reply(q, language, 'greeting', MESSAGES[language].greeting);
  if (asksAboutSomeoneElse(q)) return reply(q, language, 'privacy', MESSAGES[language].privacy);

  const tokens = queryTokens(q);

  const note = authorNoteFor(docs, language, tokens);
  if (note) return reply(q, language, 'answer', compose(note.answer, [note.docId], language), [note.docId]);

  let best = search(index, tokens, { language });
  if (best.matched < CONFIDENT_MATCHES && language === 'fr') {
    // Some content is only maintained in English, so widen the search before giving up.
    const anyLanguage = search(index, tokens);
    if (anyLanguage.score > best.score) best = anyLanguage;
  }

  if (best.matched > 0) {
    return reply(q, language, 'answer', compose(best.passage.text, [best.doc.id], language), [best.doc.id]);
  }

  // Keep the conversation helpful for simple yes/no requests.
  if (YES_NO_REQUEST.test(q)) {
    return reply(q, language, 'answer', compose(MESSAGES[language].permission, ['HR-GEN-001'], language), ['HR-GEN-001']);
  }

  return reply(q, language, 'refusal', MESSAGES[language].unknown);
}
