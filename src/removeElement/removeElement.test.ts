import { removeElement } from './removeElement';

describe('removeElement', () => {
  it('example 1: removes 3 from [3,2,2,3]', () => {
    const nums = [3, 2, 2, 3];
    const k = removeElement(nums, 3);
    expect(k).toBe(2);
    expect(nums.slice(0, k).sort()).toEqual([2, 2]);
  });

  it('example 2: removes 2 from [0,1,2,2,3,0,4,2]', () => {
    const nums = [0, 1, 2, 2, 3, 0, 4, 2];
    const k = removeElement(nums, 2);
    expect(k).toBe(5);
    expect(nums.slice(0, k).sort((a, b) => a - b)).toEqual([0, 0, 1, 3, 4]);
  });

  it('returns 0 for empty array', () => {
    const nums: number[] = [];
    expect(removeElement(nums, 1)).toBe(0);
  });

  it('returns 0 when all elements equal val', () => {
    const nums = [5, 5, 5];
    expect(removeElement(nums, 5)).toBe(0);
  });

  it('returns full length when val not in array', () => {
    const nums = [1, 2, 3];
    const k = removeElement(nums, 9);
    expect(k).toBe(3);
    expect(nums.slice(0, k).sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('removes single occurrence', () => {
    const nums = [1, 2, 3];
    const k = removeElement(nums, 2);
    expect(k).toBe(2);
    expect(nums.slice(0, k).sort((a, b) => a - b)).toEqual([1, 3]);
  });

  it('handles single-element array matching val', () => {
    const nums = [7];
    expect(removeElement(nums, 7)).toBe(0);
  });

  it('handles single-element array not matching val', () => {
    const nums = [7];
    const k = removeElement(nums, 3);
    expect(k).toBe(1);
    expect(nums[0]).toBe(7);
  });
});
