import { jump } from './jump';

describe('jump', () => {
  it('example 1: [2,3,1,1,4] -> 2', () => {
    expect(jump([2, 3, 1, 1, 4])).toBe(2);
  });

  it('example 2: [2,3,0,1,4] -> 2', () => {
    expect(jump([2, 3, 0, 1, 4])).toBe(2);
  });

  it('single element array -> 0 jumps', () => {
    expect(jump([0])).toBe(0);
  });

  it('two elements -> 1 jump', () => {
    expect(jump([1, 0])).toBe(1);
  });

  it('can jump to end in one step', () => {
    expect(jump([5, 1, 1, 1, 1])).toBe(1);
  });

  it('must take every step', () => {
    expect(jump([1, 1, 1, 1])).toBe(3);
  });
});
