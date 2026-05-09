import { merge } from './mergeArray';

describe('merge', () => {
  it('merges two sorted arrays in-place', () => {
    const nums1 = [1, 2, 3, 0, 0, 0];
    merge(nums1, 3, [2, 5, 6], 3);
    expect(nums1).toEqual([1, 2, 2, 3, 5, 6]);
  });

  it('handles empty nums2', () => {
    const nums1 = [1];
    merge(nums1, 1, [], 0);
    expect(nums1).toEqual([1]);
  });

  it('handles empty nums1', () => {
    const nums1 = [0];
    merge(nums1, 0, [1], 1);
    expect(nums1).toEqual([1]);
  });

  it('merges when nums2 elements are all smaller', () => {
    const nums1 = [4, 5, 6, 0, 0, 0];
    merge(nums1, 3, [1, 2, 3], 3);
    expect(nums1).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('merges when nums1 elements are all smaller', () => {
    const nums1 = [1, 2, 3, 0, 0, 0];
    merge(nums1, 3, [4, 5, 6], 3);
    expect(nums1).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('handles duplicate values across both arrays', () => {
    const nums1 = [1, 1, 1, 0, 0, 0];
    merge(nums1, 3, [1, 1, 1], 3);
    expect(nums1).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('handles single element each', () => {
    const nums1 = [2, 0];
    merge(nums1, 1, [1], 1);
    expect(nums1).toEqual([1, 2]);
  });

  it('handles both arrays with one element, nums2 larger', () => {
    const nums1 = [1, 0];
    merge(nums1, 1, [2], 1);
    expect(nums1).toEqual([1, 2]);
  });

  it('handles interleaved values', () => {
    const nums1 = [1, 3, 5, 7, 0, 0, 0, 0];
    merge(nums1, 4, [2, 4, 6, 8], 4);
    expect(nums1).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('handles negative numbers', () => {
    const nums1 = [-3, -1, 0, 0, 0];
    merge(nums1, 3, [-2, 1], 2);
    expect(nums1).toEqual([-3, -2, -1, 0, 1]);
  });

  it('merges when nums2 has only one element that belongs at the start', () => {
    const nums1 = [2, 3, 4, 0];
    merge(nums1, 3, [1], 1);
    expect(nums1).toEqual([1, 2, 3, 4]);
  });

  it('merges when nums2 has only one element that belongs at the end', () => {
    const nums1 = [1, 2, 3, 0];
    merge(nums1, 3, [5], 1);
    expect(nums1).toEqual([1, 2, 3, 5]);
  });

  it('handles both arrays empty', () => {
    const nums1: number[] = [];
    merge(nums1, 0, [], 0);
    expect(nums1).toEqual([]);
  });
});
