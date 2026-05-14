export function maxProfitMedium(prices: number[]): number {
  let profit = 0;
  let i = 0;

  while (i < prices.length - 1) {
    // ищем долину (локальный минимум)
    while (i < prices.length - 1 && prices[i] >= prices[i + 1]) i++;
    const buy = prices[i];

    // ищем пик (локальный максимум)
    while (i < prices.length - 1 && prices[i] <= prices[i + 1]) i++;
    const sell = prices[i];

    profit += sell - buy;
  }

  return profit;
}
