import { minSubArrayLen } from './minSubArrayLen';

describe('minSubArrayLen', () => {
  it('covers the first LeetCode example', () => {
    expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2);
  });

  it('covers the second LeetCode example', () => {
    expect(minSubArrayLen(4, [1, 4, 4])).toBe(1);
  });

  it('covers the third LeetCode example', () => {
    expect(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
  });

  it('returns 0 when the whole array sums below target', () => {
    expect(minSubArrayLen(100, [1, 2, 3])).toBe(0);
  });

  it('returns 1 when a single element already reaches target', () => {
    expect(minSubArrayLen(4, [1, 2, 4, 3])).toBe(1);
  });

  it('needs the entire array to reach target', () => {
    expect(minSubArrayLen(15, [1, 2, 3, 4, 5])).toBe(5);
  });

  it('handles a single element equal to target', () => {
    expect(minSubArrayLen(5, [5])).toBe(1);
  });

  it('handles a single element below target', () => {
    expect(minSubArrayLen(6, [5])).toBe(0);
  });

  it('treats a sum exactly equal to target as valid', () => {
    expect(minSubArrayLen(6, [1, 2, 3, 4])).toBe(2);
  });

  it('shrinks the window past a large element', () => {
    expect(minSubArrayLen(8, [1, 1, 1, 8, 1, 1, 1])).toBe(1);
  });

  it('picks the minimal window among several that qualify', () => {
    expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3, 7])).toBe(1);
  });
});
