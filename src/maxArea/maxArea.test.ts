import { maxArea } from './maxArea';

describe('maxArea', () => {
  it('covers the first LeetCode example', () => {
    expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
  });

  it('covers the second LeetCode example', () => {
    expect(maxArea([1, 1])).toBe(1);
  });

  it('handles a strictly increasing array', () => {
    expect(maxArea([4,3,2,1,4])).toBe(16);
  });

  it('handles a strictly decreasing array', () => {
    expect(maxArea([5, 4, 3, 2, 1])).toBe(6);
  });

  it('handles equal heights where width drives the area', () => {
    expect(maxArea([5, 5, 5, 5])).toBe(15);
  });

  it('picks the two outermost tall lines', () => {
    expect(maxArea([2, 1, 1, 1, 2])).toBe(8);
  });

  it('handles a tall pair sitting in the middle', () => {
    expect(maxArea([1, 9, 9, 1])).toBe(9);
  });

  it('ignores zero-height lines', () => {
    expect(maxArea([0, 0, 6, 0, 0, 6, 0, 0])).toBe(18);
  });

  it('handles a single dominating peak', () => {
    expect(maxArea([1, 2, 4, 3])).toBe(4);
  });
});
