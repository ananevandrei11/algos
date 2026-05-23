export function wordPattern(pattern: string, s: string): boolean {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i], w = words[i];
    if (charToWord.has(c) && charToWord.get(c) !== w) return false;
    if (wordToChar.has(w) && wordToChar.get(w) !== c) return false;
    charToWord.set(c, w);
    wordToChar.set(w, c);
  }
  return true;
}
