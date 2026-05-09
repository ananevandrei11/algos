import { lengthOfLastWord } from './lengthOfLastWord';

describe('lengthOfLastWord', () => {
  it('returns length of last word in simple two-word string', () => {
    expect(lengthOfLastWord('Hello World')).toBe(5);
  });

  it('handles leading and trailing spaces', () => {
    expect(lengthOfLastWord('   fly me   to   the moon  ')).toBe(4);
  });

  it('handles string with no extra spaces', () => {
    expect(lengthOfLastWord('luffy is still joyboy')).toBe(6);
  });

  it('handles single word', () => {
    expect(lengthOfLastWord('word')).toBe(4);
  });

  it('handles single word with surrounding spaces', () => {
    expect(lengthOfLastWord('  hello  ')).toBe(5);
  });

  it('handles single character word', () => {
    expect(lengthOfLastWord('a')).toBe(1);
  });
});
