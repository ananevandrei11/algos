import { summaryRanges } from './summaryRanges';

describe('summaryRanges', () => {
  it('covers the first LeetCode example', () => {
    expect(summaryRanges([0, 1, 2, 4, 5, 7])).toEqual(['0->2', '4->5', '7']);
  });

  it('covers the second LeetCode example', () => {
    expect(summaryRanges([0, 2, 3, 4, 6, 8, 9])).toEqual(['0', '2->4', '6', '8->9']);
  });

  it('returns an empty list for an empty array', () => {
    expect(summaryRanges([])).toEqual([]);
  });

  it('returns a single value for a single-element array', () => {
    expect(summaryRanges([5])).toEqual(['5']);
  });

  it('merges a fully consecutive array into one range', () => {
    expect(summaryRanges([1, 2, 3, 4, 5])).toEqual(['1->5']);
  });

  it('keeps every element separate when there are no consecutive numbers', () => {
    expect(summaryRanges([1, 3, 5, 7])).toEqual(['1', '3', '5', '7']);
  });

  it('handles a trailing range at the end of the array', () => {
    expect(summaryRanges([0, 1, 3, 4, 5])).toEqual(['0->1', '3->5']);
  });

  it('works with negative numbers', () => {
    expect(summaryRanges([-3, -2, -1, 2, 3])).toEqual(['-3->-1', '2->3']);
  });

  it('treats a range spanning zero as consecutive', () => {
    expect(summaryRanges([-1, 0, 1])).toEqual(['-1->1']);
  });

  it('handles boundary values within the constraints', () => {
    expect(summaryRanges([-2147483648, -2147483647, 2147483647])).toEqual([
      '-2147483648->-2147483647',
      '2147483647',
    ]);
  });
});
