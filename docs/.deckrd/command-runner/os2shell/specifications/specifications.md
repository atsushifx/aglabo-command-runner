---
title: "Design Specification: os2shell Module"
Based on: requirements.md v1.0
Status: Draft
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- markdownlint-disable line-length -->

## 1. Overview

### 1.1 Purpose

This specification defines the behavioral contract and technical semantics of the `os2shell` module, which provides OS-aware shell resolution for subprocess execution. It establishes the virtual OS platform abstraction, shell mapping rules, OS detection behavior, and shell resolution logic.

### 1.2 Scope

This specification defines the **observable behavior** and **decision logic** of the `os2shell` module.

Implementation details (module organization, function signatures, internal utilities) are explicitly out of scope.

---

## 2. Design Principles

### 2.1 Abstraction Philosophy

The `os2shell` module operates at a **platform abstraction layer** that decouples runtime-specific platform values from shell resolution logic. This design enables:

- Runtime Independence: The module works across different JavaScript runtimes (Node.js, Deno, etc.) without modification
- Explicit Normalization: Runtime platform values are normalized at the boundary to a canonical virtual OS platform representation
- Centralized Mapping: Shell selection is defined once per virtual OS platform, not per runtime

### 2.2 Design Assumptions

1. Virtual OS Platforms are Canonical: All shell decisions are made based on virtual OS platform enumeration, never raw runtime platform values
2. Platform Detection is Deterministic: Runtime platform detection always produces a defined value that can be mapped to a virtual OS platform or explicitly marked as unsupported
3. Caller Responsibility for Undefined: When shell resolution returns `undefined`, the caller MUST handle it explicitly; the module provides no implicit fallback
4. Unidirectional Mapping: Runtime platform values map to virtual OS platforms in one direction only; reverse mapping is not supported
5. Supported Platforms are Limited: Only explicitly defined virtual OS platforms are supported; unknown platforms result in `undefined`

### 2.3 Non-Goals

- Detecting or adapting to different shell versions or variants on the same OS
- Selecting alternative shells based on user preferences or environment variables
- Validating shell availability or executability.
- Launching or executing shells directly (subprocess spawning is caller responsibility)

---

## 3. Basic Architecture Flow

### 3.1 Overview

The os2shell module implements a unified three-stage pipeline for platform detection and shell resolution:

```bash
┌─────────────────────────────────────────┐
│ Stage 1: Raw OS Detection               │
│ ─────────────────────────────────────── │
│ Obtain raw OS platform from runtime     │
│ (e.g., 'win32', 'darwin', 'linux')     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Stage 2: Raw OS → Virtual OS Conversion │
│ ─────────────────────────────────────── │
│ Map raw OS to virtual OS platform       │
│ (e.g., 'win32' → Windows)              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Stage 3: Virtual OS → Shell Resolution  │
│ ─────────────────────────────────────── │
│ Resolve shell command for OS            │
│ (e.g., Windows → 'pwsh.exe')           │
└─────────────────────────────────────────┘
              ↓
         Final Result
     (Shell command or undefined)
```

### 3.2 Stage-by-Stage Description

#### Stage 1: Raw OS Detection

- Detects the raw platform value from the current runtime environment
- Different runtimes (Node.js, Deno, Bun) may use different naming conventions
- Returns raw OS value (e.g., `'win32'`, `'darwin'`, `'linux'`) or `undefined` if unsupported

#### Stage 2: Raw OS → Virtual OS Conversion

- Normalizes raw OS values to a canonical virtual OS platform representation
- Maps runtime-specific platform values to abstract OS concepts (Windows, macOS, Linux)
- Returns corresponding virtual OS platform or `undefined` if raw OS is unsupported
- This conversion happens at the boundary, decoupling the module from runtime-specific details

#### Stage 3: Virtual OS → Shell Resolution

- Looks up the primary shell command for the detected virtual OS platform
- Shell selection is defined once per virtual OS, not per runtime
- Returns shell command string or `undefined` if platform has no mapping

### 3.3 Example Flow

#### Scenario: Resolve shell for current platform on Windows

```text
Windows runtime environment
    ↓
[Stage 1] Detect raw OS → 'win32'
    ↓
[Stage 2] Convert raw OS → Virtual OS (Windows)
    ↓
[Stage 3] Resolve shell → 'pwsh.exe'
    ↓
    Return: 'pwsh.exe'
```

#### Scenario: Unsupported platform

```text
Unsupported runtime environment
    ↓
[Stage 1] Detect raw OS → undefined
    ↓
[Stage 2] Convert raw OS → undefined (no mapping)
    ↓
[Stage 3] Return undefined
    ↓
    Return: undefined
```

---

## 4. Stage 1 & 2: Raw OS Detection and Virtual OS Conversion

### 4.1 Raw OS Detection from Runtime

The first stage detects the raw platform value from the runtime environment.

**Detection Method:**

The module obtains the raw OS platform value using runtime-specific mechanisms:

- Node.js: `process.platform` (e.g., `'win32'`, `'darwin'`, `'linux'` and others)
- Deno: `Deno.build.os` (similar convention)
- Bun: `process.platform` (Node.js compatible)

**Raw OS Values:**

The raw platform values are runtime-specific identifiers. Different runtimes may use different naming conventions for the same operating system.

**Output:**

- Returns the raw platform string from the runtime environment
- Returns `undefined` if the platform cannot be detected

### 4.2 Raw OS to Virtual OS Conversion (Internal Mapping)

The second stage normalizes raw OS values to a canonical virtual OS platform representation using an internal mapping table.

**Mapping Principle:**

- The module maintains an **internal mapping table** that converts raw OS values to virtual OS platforms
- Only explicitly mapped raw OS values are converted to a virtual OS platform
- **Raw OS values that have NO entry in the mapping table are DISCARDED (dropped) and return `undefined`**
- This design ensures that unsupported platforms cannot accidentally pass through the conversion stage

**Node.js Platform Mapping (Example):**

| Raw OS Value (`process.platform`) | Virtual OS Platform | Status      |
| --------------------------------- | ------------------- | ----------- |
| `win32`                           | `Windows`           | ✓ Mapped    |
| `darwin`                          | `macOS`             | ✓ Mapped    |
| `linux`                           | `Linux`             | ✓ Mapped    |
| `aix`                             | *(NOT in table)*    | ✗ Discarded |
| `freebsd`                         | *(NOT in table)*    | ✗ Discarded |
| (any other value)                 | *(NOT in table)*    | ✗ Discarded |

**Discarding Behavior:**

- Any raw OS value that does not have an explicit entry in the mapping table is **not assigned a virtual OS platform**
- Instead, the function returns `undefined`, signaling that the platform is unsupported
- This prevents silent failures or implicit assumptions about unmapped platforms

**Processing Logic:**

1. Obtain the raw OS value from Stage 1 (Raw OS Detection)
2. Look up the raw OS value in the internal mapping table
3. If found: Return the corresponding virtual OS platform
4. If NOT found: **Return `undefined` (discard the platform)**

---

## 5. Virtual OS Platform Abstraction

### 5.1 Virtual OS Platform Definition

A **Virtual OS Platform** is a canonical representation of an operating system, independent of any runtime's naming conventions.

**Supported Virtual OS Platforms:**

| Platform  | Description                             |
| --------- | --------------------------------------- |
| `Windows` | Windows operating system (all versions) |
| `macOS`   | macOS operating system                  |
| `Linux`   | Linux operating system                  |

**Scope:** This specification defines behavior only for these three virtual OS platforms. All other operating systems result in `undefined` behavior from the module.

---

## 6. Stage 3: Virtual OS to Shell Resolution

### 6.1 Virtual OS Platform to Shell Mapping

The module maintains a deterministic mapping from virtual OS platform to a primary shell command.

**Primary Shell Mapping:**

| Virtual OS Platform | Primary Shell | Rationale                                                                                          |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `Windows`           | `pwsh.exe`    | Preferred modern shell (PowerShell 7+) Availability of `pwsh.exe` is not validated by this module. |
| `macOS`             | `/bin/zsh`    | macOS default shell                                                                                |
| `Linux`             | `/bin/bash`   | Common default shell on many Linux distributions                                                   |

**Mapping Semantics:**

1. Each virtual OS platform has exactly one primary shell entry
2. The shell value is a string (command or path) suitable for subprocess shell selection
3. This mapping is treated as a canonical constant; deviations from this table are not permitted

---

## 7. OS Detection Specification

### 7.1 OS Detection Behavior

**Operation:** Detect the current operating system at runtime and normalize to virtual OS platform.

**Input:** None (implicitly uses runtime environment at the moment of invocation)

**Processing:**

1. Obtain the raw runtime platform value using the appropriate detection method (e.g., `process.platform` in Node.js)
2. Look up the raw platform value in the Runtime Platform to Virtual OS Platform Mapping table
3. Return the virtual OS platform if found in the mapping; otherwise, return `undefined`

**Output:**

- If the raw platform has a defined mapping: Return the corresponding virtual OS platform
- If the raw platform has no mapping: Return `undefined`

**Decision Rule:**

| Step | Condition                     | Outcome                       |
| ---: | ----------------------------- | ----------------------------- |
|    1 | Runtime platform is in table  | Return corresponding platform |
|    2 | Runtime platform not in table | Return `undefined`            |

---

## 8. Shell Resolution Specification

### 8.1 Shell Resolution Behavior

**Operation:** Retrieve the shell command/path for the currently running operating system.

**Input:** None (implicitly uses OS detection and mapping)

**Processing:**

1. Detect the current operating system using OS Detection logic
2. If OS detection returns `undefined`, return `undefined`
3. If OS detection returns a valid virtual OS platform, look up the platform in the Virtual OS Platform to Shell Mapping table
4. Return the mapped shell string

**Output:**

- If a shell mapping exists for the detected platform: Return the shell string
- If OS detection returned `undefined` or platform has no mapping: Return `undefined`

**Decision Rule:**

| Step | Condition                      | Outcome              |
| ---: | ------------------------------ | -------------------- |
|    1 | OS not detected or unsupported | Return `undefined`   |
|    2 | OS detected and shell mapped   | Return shell command |

### 8.2 No Implicit Fallback Behavior

The module MUST NOT:

- Select a default shell when the detected OS is `undefined`
- Return a fallback shell (e.g., `sh`, `bash`, `cmd.exe`) for unsupported platforms
- Apply environment-based shell selection logic
- Guess or infer a shell for unknown operating systems

**Rationale:** Implicit fallback shells create silent failures where the wrong shell may be used for subprocess execution, leading to platform-specific bugs and security issues.

---

## 9. Edge Cases

| Scenario                     | Input/Condition                    | Expected Behavior         |
| ---------------------------- | ---------------------------------- | ------------------------- |
| Unknown runtime platform     | `process.platform` is `aix`        | Return `undefined`        |
| Supported platform (Windows) | `process.platform` is `win32`      | Return `pwsh.exe`         |
| Supported platform (macOS)   | `process.platform` is `darwin`     | Return `/bin/zsh`         |
| Supported platform (Linux)   | `process.platform` is `linux`      | Return `/bin/bash`        |
| Future runtime (e.g., Deno)  | Different platform name convention | Requires explicit mapping |

---

## 10. Requirements Traceability

| Requirement ID                    | Covered By                                                                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| FR1 (Virtual OS Abstraction)      | Section 3: Basic Architecture Flow + Section 4: Raw OS Detection and Virtual OS Conversion + Section 5: Virtual OS Platform Abstraction |
| FR2 (Virtual OS → Shell Mapping)  | Section 6: Stage 3 - Virtual OS to Shell Resolution                                                                                     |
| FR3 (OS Detection)                | Section 4: Stage 1 & 2 + Section 7: OS Detection Specification                                                                          |
| FR4 (Shell Resolution)            | Section 8: Shell Resolution Specification                                                                                               |
| Non-FR1 (Reliability)             | Section 8.2: No Implicit Fallback Behavior                                                                                              |
| Non-FR2 (Maintainability)         | Section 6.1: Virtual OS Platform to Shell Mapping                                                                                       |
| Non-FR3 (Performance)             | Section 4: Raw OS Detection and Conversion (O(1) lookup)                                                                                |
| Critical Constraint (No Fallback) | Section 4.2: Discarding Behavior + Section 8.2: Explicit constraint and rationale                                                       |

---

## 11. Open Questions

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->

- Should the module support dynamically registering new OS/shell pairs post-initialization?
- Should the module cache OS detection results for performance optimization?
- Should future shell extensions (beyond the primary shell) be versioned or backward-compatible?

---

## 12. Change History

| Date       | Version | Description                                                                                                                                                                                   |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-12-31 | 1.5     | Removed Type Definition Refactoring section (moved to implementation.md) - specifications now focuses purely on behavioral contracts                                                          |
| 2025-12-31 | 1.4     | Restructured sections per Basic Architecture Flow: Stage 1 & 2 (Section 4), Virtual OS Abstraction (Section 5), Stage 3 (Section 6), with explicit "Discarding" behavior for unsupported OSes |
| 2025-12-31 | 1.3     | Added Section 3 "Basic Architecture Flow" documenting _rawOS → VirtualOS → Shell pipeline                                                                                                     |
| 2025-12-31 | 1.2     | Enhanced Section 11.1 with Decision Records (DR000-DR004): naming conventions, function renaming, public mapping                                                                              |
| 2025-12-31 | 1.1     | Addendum: Type definition refactoring plan (Section 11.1) - command-result.types.ts migration                                                                                                 |
| 2025-12-30 | 1.0     | Initial specification document                                                                                                                                                                |
