import { intToRomanMedium } from './intToRomanMedium';

describe('intToRomanMedium', () => {
  it('covers the first LeetCode example', () => {
    expect(intToRomanMedium(3749)).toBe('MMMDCCXLIX');
  });

  it('covers the second LeetCode example', () => {
    expect(intToRomanMedium(58)).toBe('LVIII');
  });

  it('covers the third LeetCode example', () => {
    expect(intToRomanMedium(1994)).toBe('MCMXCIV');
  });

  it('handles the smallest constraint value', () => {
    expect(intToRomanMedium(1)).toBe('I');
  });

  it('handles the largest constraint value', () => {
    expect(intToRomanMedium(3999)).toBe('MMMCMXCIX');
  });

  it('uses the subtractive form for four', () => {
    expect(intToRomanMedium(4)).toBe('IV');
  });

  it('uses the subtractive form for nine', () => {
    expect(intToRomanMedium(9)).toBe('IX');
  });

  it('uses the subtractive form for forty', () => {
    expect(intToRomanMedium(40)).toBe('XL');
  });

  it('uses the subtractive form for ninety', () => {
    expect(intToRomanMedium(90)).toBe('XC');
  });

  it('uses the subtractive form for four hundred', () => {
    expect(intToRomanMedium(400)).toBe('CD');
  });

  it('uses the subtractive form for nine hundred', () => {
    expect(intToRomanMedium(900)).toBe('CM');
  });

  it('repeats a power of ten three times', () => {
    expect(intToRomanMedium(30)).toBe('XXX');
  });

  it('converts a value with every place populated', () => {
    expect(intToRomanMedium(2421)).toBe('MMCDXXI');
  });
});
