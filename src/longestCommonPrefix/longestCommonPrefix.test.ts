import { longestCommonPrefix } from './longestCommonPrefix';

describe('longestCommonPrefix', () => {
  it('returns common prefix for ["flower","flow","flight"]', () => {
    expect(longestCommonPrefix(['flower', 'flow', 'flight'])).toBe('fl');
  });

  it('returns empty string when no common prefix', () => {
    expect(longestCommonPrefix(['dog', 'racecar', 'car'])).toBe('');
  });

  it('returns the word itself when all strings are equal', () => {
    expect(longestCommonPrefix(['abc', 'abc', 'abc'])).toBe('abc');
  });

  it('returns empty string when one of the strings is empty', () => {
    expect(longestCommonPrefix(['', 'abc'])).toBe('');
  });

  it('returns the single string when array has one element', () => {
    expect(longestCommonPrefix(['alone'])).toBe('alone');
  });

  it('returns full prefix when one string is prefix of others', () => {
    expect(longestCommonPrefix(['ab', 'abc', 'abcd'])).toBe('ab');
  });
});
