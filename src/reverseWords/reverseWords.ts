export function reverseWords(s: string): string {
  const sList: string[] = [];
  let count = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === ' ') {
      continue;
    }
    if (s[i] !== ' ') {
      const word = '';
      sList[count] = sList[count] === undefined ? word + s[i] : sList[count] + s[i];
    }
    if (s[i+1] === ' ') {
      count++;
    }
  }
  let result = '';
  for (let i = sList.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      result += sList[i];
    } else {
      result = result + sList[i] + ' ';
    }
  }
  return result;
}