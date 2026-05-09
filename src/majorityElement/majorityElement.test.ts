import { majorityElement } from './majorityElement';

describe('majorityElement', () => {
  it('majority at the end: [2,3,3]', () => {
    expect(majorityElement([2, 3, 3])).toBe(3);
  });

  it('majority in the middle: [1,2,2,2,1]', () => {
    expect(majorityElement([1, 2, 2, 2, 1])).toBe(2);
  });

  it('majority at the end: [2,2,1,1,1,2,2] reversed → [2,2,1,1,1,2,2]', () => {
    expect(majorityElement([1, 1, 2, 2, 2, 1, 2])).toBe(2);
  });

  it('single element', () => {
    expect(majorityElement([1])).toBe(1);
  });

  it('majority not first: [2,1,1]', () => {
    expect(majorityElement([2, 1, 1])).toBe(1);
  });

  it('handles negative numbers, majority not first: [2,-1,-1]', () => {
    expect(majorityElement([2, -1, -1])).toBe(-1);
  });

  it('all same elements', () => {
    expect(majorityElement([5, 5, 5, 5])).toBe(5);
  });

  it('large array, majority at the end', () => {
    const nums = Array(25000).fill(3).concat(Array(25001).fill(7));
    expect(majorityElement(nums)).toBe(7);
  });
});
