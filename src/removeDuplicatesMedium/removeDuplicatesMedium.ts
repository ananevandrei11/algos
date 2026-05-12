export function removeDuplicatesMedium(nums: number[]): number {
  let k = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] !== nums[k-2]) {
      nums[k] = nums[i]
      k += 1;
    } else {
      
    }
  }
  return k;
}
