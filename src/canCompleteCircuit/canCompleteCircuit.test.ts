import { canCompleteCircuit } from './canCompleteCircuit';

describe('canCompleteCircuit', () => {
  it('returns the unique starting index from the LeetCode example', () => {
    expect(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])).toBe(3);
  });

  it('returns -1 when total gas is less than total cost', () => {
    expect(canCompleteCircuit([2, 3, 4], [3, 4, 3])).toBe(-1);
  });

  it('handles a single station where gas covers cost', () => {
    expect(canCompleteCircuit([5], [4])).toBe(0);
  });

  it('handles a single station where gas equals cost', () => {
    expect(canCompleteCircuit([3], [3])).toBe(0);
  });

  it('returns -1 for a single station when cost exceeds gas', () => {
    expect(canCompleteCircuit([1], [2])).toBe(-1);
  });

  it('returns 0 when starting at the first station works', () => {
    expect(canCompleteCircuit([5, 1, 2, 3, 4], [1, 2, 3, 4, 5])).toBe(0);
  });

  it('finds a start in the middle of the array', () => {
    expect(canCompleteCircuit([3, 4, 5, 1, 2], [5, 1, 2, 3, 4])).toBe(1);
  });

  it('returns -1 when totals are equal but no valid start exists is impossible — equal totals always yield a unique start', () => {
    expect(canCompleteCircuit([2, 0, 0], [0, 1, 1])).toBe(0);
  });

  it('handles zero gas at some stations', () => {
    expect(canCompleteCircuit([0, 0, 0, 6], [1, 1, 1, 0])).toBe(3);
  });

  it('returns -1 when every station is short by one unit', () => {
    expect(canCompleteCircuit([1, 1, 1, 1], [2, 2, 2, 2])).toBe(-1);
  });

  it('returns 0 for two stations where the first covers both costs', () => {
    expect(canCompleteCircuit([4, 0], [1, 3])).toBe(0);
  });

  it('returns -1 for two stations when neither can complete the loop', () => {
    expect(canCompleteCircuit([1, 2], [2, 2])).toBe(-1);
  });

  it('handles all-zero gas and cost arrays', () => {
    expect(canCompleteCircuit([0, 0, 0], [0, 0, 0])).toBe(0);
  });
});
