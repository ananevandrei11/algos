export function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  if (k === 0) return;

  const reverse = (nums: number[], left: number, right: number): void => {
    while (left < right) {
      let temp = nums[left];
      nums[left] = nums[right];
      nums[right] = temp;
      left++;
      right--;
    }
  }
  const n = nums.length - 1;
  reverse(nums, 0, n);
  reverse(nums, 0, k-1);
  reverse(nums, k, n);
}
