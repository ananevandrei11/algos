export function romanToInt(s: string): number {
  const mapRoman: Record<string, number> = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  }

  let res = 0;
  for (let i = 0; i < s.length; i++) {
    const current = mapRoman[s[i]];
    const next = mapRoman[s[i + 1]] || 0;

    if (current >= next) {
      res += current;
    } else {
      res -= current;
    }
  }
  return res;
};
