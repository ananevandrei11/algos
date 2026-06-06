export function plusOne(digits: number[]): number[] {
  const length = digits.length - 1;
  for (let i = length; i >= 0; i -= 1) {
    const curr = digits[i];
    if (curr < 9) {
      digits[i] = curr + 1;
      return digits;
    } else if (curr === 9) {
      digits[i] = 0;
    }
  }
  digits.unshift(1);
  return digits;
}

