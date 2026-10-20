// Independent language check for answers (deliberately separate from the bot's own detector).

const FRENCH = new Set([
  'le', 'la', 'les', 'des', 'du', 'de', 'un', 'une', 'est', 'sont', 'et', 'ou', 'pour', 'par', 'dans', 'sur',
  'au', 'aux', 'avec', 'vous', 'votre', 'vos', 'nous', 'ne', 'pas', 'que', 'qui', 'ont', 'droit', 'jours',
  'doivent', 'peuvent', 'avant', 'apres', 'après', 'jusqu', 'chaque', 'tous', 'toute', 'leurs', 'cette',
]);

const ENGLISH = new Set([
  'the', 'a', 'an', 'is', 'are', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'at', 'by', 'with', 'you', 'your',
  'must', 'may', 'be', 'every', 'per', 'days', 'after', 'before', 'up', 'not', 'can', 'all', 'receive',
]);

/** Returns 'en', 'fr' or 'unknown' for a piece of answer text. */
export function detectAnswerLanguage(text) {
  const words = String(text).toLowerCase().match(/[a-zàâçéèêëîïôûùüÿœ]+/g) || [];
  let fr = 0;
  let en = 0;
  for (const w of words) {
    if (FRENCH.has(w)) fr++;
    if (ENGLISH.has(w)) en++;
  }
  if (fr === en) return 'unknown';
  return fr > en ? 'fr' : 'en';
}
