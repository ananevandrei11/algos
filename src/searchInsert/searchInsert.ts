export function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const pivot = Math.floor((left + right) / 2);
    const middle = nums[pivot];
    if (middle === target) {
      return pivot;
    }
    if (middle < target) {
      left = pivot + 1;
    } else {
      right = pivot - 1; 
    }
  }
  return Math.max(left, right);
}
