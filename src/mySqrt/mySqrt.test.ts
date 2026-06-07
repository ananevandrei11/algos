import { mySqrt } from './mySqrt';

describe('mySqrt', () => {
  it('covers the first LeetCode example', () => {
    expect(mySqrt(4)).toBe(2);
  });

  it('covers the second LeetCode example by rounding down', () => {
    expect(mySqrt(8)).toBe(2);
  });

  it('returns zero for zero', () => {
    expect(mySqrt(0)).toBe(0);
  });

  it('returns one for one', () => {
    expect(mySqrt(1)).toBe(1);
  });

  it('returns the exact root for a perfect square', () => {
    expect(mySqrt(9)).toBe(3);
  });

  it('rounds down just below a perfect square', () => {
    expect(mySqrt(15)).toBe(3);
  });

  it('rounds down just above a perfect square', () => {
    expect(mySqrt(17)).toBe(4);
  });

  it('handles a large perfect square', () => {
    expect(mySqrt(1000000)).toBe(1000);
  });

  it('handles the maximum constraint value', () => {
    expect(mySqrt(2147483647)).toBe(46340);
  });
});
