import { isPalindrome } from './isPalindrome';

describe('isPalindrome', () => {
  it('returns true for "A man, a plan, a canal: Panama"', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
  });

  it('returns false for "race a car"', () => {
    expect(isPalindrome('race a car')).toBe(false);
  });

  it('returns true for " " (only spaces)', () => {
    expect(isPalindrome(' ')).toBe(true);
  });

  it('returns true for single alphanumeric character', () => {
    expect(isPalindrome('a')).toBe(true);
  });

  it('returns true for "0P" — non-palindrome with digits', () => {
    expect(isPalindrome('0P')).toBe(false);
  });

  it('returns true for string with only non-alphanumeric characters', () => {
    expect(isPalindrome('.,!')).toBe(true);
  });

  it('handles digits as palindrome', () => {
    expect(isPalindrome('1221')).toBe(true);
  });

  it('handles mixed digits and letters', () => {
    expect(isPalindrome('a1b2b1a')).toBe(true);
  });
});
