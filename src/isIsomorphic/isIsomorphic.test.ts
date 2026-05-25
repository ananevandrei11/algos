import { isIsomorphic } from './isIsomorphic';

describe('isIsomorphic', () => {
  it('egg -> add: true', () => {
    expect(isIsomorphic('egg', 'add')).toBe(true);
  });

  it('f11 -> b23: false (один символ не может маппиться на разные)', () => {
    expect(isIsomorphic('f11', 'b23')).toBe(false);
  });

  it('paper -> title: true', () => {
    expect(isIsomorphic('paper', 'title')).toBe(true);
  });

  it('ab -> aa: false (два разных символа не могут маппиться на один)', () => {
    expect(isIsomorphic('ab', 'aa')).toBe(false);
  });

  it('ba -> aa: false', () => {
    expect(isIsomorphic('ba', 'aa')).toBe(false);
  });

  it('a -> a: true (символ маппится на себя)', () => {
    expect(isIsomorphic('a', 'a')).toBe(true);
  });

  it('abc -> xyz: true', () => {
    expect(isIsomorphic('abc', 'xyz')).toBe(true);
  });

  it('aab -> xxy: true', () => {
    expect(isIsomorphic('aab', 'xxy')).toBe(true);
  });

  it('aab -> xyz: false', () => {
    expect(isIsomorphic('aab', 'xyz')).toBe(false);
  });
});
