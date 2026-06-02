export function reverseBits(n: number): number {
  // SHORT DECISION
  // const twoBitN = n.toString(2).padStart(32, '0');
  // const reverseTwoBitN = twoBitN.split('').reverse().join('');
  // const res = Number.parseInt(reverseTwoBitN, 2);
  let binaryN: string = "";
  let carry = n;
  while (carry > 0) {
    const num = carry % 2;
    carry = Math.floor(carry / 2);
    binaryN = num.toString() + binaryN;
  }
  while (binaryN.length < 32) {
    binaryN = "0" + binaryN;
  }
  let res = 0;
  for (let i = 0; i < binaryN.length; i++) {
    const bit = parseInt(binaryN[i]);
    res += bit * Math.pow(2, i);
  }
  return res;
}
