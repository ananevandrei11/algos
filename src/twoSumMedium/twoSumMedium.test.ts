import { twoSumMedium } from './twoSumMedium';

describe('twoSumMedium', () => {
  it('covers the first LeetCode example', () => {
    expect(twoSumMedium([2, 7, 11, 15], 9)).toEqual([1, 2]);
  });

  it('covers the second LeetCode example', () => {
    expect(twoSumMedium([2, 3, 4], 6)).toEqual([1, 3]);
  });

  it('covers the third LeetCode example', () => {
    expect(twoSumMedium([-1, 0], -1)).toEqual([1, 2]);
  });

  it('works with the smallest possible array', () => {
    expect(twoSumMedium([1, 2], 3)).toEqual([1, 2]);
  });

  it('uses the two ends of the array', () => {
    expect(twoSumMedium([3, 4, 5, 8], 11)).toEqual([1, 4]);
  });

  it('handles a pair sitting in the middle', () => {
    expect(twoSumMedium([1, 5, 6, 8, 15], 11)).toEqual([2, 3]);
  });

  it('works entirely with negative numbers', () => {
    expect(twoSumMedium([-5, -4, -3, -2, -1], -8)).toEqual([1, 3]);
  });

  it('finds a pair that crosses zero', () => {
    expect(twoSumMedium([-3, -1, 0, 2, 5], 4)).toEqual([2, 5]);
  });

  it('handles duplicate values forming the answer', () => {
    expect(twoSumMedium([3, 3], 6)).toEqual([1, 2]);
  });

  it('matches a pair of equal values inside a larger array', () => {
    expect(twoSumMedium([1, 4, 4, 9], 8)).toEqual([2, 3]);
  });

  it('handles boundary values within the constraints', () => {
    expect(twoSumMedium([-1000, -999, 998, 1000], 0)).toEqual([1, 4]);
  });
});
