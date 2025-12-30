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

## 3. Virtual OS Platform Abstraction

### 3.1 Virtual OS Platform Definition

A **Virtual OS Platform** is a canonical representation of an operating system, independent of any runtime's naming conventions.

**Supported Virtual OS Platforms:**

| Platform  | Description                             |
| --------- | --------------------------------------- |
| `Windows` | Windows operating system (all versions) |
| `macOS`   | macOS operating system                  |
| `Linux`   | Linux operating system                  |

**Scope:** This specification defines behavior only for these three virtual OS platforms. All other operating systems result in `undefined` behavior from the module.

### 3.2 Runtime Platform to Virtual OS Platform Mapping

The module MUST normalize runtime-specific platform detection to virtual OS platforms at the boundary.

**Node.js Platform Mapping:**

| Node.js `process.platform` | Virtual OS Platform | Support |
| -------------------------- | ------------------- | ------- |
| `win32`                    | `Windows`           | Yes     |
| `darwin`                   | `macOS`             | Yes     |
| `linux`                    | `Linux`             | Yes     |
| (all others)               | (undefined)         | No      |

**Mapping Rule:** If the runtime platform does not have an entry in this table, platform detection returns `undefined`.

---

## 4. Shell Mapping Specification

### 4.1 Virtual OS Platform to Shell Mapping

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

## 5. OS Detection Specification

### 5.1 OS Detection Behavior

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

## 6. Shell Resolution Specification

### 6.1 Shell Resolution Behavior

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

### 6.2 No Implicit Fallback Behavior

The module MUST NOT:

- Select a default shell when the detected OS is `undefined`
- Return a fallback shell (e.g., `sh`, `bash`, `cmd.exe`) for unsupported platforms
- Apply environment-based shell selection logic
- Guess or infer a shell for unknown operating systems

**Rationale:** Implicit fallback shells create silent failures where the wrong shell may be used for subprocess execution, leading to platform-specific bugs and security issues.

---

## 7. Edge Cases

| Scenario                     | Input/Condition                    | Expected Behavior         |
| ---------------------------- | ---------------------------------- | ------------------------- |
| Unknown runtime platform     | `process.platform` is `aix`        | Return `undefined`        |
| Supported platform (Windows) | `process.platform` is `win32`      | Return `pwsh.exe`         |
| Supported platform (macOS)   | `process.platform` is `darwin`     | Return `/bin/zsh`         |
| Supported platform (Linux)   | `process.platform` is `linux`      | Return `/bin/bash`        |
| Future runtime (e.g., Deno)  | Different platform name convention | Requires explicit mapping |

---

## 8. Requirements Traceability

| Requirement ID                    | Covered By                                     |
| --------------------------------- | ---------------------------------------------- |
| FR1 (Virtual OS Abstraction)      | Section 3: Virtual OS Platform Abstraction     |
| FR2 (Virtual OS → Shell Mapping)  | Section 4: Shell Mapping Specification         |
| FR3 (OS Detection)                | Section 5: OS Detection Specification          |
| FR4 (Shell Resolution)            | Section 6: Shell Resolution Specification      |
| Non-FR1 (Reliability)             | Section 6.2: No Implicit Fallback Behavior     |
| Non-FR2 (Maintainability)         | Section 4: Centralized mapping table           |
| Non-FR3 (Performance)             | Section 5.1: Minimal detection overhead        |
| Critical Constraint (No Fallback) | Section 6.2: Explicit constraint and rationale |

---

## 9. Open Questions

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->

- Should the module support dynamically registering new OS/shell pairs post-initialization?
- Should the module cache OS detection results for performance optimization?
- Should future shell extensions (beyond the primary shell) be versioned or backward-compatible?

---

## 10. Change History

| Date       | Version | Description                    |
| ---------- | ------- | ------------------------------ |
| 2025-12-30 | 1.0     | Initial specification document |
