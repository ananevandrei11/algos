export function longestConsecutive(nums: number[]): number {
  if (nums.length <= 1) {
    return nums.length;
  }
  const sortedNums = [...new Set(nums.sort((a, b) => a - b))];
  let res = 0;
  let temp = 0;
  for (let i = 0; i < sortedNums.length; i += 1) {
    const curr = sortedNums[i];
    const next = sortedNums[i + 1];
    if (next !== undefined && curr + 1 === next) {
      temp += 1;
      res = Math.max(res, temp);
    } else {
      temp += 1;
      res = Math.max(res, temp);
      temp = 0;
    }
  }
  return res;
}
