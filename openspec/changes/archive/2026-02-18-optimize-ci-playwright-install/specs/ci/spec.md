## ADDED Requirements

### Requirement: npm Dependency Caching

The CI environment MUST cache npm dependencies to speed up the installation phase of all jobs.

#### Scenario: Restoring npm cache

- **Given** a previous CI run has successfully executed `npm ci`.
- **When** a new job starts and executes `actions/setup-node` with caching enabled.
- **Then** the `node_modules` or global npm cache should be restored.
- **And** `npm ci` should complete significantly faster than a fresh install.

### Requirement: Playwright Browser Caching

The CI environment MUST cache Playwright browsers to reduce installation time in subsequent runs.

#### Scenario: Using cached Playwright browsers

- **Given** a previous run has already downloaded the browsers.
- **When** the E2E job starts.
- **Then** it should restore browsers from the cache.
- **And** it should install system dependencies using `--with-deps` if there is a cache miss, or via `install-deps` if there is a cache hit.
