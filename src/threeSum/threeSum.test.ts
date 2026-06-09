import { threeSum } from './threeSum';

// Neither the order of the triplets nor the order inside a triplet matters,
// so we normalize before comparing.
const normalize = (triplets: number[][]): number[][] =>
  triplets
    .map((triplet) => [...triplet].sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

const expectTriplets = (actual: number[][], expected: number[][]) => {
  expect(normalize(actual)).toEqual(normalize(expected));
};

describe('threeSum', () => {
  it('covers the first LeetCode example', () => {
    expectTriplets(threeSum([-1, 0, 1, 2, -1, -4]), [
      [-1, -1, 2],
      [-1, 0, 1],
    ]);
  });

  it('covers the second LeetCode example', () => {
    expectTriplets(threeSum([0, 1, 1]), []);
  });

  it('covers the third LeetCode example', () => {
    expectTriplets(threeSum([0, 0, 0]), [[0, 0, 0]]);
  });

  it('returns nothing for the minimal non-matching array', () => {
    expectTriplets(threeSum([1, 2, 3]), []);
  });

  it('does not reuse a single zero as three indices', () => {
    expectTriplets(threeSum([0, 0]), []);
  });

  it('drops duplicate triplets coming from repeated values', () => {
    expectTriplets(threeSum([-2, 0, 0, 2, 2]), [[-2, 0, 2]]);
  });

  it('finds several distinct triplets', () => {
    expectTriplets(threeSum([-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]), [
      [-4, -2, 6],
      [-4, 0, 4],
      [-4, 1, 3],
      [-4, 2, 2],
      [-2, -2, 4],
      [-2, 0, 2],
    ]);
  });

  it('handles all-positive numbers', () => {
    expectTriplets(threeSum([1, 2, 3, 4, 5]), []);
  });

  it('handles all-negative numbers', () => {
    expectTriplets(threeSum([-1, -2, -3, -4, -5]), []);
  });

  it('collapses many duplicates into unique triplets', () => {
    expectTriplets(threeSum([-1, -1, -1, 0, 0, 1, 1, 1]), [
      [-1, 0, 1],
    ]);
  });

  it('finds the triplet at the boundaries of the value range', () => {
    expectTriplets(threeSum([-100000, 100000, 0, 5, -5]), [
      [-100000, 0, 100000],
      [-5, 0, 5],
    ]);
  });
});
