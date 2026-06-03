import { isPalindromeNumber } from './isPalindromeNumber';

describe('isPalindromeNumber', () => {
  it('возвращает true для палиндрома 121', () => {
    expect(isPalindromeNumber(121)).toBe(true);
  });

  it('возвращает false для отрицательного -121', () => {
    expect(isPalindromeNumber(-121)).toBe(false);
  });

  it('возвращает false для 10 (читается как 01)', () => {
    expect(isPalindromeNumber(10)).toBe(false);
  });

  it('возвращает true для однозначного 0', () => {
    expect(isPalindromeNumber(0)).toBe(true);
  });

  it('возвращает true для однозначного 7', () => {
    expect(isPalindromeNumber(7)).toBe(true);
  });

  it('возвращает true для чётного палиндрома 1221', () => {
    expect(isPalindromeNumber(1221)).toBe(true);
  });

  it('возвращает false для непалиндрома 123', () => {
    expect(isPalindromeNumber(123)).toBe(false);
  });

  it('возвращает false для оканчивающегося на 0 числа 100', () => {
    expect(isPalindromeNumber(100)).toBe(false);
  });

  it('возвращает true для большого палиндрома 1234567654321', () => {
    expect(isPalindromeNumber(1234567654321)).toBe(true);
  });
});
