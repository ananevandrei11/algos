export function lengthOfLongestSubstring(s: string): number {
  // let final = "";
  // if (s.length <= 1) {
  //   return s.length;
  // }
  // for (let i = 0; i < s.length; i += 1) {
  //   const set = new Set();
  //   let res = "";
  //   let count = i + 1;
  //   let is = true;
  //   res += s[i];
  //   set.add(s[i]);
  //   while (is && count < s.length) {
  //     if (count === s.length - 1 && !set.has(s[count])) {
  //       res += s[count];
  //       final = final.length > res.length ? final : res;
  //       is = false;
  //     }
  //     if (set.has(s[count]) || count === s.length - 1) {
  //       is = false;
  //       final = final.length > res.length ? final : res;
  //     } else {
  //       set.add(s[count]);
  //       res += s[count];
  //       count++;
  //     }
  //   }
  // }
  // return final.length;
  const map = new Map<string, number>();
  let left = 0;
  let res = 0;

  for (let right = 0; right < s.length; right++) {
    const curr = s[right];
    if (map.has(curr)) {
      const a = map.get(curr) || 0;
      left = Math.max(a + 1, left);
    }
    map.set(curr, right);
    res = Math.max(res, right - left + 1);
  }
  return res;
}
