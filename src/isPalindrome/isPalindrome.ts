export function isPalindrome(s: string): boolean {
  const line = s.replace(/[^A-Za-z0-9]/g, '').replace(/[A-Z]/g, (m) => m.toLowerCase());
  if (line.length <= 1) {
    return true;
  }
  let left = 0;
  let right = line.length - 1;
  let is = true;
  while (left < right || !is) {
    const first = line[left];
    const last = line[right];
    if (first === last) {
      left++;
      right--;
    } else {
      return false;
    }
  }
  return is;
}