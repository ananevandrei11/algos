import { isValidParentheses } from './isValidParentheses';

describe('isValidParentheses', () => {
  it('простая пара скобок', () => {
    expect(isValidParentheses('()')).toBe(true);
  });

  it('несколько пар разных скобок', () => {
    expect(isValidParentheses('()[]{}')).toBe(true);
  });

  it('неправильный порядок закрытия', () => {
    expect(isValidParentheses('(]')).toBe(false);
  });

  it('вложенные скобки', () => {
    expect(isValidParentheses('([])')).toBe(true);
  });

  it('перекрещивающиеся скобки', () => {
    expect(isValidParentheses('([)]')).toBe(false);
  });

  it('только открывающая скобка', () => {
    expect(isValidParentheses('(')).toBe(false);
  });

  it('только закрывающая скобка', () => {
    expect(isValidParentheses(')')).toBe(false);
  });

  it('глубокая вложенность', () => {
    expect(isValidParentheses('{[()]}')).toBe(true);
  });

  it('нечётная длина', () => {
    expect(isValidParentheses('(()')).toBe(false);
  });

  it('перемешанные скобки разных типов', () => {
    expect(isValidParentheses('(}{)')).toBe(false);
  });
});
