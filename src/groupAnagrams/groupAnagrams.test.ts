import { groupAnagrams } from './groupAnagrams';

const normalize = (groups: string[][]): string[][] =>
  groups
    .map((group) => [...group].sort())
    .sort((a, b) => a.join().localeCompare(b.join()));

const expectGroups = (actual: string[][], expected: string[][]): void => {
  expect(normalize(actual)).toEqual(normalize(expected));
};

describe('groupAnagrams', () => {
  it('covers the first LeetCode example', () => {
    expectGroups(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [
      ['bat'],
      ['nat', 'tan'],
      ['ate', 'eat', 'tea'],
    ]);
  });

  it('covers the second LeetCode example', () => {
    expectGroups(groupAnagrams(['']), [['']]);
  });

  it('covers the third LeetCode example', () => {
    expectGroups(groupAnagrams(['a']), [['a']]);
  });

  it('keeps every string in its own group when nothing is an anagram', () => {
    expectGroups(groupAnagrams(['abc', 'def', 'ghi']), [['abc'], ['def'], ['ghi']]);
  });

  it('collapses everything into one group when all are anagrams', () => {
    expectGroups(groupAnagrams(['abc', 'bca', 'cab', 'acb']), [
      ['abc', 'bca', 'cab', 'acb'],
    ]);
  });

  it('keeps duplicate strings together in the same group', () => {
    expectGroups(groupAnagrams(['ab', 'ab', 'ba']), [['ab', 'ab', 'ba']]);
  });

  it('distinguishes anagrams from strings with different letter counts', () => {
    expectGroups(groupAnagrams(['aab', 'aba', 'abb']), [['aab', 'aba'], ['abb']]);
  });

  it('groups multiple empty strings together', () => {
    expectGroups(groupAnagrams(['', '', 'a']), [['', ''], ['a']]);
  });

  it('handles a mix of several anagram families', () => {
    expectGroups(
      groupAnagrams(['listen', 'silent', 'enlist', 'google', 'gogole', 'cat']),
      [['listen', 'silent', 'enlist'], ['google', 'gogole'], ['cat']],
    );
  });
});
