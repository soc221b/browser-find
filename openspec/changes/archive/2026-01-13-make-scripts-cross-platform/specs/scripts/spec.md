## ADDED Requirements

### Requirement: Cross-Platform Compatibility

Development and build scripts MUST execute successfully on Windows, macOS, and Linux environments without modification.

#### Scenario: Running build on Windows

- **Given** the repository is cloned on a Windows machine.
- **When** the developer runs `npm run build`.
- **Then** the command should complete successfully without errors related to path separators or missing shell commands (e.g., `sleep`).

#### Scenario: Running dev watcher

- **Given** the repository is cloned on a Windows machine.
- **When** the developer runs `npm run build -- --dev`.
- **Then** the watcher should start and persist without crashing due to platform-specific commands.
