## Context

The repository is a collection of TypeScript algorithms (`src/<algo>/<algo>.ts` + Jest). Step-by-step walkthroughs exist as standalone HTML pages and are worth studying as a ready-made pattern before implementing:
- `src/minSubArrayLen/visualize.html` — sliding window: array + window `[left..right]`, sum/res.
- `src/minSubArrayLen/visualize-mymethod.html` — O(n²): array + subArray + operation counter.
- `src/groupAnagrams/visualize.html` — a Map with "key → group" buckets, no array-window at all.

Conclusion: the walkthroughs are **structurally different**. Forcing everything onto one cell grid is a dead end (exactly what sank the previous attempt). All three already use the same trick: precompute the run as an array of "frames" (state snapshots), then a player steps through them.

## Goals / Non-Goals

**Goals:**
- An isolated application in `site/` that does not touch the root project or `src/`.
- Import real functions from `src/` via an alias (read-only).
- A working skeleton: layout, catalog, algorithm page route.
- A shared player + a "one view per algorithm" architecture; data instead of markup.
- One example — `minSubArrayLen`.

**Non-Goals:**
- Migrating all algorithms and all `visualize*.html`.
- Deployment, CI, a design system, analytics.
- Changing algorithm logic / tests.
- Any state library (zustand etc.) — without a proven need.

## Decisions

### Stack and placement: Vite + React + TS + TanStack Router, `site/` folder
User's choice. A dedicated `package.json` isolates the frontend (ESM/bundler) from the root (CommonJS); the root `tsc`/Jest stays untouched.

### Shared player + per-algorithm view (NOT a universal grid)
Split into two layers:
- **`StepPlayer`** — shared: takes an array of frames `State[]` and a render function `(state) => ReactNode`, owns the step index and controls (Step/Auto/Reset) via `useReducer`. Knows nothing about any specific algorithm.
- **per-algorithm view component** — knows how to draw this specific algorithm's state (window / subArray / Map buckets) in plain JSX.

The alternative (one universal cell grid) is rejected: `groupAnagrams` does not fit it. Each algorithm supplies `{ states, render }` to the player.

### States are data, rendering is components
A frame (`State`) is **semantic data** (indices, pointers, values, the log/event as structured fields), not an HTML string. The view renders it with JSX components. `dangerouslySetInnerHTML` and building markup from strings are **forbidden**. This is the direct lesson of the previous attempt.

### State is local, no libraries
The step index and auto mode are local to a single player; `useReducer` is enough. We do not introduce zustand/redux: there is no shared/global state yet. When a real need appears (synced visualizations, comparing approaches on one timeline), we reconsider.

### Reuse of `src/` + verification
Alias `@algos` → `../src` in Vite and tsconfig. We import the real function (read-only). The frame generator lives in `site/` (the step-by-step breakdown cannot be extracted automatically from a final answer — that is human judgment). The visualization's final answer is verified against the real function's result for the same input.

### Routes
- `/` — catalog (list from a typed algorithm registry).
- `/algo/$slug` — algorithm page; an unknown `slug` → a "not found" state, without crashing.

## Risks / Trade-offs

- **The frame generator duplicates the algorithm logic** → the step-by-step version still has to be written separately (in `site/`). Mitigated by verifying the final answer against the real function.
- **Temptation of premature abstractions** → keep it minimal: `StepPlayer` + per-algorithm view + registry. A new algorithm = one states file + one view component.
- **CommonJS in `src/` vs ESM in `site/`** → Vite resolves the `.ts` sources directly, the module systems do not conflict.

## Open Questions

- TanStack routes: file-based (codegen plugin) or a manual route tree in code. At the start — whichever is simpler; decided in tasks.
