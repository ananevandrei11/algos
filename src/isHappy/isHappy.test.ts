import { isHappy } from './isHappy';

describe('isHappy', () => {
  it('19: true (1²+9²=82 → ... → 1)', () => {
    expect(isHappy(19)).toBe(true);
  });

  it('2: false (зацикливается без 1)', () => {
    expect(isHappy(2)).toBe(false);
  });

  it('1: true (граничный — уже счастливое)', () => {
    expect(isHappy(1)).toBe(true);
  });

  it('7: true', () => {
    expect(isHappy(7)).toBe(true);
  });

  it('4: false (попадает в классический цикл 4→16→37→58→89→145→42→20→4)', () => {
    expect(isHappy(4)).toBe(false);
  });

  it('100: true (1²+0²+0²=1)', () => {
    expect(isHappy(100)).toBe(true);
  });

  it('10: true', () => {
    expect(isHappy(10)).toBe(true);
  });

  it('23: true', () => {
    expect(isHappy(23)).toBe(true);
  });

  it('3: false', () => {
    expect(isHappy(3)).toBe(false);
  });

  it('1111111: true (семь единиц, сумма квадратов = 7)', () => {
    expect(isHappy(1111111)).toBe(true);
  });

  it('2147483647: false (верхняя граница 2³¹−1)', () => {
    expect(isHappy(2147483647)).toBe(false);
  });
});
