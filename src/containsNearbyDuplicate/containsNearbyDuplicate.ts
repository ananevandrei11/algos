export function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const lastSeen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const prev = lastSeen.get(nums[i]);
    if (prev !== undefined && i - prev <= k) {
      return true;
    }
    lastSeen.set(nums[i], i);
  }

  return false;
}
