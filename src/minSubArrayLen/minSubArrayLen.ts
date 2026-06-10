export function minSubArrayLenOnPow2(target: number, nums: number[]): number {
  let res: number[] = [];
  for (let i = 0; i < nums.length; i += 1) {
    const currI = nums[i];
    if (currI >= target) {
      return 1;
    }
    let subArray: number[] = [];
    let count = currI;
    let ind = i + 1;
    subArray.push(currI);
    while (count < target && ind < nums.length) {
      const currNext = nums[ind];
      count += currNext;
      if (count >= target) {
        subArray.push(currNext);
        if (res.length === 0 || subArray.length < res.length) {
          res = subArray.slice();
        }
      } else {
        ind++;
        subArray.push(currNext);
      }
    }
  }
  return res.length;
}

export function minSubArrayLen(target: number, nums: number[]): number {
  let res = Infinity;
  let sum = 0;
  let left = 0;
  for (let i = 0; i < nums.length; i += 1) {
    sum += nums[i];
    while (sum >= target) {
      res = Math.min(res, i - left + 1);
      sum -= nums[left];
      left += 1;
    }
  }
  return res === Infinity ? 0 : res;
}
