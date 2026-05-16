import { canJump } from './canJump';

describe('canJump', () => {
  it('должен вернуть true для [2,3,1,1,4]', () => {
    expect(canJump([2, 3, 1, 1, 4])).toBe(true);
  });

  it('должен вернуть false для [3,2,1,0,4]', () => {
    expect(canJump([3, 2, 1, 0, 4])).toBe(false);
  });

  it('должен вернуть true для массива из одного элемента [0]', () => {
    expect(canJump([0])).toBe(true);
  });

  it('должен вернуть true для [1,0]', () => {
    expect(canJump([1, 0])).toBe(true);
  });

  it('должен вернуть false для [0,1]', () => {
    expect(canJump([0, 1])).toBe(false);
  });

  it('должен вернуть true для массива с большими прыжками [5,0,0,0,0]', () => {
    expect(canJump([5, 0, 0, 0, 0])).toBe(true);
  });

  it('должен вернуть false для [1,0,1,0]', () => {
    expect(canJump([1, 0, 1, 0])).toBe(false);
  });

  it('должен вернуть true для [2,0,0]', () => {
    expect(canJump([2, 0, 0])).toBe(true);
  });
});
