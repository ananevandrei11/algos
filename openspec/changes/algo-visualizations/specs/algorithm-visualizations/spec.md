## ADDED Requirements

### Requirement: Shared step player
The site SHALL provide a reusable player that plays an ordered sequence of states and offers "Step", "Auto", and "Reset" controls. The player SHALL be independent of any specific algorithm: it takes a list of states and a function that renders the current one.

#### Scenario: Step forward
- **WHEN** a user clicks "Step"
- **THEN** the next state is displayed, and on the last state no further advancement happens

#### Scenario: Auto play
- **WHEN** a user enables "Auto"
- **THEN** states advance on a timer and stop on the last one

#### Scenario: Reset
- **WHEN** a user clicks "Reset"
- **THEN** the visualization returns to the state before the first step

### Requirement: Per-algorithm view component
State rendering SHALL be done by a view component specific to the algorithm, chosen to fit its data structure. A single universal layout for all algorithms SHALL NOT be imposed.

#### Scenario: Algorithm with a non-array structure
- **WHEN** an algorithm uses a structure other than an array row (for example a hash map, intervals, a grid, or a stack)
- **THEN** its state is rendered by its own view component while the shared player is reused unchanged

### Requirement: States as data, no HTML strings
Each state (frame) SHALL be semantic data (indices, pointers, values, a structured log event), not a markup string. Rendering SHALL be done by React components; `dangerouslySetInnerHTML` and building markup from strings SHALL NOT be used.

#### Scenario: Step log rendered from data
- **WHEN** a state carries a description of the current step
- **THEN** it is stored as a structured event and rendered by a JSX component, without injecting HTML strings

### Requirement: Trace the actual src/ implementation
The frame trace for an algorithm SHALL follow the actual implementation in `src/<name>/<name>.ts` step by step, including its non-optimal characteristics. The visualization SHALL NOT substitute a different or "optimized" algorithm for the one in `src/`.

#### Scenario: Naive implementation is shown faithfully
- **WHEN** the `src/` implementation uses a naive approach (for example nested loops)
- **THEN** the visualization steps through that same approach rather than an optimized alternative

### Requirement: Verify the answer against the real function from src/
The visualization's final answer SHALL match the result of the algorithm function imported from `src/` for the same input, and the page SHALL display whether they agree.

#### Scenario: Consistency with the reference
- **WHEN** the visualization reaches its last state for a given input
- **THEN** the displayed answer equals the value returned by the real function from `src/`, and a verification line confirms the match

### Requirement: Source-code block loaded from src/
Each algorithm page SHALL display the source text of the `src/` function below the visualization, loaded from the source file via a raw import so it cannot drift from the real file.

#### Scenario: Viewing the source under a visualization
- **WHEN** a user opens an algorithm page
- **THEN** the exact text of `src/<name>/<name>.ts` is shown as a static code block beneath the visualization

### Requirement: Coverage of algorithms from src/
The site SHALL provide a visualization for the algorithms in `src/`, each registered as a self-contained module, added one at a time following the established recipe.

#### Scenario: A registered algorithm is reachable
- **WHEN** an algorithm has a module and a registry entry
- **THEN** it appears in the catalog and its page renders an interactive step-by-step visualization with a correct final answer

#### Scenario: Adding a new algorithm
- **WHEN** a new algorithm module and registry entry are added following the recipe
- **THEN** no changes to the shared player are required for it to appear and play
