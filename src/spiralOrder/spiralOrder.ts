export function spiralOrder(matrix: number[][]): number[] {
  if (matrix.length === 1) {
    return matrix[0];
  }
  let res: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      res.push(matrix[top][col]);
    }
    top++;
    for (let row = top; row <= bottom; row++) {
      res.push(matrix[row][right]);
    }
    right--;
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        res.push(matrix[bottom][col]);
      }
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        res.push(matrix[row][left]);
      }
      left++;
    }
  }
  return res;
}

spiralOrder([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);
// .toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
