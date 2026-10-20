// Text helpers shared by retrieval and language detection.

export const STOPWORDS = new Set([
  // English
  'the', 'a', 'an', 'is', 'are', 'am', 'be', 'been', 'was', 'were', 'what', 'whats', 'which', 'who', 'whom',
  'how', 'many', 'much', 'for', 'i', 'my', 'me', 'we', 'our', 'you', 'your', 'can', 'could', 'do', 'does',
  'did', 'with', 'in', 'on', 'at', 'and', 'or', 'to', 'of', 'should', 'must', 'will', 'would', 'have', 'has',
  'get', 'any', 'if', 'than', 'not', 'this', 'that', 'these', 'those', 'from', 'up', 'by', 'as', 'into',
  'about', 'it', 'its', 'they', 'them', 'their', 'there', 'when', 'where', 'why', 'per', 'also', 'need',
  'tell', 'please', 'know', 'all', 'some',
  // French
  'le', 'la', 'les', 'des', 'du', 'de', 'un', 'une', 'est', 'sont', 'quel', 'quelle', 'quels', 'quelles',
  'combien', 'pour', 'je', 'mon', 'ma', 'mes', 'puis', 'peux', 'peut', 'avec', 'dans', 'sur', 'au', 'aux',
  'et', 'ou', 'qui', 'que', 'quoi', 'comment', 'nous', 'vous', 'il', 'elle', 'ce', 'cette', 'ces',
  'par', 'pas', 'ne', 'en', 'qu', 'dois', 'faut', 'leur', 'leurs', 'son', 'sa', 'ses', 'tout', 'tous',
  'toute', 'plus', 'moins', 'votre', 'vos', 'notre', 'nos', 'se', 'si', 'mais',
]);

/** Light plural folding so "claims" finds "claim" and "jours" finds "jour". */
export function stem(word) {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

export function tokenize(text) {
  return (String(text).toLowerCase().match(/[a-z0-9]+/g) || [])
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/** Make matching forgiving: people type "hebergement", "conge", "Quebec" without accents. */
export function normalizeQuery(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function queryTokens(question) {
  return tokenize(normalizeQuery(question));
}
