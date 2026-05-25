export function isIsomorphic(s: string, t: string): boolean {
  const getMap = (word: string) => {
    const wordtMap = new Map<string, number[]>();
    for (let i = 0; i < word.length; i += 1) {
      const curr = word[i];
      if (!wordtMap.has(curr)) {
        wordtMap.set(curr, [i]);
      } else {
        let getCurr = wordtMap.get(curr) || [];
        getCurr.push(i);
        wordtMap.set(curr, getCurr);
      }
    }
    return wordtMap;
  };
  const sMap = getMap(s);
  const tMap = getMap(t);
  if (sMap.size !== tMap.size) {
    return false;
  }
  const sMapIndexes = [...sMap.values()];
  const tMapIndexes = [...tMap.values()];

  for (let i = 0; i < sMapIndexes.length; i += 1) {
    const currS = sMapIndexes[i];
    const currT = tMapIndexes[i];
    for (let j = 0; j < currS.length; j += 1) {
      if (currS[j] !== currT[j]) {
        return false;
      }
    }
  }

  return true;
}
