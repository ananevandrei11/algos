export function singleNumber(nums: number[]): number {
  if (nums.length === 1) return nums[0];

  const map = new Map<number, number>();
  // const res = nums[0];
  for (let i = 0; i < nums.length; i += 1) {
    const is = map.get(nums[i]);
    if (is) {
      map.delete(nums[i]);
    } else {
      map.set(nums[i], 1);
    }
  }
  const res = [...map].flat();
  return res[0];
}
