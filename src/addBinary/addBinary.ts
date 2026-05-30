export function addBinary(a: string, b: string): string {
  if (a === "0" && b === "0") {
    return "0";
  }
  let aLength = a.length - 1;
  let bLength = b.length - 1;
  let carry = 0;
  let ab = "";

  while (aLength >= 0 || bLength >= 0 || carry > 0) {
    const sum =
      (aLength >= 0 ? Number(a[aLength]) : 0) +
      (bLength >= 0 ? Number(b[bLength]) : 0) +
      carry;
    const result = sum % 2;
    carry = Math.floor(sum / 2);
    ab = result + ab;
    aLength--;
    bLength--;
  }

  return ab;
}
