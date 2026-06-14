import { longestConsecutive } from './longestConsecutive';

describe('longestConsecutive', () => {
  it('covers the first LeetCode example', () => {
    expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
  });

  it('covers the second LeetCode example', () => {
    expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
  });

  it('covers the third LeetCode example', () => {
    expect(longestConsecutive([1, 0, 1, 2])).toBe(3);
  });

  it('returns 0 for an empty array', () => {
    expect(longestConsecutive([])).toBe(0);
  });

  it('returns 1 for a single element', () => {
    expect(longestConsecutive([42])).toBe(1);
  });

  it('returns 1 when no two elements are consecutive', () => {
    expect(longestConsecutive([10, 30, 20, 50])).toBe(1);
  });

  it('ignores duplicates within a sequence', () => {
    expect(longestConsecutive([1, 2, 2, 3, 3, 3, 4])).toBe(4);
  });

  it('handles negative numbers', () => {
    expect(longestConsecutive([-3, -2, -1, 0, 1])).toBe(5);
  });

  it('spans a sequence that crosses zero', () => {
    expect(longestConsecutive([-1, 1, 0, -2, 2])).toBe(5);
  });

  it('picks the longest of several separate runs', () => {
    expect(longestConsecutive([1, 2, 3, 10, 11, 100, 101, 102, 103])).toBe(4);
  });

  it('handles an already sorted array', () => {
    expect(longestConsecutive([1, 2, 3, 4, 5, 6])).toBe(6);
  });

  it('handles a reverse sorted array', () => {
    expect(longestConsecutive([6, 5, 4, 3, 2, 1])).toBe(6);
  });

  it('returns 1 when all elements are the same', () => {
    expect(longestConsecutive([7, 7, 7, 7])).toBe(1);
  });
});
