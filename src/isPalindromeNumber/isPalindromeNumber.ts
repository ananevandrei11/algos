export function isPalindromeNumber(x: number): boolean {
  const arrNums = x.toString().split('');
  let left = 0;
  let right = arrNums.length - 1;

  while (left < right) {
    if (arrNums[left] !== arrNums[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}
isPalindromeNumber(121);