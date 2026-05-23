export function convertZigZag(s: string, numRows: number): string {
  if (numRows === 1) return s;

  const rows = new Array(numRows).fill("");
  let row = 0;
  let step = -1;

  for (const c of s) {
    console.log({
      row, step, c
    })
    rows[row] += c;
    if (row === 0 || row === numRows - 1) step = -step;
    row += step;
  }
  return rows.join("");
}
