export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }
  if (s.length === 0 && t.length === 0) {
    return true;
  }

  const sMap = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    const curr = s[i];
    if (!sMap.has(curr)) {
      sMap.set(curr, 1);
    } else {
      let getCurr = sMap.get(curr) || 0;
      sMap.set(curr, getCurr + 1);
    }
  }

  const tMap = new Map<string, number>();
  for (let i = 0; i < t.length; i++) {
    const curr = t[i];
    if (!tMap.has(curr)) {
      tMap.set(curr, 1);
    } else {
      let getCurr = tMap.get(curr) || 0;
      tMap.set(curr, getCurr + 1);
    }
  }

  const sMapKeys = [...sMap.keys()];
  for (let i = 0; i < sMapKeys.length; i++) {
    const sKey = sMap.get(sMapKeys[i]);
    const tKey = tMap.get(sMapKeys[i]);
    if (!tKey || !sKey) return false;
    if (tKey !== sKey) return false;
  }
  return true;
}
