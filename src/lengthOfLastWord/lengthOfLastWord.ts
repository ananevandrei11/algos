export function lengthOfLastWord(s: string): number {
  const word: string[] = [];
  const length = s.length - 1;

  for (let i = length; i >= 0; i -= 1) {
    if (i === length && s[i] === ' ' || s[i] === ' ' && word.length === 0) {
      continue;
    }
    if (s[i] === ' ' && s[i+1] !== ' ') {
      break;
    }
    word.unshift(s[i]);
  }
  return word.length;
}
