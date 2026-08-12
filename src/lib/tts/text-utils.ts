/** Strip HTML tags, collapse whitespace, and trim for clean speech output. */
export function normalizeForSpeech(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function questionOf(n: number, total: number): string {
  return `Question ${n} of ${total}.`;
}

export function optionOf(n: number, text: string): string {
  return `Option ${n}. ${text}`;
}

export function requiredText(): string {
  return "This field is required.";
}

/** Safe hash for cache keys (djb2) — not cryptographic. */
export function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}
