import { romanToInt } from './romanToInt';

describe('romanToInt', () => {
  // Basic single symbols
  it('should convert single symbol I to 1', () => {
    expect(romanToInt('I')).toBe(1);
  });

  it('should convert single symbol V to 5', () => {
    expect(romanToInt('V')).toBe(5);
  });

  it('should convert single symbol X to 10', () => {
    expect(romanToInt('X')).toBe(10);
  });

  it('should convert single symbol L to 50', () => {
    expect(romanToInt('L')).toBe(50);
  });

  it('should convert single symbol C to 100', () => {
    expect(romanToInt('C')).toBe(100);
  });

  it('should convert single symbol D to 500', () => {
    expect(romanToInt('D')).toBe(500);
  });

  it('should convert single symbol M to 1000', () => {
    expect(romanToInt('M')).toBe(1000);
  });

  // Examples from the problem
  it('should convert III to 3', () => {
    expect(romanToInt('III')).toBe(3);
  });

  it('should convert XII to 12', () => {
    expect(romanToInt('XII')).toBe(12);
  });

  it('should convert XXVII to 27', () => {
    expect(romanToInt('XXVII')).toBe(27);
  });

  it('should convert LVIII to 58', () => {
    expect(romanToInt('LVIII')).toBe(58);
  });

  it('should convert MCMXCIV to 1994', () => {
    expect(romanToInt('MCMXCIV')).toBe(1994);
  });

  // Subtractive cases
  it('should convert IV to 4', () => {
    expect(romanToInt('IV')).toBe(4);
  });

  it('should convert IX to 9', () => {
    expect(romanToInt('IX')).toBe(9);
  });

  it('should convert XL to 40', () => {
    expect(romanToInt('XL')).toBe(40);
  });

  it('should convert XC to 90', () => {
    expect(romanToInt('XC')).toBe(90);
  });

  it('should convert CD to 400', () => {
    expect(romanToInt('CD')).toBe(400);
  });

  it('should convert CM to 900', () => {
    expect(romanToInt('CM')).toBe(900);
  });

  // Edge cases
  it('should convert MMMCMXCIX to 3999 (maximum)', () => {
    expect(romanToInt('MMMCMXCIX')).toBe(3999);
  });

  it('should convert MMXXIII to 2023', () => {
    expect(romanToInt('MMXXIII')).toBe(2023);
  });

  it('should convert CMXCIX to 999', () => {
    expect(romanToInt('CMXCIX')).toBe(999);
  });

  it('should convert XLIV to 44', () => {
    expect(romanToInt('XLIV')).toBe(44);
  });
});
