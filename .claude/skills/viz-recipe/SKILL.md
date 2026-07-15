---
name: viz-recipe
description: Recipe for building an algorithm visualization module in site/. Use when implementing or reviewing a visualization for an algorithm from src/ (the algo-visualizations change, opsx:apply).
metadata:
  author: project
  version: "1.0"
---

# Algorithm visualization recipe

How to add one algorithm visualization to `site/`. One algorithm = one self-contained
module in `site/src/algorithms/<name>.tsx` + one entry in `site/src/registry.ts`.

Reference example: `site/src/algorithms/minSubArrayLen.tsx`.
Requirements spec: `openspec/changes/algo-visualizations/specs/algorithm-visualizations/spec.md`.

## Core rule

Visualize the **exact implementation in `src/<name>/<name>.ts`**, step by step,
including its non-optimal characteristics (naive nested loops stay nested loops).
Optimization is NOT a goal — fidelity to that code is. Do not substitute a smarter
algorithm. Trace the single exported function of the file (`minSubArrayLen`, which
has two functions, is the exception — trace the one the registry imports).

## Module pattern

```
buildStates(input) -> { states: State[], answer }   // the frame trace
View({ ...input, state })                            // renders the current frame
```

- **States are data.** `State = { ...dataSnapshot, log }` where `log` is a structured
  event (a discriminated union), rendered by a small `<LogLine>` JSX component.
- **No HTML strings.** Never build markup from strings; never use
  `dangerouslySetInnerHTML`. React components only.
- **`buildStates` mirrors the src body.** Push a state at each significant step
  (each loop iteration, each pointer move, each decision). It is a literal
  transcription of `src/<name>/<name>.ts`, instrumented — not a rewrite.
- **Play with the shared `StepPlayer`** (`site/src/components/StepPlayer.tsx`) —
  never modify it. Pass `states` and a `render` function.
- **Verify the answer.** `const expected = useMemo(() => realFn(input), [])` and
  compare `answer === expected`; render a green/red verification line.
- **Pick a small example input.** One small case is enough — typically one of the
  cases already in `src/<name>/<name>.test.ts`. No input UI; the example is hard-coded.

## View form per data structure

Pick the form that fits the data; do NOT force a universal layout:
- array row + pointers/index (see `minSubArrayLen`) — two-pointer, sliding window, in-place
- hash table (key→value rows) — anagram / isomorphic / wordPattern / majority / consecutive
- intervals on a number line — merge/insert intervals, summaryRanges
- grid / matrix — spiralOrder, rotate
- bit row (32 cells) — hammingWeight, reverseBits, addBinary
- linked list nodes — mergeTwoSortedLists
- stack column — isValidParentheses
- scalar/number in focus — mySqrt, isHappy, plusOne, hIndex

Do NOT pre-extract shared view primitives. Duplicate until the repetition is obvious,
then extract.

## Source-code block

Each page shows the real `src/` file under the visualization. Wired once, not per module:
- `AlgoEntry` (`site/src/registry.ts`) has a `source: string` field.
- Fill it via Vite raw import: `import code from "@algos/<name>/<name>.ts?raw"`.
- `AlgoPage` (`site/src/routes/AlgoPage.tsx`) renders `<pre className="source">{algo.source}</pre>`.

## Stack conventions

- React 19, TanStack Router, Vite. `@algos` alias → repo `src/` is **read-only**;
  never modify `src/`.
- Register the algorithm with a `slug`, `title`, `tags`, `Visualization`, and `source`.
