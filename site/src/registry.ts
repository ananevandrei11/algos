import type { ComponentType } from "react";
import { MinSubArrayLenViz } from "./algorithms/minSubArrayLen";
import minSubArrayLenSource from "@algos/minSubArrayLen/minSubArrayLen.ts?raw";
import { RemoveElementViz } from "./algorithms/removeElement";
import removeElementSource from "@algos/removeElement/removeElement.ts?raw";
import { RemoveDuplicatesViz } from "./algorithms/removeDuplicates";
import removeDuplicatesSource from "@algos/removeDuplicates/removeDuplicates.ts?raw";
import { RemoveDuplicatesMediumViz } from "./algorithms/removeDuplicatesMedium";
import removeDuplicatesMediumSource from "@algos/removeDuplicatesMedium/removeDuplicatesMedium.ts?raw";
import { TwoSumMediumViz } from "./algorithms/twoSumMedium";
import twoSumMediumSource from "@algos/twoSumMedium/twoSumMedium.ts?raw";
import { ThreeSumViz } from "./algorithms/threeSum";
import threeSumSource from "@algos/threeSum/threeSum.ts?raw";
import { MaxAreaViz } from "./algorithms/maxArea";
import maxAreaSource from "@algos/maxArea/maxArea.ts?raw";
import { IsPalindromeViz } from "./algorithms/isPalindrome";
import isPalindromeSource from "@algos/isPalindrome/isPalindrome.ts?raw";
import { ReverseWordsViz } from "./algorithms/reverseWords";
import reverseWordsSource from "@algos/reverseWords/reverseWords.ts?raw";
import { SearchInsertViz } from "./algorithms/searchInsert";
import searchInsertSource from "@algos/searchInsert/searchInsert.ts?raw";
import { LengthOfLongestSubstringViz } from "./algorithms/lengthOfLongestSubstring";
import lengthOfLongestSubstringSource from "@algos/lengthOfLongestSubstring/lengthOfLongestSubstring.ts?raw";
import { ContainsNearbyDuplicateViz } from "./algorithms/containsNearbyDuplicate";
import containsNearbyDuplicateSource from "@algos/containsNearbyDuplicate/containsNearbyDuplicate.ts?raw";
import { ProductExceptSelfViz } from "./algorithms/productExceptSelf";
import productExceptSelfSource from "@algos/productExceptSelf/productExceptSelf.ts?raw";
import { MergeArrayViz } from "./algorithms/mergeArray";
import mergeArraySource from "@algos/mergeArray/mergeArray.ts?raw";
import { CanJumpViz } from "./algorithms/canJump";
import canJumpSource from "@algos/canJump/canJump.ts?raw";

// One entry per algorithm. Drives both the catalog and the /algo/$slug route.
// A new algorithm = one module (states + view) + one entry here.
export interface AlgoEntry {
  slug: string;
  title: string;
  tags: string[];
  Visualization: ComponentType;
  source: string; // raw text of src/<name>/<name>.ts (Vite ?raw import)
}

export const algorithms: AlgoEntry[] = [
  {
    slug: "minSubArrayLen",
    title: "Minimum Size Subarray Sum",
    tags: ["array", "sliding-window", "O(n)"],
    Visualization: MinSubArrayLenViz,
    source: minSubArrayLenSource,
  },
  {
    slug: "removeElement",
    title: "Remove Element",
    tags: ["array", "two-pointers", "in-place", "O(n)"],
    Visualization: RemoveElementViz,
    source: removeElementSource,
  },
  {
    slug: "removeDuplicates",
    title: "Remove Duplicates from Sorted Array",
    tags: ["array", "two-pointers", "in-place", "O(n)"],
    Visualization: RemoveDuplicatesViz,
    source: removeDuplicatesSource,
  },
  {
    slug: "removeDuplicatesMedium",
    title: "Remove Duplicates from Sorted Array II",
    tags: ["array", "two-pointers", "in-place", "O(n)"],
    Visualization: RemoveDuplicatesMediumViz,
    source: removeDuplicatesMediumSource,
  },
  {
    slug: "twoSumMedium",
    title: "Two Sum II – Input Array Is Sorted",
    tags: ["array", "two-pointers", "O(n²)"],
    Visualization: TwoSumMediumViz,
    source: twoSumMediumSource,
  },
  {
    slug: "threeSum",
    title: "3Sum",
    tags: ["array", "two-pointers", "sorting", "O(n²)"],
    Visualization: ThreeSumViz,
    source: threeSumSource,
  },
  {
    slug: "maxArea",
    title: "Container With Most Water",
    tags: ["array", "two-pointers", "O(n)"],
    Visualization: MaxAreaViz,
    source: maxAreaSource,
  },
  {
    slug: "isPalindrome",
    title: "Valid Palindrome",
    tags: ["string", "two-pointers", "O(n)"],
    Visualization: IsPalindromeViz,
    source: isPalindromeSource,
  },
  {
    slug: "reverseWords",
    title: "Reverse Words in a String",
    tags: ["string", "two-phase", "O(n)"],
    Visualization: ReverseWordsViz,
    source: reverseWordsSource,
  },
  {
    slug: "searchInsert",
    title: "Search Insert Position",
    tags: ["array", "binary-search", "O(log n)"],
    Visualization: SearchInsertViz,
    source: searchInsertSource,
  },
  {
    slug: "lengthOfLongestSubstring",
    title: "Longest Substring Without Repeating Characters",
    tags: ["string", "sliding-window", "hash-map", "O(n)"],
    Visualization: LengthOfLongestSubstringViz,
    source: lengthOfLongestSubstringSource,
  },
  {
    slug: "containsNearbyDuplicate",
    title: "Contains Duplicate II",
    tags: ["array", "hash-map", "sliding-window", "O(n)"],
    Visualization: ContainsNearbyDuplicateViz,
    source: containsNearbyDuplicateSource,
  },
  {
    slug: "productExceptSelf",
    title: "Product of Array Except Self",
    tags: ["array", "prefix-product", "O(n)"],
    Visualization: ProductExceptSelfViz,
    source: productExceptSelfSource,
  },
  {
    slug: "mergeArray",
    title: "Merge Sorted Array",
    tags: ["array", "two-pointers", "in-place", "O(m+n)"],
    Visualization: MergeArrayViz,
    source: mergeArraySource,
  },
  {
    slug: "canJump",
    title: "Jump Game",
    tags: ["array", "greedy", "O(n)"],
    Visualization: CanJumpViz,
    source: canJumpSource,
  },
];

export function findAlgo(slug: string): AlgoEntry | undefined {
  return algorithms.find((a) => a.slug === slug);
}
