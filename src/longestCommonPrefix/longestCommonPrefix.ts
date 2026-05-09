export function longestCommonPrefix(strs: string[]): string {
  let result = '';
  const firstWord = strs[0];

  for (let i = 0; i < firstWord.length; i += 1) {
    const letter = firstWord[i];
    let matched = true;
    for (let j = 1; j < strs.length; j += 1) {
      if (letter !== strs[j][i]) {
        matched = false;
        break;
      }
    }
    if (!matched) break;
    result += letter;

  }
  return result;
}
