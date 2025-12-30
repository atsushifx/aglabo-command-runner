# Requirements: os2shell Module

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- markdownlint-disable line-length -->

## Problem Statement

The `os2shell` module addresses the need to abstract and manage OS-specific shell selection for subprocess execution. Different operating systems have different default shells and subprocess handling requirements. Applications need a unified interface to obtain the appropriate shell for the current OS environment without duplicating platform detection logic.

## Goals

1. Create a mapping table that associates operating systems with their corresponding shells
2. Provide functionality to detect the current OS
3. Retrieve the appropriate shell for subprocess execution based on the running OS
4. Enable subprocess creation to use the correct shell regardless of the host platform

## Requirements

### Functional Requirements

1. **Virtual OS Platform Abstraction**
   - Define a **virtual OS platform enumeration** that is independent of any specific runtime (Node.js, Deno, etc.)
   - Do NOT directly use runtime-specific platform values (e.g., `process.platform` from Node.js, `Deno.build.os`)
   - Map runtime platform values to virtual OS platform values at the boundary
   - Virtual OS platforms serve as the canonical representation for shell mapping
   - Supported virtual OS platforms:
     - `Windows` - Windows operating system
     - `macOS` - macOS (formerly Darwin)
     - `Linux` - Linux operating system
   - Mapping is unidirectional: runtime platform → virtual OS platform (never the reverse)
   - **Rationale:** This abstraction decouples the module from runtime-specific platform naming and makes it compatible with future runtimes without code changes

2. **Virtual OS → Shell Mapping Table**
   - Maintain a mapping from virtual OS platform to a primary shell command
   - The concrete shell selection is defined in the specification
   - Support extending the mapping with additional shells per OS in future versions (but only primary shell is required initially)
   - Define this mapping as an enumeration or constant mapping object in code

3. **OS Detection**
   - Detect the current operating system at runtime
   - Normalize runtime-specific platform detection (e.g., `process.platform`) to virtual OS platform
   - Handle OS detection across Node.js and other runtime environments
   - Return the detected virtual OS platform, not the raw runtime platform value

4. **Shell Resolution**
   - Export a function to retrieve the shell for the current OS
   - Function operates on the virtual OS platform level (not raw runtime values)
   - If the operating system is detected and supported, return the shell path/command as a string
   - If the operating system cannot be detected or is unsupported, return `undefined`
   - The module MUST NOT apply any implicit fallback shell selection
   - Handling of `undefined` results is the responsibility of the caller
   - Caller MUST explicitly check and handle the `undefined` case (e.g., via JSDoc or documentation)

### Non-Functional Requirements

1. **Reliability**
   - Consistent behavior across different OS versions
   - Explicit, deterministic behavior: return `undefined` for unknown or unsupported operating systems (no implicit fallback)
   - Prevent silent failures by making undefined results visible to callers

2. **Maintainability**
   - Code should be clear and easy to extend with new OS/shell combinations
   - Centralized mapping to avoid duplication

3. **Performance**
   - Minimal overhead for shell detection
   - Cache OS detection results if needed

## Constraints

- Must work in Node.js environment (v20+)
- Must handle cross-platform scenarios
- Limited to subprocess shell selection use cases
- Should not introduce external OS-specific dependencies

## Critical Design Constraints

### No Implicit Fallback Shell

This is a **non-negotiable requirement** to prevent silent failures and unsafe subprocess execution:

- The module **MUST NOT** select a fallback shell implicitly (e.g., defaulting to `sh`, `cmd.exe`, `bash`)
- The module **MUST NOT** apply default shell selection for unknown or unsupported OS
- Return `undefined` explicitly so callers are forced to handle the unknown OS case
- This constraint prevents future contributors from adding ad-hoc fallback logic

**Rationale:** Implicit fallback shells can cause silent failures where incorrect shells are used for subprocess execution, leading to command failures, security issues, or platform-specific bugs that are difficult to diagnose.

## Scope

**In Scope:**

- OS detection logic
- Shell mapping table
- API to retrieve shell for current OS

**Out of Scope:**

- Actual subprocess spawning
- Interactive shell functionality
- Shell feature capability detection

## Appendix: Raw OS to Virtual OS Mapping

This module normalizes runtime-specific OS identifiers ("raw OS")
into a limited set of virtual OS platforms.

- Only explicitly supported raw OS values are mapped.
- Raw OS values without a defined mapping MUST result in `undefined`.
- The module MUST NOT apply implicit fallbacks for unknown raw OS values.
- Handling of `undefined` results is the responsibility of the caller.

This design intentionally limits supported platforms to ensure
predictable and maintainable shell resolution behavior.

## Decision Records

See [`DecisionRecords.md`](./DecisionRecords.md) for detailed decision records.
