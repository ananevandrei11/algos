export function mySqrt(x: number): number {
  // if (x === 0 || x === 1) {
  //   return x;
  // }
  // let aproximatly = 10;
  // while (aproximatly > 0) {
  //   const curr = ((aproximatly + (x / aproximatly)) * 0.5);
  //   if (Math.round(curr * curr) === x) {
  //     return Math.floor(curr);
  //   }
  //   aproximatly = curr;
  //   console.log('aproximatly', aproximatly);
  // }
  // return Math.floor(aproximatly);

  let q = x;
  while (q * q > x) {
    q = Math.floor((q + x / q) / 2);
  }
  return q;
}
