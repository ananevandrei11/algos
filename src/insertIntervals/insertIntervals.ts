export function insertIntervals(intervals: number[][], newInterval: number[]): number[][] {
  const sorted = [...intervals, newInterval].sort((a,b) => a[0] - b[0]);

  let res: number[][] = [];
  let count = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    if (i === 0) {
      res.push(sorted[i]);
      continue;
    }
    const start = sorted[i][0];
    const endRes = res[count][1];
    if (start <= endRes) {
      res[count][1] = Math.max(endRes, sorted[i][1]);
    } else {
      count++;
      res.push(sorted[i]);
    }
  }
  return res;
}
