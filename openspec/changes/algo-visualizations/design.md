## Context

`site/` is an isolated Vite + React 19 + TanStack Router app that imports the real
algorithm functions from the repo root `src/` (read-only) via the `@algos` alias.
One algorithm (`minSubArrayLen`) already proves the pattern: a module builds an
ordered list of plain-data states plus a view component, played by a generic
`StepPlayer`, with the final answer verified against the real `src/` function.

We are scaling this from 1 to all 49 algorithms, and the set will keep growing. The
defining constraint from the user: visualize the **exact implementation in `src/`**,
not an idealized rewrite. Optimization is explicitly not a goal.

## Goals / Non-Goals

**Goals:**
- A repeatable recipe so each algorithm is one self-contained module + one registry entry.
- Frame traces faithful to the actual `src/<name>/<name>.ts` code.
- A static source-code block per page that physically cannot drift from `src/`.
- Answer verification against the real `src/` function on every page.

**Non-Goals:**
- Optimizing or rewriting algorithms (fidelity beats elegance here).
- A universal layout for all algorithms — each picks a view form for its data.
- Pre-extracting shared view primitives before duplication is actually visible.
- Line-by-line code-highlight sync with the source block.

## Decisions

- **Trace the real implementation, not an optimal twin.** `buildStates` reimplements
  the body of the `src/` function with `states.push(...)` at each significant step.
  This is unavoidable (an uninstrumented function can't be traced) and must mirror the
  src code, including naive loops. _Alternative considered:_ instrumenting `src/`
  directly — rejected, `src/` is read-only and must stay clean.

- **States are data; views are components.** A state is `{ ...snapshot, log }` with a
  structured `log` event rendered by JSX. No HTML strings, no `dangerouslySetInnerHTML`.
  _Alternative:_ render-to-string per frame — rejected, it's the anti-pattern this
  architecture exists to avoid.

- **Source block via Vite `?raw` import.** `import code from "@algos/<name>/<name>.ts?raw"`
  yields the file text; render it in a `<pre>` under the visualization. Guarantees the
  shown code equals the real file. Wire it once: add a `source` field to `AlgoEntry`
  and render the `<pre>` in `AlgoPage`, not in every module. _Alternative:_ hand-copying
  code into each module — rejected, it drifts.

- **One view form per data structure, chosen per algorithm.** Array row + pointers
  (exists), hash table, intervals on a number line, grid, bit row, linked list, stack,
  scalar. Shared primitives are extracted only after the repetition is real, not before.

- **Add algorithms one at a time.** Each is independent; the shared `StepPlayer` never
  changes. Catalog grouping by tags is added when card count makes a flat list unwieldy.

## Risks / Trade-offs

- **Trace can diverge from `src/` over time** → the per-page answer verification
  (`useMemo` + `===` against the real function) catches result divergence; the visible
  `<pre>` source keeps the displayed code honest. Step-level divergence is the residual
  risk, mitigated by keeping `buildStates` a literal transcription of the src body.
- **49 hand-written traces is real work** → accepted by design; the recipe keeps each
  one mechanical and the view forms are reused informally as they recur.
- **Premature abstraction** → explicitly deferred; duplication is allowed until a shared
  primitive is obviously warranted.
