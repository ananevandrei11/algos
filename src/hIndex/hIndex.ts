export function hIndex(citations: number[]): number {
  const sorted = citations.sort((a,b) => b - a);
  let result = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i] > 0 && sorted[i] > result) {
      result++;
    } else {
      break;
    }
  }
  return result;
}
