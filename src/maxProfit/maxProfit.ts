export function maxProfit(prices: number[]): number {
  if (prices.length <= 1) {
    return 0;
  }
  let minPrice = prices[0];
  let maxProfit = 0;
  for (let i = 1; i < prices.length; i += 1) {
    const curr = prices[i];
    if (curr < minPrice) {
      minPrice = curr;
    }
    const currProfit = curr - minPrice;
    maxProfit = currProfit > maxProfit ? currProfit : maxProfit;
  }
  return maxProfit;
}
