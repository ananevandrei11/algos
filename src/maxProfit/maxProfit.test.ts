import { maxProfit } from './maxProfit';

describe('maxProfit', () => {
  it('returns 5 for [7,1,5,3,6,4]', () => {
    expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5);
  });

  it('returns 0 when prices only decrease [7,6,4,3,1]', () => {
    expect(maxProfit([7, 6, 4, 3, 1])).toBe(0);
  });

  it('returns 0 for single element', () => {
    expect(maxProfit([5])).toBe(0);
  });

  it('returns 0 for two equal prices', () => {
    expect(maxProfit([3, 3])).toBe(0);
  });

  it('picks global min buy, not local', () => {
    // buy at 1 (day 4), sell at 10 (day 5) — not buy at 2 (day 1)
    expect(maxProfit([2, 9, 1, 10])).toBe(9);
  });

  it('handles profit only at the very end', () => {
    expect(maxProfit([5, 4, 3, 2, 1, 100])).toBe(99);
  });

  it('handles profit only at the very beginning', () => {
    expect(maxProfit([1, 100, 2, 3, 4])).toBe(99);
  });

  it('all equal prices returns 0', () => {
    expect(maxProfit([5, 5, 5, 5])).toBe(0);
  });

  it('two elements increasing', () => {
    expect(maxProfit([1, 10000])).toBe(9999);
  });

  it('large input — prices at constraint boundaries', () => {
    const prices = Array.from({ length: 100000 }, (_, i) => i % 10001);
    expect(maxProfit(prices)).toBeGreaterThan(0);
  });
});
