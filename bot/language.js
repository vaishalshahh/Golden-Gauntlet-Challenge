// Decides whether a question is English or French so Lumi can answer in kind.

import { normalizeQuery } from './text.js';

const FRENCH = new Set([
  'le', 'la', 'les', 'des', 'du', 'de', 'un', 'une', 'est', 'sont', 'quel', 'quelle', 'quels', 'quelles',
  'combien', 'pour', 'je', 'j', 'mon', 'ma', 'mes', 'puis', 'peux', 'peut', 'avec', 'dans', 'sur', 'au',
  'aux', 'et', 'ou', 'qui', 'que', 'quoi', 'comment', 'nous', 'vous', 'il', 'elle', 'ai', 'ce', 'cette',
  'ces', 'mais', 'par', 'pas', 'ne', 'apres', 'avant', 'dois', 'faut', 'bonjour', 'bonsoir', 'salut',
  'merci', 'quand', 'jours', 'mot', 'passe', 'votre', 'vos', 'mes', 'est-ce',
]);

const ENGLISH = new Set([
  'the', 'a', 'an', 'is', 'are', 'what', 'which', 'how', 'many', 'much', 'for', 'i', 'my', 'me', 'can', 'do',
  'does', 'with', 'in', 'on', 'at', 'and', 'or', 'who', 'when', 'where', 'to', 'of', 'should', 'must', 'hi',
  'hello', 'hey', 'thanks', 'after', 'before', 'there', 'it', 'long', 'am', 'allowed', 'days', 'your', 'get',
]);

export function detectLanguage(text) {
  const raw = String(text);
  const words = normalizeQuery(raw).toLowerCase().match(/[a-z]+/g) || [];
  let fr = 0;
  let en = 0;
  for (const w of words) {
    if (FRENCH.has(w)) fr++;
    if (ENGLISH.has(w)) en++;
  }
  if (/[àâçéèêëîïôûùüÿœ]/i.test(raw)) fr += 2;
  return fr > en ? 'fr' : 'en';
}
