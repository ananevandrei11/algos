import { singleNumber } from './singleNumber';

describe('singleNumber', () => {
  it('finds the single number with the unique one at the end', () => {
    expect(singleNumber([2, 2, 1])).toBe(1);
  });

  it('finds the single number with pairs interleaved', () => {
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
  });

  it('returns the only element for a single-element array', () => {
    expect(singleNumber([1])).toBe(1);
  });

  it('works when the single number is at the start', () => {
    expect(singleNumber([7, 3, 3, 5, 5])).toBe(7);
  });

  it('works with negative numbers', () => {
    expect(singleNumber([-1, -1, -2])).toBe(-2);
  });

  it('works with a single negative number', () => {
    expect(singleNumber([-5])).toBe(-5);
  });

  it('finds zero as the single number', () => {
    expect(singleNumber([0, 1, 1])).toBe(0);
  });

  it('handles a mix of positive and negative numbers', () => {
    expect(singleNumber([-3, 4, -3, 4, 9])).toBe(9);
  });

  it('handles large values within constraints', () => {
    expect(singleNumber([30000, -30000, 30000])).toBe(-30000);
  });
});
