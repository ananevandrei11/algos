import { removeDuplicatesMedium } from './removeDuplicatesMedium';

describe('removeDuplicatesMedium', () => {
  it('example 1: [1,1,1,2,2,3] → k=5', () => {
    const k = removeDuplicatesMedium([1, 1, 1, 2, 2, 3]);
    expect(k).toBe(5);
  });

  it('example 2: [0,0,1,1,1,1,2,3,3] → k=7', () => {
    const k = removeDuplicatesMedium([0, 0, 1, 1, 1, 1, 2, 3, 3]);
    expect(k).toBe(7);
  });

  it('no duplicates: k=5', () => {
    const k = removeDuplicatesMedium([1, 2, 3, 4, 5]);
    expect(k).toBe(5);
  });

  it('all same elements: k=2', () => {
    const k = removeDuplicatesMedium([7, 7, 7, 7, 7]);
    expect(k).toBe(2);
  });

  it('single element: k=1', () => {
    const k = removeDuplicatesMedium([42]);
    expect(k).toBe(1);
  });

  it('three identical elements: k=2', () => {
    const k = removeDuplicatesMedium([3, 3, 3]);
    expect(k).toBe(2);
  });

  it('negative numbers: k=6', () => {
    const k = removeDuplicatesMedium([-4, -4, -4, -1, -1, 0, 2, 2, 2]);
    expect(k).toBe(7);
  });
});
