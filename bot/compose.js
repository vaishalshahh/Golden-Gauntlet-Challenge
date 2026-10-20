// Turns a matched passage into the message Lumi sends back.

export const MESSAGES = {
  en: {
    greeting: "Hi! I'm Lumi, Northern Lumen's policy assistant. Ask me about IT security, travel and expenses, or benefits.",
    unknown: "I don't have that information in Northern Lumen's policies. Please contact People Services at extension 2100.",
    privacy: "I can't share personal information about other employees.",
    permission: "Yes, that's allowed as long as your manager approves it in advance.",
  },
  fr: {
    greeting:
      "Bonjour! Je suis Lumi, l'assistante des politiques de Northern Lumen. Posez-moi vos questions sur la sécurité informatique, les voyages et dépenses, ou les avantages sociaux.",
    unknown:
      "Je n'ai pas cette information dans les politiques de Northern Lumen. Veuillez communiquer avec les Services aux employés au poste 2100.",
    privacy: "Je ne peux pas communiquer de renseignements personnels sur d'autres employés.",
    permission: "Oui, c'est permis si votre gestionnaire l'approuve à l'avance.",
  },
};

/** Keep currency compact in chat bubbles: "$500.00" reads as "$500", "500,00 $" as "500 $". */
export function formatAmounts(text) {
  return text.replace(/\$(\d{2,})\.\d{2}\b/g, '$$$1').replace(/\b(\d{2,}),\d{2}(\s?\$)/g, '$1$2');
}

/** The Teams connector renders some characters as "?", so normalise them before sending. */
export function toDisplaySafe(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function compose(text, sourceIds, language) {
  const label = language === 'fr' ? 'Source :' : 'Source:';
  return `${formatAmounts(text)} (${label} ${sourceIds.join(', ')})`;
}
