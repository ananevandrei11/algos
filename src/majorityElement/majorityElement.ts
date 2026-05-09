export function majorityElement(nums: number[]): number {
  if (nums.length === 1) {
    return nums[0];
  }

  let candidate = nums[0];
  let count = 1;
  for (let i = 0; i < nums.length; i += 1) {
    const curr = nums[i];
    if (candidate === curr) {
      count += 1;
    } else {
      count -= 1;
      if (count === 0) {
        candidate = curr;
        count = 1;
      }
    }
  }
  return candidate;
}
