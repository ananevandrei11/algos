import { mergeIntervals } from './mergeIntervals';

describe('mergeIntervals', () => {
  it('merges overlapping intervals from the first LeetCode example', () => {
    expect(
      mergeIntervals([
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ]),
    ).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it('treats touching intervals as overlapping', () => {
    expect(
      mergeIntervals([
        [1, 4],
        [4, 5],
      ]),
    ).toEqual([[1, 5]]);
  });

  it('merges intervals given out of order', () => {
    expect(
      mergeIntervals([
        [4, 7],
        [1, 4],
      ]),
    ).toEqual([[1, 7]]);
  });

  it('returns a single interval unchanged', () => {
    expect(mergeIntervals([[1, 4]])).toEqual([[1, 4]]);
  });

  it('keeps fully disjoint intervals separate', () => {
    expect(
      mergeIntervals([
        [1, 2],
        [4, 5],
        [7, 8],
      ]),
    ).toEqual([
      [1, 2],
      [4, 5],
      [7, 8],
    ]);
  });

  it('absorbs an interval fully contained in another', () => {
    expect(
      mergeIntervals([
        [1, 10],
        [3, 5],
      ]),
    ).toEqual([[1, 10]]);
  });

  it('merges a chain of overlapping intervals into one', () => {
    expect(
      mergeIntervals([
        [1, 4],
        [2, 5],
        [3, 6],
        [5, 8],
      ]),
    ).toEqual([[1, 8]]);
  });

  it('handles duplicate intervals', () => {
    expect(
      mergeIntervals([
        [1, 3],
        [1, 3],
        [1, 3],
      ]),
    ).toEqual([[1, 3]]);
  });

  it('handles zero-length intervals', () => {
    expect(
      mergeIntervals([
        [1, 1],
        [2, 2],
      ]),
    ).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it('sorts and merges an unsorted mix of intervals', () => {
    expect(
      mergeIntervals([
        [8, 10],
        [1, 3],
        [15, 18],
        [2, 6],
        [9, 12],
      ]),
    ).toEqual([
      [1, 6],
      [8, 12],
      [15, 18],
    ]);
  });
});
