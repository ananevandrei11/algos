import { spiralOrder } from './spiralOrder';

describe('spiralOrder', () => {
  it('covers the first LeetCode example', () => {
    expect(
      spiralOrder([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
    ).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
  });

  it('covers the second LeetCode example', () => {
    expect(
      spiralOrder([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]),
    ).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
  });

  it('handles a single element', () => {
    expect(spiralOrder([[42]])).toEqual([42]);
  });

  it('handles a single row', () => {
    expect(spiralOrder([[1, 2, 3, 4]])).toEqual([1, 2, 3, 4]);
  });

  it('handles a single column', () => {
    expect(spiralOrder([[1], [2], [3], [4]])).toEqual([1, 2, 3, 4]);
  });

  it('handles a square matrix', () => {
    expect(
      spiralOrder([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([1, 2, 4, 3]);
  });

  it('spirals into the center of a larger square matrix', () => {
    expect(
      spiralOrder([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]),
    ).toEqual([1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]);
  });

  it('handles a tall matrix', () => {
    expect(
      spiralOrder([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ]),
    ).toEqual([1, 2, 4, 6, 8, 7, 5, 3]);
  });

  it('handles a wide matrix', () => {
    expect(
      spiralOrder([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]),
    ).toEqual([1, 2, 3, 4, 8, 7, 6, 5]);
  });

  it('handles negative numbers', () => {
    expect(
      spiralOrder([
        [-1, -2],
        [-3, -4],
      ]),
    ).toEqual([-1, -2, -4, -3]);
  });
});
