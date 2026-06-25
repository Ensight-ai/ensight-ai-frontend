// Safety net for agent text.
//
// The backend now flattens Gemini's "thinking" content blocks to plain text,
// but messages saved before that fix were stored as the stringified block list
// (e.g. `[{'type': 'text', 'text': '...', 'thought_signature': '...'}]`). This
// repairs those when displaying, so the raw structure never reaches a visitor.

export function cleanAgentText(s: string | null | undefined): string {
  if (!s) return "";
  const t = s.trimStart();
  const looksLikeBlocks =
    (t.startsWith("[{") || t.startsWith("{'") || t.startsWith('{"')) &&
    /thought_signature|['"]type['"]\s*:\s*['"]text['"]/.test(s);
  if (!looksLikeBlocks) return s;

  // Pull every `'text': '...'` (or double-quoted) value out of the blob.
  const parts: string[] = [];
  for (const re of [
    /['"]text['"]\s*:\s*'((?:[^'\\]|\\.)*)'/g,
    /['"]text['"]\s*:\s*"((?:[^"\\]|\\.)*)"/g,
  ]) {
    for (const m of s.matchAll(re)) parts.push(m[1]);
  }
  if (parts.length === 0) return s;
  return parts
    .join("")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .trim();
}
