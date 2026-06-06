import { plusOne } from './plusOne';

describe('plusOne', () => {
  it('covers the first LeetCode example', () => {
    expect(plusOne([1, 2, 3])).toEqual([1, 2, 4]);
  });

  it('covers the second LeetCode example', () => {
    expect(plusOne([4, 3, 2, 1])).toEqual([4, 3, 2, 2]);
  });

  it('grows the array when a single nine rolls over', () => {
    expect(plusOne([9])).toEqual([1, 0]);
  });

  it('increments a single digit without carry', () => {
    expect(plusOne([0])).toEqual([1]);
  });

  it('propagates the carry through a trailing nine', () => {
    expect(plusOne([1, 9])).toEqual([2, 0]);
  });

  it('propagates the carry through every digit', () => {
    expect(plusOne([9, 9, 9])).toEqual([1, 0, 0, 0]);
  });

  it('keeps the length when only the last digit changes', () => {
    expect(plusOne([1, 2, 9])).toEqual([1, 3, 0]);
  });

  it('handles a long number at the maximum constraint length', () => {
    const digits = new Array(100).fill(9);
    const expected = [1, ...new Array(100).fill(0)];
    expect(plusOne(digits)).toEqual(expected);
  });
});
