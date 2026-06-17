## 1. Study the examples

- [x] 1.1 Read the three `visualize*.html` (minSubArrayLen window, mymethod, groupAnagrams); capture the shared trick (frames array + player) and the structural differences

## 2. site/ skeleton

- [x] 2.1 Create `site/` with its own `package.json` (react, react-dom, @tanstack/react-router; dev: vite, @vitejs/plugin-react, typescript, types)
- [x] 2.2 `site/tsconfig.json` (strict, react-jsx) + `paths` for alias `@algos/*` → `../src/*`
- [x] 2.3 `site/vite.config.ts` (React plugin, alias `@algos` → `../src`)
- [x] 2.4 `site/index.html` + entry point `site/src/main.tsx`
- [x] 2.5 `dev`/`build` scripts; verify `npm run dev` starts

## 3. Routing, layout, catalog

- [x] 3.1 Root layout (header/nav + container) on TanStack Router
- [x] 3.2 Typed algorithm registry (`slug`, `title`, `tags`) — a single `minSubArrayLen` entry
- [x] 3.3 Main catalog: list from the registry with links to `/algo/<slug>`
- [x] 3.4 Route `/algo/$slug`: lookup in the registry, unknown slug → "not found" without crashing

## 4. Shared player (data + controls)

- [x] 4.1 State type as data (no markup): indices/pointers/values/structured log
- [x] 4.2 `StepPlayer` on `useReducer`: takes `states` and `render(state) => ReactNode`, controls Step/Auto/Reset
- [x] 4.3 Base styles (dark theme in the spirit of the existing pages)

## 5. Example minSubArrayLen

- [x] 5.1 State generator for `minSubArrayLen` (sliding window), states are data
- [x] 5.2 minSubArrayLen view component (array + left/right window + sum/res) in JSX, no HTML strings
- [x] 5.3 Import the real `minSubArrayLen` from `@algos/...` and verify the final answer against its result
- [x] 5.4 Wire it into the `/algo/minSubArrayLen` page

## 6. Verification

- [x] 6.1 `npm run build` in `site/` — no type or build errors
- [x] 6.2 Click through the visualization in the browser: step/auto/reset, answer matches, no premature index highlighting
- [x] 6.3 Confirm `src/` and the root project are unchanged (git)
