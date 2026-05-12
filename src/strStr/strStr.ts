export function strStr(haystack: string, needle: string): number {
  if (needle.length === 0) return 0; // ← добавь это

  for (let i = 0; i < haystack.length; i += 1) {
    if (haystack[i] !== needle[0]) continue;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) break;
      if (j === needle.length - 1) return i;
    }
  }
  return -1;
};