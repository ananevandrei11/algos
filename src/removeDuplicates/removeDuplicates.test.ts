import { removeDuplicates } from './removeDuplicates';

describe('removeDuplicates', () => {
  it('returns correct count for array with duplicates', () => {
    const nums = [1, 1, 2];
    expect(removeDuplicates(nums)).toBe(2);
  });

  it('modifies array in-place: unique elements at the front', () => {
    const nums = [1, 1, 2];
    const k = removeDuplicates(nums);
    expect(nums.slice(0, k)).toEqual([1, 2]);
  });

  it('example 2: longer array with multiple duplicates', () => {
    const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
    const k = removeDuplicates(nums);
    expect(k).toBe(5);
    expect(nums.slice(0, k)).toEqual([0, 1, 2, 3, 4]);
  });

  it('array with no duplicates returns same length', () => {
    const nums = [1, 2, 3, 4, 5];
    const k = removeDuplicates(nums);
    expect(k).toBe(5);
    expect(nums.slice(0, k)).toEqual([1, 2, 3, 4, 5]);
  });

  it('array with all same elements returns 1', () => {
    const nums = [7, 7, 7, 7];
    const k = removeDuplicates(nums);
    expect(k).toBe(1);
    expect(nums[0]).toBe(7);
  });

  it('single element array returns 1', () => {
    const nums = [42];
    expect(removeDuplicates(nums)).toBe(1);
  });

  it('handles negative numbers', () => {
    const nums = [-3, -3, -1, 0, 0, 2];
    const k = removeDuplicates(nums);
    expect(k).toBe(4);
    expect(nums.slice(0, k)).toEqual([-3, -1, 0, 2]);
  });
});
