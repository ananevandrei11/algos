export function groupAnagrams(strs: string[]): string[][] {
  if (strs.length === 1) {
    return [[strs[0]]];
  }

  const groups = new Map<string, string[]>();
  for (const str of strs) {
    const key = [...str].sort().join("");
    const group = groups.get(key);
    if (group) {
      group.push(str);
    } else {
      groups.set(key, [str]);
    }
  }
  return [...groups.values()];
}
