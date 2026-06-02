import { hammingWeight } from './hammingWeight';

describe('hammingWeight', () => {
  it('считает три единицы в 1011 (11)', () => {
    expect(hammingWeight(11)).toBe(3);
  });

  it('считает одну единицу в 10000000 (128)', () => {
    expect(hammingWeight(128)).toBe(1);
  });

  it('считает тридцать единиц в 2147483645', () => {
    expect(hammingWeight(2147483645)).toBe(30);
  });

  it('возвращает 1 для минимального n = 1', () => {
    expect(hammingWeight(1)).toBe(1);
  });

  it('считает все 31 бит для максимального n = 2^31 - 1', () => {
    expect(hammingWeight(2147483647)).toBe(31);
  });
});
