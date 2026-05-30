import { containsNearbyDuplicate } from './containsNearbyDuplicate';

describe('containsNearbyDuplicate', () => {
  it('returns true when duplicate is within distance k', () => {
    expect(containsNearbyDuplicate([1, 2, 3, 1], 3)).toBe(true);
  });

  it('returns true when duplicate is exactly k apart', () => {
    expect(containsNearbyDuplicate([1, 0, 1, 1], 1)).toBe(true);
  });

  it('returns false when duplicates are farther than k apart', () => {
    expect(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2)).toBe(false);
  });

  it('returns false when there are no duplicates at all', () => {
    expect(containsNearbyDuplicate([1, 2, 3, 4, 5], 10)).toBe(false);
  });

  it('returns false for a single-element array', () => {
    expect(containsNearbyDuplicate([1], 1)).toBe(false);
  });

  it('returns false when k is 0', () => {
    expect(containsNearbyDuplicate([1, 1, 1], 0)).toBe(false);
  });

  it('returns true for adjacent duplicates when k is 1', () => {
    expect(containsNearbyDuplicate([99, 99], 1)).toBe(true);
  });

  it('returns false when the only duplicate is just out of range', () => {
    expect(containsNearbyDuplicate([1, 2, 1], 1)).toBe(false);
  });

  it('keeps the latest index so a closer duplicate is found', () => {
    expect(containsNearbyDuplicate([1, 2, 1, 1], 1)).toBe(true);
  });

  it('works with negative numbers', () => {
    expect(containsNearbyDuplicate([-1, -2, -1], 2)).toBe(true);
    expect(containsNearbyDuplicate([-1, -2, -3, -1], 2)).toBe(false);
  });

  it('handles large values within constraints', () => {
    expect(containsNearbyDuplicate([1000000000, -1000000000, 1000000000], 2)).toBe(true);
  });
});
