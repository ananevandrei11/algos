import { strStr } from './strStr';

describe('strStr', () => {
  it('returns 0 when needle is at the beginning', () => {
    expect(strStr('sadbutsad', 'sad')).toBe(0);
  });

  it('returns -1 when needle is not in haystack', () => {
    expect(strStr('leetcode', 'leeto')).toBe(-1);
  });

  it('returns 0 when needle is empty string', () => {
    expect(strStr('hello', '')).toBe(0);
  });

  it('returns 0 when both strings are empty', () => {
    expect(strStr('', '')).toBe(0);
  });

  it('returns -1 when haystack is empty but needle is not', () => {
    expect(strStr('', 'a')).toBe(-1);
  });

  it('finds single character at beginning', () => {
    expect(strStr('a', 'a')).toBe(0);
  });

  it('finds single character in middle', () => {
    expect(strStr('abc', 'b')).toBe(1);
  });

  it('finds single character at end', () => {
    expect(strStr('abc', 'c')).toBe(2);
  });

  it('returns -1 when single character not found', () => {
    expect(strStr('abc', 'd')).toBe(-1);
  });

  it('returns 0 when needle equals haystack', () => {
    expect(strStr('hello', 'hello')).toBe(0);
  });

  it('returns -1 when needle equals haystack length but different', () => {
    expect(strStr('hello', 'world')).toBe(-1);
  });

  it('returns -1 when needle is longer than haystack', () => {
    expect(strStr('hi', 'hello')).toBe(-1);
  });

  it('returns first occurrence when multiple matches exist', () => {
    expect(strStr('sadbutsad', 'sad')).toBe(0);
  });

  it('finds needle at different positions', () => {
    expect(strStr('hello world', 'world')).toBe(6);
    expect(strStr('mississippi', 'issi')).toBe(1);
  });

  it('finds needle with repeating characters', () => {
    expect(strStr('aaa', 'aa')).toBe(0);
  });

  it('finds needle in haystack with repeating patterns', () => {
    expect(strStr('aaab', 'aaab')).toBe(0);
    expect(strStr('aaab', 'aab')).toBe(1);
  });

  it('handles needle of length 1 at end', () => {
    expect(strStr('abcdefghij', 'j')).toBe(9);
  });

  it('handles long needle at end', () => {
    expect(strStr('abcdefghij', 'ghij')).toBe(6);
  });

  it('is case sensitive', () => {
    expect(strStr('Hello', 'hello')).toBe(-1);
    expect(strStr('Hello', 'Hello')).toBe(0);
  });

  it('handles whitespace', () => {
    expect(strStr('hello world', ' ')).toBe(5);
  });

  it('finds needle that appears only at the end', () => {
    expect(strStr('abcdefg', 'fg')).toBe(5);
  });
});
