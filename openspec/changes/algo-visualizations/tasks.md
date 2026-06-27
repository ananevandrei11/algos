## 1. Foundation: source-code block + recipe

- [x] 1.1 Add a `source: string` field to `AlgoEntry` in `site/src/registry.ts`
- [x] 1.2 Render `<pre className="source">{algo.source}</pre>` under `<Visualization/>` in `site/src/routes/AlgoPage.tsx`
- [x] 1.3 Add `.source` styles (monospace block) to `site/src/styles.css`
- [x] 1.4 Wire the `minSubArrayLen` entry with `source` via `import code from "@algos/minSubArrayLen/minSubArrayLen.ts?raw"` as the reference example of the full recipe

## 2. Array row + pointers/index

- [x] 2.1 `removeElement`
- [x] 2.2 `removeDuplicates`
- [x] 2.3 `removeDuplicatesMedium`
- [x] 2.4 `twoSumMedium` (trace the naive nested loop from `src/`, not two-pointer)
- [x] 2.5 `threeSum`
- [x] 2.6 `maxArea`
- [x] 2.7 `isPalindrome`
- [x] 2.8 `reverseWords`
- [x] 2.9 `searchInsert`
- [x] 2.10 `lengthOfLongestSubstring`
- [x] 2.11 `containsNearbyDuplicate`
- [x] 2.12 `productExceptSelf`
- [x] 2.13 `mergeArray`
- [x] 2.14 `canJump`
- [x] 2.15 `jump`
- [x] 2.16 `maxProfit`
- [x] 2.17 `maxProfitMedium`
- [x] 2.18 `majorityElement`
- [ ] 2.19 `hIndex`
- [ ] 2.20 `canCompleteCircuit`

## 3. Hash table (key → value)

- [ ] 3.1 `isAnagram`
- [ ] 3.2 `groupAnagrams`
- [ ] 3.3 `isIsomorphic`
- [ ] 3.4 `wordPattern`
- [ ] 3.5 `longestConsecutive`
- [ ] 3.6 `singleNumber`

## 4. Intervals on a number line

- [ ] 4.1 `mergeIntervals`
- [ ] 4.2 `insertIntervals`
- [ ] 4.3 `summaryRanges`

## 5. Grid / matrix

- [ ] 5.1 `spiralOrder`
- [ ] 5.2 `rotate`

## 6. Bit row

- [ ] 6.1 `hammingWeight`
- [ ] 6.2 `reverseBits`
- [ ] 6.3 `addBinary`

## 7. Linked list / stack

- [ ] 7.1 `mergeTwoSortedLists`
- [ ] 7.2 `isValidParentheses`

## 8. Scalar / string in focus

- [ ] 8.1 `mySqrt`
- [ ] 8.2 `isHappy`
- [ ] 8.3 `plusOne`
- [ ] 8.4 `isPalindromeNumber`
- [ ] 8.5 `romanToInt`
- [ ] 8.6 `intToRomanMedium`
- [ ] 8.7 `lengthOfLastWord`
- [ ] 8.8 `longestCommonPrefix`
- [ ] 8.9 `strStr`
- [ ] 8.10 `convertZigZag`

## 9. Special data structures

- [ ] 9.1 `RandomizedSet`
- [ ] 9.2 `parseArgs`

## 10. Catalog & verification

- [ ] 10.1 Group catalog cards by category/tags in `site/src/routes/Catalog.tsx`
- [ ] 10.2 Run `cd site && npm run dev`, walk every page: Step/Auto/Reset work, log reads sensibly, source block shows the `src/` file, verification line is green
- [ ] 10.3 Run `cd site && npm run build` (`tsc --noEmit && vite build`) — types and build clean
