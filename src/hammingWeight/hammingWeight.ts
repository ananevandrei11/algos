export function hammingWeight(n: number): number {
  let binaryN: string = "";
  let carry = n;
  let count = 0;
  while (carry > 0) {
    const num = carry % 2;
    carry = Math.floor(carry / 2);
    binaryN = num.toString() + binaryN;
    if (num === 1) {
      count++;
    }
  }
  return count;
}
hammingWeight(11);