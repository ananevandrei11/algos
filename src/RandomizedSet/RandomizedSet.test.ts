import { RandomizedSet } from './RandomizedSet';

describe('RandomizedSet', () => {
  it('insert возвращает true если элемента не было', () => {
    const rs = new RandomizedSet();
    expect(rs.insert(1)).toBe(true);
  });

  it('insert возвращает false если элемент уже есть', () => {
    const rs = new RandomizedSet();
    rs.insert(1);
    expect(rs.insert(1)).toBe(false);
  });

  it('remove возвращает true если элемент был', () => {
    const rs = new RandomizedSet();
    rs.insert(1);
    expect(rs.remove(1)).toBe(true);
  });

  it('remove возвращает false если элемента не было', () => {
    const rs = new RandomizedSet();
    expect(rs.remove(2)).toBe(false);
  });

  it('после remove элемент можно снова insert', () => {
    const rs = new RandomizedSet();
    rs.insert(1);
    rs.remove(1);
    expect(rs.insert(1)).toBe(true);
  });

  it('getRandom возвращает единственный элемент', () => {
    const rs = new RandomizedSet();
    rs.insert(42);
    expect(rs.getRandom()).toBe(42);
  });

  it('getRandom возвращает только элементы из набора', () => {
    const rs = new RandomizedSet();
    rs.insert(1);
    rs.insert(2);
    rs.insert(3);
    for (let i = 0; i < 20; i++) {
      expect([1, 2, 3]).toContain(rs.getRandom());
    }
  });

  it('пример из условия задачи', () => {
    const rs = new RandomizedSet();
    expect(rs.insert(1)).toBe(true);
    expect(rs.remove(2)).toBe(false);
    expect(rs.insert(2)).toBe(true);
    expect(rs.remove(1)).toBe(true);
    expect(rs.insert(2)).toBe(false);
    expect(rs.getRandom()).toBe(2);
  });
});
