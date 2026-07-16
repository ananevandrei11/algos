# Project: algos

Repo of LeetCode-style algorithm implementations in `src/` (read-only source of truth)
plus a visualization site in `site/` (Vite + React 19 + TanStack Router).

## Visualization work (opsx:apply algo-visualizations)

When implementing the `algo-visualizations` change:

1. **Use the `viz-recipe` skill** for every visualization module. It defines the module
   pattern (states-as-data, view-per-structure, verification against `src/`, `?raw`
   source block) and the core rule: trace the **exact implementation in `src/`**, not an
   optimized rewrite.

2. **Implement ONE task at a time, then STOP.** Do one task from
   `openspec/changes/algo-visualizations/tasks.md` (the `- [ ]` items), mark it
   `- [ ]` → `- [x]`, commit, and end the session — do not continue to the next
   task in the same session. The next session resumes from the first unchecked box.
   This makes `/opsx:apply algo-visualizations` (no further arguments) the only command
   needed each session; it overrides apply's default "keep going until done".

3. **At a control point (the task that completes a `## N.` group — all its boxes now
   `- [x]`), delegate before stopping:**
   - `Agent(viz-reviewer)` — reviews the whole group diff against the recipe; fix findings.
   - `Agent(viz-tester)` — walks the new pages in the browser; fix problems.
   - Do not start the next group until both come back GREEN.

   Per-task stop, but per-group review: subagents start cold, so call them once the
   group is complete (reviewer reads the accumulated `git diff`), not on every module.

## Do not touch

- `src/` — read-only.
- `site/src/components/StepPlayer.tsx` — generic player, unchanged.
- `.claude/commands/opsx/*` and `.claude/skills/openspec-*` — managed by `openspec init`.
