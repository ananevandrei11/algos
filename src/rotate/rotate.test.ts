import { rotate } from './rotate';

describe('rotate', () => {
  it('пример 1: [1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4]', () => {
    const nums = [1, 2, 3, 4, 5, 6, 7];
    rotate(nums, 3);
    expect(nums).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });

  it('пример 2: [-1,-100,3,99], k=2 → [3,99,-1,-100]', () => {
    const nums = [-1, -100, 3, 99];
    rotate(nums, 2);
    expect(nums).toEqual([3, 99, -1, -100]);
  });

  it('k=0 — массив не изменяется', () => {
    const nums = [1, 2, 3];
    rotate(nums, 0);
    expect(nums).toEqual([1, 2, 3]);
  });

  it('k равно длине массива — массив не изменяется', () => {
    const nums = [1, 2, 3];
    rotate(nums, 3);
    expect(nums).toEqual([1, 2, 3]);
  });

  it('k больше длины массива (k % n)', () => {
    const nums = [1, 2, 3, 4, 5];
    rotate(nums, 7); // 7 % 5 = 2
    expect(nums).toEqual([4, 5, 1, 2, 3]);
  });

  it('массив из одного элемента', () => {
    const nums = [42];
    rotate(nums, 5);
    expect(nums).toEqual([42]);
  });

  it('массив из двух элементов, k=1', () => {
    const nums = [1, 2];
    rotate(nums, 1);
    expect(nums).toEqual([2, 1]);
  });
});
