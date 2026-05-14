import { maxProfitMedium } from './maxProfitMedium';

describe('maxProfitMedium', () => {
  it('должен вернуть 7 для [7,1,5,3,6,4]', () => {
    expect(maxProfitMedium([7, 1, 5, 3, 6, 4])).toBe(7);
  });

  it('должен вернуть 4 для [1,2,3,4,5]', () => {
    expect(maxProfitMedium([1, 2, 3, 4, 5])).toBe(4);
  });

  it('должен вернуть 0 для убывающего массива [7,6,4,3,1]', () => {
    expect(maxProfitMedium([7, 6, 4, 3, 1])).toBe(0);
  });

  it('должен вернуть 0 для массива из одного элемента', () => {
    expect(maxProfitMedium([5])).toBe(0);
  });

  it('должен вернуть 0 для одинаковых цен [3,3,3]', () => {
    expect(maxProfitMedium([3, 3, 3])).toBe(0);
  });

  it('должен вернуть прибыль для двух дней [1,5]', () => {
    expect(maxProfitMedium([1, 5])).toBe(4);
  });
});
