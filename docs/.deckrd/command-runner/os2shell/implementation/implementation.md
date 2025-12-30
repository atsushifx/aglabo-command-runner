---
title: "Implementation: os2shell
Module"Based on: specifications.md v1.0
Status: Draft
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable  line-length -->

## Implementation

## 1. Overview

### 1.1 Purpose

This implementation defines the behavioral contracts, type constraints, and decision logic for the `os2shell` module. It specifies how the module normalizes runtime-specific platform detection to virtual OS platforms and resolves the appropriate shell command, without prescribing internal code structure or algorithms.

### 1.2 Module Location

- Raw OS Detection & Virtual OS Conversion: `src/runtime/getOSPlatform.ts` (existing, internal implementation with `_getRawOSPlatform()` and `_RAW_OS_TO_VIRTUAL_OS_MAP`)
- Shell Resolution: `src/runtime/os2shell.ts` (to be created, uses `getOSPlatform()`)
- Type Definitions: `shared/types/os2shell.types.ts` (to be created, public types and `AG_OS_TO_SHELL_MAP`)
- Public API: `getOSPlatform()` returns Virtual OS (Windows, macOS, Linux, or undefined)
- Export Status: Internal module (not yet public API)

### 1.3 Testing Strategy

**Runtime Environment Tests (Node.js, Deno, Bun):**

Testing of OS detection across different JavaScript runtimes uses the public API `getOSPlatform()` as the integration point:

```typescript
// Test each runtime's OS detection through public API
test('Node.js: getOSPlatform should detect Windows', () => {
  // In Windows Node.js environment
  const os = getOSPlatform();
  expect(os).toBe(AGTOSType.Windows);
});

test('Deno: getOSPlatform should detect macOS', () => {
  // In macOS Deno environment
  const os = getOSPlatform();
  expect(os).toBe(AGTOSType.macOS);
});

test('Bun: getOSPlatform should detect Linux', () => {
  // In Linux Bun environment
  const os = getOSPlatform();
  expect(os).toBe(AGTOSType.Linux);
});
```

**Rationale:**

- Public API test covers both internal stages (raw detection + virtual OS conversion)
- Implementation details (`_getRawOSPlatform()`, `_RAW_OS_TO_VIRTUAL_OS_MAP`) are validated implicitly
- Tests remain stable as long as `getOSPlatform()` contract is honored
- No need for separate unit tests of internal functions

---

## 2. Shared Types File Organization and Refactoring

### 2.1 Type Definition Files

The os2shell module implementation requires coordinated type definitions across multiple shared type files. This section documents the current state and planned refactoring to organize types by functional domain and reusability scope.

#### Current State

Currently, only one type definition file exists in the shared directory:

| File                            | Status   | Contents                                                  |
| ------------------------------- | -------- | --------------------------------------------------------- |
| `shared/types/runtime.types.ts` | ✓ Exists | Runtime detection types for Node.js/Deno/Bun environments |

#### Planned State After Refactoring

The refactoring will organize types across three dedicated files based on functional domain and reusability:

| File                                   | Status            | Purpose                                              | Scope                                                     |
| -------------------------------------- | ----------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `shared/types/runtime.types.ts`        | Existing (update) | Runtime environment detection abstractions           | Cross-runtime support, core platform value detection      |
| `shared/types/command-result.types.ts` | New (create)      | Command execution result types (error/success/union) | Shared across all command-runner modules                  |
| `shared/types/os2shell.types.ts`       | New (create)      | Virtual OS platform and shell mapping enumerations   | os2shell module specific, canonical OS/shell abstractions |

#### Type and Enum Distribution Matrix

This matrix shows which types are defined in which file and their migration paths:

| Type/Enum/Constant          | Location                   | Destination File               | Purpose                                                   | Visibility                                     |
| --------------------------- | -------------------------- | ------------------------------ | --------------------------------------------------------- | ---------------------------------------------- |
| `_RawOSPlatformType`        | runtime.types.ts (exists)  | runtime.types.ts (unchanged)   | Enum of raw OS values from runtime                        | Internal (underscore prefix)                   |
| `_RawOSPlatformResult`      | runtime.types.ts (exists)  | runtime.types.ts (unchanged)   | Type union for detection result                           | Internal (underscore prefix)                   |
| `AGTCommandErrorType`       | *(new)*                    | command-result.types.ts        | Error classification enumeration                          | Public (AGT prefix)                            |
| `AGTCommandError`           | *(new)*                    | command-result.types.ts        | Error result type with details                            | Public (AGT prefix)                            |
| `AGTCommandSuccess`         | *(new)*                    | command-result.types.ts        | Success result type                                       | Public (AGT prefix)                            |
| `AGTCommandResult`          | *(new)*                    | command-result.types.ts        | Union type of success \| error                            | Public (AGT prefix)                            |
| `AGTOSType`                 | *(new - os2shell)*         | os2shell.types.ts              | Virtual OS platform enumeration (Windows, macOS, Linux)   | Public (AGT prefix)                            |
| `AGTShellType`              | *(new - os2shell)*         | os2shell.types.ts              | Supported shell command enumeration (pwsh.exe, zsh, bash) | Public (AGT prefix)                            |
| `AG_OS_TO_SHELL_MAP`        | *(new - public mapping)*   | shared/types/os2shell.types.ts | Virtual OS platform → shell command mapping table         | Public (`AG_`prefix, UPPER_SNAKE_CASE)         |
| `_RAW_OS_TO_VIRTUAL_OS_MAP` | *(new - internal mapping)* | src/runtime/getOSPlatform.ts   | Raw OS → Virtual OS platform conversion table (internal)  | Internal (underscore prefix, UPPER_SNAKE_CASE) |

#### File Organization Rationale

##### runtime.types.ts

Remains unchanged; focuses on runtime-specific platform value detection (Node.js `process.platform`, Deno `Deno.build.os`, etc.)

##### command-result.types.ts

New shared types for command execution results; usable by multiple command-runner modules for consistent error handling

##### os2shell.types.ts

New module-specific types for virtual OS platforms and shell mappings; contains the canonical OS/shell abstractions and public mapping table

##### getOSPlatform.ts (runtime internal utilities)

Houses internal implementation of raw OS detection and conversion:

- `_getRawOSPlatform()`: Internal function to detect raw OS platform from runtime
- `_RAW_OS_TO_VIRTUAL_OS_MAP`: Internal constant mapping raw OS values to virtual OS platforms
- `getOSPlatform()`: Public API that combines raw detection and conversion to return virtual OS

#### Import References

After refactoring, code will import from the appropriate file based on functional need:

```typescript
// For runtime platform detection (internal utility)
import { _getRawOSPlatform, _RawOSPlatformType } from '#runtime/detectRuntime.ts';

// For command result types (shared across modules)
import { AGTCommandError, AGTCommandResult, AGTCommandSuccess } from '#shared/types/command-result.types.ts';

// For os2shell virtual OS and shell definitions
import { AG_OS_TO_SHELL_MAP, AGTOSType, AGTShellType } from '#shared/types/os2shell.types.ts';
```

---

## 3. Type Definitions

### 3.1 Input Type

```typescript
// getOSPlatform input parameters
// - rawOS: raw platform string for testing (default: undefined)
//   When undefined: detects from runtime environment (process.platform)
//   When provided: uses the provided string for testing platform mapping
//
// resolveShell input parameters
// - virtualOS: virtual OS platform for testing (default: undefined)
//   When undefined: return `undefined` (no platform detection is performed)
//   When provided: uses the provided platform directly for testing
```

### 3.2 Output Type

```typescript
// Virtual OS Platform Enumeration (public type with AGT prefix)
enum AGTOSType {
  Windows = 'windows',
  macOS = 'macos',
  Linux = 'linux',
}

// Shell Resolution output
enum AGTShellType {
  PowerShell = 'pwsh.exe',
  Zsh = '/bin/zsh',
  Bash = '/bin/bash',
}
```

### 3.3 Conceptual Types (Informative)

The following types are referenced conceptually to explain implementation constraints:

**Internal Types (not exported):**

- `_RuntimePlatform`: The raw platform string from runtime environment (e.g., "win32", "darwin", "linux")
- `_PlatformMap`: Maps raw platform strings to `AGTOSType` values
  - Example: `{ win32: AGTOSType.Windows, darwin: AGTOSType.macOS, ... }`

**Constants (with AG_ prefix):**

- `AG_OS_TO_SHELL_MAP`: Maps `AGTOSType` values to shell command strings
  - Example: `{ AGTOSType.Windows: AGTOSType.PowerShell, ... }
  - Key type: `AGTOSType` (ensures type-safe lookups)

---

## 4. Function Contract

### 4.1 Signature

```typescript
// OS Detection function
// @param rawOS - Raw platform string for testing (default: undefined)
//   - undefined: Detects from runtime environment
//   - string: Uses provided value for testing platform mapping
// @returns Virtual OS platform or undefined if unsupported
//  for unit tests string to _RawOSPlatform assigned.
function getOSPlatform(rawOS?: _RawOSPlatformType): AGTOSType | undefined;

// Shell Resolution function
// @param virtualOS - Virtual OS platform for testing (default: undefined)
//   - undefined: Calls getOSPlatform() to determine platform
//   - string: Uses provided platform directly for testing shell resolution
// @returns Shell command string or undefined if unsupported
function resolveShell(virtualOS?: AGTOSType): AGTShellType | undefined;
```

### 4.2 Preconditions

**Production Mode (parameters undefined):**

- Runtime platform detection mechanism is available at invocation time
- Mapping tables are initialized and immutable
- No prior state or configuration is required

**Testing Mode (parameters provided):**

- Platform string values are valid (e.g., "win32", "darwin", "linux")
- Virtual OS platform strings match enum values or are undefined
- Mapping tables are initialized and immutable

### 4.3 Postconditions

**For supported platforms:**

- `getOSPlatform(rawOS)` returns corresponding `AGTOSType` enum value
- `resolveShell(virtualOS)` returns valid shell command string

**For unsupported platforms:**

- Returns `undefined` for graceful degradation
- No exceptions thrown

**General:**

- Return values are deterministic for identical platform inputs
- No side effects on external state
- Behavior identical whether in production or testing mode

### 4.4 Invariants

- Shell selection is always based on `AGTOSType` enum values, never on raw runtime platform strings
- Each `AGTOSType` enum value (Windows, macOS, Linux) maps to exactly one shell command
- Platform detection always produces either a valid `AGTOSType` value or `undefined`
- Mappings are immutable after module initialization
- Test parameters (`rawOS`, `virtualOS`) override runtime detection but do not affect default behavior
- When test parameters are `undefined`, functions behave identically to production mode

---

## 5. Basic Flow

### 5.0 Overall Platform Detection and Shell Resolution Flow

The os2shell module implements a three-stage pipeline for platform detection and shell resolution:

```text
┌─────────────────────────────────────────────────────────────────┐
│ Stage 1: Raw OS Detection                                       │
├─────────────────────────────────────────────────────────────────┤
│ _getRawOSPlatform() - Internal Utility Function                 │
│ ├─ Detects runtime: Node.js / Deno / Bun                        │
│ ├─ Returns raw platform value: 'win32' / 'darwin' / 'linux'     │
│ └─ Returns undefined for unsupported runtimes                   │
│                                                                 │
│ Input: None (detects from runtime environment)                  │
│ Output: _RawOSPlatformType | undefined                          │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ Stage 2: Raw OS to Virtual OS Conversion (Internal)             │
├─────────────────────────────────────────────────────────────────┤
│ _RAW_OS_TO_VIRTUAL_OS_MAP - Internal Mapping Table              │
│ ├─ 'win32' → AGTOSType.Windows                                  │
│ ├─ 'darwin' → AGTOSType.macOS                                   │
│ └─ 'linux' → AGTOSType.Linux                                    │
│                                                                 │
│ Input: _RawOSPlatformType | undefined                           │
│ Output: AGTOSType | undefined                                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────────┐
│ Stage 3: Virtual OS to Shell Resolution (Public API)           │
├────────────────────────────────────────────────────────────────┤
│ AG_OS_TO_SHELL_MAP - Public Mapping Table                     │
│ ├─ AGTOSType.Windows → 'pwsh.exe'                              │
│ ├─ AGTOSType.macOS → '/bin/zsh'                                │
│ └─ AGTOSType.Linux → '/bin/bash'                               │
│                                                                │
│ Input: AGTOSType | undefined                                   │
│ Output: AGTShellType | undefined                               │
│         (Shell command string or undefined)                    │
└────────────────────────────────────────────────────────────────┘
                           ↓
                    FINAL RESULT
              Shell command or undefined
```

### 5.0.1 Complete Example

#### Scenario: Get shell for current platform (production mode)

```text
Runtime Environment: Node.js on Windows
    ↓
_getRawOSPlatform()
    ↓ (detects from process.platform)
'win32'
    ↓
_RAW_OS_TO_VIRTUAL_OS_MAP['win32']
    ↓
AGTOSType.Windows
    ↓
AG_OS_TO_SHELL_MAP[AGTOSType.Windows]
    ↓
'pwsh.exe'
```

#### Scenario: Test shell resolution with specific virtual OS

```text
Test Input: AGTOSType.macOS
    ↓
AG_OS_TO_SHELL_MAP[AGTOSType.macOS]
    ↓
'/bin/zsh'
```

### 5.0.2 Key Design Points

1. **Stage 1 - Raw OS Detection:**
   - Internal utility `_getRawOSPlatform()` abstracts runtime differences (Node/Deno/Bun)
   - All runtimes return consistent raw values: 'win32', 'darwin', 'linux'
   - Returns `undefined` for unsupported platforms

2. **Stage 2 - Internal Conversion:**
   - Private mapping table `_RAW_OS_TO_VIRTUAL_OS_MAP` converts raw to virtual OS
   - Type: `Record<_RawOSPlatformType, AGTOSType>`
   - Not exposed to public API; used internally only

3. **Stage 3 - Public Shell Resolution:**
   - Public constant `AG_OS_TO_SHELL_MAP` defines the primary shell for each virtual OS
   - Type: `Record<AGTOSType, AGTShellType>`
   - Public API; users can import and reference directly
   - Users may validate or document platform-shell relationships

---

## 6. Implementation Constraints

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->

### 6.1 Decision Logic

#### 6.1.1 `getOSPlatform(rawOS?)` - Platform Detection

| Step | Condition Check                   | Implementation Note                          |
| ---: | --------------------------------- | -------------------------------------------- |
|    1 | Is `rawOS` parameter provided?    | Use provided value; else detect from runtime |
|    2 | Is raw platform in mapping table? | Map to `AGTOSType` or return `undefined`     |
|    3 | Is mapped virtual OS valid?       | Return corresponding `AGTOSType` value       |

**Example Test Case:**

- Input: `getOSPlatform('win32')`
- Output: `AGTOSType.Windows`

#### 6.1.2 resolveShell(virtualOS?) - Shell Resolution with Type Constraint

**Type Constraint:**

- Parameter `virtualOS` accepts: `AGTOSType` enum value or `undefined`
- This constrains input to valid platform types only
- This function does NOT implicitly call getOSPlatform();
  shell resolution and platform detection are intentionally separated.

**Resolution Logic:**

| Step | Condition Check                           | Implementation Note                              |
| ---: | ----------------------------------------- | ------------------------------------------------ |
|    1 | Shortcut: Is `virtualOS` === `undefined`? | Return `undefined` immediately (no table lookup) |
|    2 | Is `virtualOS` a valid `AGTOSType`?       | Proceed to table matching                        |
|    3 | Does platform have shell in mapping?      | Return shell string from table                   |
|    4 | No mapping found                          | Return `undefined`                               |

**Shortcut Behavior:**

- When `virtualOS` is `undefined`, function returns `undefined` without calling `getOSPlatform()`
- This allows efficient testing of shell resolution in isolation
- Pattern: `undefined -> undefined` (no platform detection, direct return)

**Example Test Cases:**

- Input: `resolveShell(AGTOSType.Windows)`
- Output: Shell command string (e.g., AGTShellType.PowerShell)
-
- Input: `resolveShell(undefined)`
- Output: `undefined` (shortcut, no detection)

### 6.2 Instance Checks and Table Matching

**Platform Detection (getOSPlatform):**

- Raw platform string equality checks against `_PlatformMap`
- Example: If `rawOS === 'win32'`, return `AGTOSType.Windows`
- String equality only; no fuzzy matching

**Shell Resolution (resolveShell):**

- Type constraint ensures `virtualOS` is `AGTOSType` enum or `undefined`
- Direct table lookup in `AG_OS_TO_SHELL_MAP` using `AGTOSType` as key
- Example: `AG_OS_TO_SHELL_MAP[AGTOSType.Windows]` → AGTShellType.PowerShell)
- Shortcut: If `virtualOS === undefined`, return `undefined` immediately

**Prohibited Operations:**

- No version detection
- No shell variant detection
- No environment variable inspection
- No shell availability validation
- No fuzzy matching or pattern-based detection

### 6.3 Performance Constraints

- Time Complexity: O(1) - constant-time lookup operations only
- Space Complexity: O(1) - fixed, immutable mappings
- No external I/O, no dynamic allocation, no recursive operations

---

## 7. Dependencies

### 7.1 Internal Dependencies

| Module                            | Purpose                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/shared/types/os2shell.types.ts` | Shell command mapping table (public constants / immutable) / used by resolveShell as the canonical lookup table |

### 7.2 External Dependencies

- None (zero-dependency requirement)

---

## 8. Error Handling

### 8.1 Error Cases

| Condition                             | Behavior           |
| ------------------------------------- | ------------------ |
| Runtime platform not in mapping table | Return `undefined` |
| Virtual OS platform unsupported       | Return `undefined` |
| Shell mapping missing for OS          | Return `undefined` |

### 8.2 Error Strategy

The module does not throw exceptions. Unsupported platforms return `undefined`, delegating responsibility for explicit handling to the caller. This strategy prevents silent failures from implicit fallback shells, which could mask platform-specific bugs.

---

## 9. Specifications Traceability

| Spec Section                       | Implementation Section |
| ---------------------------------- | ---------------------- |
| 3: Virtual OS Platform Abstraction | 3.2, 3.3, 4.4, 5.1     |
| 4: Shell Mapping Specification     | 3.2, 4.1, 5.1          |
| 5: OS Detection Specification      | 4.1, 5.1, 6            |
| 6: Shell Resolution Specification  | 4.1, 5.1, 8.2          |
| 6.2: No Implicit Fallback          | 8.2, 6.2               |

---

## 10. Type Definitions and File Refactoring

### 10.1 Purpose

This section documents the planned refactoring of type definitions for the os2shell module and command execution results. The reorganization ensures separation of concerns and improves import clarity across modules.

### 10.2 Type Organization and Migration

**Current State:** Types are currently defined in `shared/types/runtime.types.ts`:

- `AGTCommandErrorType` - Enum of command execution error types
- `AGTCommandError` - Type definition for command execution errors
- `AGTCommandSuccess` - Type definition for successful command execution
- `AGTCommandResult` - Union type combining success and error results
- `AGTPlatformType` - Raw OS platform values (should be renamed)
- `AGTPlatformResult` - Raw OS detection result (should be renamed)

**Planned Changes:**

- `shared/types/command-result.types.ts`: New file for command execution result types (shared across modules)
- `shared/types/os2shell.types.ts`: New file for virtual OS and shell enumerations (os2shell-specific)
- `shared/types/runtime.types.ts`: Rename platform-related types with `_` prefix for internal use

**File Structure:**

```text
shared/types/
├── runtime.types.ts            # Contains: AGTRuntimeType, AGTRuntimeResult, _RawOSPlatformType, _RawOSPlatformResult
├── command-result.types.ts     # New file: Command execution result types (shared)
└── os2shell.types.ts           # New file: Virtual OS and shell types and constants (os2shell-specific)
```

### 10.3 Type and Enum Distribution

| Type/Enum                   | Source File               | Destination File        | Purpose                                |
| --------------------------- | ------------------------- | ----------------------- | -------------------------------------- |
| `AGTCommandErrorType`       | runtime.types.ts          | command-result.types.ts | Error classification (shared)          |
| `AGTCommandError`           | runtime.types.ts          | command-result.types.ts | Error result type (shared)             |
| `AGTCommandSuccess`         | runtime.types.ts          | command-result.types.ts | Success result type (shared)           |
| `AGTCommandResult`          | runtime.types.ts          | command-result.types.ts | Result union type (shared)             |
| `_RawOSPlatformType`        | runtime.types.ts (rename) | runtime.types.ts        | Raw OS platform (internal, unprefixed) |
| `_RawOSPlatformResult`      | runtime.types.ts (rename) | runtime.types.ts        | Raw OS detection result (internal)     |
| `AGTOSType`                 | (new)                     | os2shell.types.ts       | Virtual OS platform enumeration        |
| `AGTShellType`              | (new)                     | os2shell.types.ts       | Supported shell enumeration            |
| `AG_OS_TO_SHELL_MAP`        | (new)                     | os2shell.types.ts       | Virtual OS → Shell mapping (public)    |
| `_RAW_OS_TO_VIRTUAL_OS_MAP` | (new)                     | os2shell.ts (internal)  | Raw OS → Virtual OS conversion table   |

### 10.4 Implementation Details

#### 1. Function Refactoring

getOSPlatform(): VirtualOS を返す publicAPI
_getRawOSPlatform(): rawOS 検出専用 (internal)

- Reflects that this function returns raw (not virtual) OS platform values
- The `_` prefix indicates internal use
- Update all imports in test files and implementations

#### 2. New Enums in os2shell.types.ts

```typescript
export enum AGTOSType {
  Windows = 'windows',
  macOS = 'macos',
  Linux = 'linux',
}

export enum AGTShellType {
  PowerShell = 'pwsh.exe',
  Zsh = '/bin/zsh',
  Bash = '/bin/bash',
}
```

Include comprehensive JSDoc with examples and mapping semantics.

#### 3. Public Mapping Table in os2shell.types.ts

```typescript
export const AG_OS_TO_SHELL_MAP: Record<AGTOSType, AGTShellType> = {
  [AGTOSType.Windows]: AGTShellType.PowerShell,
  [AGTOSType.macOS]: AGTShellType.Zsh,
  [AGTOSType.Linux]: AGTShellType.Bash,
};
```

This mapping is part of the public API and represents the canonical OS-to-Shell contract. Users can import and reference this mapping directly for documentation or validation.

#### 4. Internal Mapping Table (os2shell.ts implementation)

Create internal utility `_RAW_OS_TO_VIRTUAL_OS_MAP` (not public):

```typescript
const _RAW_OS_TO_VIRTUAL_OS_MAP: Record<_RawOSPlatformType, AGTOSType> = {
  'win32': AGTOSType.Windows,
  'darwin': AGTOSType.macOS,
  'linux': AGTOSType.Linux,
};
```

This mapping is used internally only and not exported in type files.

### 10.5 Naming Convention

#### Public types

`AGT` prefix + PascalCase (e.g., `AGTOSType`, `AGTShellType`)

#### Public constants

`AG_` prefix + UPPER_SNAKE_CASE (e.g., `AG_OS_TO_SHELL_MAP`)

#### Public functions

use namespace `agShellDetection` for external API.
(ex. `agShellDetection.getOSPlatform()`)

Note:
`getOSPlatform` and `resolveShell` are internal named exports;
external consumers MUST use the agShellDetection namespace facade.

#### Internal types

`_` prefix (e.g., `_RawOSPlatformType`, `_RAW_OS_TO_VIRTUAL_OS_MAP`)

#### Internal functions

`_` prefix + camelCase (e.g., `_getRawOSPlatform()`)

See DecisionRecords.md DR000 for complete naming convention details.

### 10.6 Integration Checklist

- [ ] Move `AGTCommandErrorType`, `AGTCommandError`, `AGTCommandSuccess`, `AGTCommandResult` to `command-result.types.ts`
- [ ] Rename `AGTPlatformType` → `_RawOSPlatformType` and `AGTPlatformResult` → `_RawOSPlatformResult` in `runtime.types.ts`
- [ ] Create `os2shell.types.ts` with `AGTOSType`, `AGTShellType`, and `AG_OS_TO_SHELL_MAP`
- [ ] Create internal `_RAW_OS_TO_VIRTUAL_OS_MAP` in `src/runtime/os2shell.ts`
- [ ] Ensure raw OS detection is implemented as `_getRawOSPlatform()` (internal)
- [ ] Ensure `getOSPlatform()` remains the public API returning virtual OS
- [ ] Update imports in all test files
- [ ] Update barrel file (`shared/types/index.ts`) to export from all three type files
- [ ] Preserve all JSDoc documentation and examples during migration
- [ ] Ensure TypeScript strict mode compatibility

### 10.7 Quality Assurance

- New enums and mapping must align with specification mapping tables (Sections 5 and 6 of specifications.md)
- Add tests for:
  - `_getRawOSPlatform()` returning correct raw OS values per runtime
  - Raw OS to virtual OS conversion (`_RAW_OS_TO_VIRTUAL_OS_MAP`)
  - Virtual OS to shell mapping (`AG_OS_TO_SHELL_MAP`) consistency
- Verify `AG_OS_TO_SHELL_MAP` is accessible as part of public API
- No changes to existing type semantics or behavior
- Breaking changes: None (all existing exported types maintain public API)

Note: Internal utilities MAY be unit-tested for implementation confidence,
but public API behavior remains the primary contract.

---

## 11. Change History

| Date       | Version | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| 2025-12-30 | 1.1     | Add test parameters to getOSPlatform and resolveShell          |
|            |         | - Implement enum AGTOSType for virtual OS representation       |
|            |         | - Add rawOS parameter to getOSPlatform (default: undefined)    |
|            |         | - Add virtualOS parameter to resolveShell (default: undefined) |
|            |         | - Add undefined->undefined shortcut for resolveShell           |
|            |         | - Define table mapping with AG_OS_TO_SHELL_MAP constant        |
| 2025-12-30 | 1.0     | Initial implementation                                         |
