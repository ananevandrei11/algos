import { isAnagram } from './isAnagram';

describe('isAnagram', () => {
  it('returns true for "anagram" and "nagaram"', () => {
    expect(isAnagram('anagram', 'nagaram')).toBe(true);
  });

  it('returns false for "rat" and "car"', () => {
    expect(isAnagram('rat', 'car')).toBe(false);
  });

  it('returns true for identical strings', () => {
    expect(isAnagram('abc', 'abc')).toBe(true);
  });

  it('returns true for single character', () => {
    expect(isAnagram('a', 'a')).toBe(true);
  });

  it('returns false for single different characters', () => {
    expect(isAnagram('a', 'b')).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(isAnagram('ab', 'abc')).toBe(false);
  });

  it('returns true for "listen" and "silent"', () => {
    expect(isAnagram('listen', 'silent')).toBe(true);
  });

  it('returns false for different character frequencies', () => {
    expect(isAnagram('aab', 'abc')).toBe(false);
  });

  it('returns true for long anagrams', () => {
    expect(isAnagram('abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba')).toBe(true);
  });

  it('returns false for one empty and one non-empty (edge case)', () => {
    expect(isAnagram('a', '')).toBe(false);
  });
});
