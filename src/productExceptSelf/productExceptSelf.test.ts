import { productExceptSelf } from './productExceptSelf';

describe('productExceptSelf', () => {
  it('returns products for positive numbers', () => {
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
  });

  it('handles a single zero in the array', () => {
    const result = productExceptSelf([-1, 1, 0, -3, 3]).map((n) => n + 0);
    expect(result).toEqual([0, 0, 9, 0, 0]);
  });

  it('handles multiple zeros', () => {
    const result = productExceptSelf([0, 0, 2, 3]).map((n) => n + 0);
    expect(result).toEqual([0, 0, 0, 0]);
  });

  it('handles negative numbers', () => {
    expect(productExceptSelf([-1, -2, -3, -4])).toEqual([-24, -12, -8, -6]);
  });

  it('handles mixed signs', () => {
    expect(productExceptSelf([2, -3, 4, -5])).toEqual([60, -40, 30, -24]);
  });

  it('works with two elements', () => {
    expect(productExceptSelf([3, 7])).toEqual([7, 3]);
  });

  it('works with ones', () => {
    expect(productExceptSelf([1, 1, 1, 1])).toEqual([1, 1, 1, 1]);
  });
});
