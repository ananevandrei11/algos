export function summaryRanges(nums: number[]): string[] {
  const map = new Map<number, number[]>();
  let indicator = 1;
  for (let i = 0; i < nums.length; i += 1) {
    const curr = nums[i];
    if (map.size === 0) {
      map.set(indicator, [curr]);
      continue;
    }
    const prev = nums[i - 1];
    if (prev === curr - 1) {
      const currIndicator = map.get(indicator) || [];
      currIndicator?.push(curr);
      map.set(indicator, currIndicator);
    } else {
      indicator += 1;
      map.set(indicator, [curr]);
    }
  }
  let values = [...map.values()];
  const res: string[] = [];
  for (let i = 0; i < values.length; i += 1) {
    if (values[i].length === 1) {
      res.push(values[i][0].toString());
    } else {
      res.push(`${values[i][0]}->${values[i][values[i].length - 1]}`);
    }
  }
  return res;
}
summaryRanges([0, 1, 2, 4, 5, 7]); // ['0->2', '4->5', '7']
// summaryRanges([0, 2, 3, 4, 6, 8, 9]); // ['0', '2->4', '6', '8->9']
