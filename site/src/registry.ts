import type { ComponentType } from "react";
import { MinSubArrayLenViz } from "./algorithms/minSubArrayLen";
import minSubArrayLenSource from "@algos/minSubArrayLen/minSubArrayLen.ts?raw";
import { RemoveElementViz } from "./algorithms/removeElement";
import removeElementSource from "@algos/removeElement/removeElement.ts?raw";

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
];

export function findAlgo(slug: string): AlgoEntry | undefined {
  return algorithms.find((a) => a.slug === slug);
}
