---
title: "Decision Records: os2shell Module"
Status: Draft
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable line-length no-duplicate-heading  -->

## Decision Records

This document captures decisions made during the os2shell module design and development, documenting the rationale, context, and alternatives considered.

---

## DR000: Naming Convention for Public and Internal Symbols

**Phase**: spec
**Status**: Decided (2025-12-31)

### Context

The command-runner library exports various public APIs (types, constants, functions) while also having internal implementation details. A consistent naming convention is essential for:

- Clarifying API boundaries (public vs. internal)
- Preventing accidental public API breakage
- Making code intentions clear to developers
- Supporting tooling and documentation generation

### Decision

Establish the following naming convention across the command-runner library:

| Category               | Prefix | Style             | Example                                           | Usage                                                             |
| ---------------------- | ------ | ----------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| **Public Types**       | `AGT`  | PascalCase        | `AGTOSType`, `AGTShellType`, `AGTRuntimeType`     | Exported enums, interfaces, type aliases that form the public API |
| **Public Constants**   | `AG`   | UPPER_SNAKE_CASE  | `AG_OS_TO_SHELL_MAP`, `AG_DEFAULT_SHELL`          | Exported constants and constant-like values                       |
| **Public Functions**   | `ag`   | camelCase         | `agGetShell()`, `agDetectOS()`                    | Exported functions in the public API (if used)                    |
| **Internal Types**     | `_`    | _PascalCase       | `_RawOSPlatformType`, `_VirtualOSShellMap`        | Non-exported enums, interfaces, type aliases (private/internal)   |
| **Internal Constants** | `_`    | _UPPER_SNAKE_CASE | `_OS_TO_SHELL_MAP`, `_RAW_OS_TO_VIRTUAL_OS_MAP`   | Non-exported constants and mappings                               |
| **Internal Functions** | `_`    | _camelCase        | `_getRawOSPlatform()`, `_convertRawToVirtualOS()` | Non-exported utility functions (private/internal)                 |

### Rationale

- API Clarity: The `AGT` prefix clearly marks public types as part of the official API
- Consistency: The AGT (AGL-abo-Tag) convention is established across exported types
- Convention Consistency: Using underscore (`_`) for internal symbols is a JavaScript standard
- Maintainability: Developers immediately understand whether a symbol is public or internal
- Documentation: Tools can use prefixes to automatically categorize symbols in generated documentation
- Backward Compatibility: This convention helps protect the public API surface

### Consequences

- All existing and new public types must follow the `AGT` prefix pattern
- Internal implementation details must use `_` prefix
- Documentation and TypeScript declarations must clearly indicate public APIs
- Code reviews should enforce this convention for consistency
- Public APIs are limited to clear, intentional exports

### Implementation Guidelines

1. Exported types from any module use `AGT` prefix
2. Exported constants (if any) use `AG` prefix
3. All non-exported symbols use `_` prefix
4. Barrel files (`index.ts`) only re-export symbols intended to be public
5. Internal utilities and mapping tables use `_` prefix even if they're in type files

### Related Specifications

This convention applies across all modules in the command-runner library, including os2shell.

---

## DR001: Type Definition Organization and File Separation

**Phase**: spec
**Status**: Decided (2025-12-31)

### Context

The initial design placed command execution result types (`AGTCommandErrorType`, `AGTCommandError`, `AGTCommandSuccess`, `AGTCommandResult`) alongside runtime detection types in `shared/types/runtime.types.ts`. This creates semantic coupling between two distinct concerns:

1. Runtime environment detection (Node.js, Deno, Bun)
2. Command execution result handling

Additionally, the os2shell module requires virtual OS platform abstractions and shell mapping enumerations that should be defined in a module-specific type file.

### Decision

Organize type definitions across three dedicated files based on functional domain and reusability:

1. `shared/types/runtime.types.ts` (existing)
   - Remains unchanged
   - Contains: `AGTRuntimeType`, `AGTRuntimeResult`, `_RawOSPlatformType`, `_RawOSPlatformResult`
   - Purpose: Cross-runtime support and platform detection

2. `shared/types/command-result.types.ts` (new - shared)
   - Contains: `AGTCommandErrorType`, `AGTCommandError`, `AGTCommandSuccess`, `AGTCommandResult`
   - Purpose: Reusable command execution result types for all modules
   - Scope: Shared across command-runner modules

3. `shared/types/os2shell.types.ts` (new - module-specific)
   - Contains: `AGTOSType` (enum), `AGTShellType` (enum)
   - Purpose: Virtual OS platform and shell mapping abstractions
   - Scope: os2shell module core design

### Rationale

- Separation of Concerns: Decouples runtime detection, command results, and shell mapping
- Module Ownership: Success and result union types are usable by multiple modules; shell mappings belong to os2shell
- Reusability: Generic error types can be shared across modules via `command-result.types.ts`
- Maintainability: Each file reflects its functional domain, improving discoverability
- Future Extensibility: Dedicated files enable module-specific enhancements without affecting other concerns

### Consequences

- Migrating types requires updating imports in test files and module implementations
- New enums (`AGTOSType`, `AGTShellType`) must be created to support the specification
- Backward compatibility can be maintained through re-exports in barrel files
- Clear import paths for users: shell types from `os2shell.types.ts`, result types from `command-result.types.ts`

### Alternatives Considered

1. Keep all types in `runtime.types.ts` - Rejected due to semantic coupling
2. Create separate files for each type - Rejected as over-engineering for initial phase
3. Merge command-result and os2shell types into single file - Rejected due to different reusability scopes

### Related Specifications

See `specifications.md` Section 9.1: Type Definition Refactoring (Addendum)

---

## DR002: Raw OS Platform Type and Function Naming Clarification

**Phase**: spec
**Status**: Decided (2025-12-31)

### Context

The requirements and specification documents define two distinct platform concepts:

1. Virtual OS Platform - Canonical abstraction (Windows, macOS, Linux) defined in specification Section 3
2. Raw OS Platform - Runtime-specific values (win32, darwin, linux) from Node.js `process.platform`

However, the current implementation uses naming that obscures this distinction:

- `AGTPlatformType` enum in `runtime.types.ts` contains raw platform values (`win32`, `darwin`, `linux`)
- `getOSPlatform()` function returns raw OS platform values, not virtual OS platforms
- The underscore prefix convention (`_`) indicates internal/private types, but is not applied consistently

### Decision

Clarify naming to distinguish between raw OS platforms and virtual OS platforms:

1. Type Naming
   - Rename `AGTPlatformType` → `_RawOSPlatformType` in `runtime.types.ts`
   - Rationale: This internal type represents raw OS platform values from Node.js, not the abstract virtual OS platform
   - Rename `AGTPlatformResult` → `_RawOSPlatformResult` accordingly

2. Function Naming
   - Rename `getOSPlatform()` → `_getRawOSPlatform()` in `src/runtime/getOSPlatform.ts`
   - Rationale: This function retrieves raw OS platform strings, not virtual OS platforms
   - Clarifies that consumers should use higher-level abstractions (os2shell module)

3. Virtual OS Platform Type (New)
   - Create `AGTOSType` enum in `shared/types/os2shell.types.ts`
   - Values: Windows, macOS, Linux (specification Section 3)
   - Represents the canonical virtual OS platform abstraction

### Rationale

- Terminology Precision: Clarifies the distinction between raw and virtual OS platforms
- API Clarity: Signals that `_getRawOSPlatform()` is an internal utility, not the primary API
- Specification Alignment: Aligns implementation with requirements and specification terminology
- Convention Consistency: Uses underscore prefix (`_`) consistently for internal types and functions
- Migration Path: Guides users toward the public `os2shell` API rather than internal runtime utilities

### Consequences

- Update imports in test files that reference `AGTPlatformType` and `getOSPlatform()`
- Update JSDoc examples in `getOSPlatform.ts` to reflect new function name
- Update references in `getOSPlatform.spec.ts` test file
- Create new `AGTOSType` enum in `os2shell.types.ts` with proper documentation
- Maintain backward compatibility consideration if these are part of the public API

### Alternatives Considered

1. Keep current names and document the distinction - Rejected as it maintains the confusion
2. Rename only the enum - Rejected as function name inconsistency would remain
3. Fold raw OS detection into the os2shell module - Rejected as runtime detection is a separate concern

### Implementation Order

1. Create `AGTOSType` enum in `shared/types/os2shell.types.ts`
2. Rename types in `runtime.types.ts` to `_RawOSPlatformType` and `_RawOSPlatformResult`
3. Rename function and update implementation in `getOSPlatform.ts` to `_getRawOSPlatform()`
4. Update all imports and references in test files
5. Update JSDoc and examples
6. Update barrel file exports if applicable

### Related Requirements

See requirements.md Section 3: Virtual OS Platform Abstraction and Appendix: Raw OS to Virtual OS Mapping

---

## DR003: Internal Raw OS to Virtual OS Conversion Table

**Phase**: spec
**Status**: Decided (2025-12-31)

### Context

The os2shell module implements shell resolution by:

1. Obtaining raw OS platform values via `_getRawOSPlatform()` (win32, darwin, linux)
2. Converting to virtual OS platform (`Windows`, `macOS`, `Linux`)
3. Looking up shell in the primary shell mapping table (specification Section 4)

<!-- textlint-disable ja-technical-writing/max-comma -->

Multiple JavaScript runtimes (Node.js, Deno, Bun) return consistent raw OS platform values (win32, darwin, linux). Runtime differences are abstracted in `_getRawOSPlatform()` implementation. A conversion table is required to map raw OS values to virtual OS platform types.

<!-- textlint-enable ja-technical-writing/max-comma -->

### Decision

Define an internal constant mapping from raw OS platform values to virtual OS platform values:

```typescript
/** @internal Mapping from raw OS platform to virtual OS platform */
const _rawOSToVirtualOSMap: Record<_RawOSPlatformType, AGTOSType> = {
  'win32': AGTOSType.Windows,
  'darwin': AGTOSType.macOS,
  'linux': AGTOSType.Linux,
};
```

### Rationale

- Implementation Detail: This is an internal table; consumers use the public os2shell API
- Single Responsibility: The mapping is defined once, independent of runtime differences
- Runtime Abstraction: `_getRawOSPlatform()` handles runtime differences (Node/Deno/Bun) to return consistent raw values; the conversion table handles raw→virtual conversion
- Type Safety: Using `Record<_RawOSPlatformType, AGTOSType>` ensures compile-time completeness

### Consequences

- Table location: `shared/types/os2shell.types.ts` or internal os2shell module utility
- Must remain synchronized with both `_RawOSPlatformType` and `AGTOSType` definitions
- Table maintenance is straightforward: only 3 entries

### Testing Strategy

- Test `_getRawOSPlatform()` function once per runtime (verify win32/darwin/linux values are returned correctly)
- Test raw→virtual conversion mapping in isolation (verify each raw value converts to expected virtual OS)
- Runtime differences are abstracted away in `_getRawOSPlatform()` implementation; test at that level, not at conversion level

### Related Specifications

See `specifications.md` Section 3.2: Runtime Platform to Virtual OS Platform Mapping and Section 4: Shell Mapping Specification

### Clarification

DR003 defines the existence and semantics of the raw-to-virtual mapping.The physical location and implementation of this mapping is finalized in DR006.

---

## DR004: Virtual OS to Shell Mapping as Public Constant Table

**Phase**: spec
**Status**: Decided (2025-12-31)

### Context

The specification defines the primary shell mapping (Section 4) that associates virtual OS platforms with their corresponding shells:

| Virtual OS Platform | Primary Shell |
| ------------------- | ------------- |
| `Windows`           | `pwsh.exe`    |
| `macOS`             | `/bin/zsh`    |
| `Linux`             | `/bin/bash`   |

This mapping is not merely an internal implementation detail. Consumers of the os2shell module may want to:

- Query which shell is mapped to a specific OS
- Reference the mapping in documentation
- Understand the public OS-shell contracts

Therefore, this mapping should be a public constant table accessible to users of the library.

### Decision

Define the virtual OS to shell mapping as a **public constant table** in `shared/types/os2shell.types.ts`:

```typescript
// In shared/types/os2shell.types.ts

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

/** Public mapping from virtual OS platform to primary shell */
export const AG_OS_TO_SHELL_MAP: Record<AGTOSType, AGTShellType> = {
  [AGTOSType.Windows]: AGTShellType.PowerShell,
  [AGTOSType.macOS]: AGTShellType.Zsh,
  [AGTOSType.Linux]: AGTShellType.Bash,
};
```

### Naming Rationale

- Uses `AG` prefix per DR000 convention for public constants
- Uses UPPER_SNAKE_CASE style per DR000 for constants
- Clear, descriptive name: `AG_OS_TO_SHELL_MAP` (Virtual OS to Shell mapping)
- Follows TypeScript constant naming conventions

### Rationale

- Public API: The mapping is part of the official os2shell contract
- Semantic Cohesion: Types (`AGTOSType`, `AGTShellType`) and their mapping coexist in the same file
- User Accessibility: Consumers can import and reference the mapping directly
- Documentation: The mapping serves as self-documenting reference for supported OS-shell pairs
- Specification Compliance: Implements specification Section 4 as public contract
- Type Safety: `Record<AGTOSType, AGTShellType>` ensures compile-time completeness

### Consequences

- The mapping is part of the public API and subject to semantic versioning
- Changes to the mapping (e.g., changing shells) are breaking changes for consumers relying on it
- Consumers can import both enums and the mapping from `os2shell.types.ts`
- Clear separation of concerns: public mapping vs. internal conversion utilities

### Implementation in os2shell Module

Internal implementation can still use internal utilities:

```typescript
// In os2shell module (internal)

import { AG_OS_TO_SHELL_MAP, AGTOSType, AGTShellType } from '#shared/types/os2shell.types.ts';

/** @internal Get shell for the current virtual OS */
function _getShellForOS(virtualOS: AGTOSType | undefined): AGTShellType | undefined {
  if (virtualOS === undefined) { return undefined; }
  return AG_OS_TO_SHELL_MAP[virtualOS];
}
```

### Alternatives Considered

1. Keep mapping private (`_osToShellMap`) - Rejected as it hides useful public information
2. Define mapping in os2shell module only - Rejected as it couples type definitions with implementation
3. Provide getter function instead of constant - Rejected as simple constant table is sufficient and more efficient

### Related Decisions

- DR000: Naming convention - public constants use `AG` prefix
- DR001: Type definition organization - enums are in `os2shell.types.ts`
- DR003: Internal raw OS conversion is separate from this public mapping

### Related Specifications

See `specifications.md` Section 4: Shell Mapping Specification (Primary Shell Mapping table)

---

## DR005: Type File Refactoring and Reorganization

**Phase**: impl
**Status**: Decided (2025-12-31)

### Context

DR001 defined the intended organization; this DR finalizes it at implementation level.
During implementation planning, the initial type definitions were scattered or co-located without clear separation of concerns:

- Runtime detection types (Node.js, Deno, Bun) share the same file
- Command execution result types (error/success) mixed with runtime types
- Virtual OS and shell mapping types not yet separated into module-specific files

This leads to:

- Semantic coupling between unrelated concerns
- Unclear module ownership and responsibility
- Import paths that don't reflect functional domains
- Difficulty for users to discover the correct types for their use case

### Decision

Reorganize type definitions across three dedicated files in `shared/types/` directory based on functional domain and reusability scope:

1. **`runtime.types.ts`** (update existing)
   - Contains: `_RawOSPlatformType`, `_RawOSPlatformResult`
   - Scope: Cross-runtime platform detection (Node.js, Deno, Bun)
   - Ownership: Runtime abstraction layer

2. **`command-result.types.ts`** (new - shared)
   - Contains: `AGTCommandErrorType`, `AGTCommandError`, `AGTCommandSuccess`, `AGTCommandResult`
   - Scope: Reusable across all command-runner modules
   - Ownership: Shared library layer

3. **`os2shell.types.ts`** (new - module-specific)
   - Contains: `AGTOSType`, `AGTShellType`, `AG_OS_TO_SHELL_MAP`,
   - Scope: os2shell module exclusive
   - Ownership: os2shell module

### Rationale

- Separation of Concerns: Each file represents a distinct functional domain
- Clear Ownership: Module-specific types live in module-specific files; shared types in shared layer
- Import Clarity: Users import from the appropriate file based on their need:
  - `from '#shared/types/runtime.types.ts'` for runtime detection
  - `from '#shared/types/command-result.types.ts'` for command results
  - `from '#shared/types/os2shell.types.ts'` for virtual OS and shell definitions
- Discoverability: Logical organization helps developers find the right types
- Maintainability: Each file has a single, clear purpose
- Future Extensibility: New types can be added to their appropriate file without creating new concerns

### Consequences

- File Creation: Two new files must be created (`command-result.types.ts`, `os2shell.types.ts`)
- File Updates: `runtime.types.ts` must be updated to rename and reorganize types
- Import Updates: All test files and implementations that import these types must be updated
- Barrel File Updates: `shared/types/index.ts` must re-export from all three files to maintain public API compatibility
- JSDoc Migration: All documentation and examples must be preserved during file migrations
- Breaking Changes: None - proper re-exports maintain backward compatibility

### Migration Strategy

Implement in this order:

1. Create `os2shell.types.ts` with new `AGTOSType`, `AGTShellType`, and `AG_OS_TO_SHELL_MAP`
2. Create `command-result.types.ts` with command result types
3. Rename types in `runtime.types.ts` to `_RawOSPlatformType` and `_RawOSPlatformResult`
4. Update all imports in:
   - Test files (`**/__tests__/**/*.spec.ts`)
   - Implementation files (`src/runtime/*.ts`)
   - Type reference files
5. Update barrel file exports for compatibility
6. Run comprehensive type checking and tests
7. Verify all imports resolve correctly

### Alternatives Considered

1. **Keep all types in `runtime.types.ts`** - Rejected: Creates semantic coupling and obscures module boundaries
2. **Create one file per type** - Rejected: Over-engineering; lacks logical grouping
3. **Merge command-result and os2shell types** - Rejected: Different reusability scopes (shared vs. module-specific)
4. **Create types directly in implementation files** - Rejected: Violates separation of concerns; makes testing harder

### Implementation Checklist

- [ ] Create `shared/types/os2shell.types.ts` with `AGTOSType`, `AGTShellType`, `AG_OS_TO_SHELL_MAP`
- [ ] Create `shared/types/command-result.types.ts` with command result types
- [ ] Update `runtime.types.ts` type naming to `_RawOSPlatformType`, `_RawOSPlatformResult`
- [ ] Update imports in `src/runtime/__tests__/unit/getOSPlatform.spec.ts`
- [ ] Update imports in `src/runtime/__tests__/unit/detectRuntime.spec.ts`
- [ ] Update imports in `src/runtime/__tests__/unit/types.spec.ts`
- [ ] Update barrel file `shared/types/index.ts` exports
- [ ] Run `pnpm check:types` to verify no type errors
- [ ] Run `pnpm test` to verify all tests pass
- [ ] Verify import paths in implementation files

### Related Decisions

- DR000: Naming convention - ensures consistent naming across new type files
- DR001: Type definition organization (requirements-time decision) - this DR implements the strategy
- DR002: Raw OS Platform naming clarification - defines the naming used in the refactored types
- DR003: Internal conversion tables - placement decision for `_rawOSToVirtualOSMap`
- DR004: Public mapping table - placement decision for `AG_OS_TO_SHELL_MAP`

### Related Specifications

See `specifications.md` Sections 3-6 for the virtual OS platform and shell mapping specifications that these type files implement.

See `implementation.md` Section 2 "Shared Types File Organization and Refactoring" for detailed migration plan and file distribution matrix.

---

## DR006: Internal Raw OS to Virtual OS Mapping Implementation

**Phase**: impl
**Status**: Decided (2025-12-31)

### Context

DR003 defines the existence and semantics.
DR006 concretizes it at implementation level.

During implementation planning for the os2shell module, the architecture needed to define:

1. How raw OS platform values (from runtime) are converted to Virtual OS platforms
2. Where the conversion mapping table should be located
3. Whether internal implementation should be unit-tested separately from public API
4. fHow to support unit testing without exposing internal APIs

The conversion from raw OS values (e.g., 'win32', 'darwin', 'linux') to Virtual OS platforms (Windows, macOS, Linux) is a critical internal stage (Stage 2 of the 3-stage pipeline per specifications.md Section 3).

### Decision

The internal raw-to-virtual OS conversion mapping is implemented as a private constant inside `src/runtime/getOSPlatform.ts`:

**Implementation Structure:**

```typescript
// getOSPlatform.ts (src/runtime/)

// Private function: Raw OS detection from runtime
// _testRawOS is used for unit tests.
const _getRawOS = (_testRawOS?: string): string | undefined => {
  // Runtime-specific detection logic
  // Returns: 'win32', 'darwin', 'linux', and other unsupported values.
};

// Private constant: Raw OS → Virtual OS mapping table
const _RAW_OS_TO_VIRTUAL_OS_MAP: Record<_RawOSPlatformType, AGTOSType> = {
  win32: AGTOSType.Windows,
  darwin: AGTOSType.macOS,
  linux: AGTOSType.Linux,
};

// Public function: Virtual OS detection (combines raw detection + conversion)
// parameter: _testRawOS used for Unit Tests.
export const getOSPlatform = (_testRawOS?: _RawOSPlatformType): AGTOSType | undefined => {
  const rawOS = _getRawOS(_testRawOS);
  return _RAW_OS_TO_VIRTUAL_OS_MAP[rawOS];
};
```

**Naming Convention:**

- `_getRawOS()`: Internal function (_camelCase per DR000)
- `_RAW_OS_TO_VIRTUAL_OS_MAP`: Internal constant (_UPPER_SNAKE_CASE per DR000)

**Testing Approach:**

- Runtime environment tests use the public API `getOSPlatform()` as the integration point
- No separate unit tests for internal functions (`_getRawOS()`, `_RAW_OS_TO_VIRTUAL_OS_MAP`)
- Internal implementation is validated implicitly through public API contract compliance

### Rationale

- Single Responsibility: Raw OS detection and its conversion are tightly coupled concerns; keeping both in getOSPlatform.ts maintains cohesion
- Encapsulation: Internal mapping table is private; only the Virtual OS result is exposed
- Simplicity: Avoids creating additional files or directories for internal mapping
- Testing Strategy: Public API testing is sufficient; the mapping correctness is implicit in correct Virtual OS output
- Maintainability: All "raw OS concerns" are co-located in one file, simplifying changes to raw OS handling

### Consequences

- `getOSPlatform.ts` contains both raw detection and conversion logic (vs. separation into multiple files)
- Internal functions are not individually testable; testing focuses on public contract
- Changes to the mapping require updating getOSPlatform.ts only
- Runtime environment tests (Node.js, Deno, Bun) verify correct Virtual OS detection through public API
- Internal implementation details are hidden from callers; public API is the only contract

### Migration Strategy

1. Rename current `getOSPlatform()` function body to internal `_getRawOS()`
2. Add `_RAW_OS_TO_VIRTUAL_OS_MAP` constant inside getOSPlatform.ts
3. Create new public `getOSPlatform()` that:
   - Calls `_getRawOS()` to get raw platform
   - Looks up in `_RAW_OS_TO_VIRTUAL_OS_MAP`
   - Returns Virtual OS or undefined
4. Update test suite to use public `getOSPlatform()` for Node.js/Deno/Bun runtime tests
5. Run type checking and tests to verify contract compliance

### Alternatives Considered

1. **Separate utility file** (src/runtime/platform-mapping.ts)
   - Rejected: Creates unnecessary file overhead for a simple lookup
   - Too much structure for a single mapping table
   - Would require additional imports

2. **Shared constants directory** (shared/constants/)
   - Rejected: Semantic mismatch - mapping is internal, not shared
   - Violates separation of concerns - internal logic shouldn't live in shared layer
   - Confuses developers about reusability

3. **Internal types directory** (src/internal/types/)
   - Rejected: Overkill for a single mapping constant
   - Duplicates existing structure (shared/types already exists)
   - Creates unnecessary directory indirection

4. **Separate export for testing** (export __testOnly with mapping)
   - Rejected: Complicates public API surface
   - Testing public contract is sufficient; no need for internal exports
   - Encourages tight coupling between tests and implementation details

### Implementation Checklist

- [ ] Implement `_getRawOS()` in getOSPlatform.ts
- [ ] Add `_RAW_OS_TO_VIRTUAL_OS_MAP` mapping table
- [ ] Refactor public `getOSPlatform()` to use both
- [ ] Update existing runtime tests to expect Virtual OS output
- [ ] Add Node.js/Deno/Bun environment-specific test cases
- [ ] Run type checking (pnpm check:types)
- [ ] Run test suite (pnpm test)
- [ ] Verify all imports and exports function correctly

### Related Decisions

- DR000: Naming convention for internal symbols (`_camelCase`, `_UPPER_SNAKE_CASE`)
- DR005: Type file refactoring and reorganization
- DR001-DR004: Earlier decisions about OS/shell mapping and type organization

### Related Specifications

- `specifications.md` Section 3: Basic Architecture Flow describing the 3-stage pipeline
- `specifications.md` Section 4: Raw OS Detection and Virtual OS Conversion (Stage 2 specification)
- `implementation.md` Section 1.2: Module Location describing getOSPlatform.ts role
- `implementation.md` Section 1.3: Testing Strategy specifying public API usage for runtime tests

---

## Change History

| Date       | Decision | Status  |
| ---------- | -------- | ------- |
| 2025-12-31 | DR006    | Decided |
| 2025-12-31 | DR005    | Decided |
| 2025-12-31 | DR004    | Decided |
| 2025-12-31 | DR000    | Decided |
| 2025-12-31 | DR003    | Decided |
| 2025-12-31 | DR002    | Decided |
| 2025-12-31 | DR001    | Decided |
