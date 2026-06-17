## ADDED Requirements

### Requirement: Shared step player
The site SHALL provide a reusable player that plays an ordered sequence of states and offers "Step", "Auto", "Reset" controls. The player SHALL be independent of any specific algorithm: it takes states and a function to render them.

#### Scenario: Step forward
- **WHEN** a user clicks "Step"
- **THEN** the next state is displayed; on the last state there is no further advancement

#### Scenario: Auto
- **WHEN** a user enables "Auto"
- **THEN** states play on a timer and stop on the last one

#### Scenario: Reset
- **WHEN** a user clicks "Reset"
- **THEN** the visualization returns to the initial state before the first step

### Requirement: A separate view component per algorithm
State rendering SHALL be done by a separate view component for the specific algorithm; a single universal grid for all algorithms SHALL NOT be imposed.

#### Scenario: Algorithm with its own data structure
- **WHEN** an algorithm has a structure different from an array-window (for example, a Map with groups)
- **THEN** its state is rendered by its own view component, and the shared player is used unchanged

### Requirement: States as data, no HTML strings
Each state (frame) SHALL be semantic data (indices, pointers, values, a structured log), not a markup string. Rendering SHALL be done by React components; `dangerouslySetInnerHTML` and building markup from strings SHALL NOT be used.

#### Scenario: Step log rendered from data
- **WHEN** a state contains a description of the current step
- **THEN** it is stored as data and rendered by a JSX component, without injecting HTML strings

### Requirement: Verify the answer against the real function from src/
The visualization's final answer SHALL match the result of the algorithm function imported from `src/` for the same input.

#### Scenario: Consistency with the reference
- **WHEN** the visualization reaches the last state for a given input
- **THEN** the displayed answer equals the value returned by the real function from `src/`

### Requirement: minSubArrayLen example
The site SHALL include a working `minSubArrayLen` visualization on the shared player as the first example.

#### Scenario: Viewing the minSubArrayLen visualization
- **WHEN** a user opens the `minSubArrayLen` page
- **THEN** an interactive step-by-step visualization with the correct final answer is displayed
