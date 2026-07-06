## Why

The repo has 49 algorithm implementations in `src/`, but only one of them
(`minSubArrayLen`) is visualized in `site/`. We want a step-by-step visualization
of every algorithm — showing the **exact implementation that lives in `src/`** at
work (including its naive loops), not an idealized rewrite. The set will keep
growing, so the change must also fix a repeatable recipe for adding the next one.

## What Changes

- Establish a repeatable per-algorithm recipe: a module that builds an ordered list
  of plain-data states (the frame trace) plus a view component, played by the shared
  `StepPlayer`, with the final answer verified against the real `src/` function.
- The frame trace SHALL follow the **actual implementation in `src/<name>/<name>.ts`**
  step by step (optimization is not a goal — fidelity to that code is).
- Add a static source-code block under each visualization, loaded from `src/` via
  Vite `?raw` import so it can never drift from the real file.
- Cover all 49 algorithms from `src/`, each as a self-contained module with a view
  form chosen to fit its data structure (array row, hash table, intervals, grid,
  bit row, linked list, stack, scalar). New algorithms added one at a time.
- Group the catalog by category/tags once the card count grows.

## Capabilities

### New Capabilities
- `algorithm-visualizations`: data-driven step player, per-algorithm view components
  that trace the real `src/` implementation, answer verification against `src/`, a
  raw source-code block per page, and full coverage of the algorithms in `src/` plus
  the recipe for extending it.

### Modified Capabilities
<!-- None. openspec/specs/ is empty; this is a fresh start. -->

## Impact

- `site/src/algorithms/<name>.tsx` — one module per algorithm (49 + future).
- `site/src/registry.ts` — one entry per algorithm; add a `source` field (raw import).
- `site/src/routes/AlgoPage.tsx` — render the `<pre>` source block under the visualization.
- `site/src/routes/Catalog.tsx` — grouping by category when cards grow.
- `site/src/styles.css` — styles for the source block and new view forms.
- `site/src/components/StepPlayer.tsx` — unchanged (already generic).
- `src/` — read-only, never modified.
