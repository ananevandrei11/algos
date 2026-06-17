## ADDED Requirements

### Requirement: Isolated application in site/
The site SHALL live in a `site/` folder with its own `package.json` and configuration, without modifying the root project (`src/`, root `package.json`, `tsconfig.json`, Jest).

#### Scenario: Installing site dependencies does not affect the root
- **WHEN** a developer installs dependencies inside `site/`
- **THEN** only `site/package.json` and the `site/` environment change
- **AND** the root project and its tests remain unchanged

### Requirement: Vite + React + TypeScript stack
The application SHALL be built on Vite + React + TypeScript and SHALL provide dev and build scripts.

#### Scenario: Dev server
- **WHEN** the dev script is run in `site/`
- **THEN** a Vite dev server starts and serves the application

#### Scenario: Production build
- **WHEN** the build script is run in `site/`
- **THEN** the build completes with no type or build errors

### Requirement: Reuse of algorithms from src/ read-only
The site SHALL import algorithm functions from the root `src/` via an alias, without copying or modifying code in `src/`.

#### Scenario: Importing a function via alias
- **WHEN** a site module imports an algorithm function via the alias to `src/`
- **THEN** the import resolves to the source `.ts` file, the function is available, and files in `src/` are not changed

### Requirement: Catalog and type-safe routes
The site SHALL have a root layout, a main catalog page listing algorithms from a typed registry, and an algorithm page route by `slug` (TanStack Router).

#### Scenario: Viewing the catalog
- **WHEN** a user opens `/`
- **THEN** a list of algorithms from the registry is displayed with links to their pages

#### Scenario: Navigating to an algorithm page
- **WHEN** a user navigates to `/algo/<slug>` of an existing algorithm
- **THEN** that algorithm's page is displayed

#### Scenario: Unknown slug
- **WHEN** a user navigates to `/algo/<slug>` that does not exist in the registry
- **THEN** a "not found" state is shown, without the application crashing
