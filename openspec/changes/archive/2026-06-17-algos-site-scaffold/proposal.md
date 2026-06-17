## Why

Algorithm walkthroughs currently live as scattered standalone HTML files (`src/*/visualize*.html`) with hardcoded, copy-pasted logic. They can't be discovered, reused, or presented as a cohesive whole. What's needed is a showcase site: a catalog of algorithms plus interactive step-by-step visualizations built on top of the real functions from `src/`.

This change covers the first step — the site skeleton and one migrated example. Migrating the rest of the algorithms is separate, later work.

## What Changes

- Add a frontend application in `site/` on **Vite + React + TypeScript** with **TanStack Router**, with its own `package.json`. The root algorithms project and `src/` are not touched.
- A main catalog page listing algorithms + an algorithm page route.
- Visualization architecture modeled on the existing `visualize*.html`: a **shared player** (step / auto / reset over a sequence of states) + a **separate view component per algorithm** (because the walkthroughs are structurally different: window, subArray+counter, Map buckets). Not one universal grid.
- Visualization states are **data**, rendered by React components. No HTML strings, no `dangerouslySetInnerHTML`. State is local (`useReducer`/`useState`), no third-party state libraries.
- Real functions from `src/` are imported via an alias (read-only); the visualization's final answer is verified against the real function's result.
- One migrated example — `minSubArrayLen` — as proof that the skeleton works.

## Capabilities

### New Capabilities

- `algos-site-shell`: the application skeleton in `site/` — stack, dev/build, importing algorithms from `src/`, root layout, catalog and type-safe routes.
- `algorithm-visualizer`: shared step player + the "one view component per algorithm" architecture, data-instead-of-markup, verification against the real function, the `minSubArrayLen` example.

### Modified Capabilities

<!-- None: no existing specs. -->

## Impact

- **New code**: the `site/` directory (Vite/TS configs, React application sources).
- **Dependencies**: only inside `site/package.json` (`vite`, `react`, `react-dom`, `@tanstack/react-router`). Root `package.json` is not touched.
- **Reuse**: alias in Vite/tsconfig pointing to the root `src/` (read-only).
- **Not affected**: algorithms, Jest tests, existing `visualize*.html` (remain until a separate migration).
