import { lengthOfLongestSubstring } from './lengthOfLongestSubstring';

describe('lengthOfLongestSubstring', () => {
  it('covers the first LeetCode example', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
  });

  it('covers the second LeetCode example', () => {
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
  });

  it('covers the third LeetCode example', () => {
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
  });

  it('returns 0 for an empty string', () => {
    expect(lengthOfLongestSubstring('')).toBe(0);
  });

  it('returns 1 for a single character', () => {
    expect(lengthOfLongestSubstring('a')).toBe(1);
  });

  it('returns the full length when all characters are unique', () => {
    expect(lengthOfLongestSubstring('abcdef')).toBe(6);
  });

  it('handles a repeat that forces the window to slide past it', () => {
    expect(lengthOfLongestSubstring('abba')).toBe(2);
  });

  it('handles spaces as regular characters', () => {
    expect(lengthOfLongestSubstring(' ')).toBe(1);
  });

  it('handles digits and symbols', () => {
    expect(lengthOfLongestSubstring('1!2@1!')).toBe(4);
  });

  it('finds the window in the middle of the string', () => {
    expect(lengthOfLongestSubstring('aabcdee')).toBe(5);
  });

  it('handles a long tail of unique characters after repeats', () => {
    expect(lengthOfLongestSubstring('dvdf')).toBe(3);
  });

  it('treats uppercase and lowercase as distinct', () => {
    expect(lengthOfLongestSubstring('aAbBcC')).toBe(6);
  });
});
