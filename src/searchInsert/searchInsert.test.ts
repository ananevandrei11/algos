import { searchInsert } from './searchInsert';

describe('searchInsert', () => {
  it('returns index when target is found', () => {
    expect(searchInsert([1, 3, 5, 6], 5)).toBe(2);
  });

  it('returns insertion index when target is between elements', () => {
    expect(searchInsert([1, 3, 5, 6], 2)).toBe(1);
  });

  it('returns length when target is greater than all elements', () => {
    expect(searchInsert([1, 3, 5, 6], 7)).toBe(4);
  });

  it('returns 0 when target is less than all elements', () => {
    expect(searchInsert([1, 3, 5, 6], 0)).toBe(0);
  });

  it('returns 0 when target matches first element', () => {
    expect(searchInsert([1, 3, 5, 6], 1)).toBe(0);
  });

  it('returns last index when target matches last element', () => {
    expect(searchInsert([1, 3, 5, 6], 6)).toBe(3);
  });

  it('works with single element — target found', () => {
    expect(searchInsert([5], 5)).toBe(0);
  });

  it('works with single element — target not found', () => {
    expect(searchInsert([5], 3)).toBe(0);
    expect(searchInsert([5], 7)).toBe(1);
  });

  it('works with negative numbers', () => {
    expect(searchInsert([-10, -5, 0, 3], -5)).toBe(1);
    expect(searchInsert([-10, -5, 0, 3], -7)).toBe(1);
  });

  it('finds target in a long array', () => {
    expect(searchInsert([2, 5, 8, 12, 16, 23, 31, 38, 45, 52, 60, 67, 74, 81, 95, 103, 112, 120], 60)).toBe(10);
  });

  it('returns insertion index in a long array when target is absent', () => {
    expect(searchInsert([2, 5, 8, 12, 16, 23, 31, 38, 45, 52, 60, 67, 74, 81, 95, 103, 112, 120], 70)).toBe(12);
  });
});
