function quicksort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (i === pivotIndex) {
      continue;
    }
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quicksort(left), pivot, ...quicksort(right)];
}
export function threeSum(nums: number[]): number[][] {
  const sortedNums = quicksort(nums);
  let res = [];
  for (let i = 0; i < sortedNums.length; i += 1) {
    const one = sortedNums[i];
    if (i > 0 && sortedNums[i] === sortedNums[i - 1]) continue;
    let left = i + 1;
    let right = sortedNums.length - 1;
    while (left < right) {
      const two = sortedNums[left];
      const three = sortedNums[right];
      const sum = one + three + two;
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        res.push([one, two, three]);
        left++;
        right--;
        while (left < right && sortedNums[left] === sortedNums[left - 1])
          left++;
        while (left < right && sortedNums[right] === sortedNums[right + 1])
          right--;
      }
    }
  }
  return res;
}
