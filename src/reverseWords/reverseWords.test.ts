import { reverseWords } from './reverseWords';

describe('reverseWords', () => {
  it('reverses words in a normal sentence', () => {
    expect(reverseWords('the sky is blue')).toBe('blue is sky the');
  });

  it('trims leading and trailing spaces', () => {
    expect(reverseWords('  hello world  ')).toBe('world hello');
  });

  it('reduces multiple spaces between words to one', () => {
    expect(reverseWords('a good   example')).toBe('example good a');
  });

  it('handles a single word', () => {
    expect(reverseWords('word')).toBe('word');
  });

  it('handles a single word with spaces around it', () => {
    expect(reverseWords('  word  ')).toBe('word');
  });

  it('handles uppercase and digits', () => {
    expect(reverseWords('Hello World 123')).toBe('123 World Hello');
  });
});
