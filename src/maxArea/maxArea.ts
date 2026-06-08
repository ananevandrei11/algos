export function maxArea(height: number[]): number {
  let max = 0;
  // for (let i = 0; i < height.length; i++) {
  //   const leftHeight = height[i];
  //   for (let j = height.length - 1; j >= 0; j--) {
  //     const rightHeight = height[j];
  //     const currHeight = leftHeight >= rightHeight ? rightHeight : leftHeight;
  //     const betweenIndex = j - i;
  //     const volume = currHeight * betweenIndex;
  //     if (volume > max) {
  //       max = volume;
  //     }
  //   }
  // }
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    const leftHeight = height[left];
    const rightHeight = height[right];
    const currHeight = leftHeight >= rightHeight ? rightHeight : leftHeight;
    const betweenIndex = right - left;
    if (leftHeight >= rightHeight) {
      right--;
    } else {
      left++;
    }
    const volume = currHeight * betweenIndex;
    if (volume > max) {
      max = volume;
    }
  }
  return max;
}
