import type { ComponentType } from "react";
import { MinSubArrayLenViz } from "./algorithms/minSubArrayLen";

// One entry per algorithm. Drives both the catalog and the /algo/$slug route.
// A new algorithm = one module (states + view) + one entry here.
export interface AlgoEntry {
  slug: string;
  title: string;
  tags: string[];
  Visualization: ComponentType;
}

export const algorithms: AlgoEntry[] = [
  {
    slug: "minSubArrayLen",
    title: "Minimum Size Subarray Sum",
    tags: ["array", "sliding-window", "O(n)"],
    Visualization: MinSubArrayLenViz,
  },
];

export function findAlgo(slug: string): AlgoEntry | undefined {
  return algorithms.find((a) => a.slug === slug);
}
