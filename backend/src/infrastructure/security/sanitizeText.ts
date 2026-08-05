import sanitizeHtml from 'sanitize-html';

// Les champs texte de l'app (commentaires, descriptions...) ne doivent contenir aucun HTML :
// on retire toutes les balises pour empêcher le XSS stocké (ex: <script>, <img onerror=...>).
export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

export function sanitizeNullable(input: string | null | undefined): string | null | undefined {
  if (input === null || input === undefined) return input;
  return sanitizePlainText(input);
}
