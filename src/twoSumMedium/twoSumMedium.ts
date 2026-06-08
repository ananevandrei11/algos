export function twoSumMedium(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const curr = numbers[i];
    for (let j = i+1; j < numbers.length; j++) {
      const currNext = numbers[j];
      const sum = curr + currNext;
      if (sum === target) {
        return [i+1, j+1];
      }
    }
  }
  return [];
}
