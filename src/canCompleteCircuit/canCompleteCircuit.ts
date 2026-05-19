export function canCompleteCircuit(gas: number[], cost: number[]): number {
  if (gas.reduce((res, i) => res += i, 0) < cost.reduce((res, i) => res += i, 0)) {
    return -1;
  }
  const n = gas.length;
  for (let start = 0; start < n; start += 1) {
    let tank = 0;
    let ok = true;
    for (let k = 0; k < n; k += 1) {
      const i = (start + k) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) {
        ok = false;
        break;
      }
    }
    if (ok) return start;
  }

  return -1;
}
