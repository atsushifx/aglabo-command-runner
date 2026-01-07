---
title: "Tasks: os2shell Module Implementation"
based_on: "implementation.md v1.1"
status: "Active"
task_count: 568
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable line-length -->

## os2shell Module Implementation Tasks

## Overview

**Task list** organized into 8 sections with clear task IDs in the format `T<Section(2-digit)>-<Subsection(2-digit)>-<TestCase(2-digit)>`.

- **Sections:** 01-08 (8 main feature areas)
- **Section 01:** 52 tasks - 3 tasks for file/structure-only, 5 tasks for value-bearing items (正常系/異常系/エッジケース + type check)
- **Sections 02-08:** Summary format (implementation details as needed)
- **Coverage:** Implementation / Value Correctness (Normal/Invalid/Edge Cases) / Type Correctness / Export & Structure

---

## セクション01: Type Definitions & File Organization (12 subsections, 52 tasks)

### T01-01: Rename AGTPlatformType to _RawOSPlatformType (5 tasks)

- [x] **T01-01-01** Given: runtime.types.ts open / When: renaming AGTPlatformType / Then: type renamed to `_RawOSPlatformType` with `_` prefix
- [x] **T01-01-02** Given: _RawOSPlatformType defined / When: checking normal values / Then: contains 'win32', 'darwin', 'linux'
- [x] **T01-01-03** Given: _RawOSPlatformType defined / When: checking invalid values / Then: no incorrect or misspelled values (e.g., 'unix', 'windows' excluded)
- [x] **T01-01-04** Given: _RawOSPlatformType defined / When: checking edge cases / Then: no extra spaces, no case variations ('WIN32', 'darwin' with capital letters)
- [x] **T01-01-05** Given: type renamed / When: running type check / Then: all references updated with no compilation errors

### T01-02: Rename AGTPlatformResult to _RawOSPlatformResult (5 tasks)

- [x] **T01-02-01** Given: runtime.types.ts has AGTPlatformResult / When: renaming to _RawOSPlatformResult / Then: type renamed with `_` prefix
- [x] **T01-02-02** Given: _RawOSPlatformResult defined / When: checking normal union / Then: includes `_RawOSPlatformType` and undefined as options
- [x] **T01-02-03** Given: _RawOSPlatformResult defined / When: checking invalid union / Then: no extra types (null not included, only undefined), no duplicate entries
- [x] **T01-02-04** Given: _RawOSPlatformResult defined / When: checking edge cases / Then: undefined is optional, not /required; order doesn't affect type safety
- [x] **T01-02-05** Given: type renamed / When: running type check / Then: all references updated with no import errors

### T01-03: Create shared/types/command-result.types.ts File (3 tasks)

- [x] **T01-03-01** Given: new file creation / When: creating command-result.types.ts / Then: file created at shared/types/command-result.types.ts
- [x] **T01-03-02** Given: file created / When: checking structure / Then: includes UTF-8 encoding, proper TypeScript syntax, and ES6 export statements
- [x] **T01-03-03** Given: file ready / When: preparing for type definitions / Then: includes section comments for enums and types with JSDoc placeholders

### T01-04: Define AGTCommandErrorType in command-result.types.ts (5 tasks)

- [x] **T01-04-01** Given: command-result.types.ts open / When: defining AGTCommandErrorType / Then: public enum created
- [x] **T01-04-02** Given: enum defined / When: checking normal values / Then: includes TypeErrors, RuntimeErrors, ValidationErrors
- [x] **T01-04-03** Given: enum defined / When: checking invalid values / Then: no extra or misspelled values (e.g., 'TypeError', 'RuntimeError' singular excluded)
- [x] **T01-04-04** Given: enum defined / When: checking edge cases / Then: no duplicate values, correct casing (TypeErrors not typeErrors), no extra spaces
- [x] **T01-04-05** Given: enum defined / When: checking type / Then: enum is properly exported and accessible as AGTCommandErrorType

### T01-05: Define AGTCommandError Type in command-result.types.ts (5 tasks)

- [x] **T01-05-01** Given: command-result.types.ts updating / When: defining AGTCommandError type / Then: type object created
- [x] **T01-05-02** Given: type defined / When: checking normal fields / Then: includes type and message fields, both required
- [x] **T01-05-03** Given: type defined / When: checking invalid fields / Then: no extra required fields (code, stack), type is AGTCommandErrorType and message is string (not number, boolean)
- [x] **T01-05-04** Given: type defined / When: checking edge cases / Then: no optional required fields, field order doesn't matter, allows additional properties via index signature
- [x] **T01-05-05** Given: type defined / When: checking type / Then: type is properly exported and accessible as AGTCommandError

### T01-06: Define AGTCommandSuccess Type in command-result.types.ts (5 tasks)

- [x] **T01-06-01** Given: command-result.types.ts updating / When: defining AGTCommandSuccess type / Then: type object created
- [x] **T01-06-02** Given: type defined / When: checking normal fields / Then: includes success and result fields
- [x] **T01-06-03** Given: type defined / When: checking invalid fields / Then: success is literal true (not boolean, not false), result is unknown (not any, not void), no extra fields like error
- [x] **T01-06-04** Given: type defined / When: checking edge cases / Then: field order matches error pattern, success is required not optional, allows additional properties
- [x] **T01-06-05** Given: type defined / When: checking type / Then: type is properly exported and accessible as AGTCommandSuccess

### T01-07: Define AGTCommandResult Union Type (3 tasks)

- [x] **T01-07-01** Given: command-result.types.ts complete / When: creating AGTCommandResult union / Then: union type created as AGTCommandSuccess | AGTCommandError
- [x] **T01-07-02** Given: union type defined / When: checking discriminator / Then: 'success' field enables proper type narrowing
- [x] **T01-07-03** Given: union defined / When: checking structure / Then: union is properly exported and accessible as AGTCommandResult

### T01-08: Create shared/types/os2shell.types.ts File (3 tasks)

- [x] **T01-08-01** Given: creating os2shell-specific types / When: creating os2shell.types.ts / Then: file created at shared/types/os2shell.types.ts
- [x] **T01-08-02** Given: file created / When: checking module structure / Then: includes proper TypeScript syntax, ES6 exports, and necessary imports from runtime.types.ts
- [x] **T01-08-03** Given: file ready / When: preparing for definitions / Then: includes section comments for enums and constants with JSDoc placeholders

### T01-09: Define AGTOSType Enum in os2shell.types.ts (5 tasks)

- [x] **T01-09-01** Given: os2shell.types.ts file / When: defining AGTOSType enum / Then: public enum created
- [x] **T01-09-02** Given: enum defined / When: checking normal values / Then: Windows='windows', macOS='macos', Linux='linux'
- [x] **T01-09-03** Given: enum defined / When: checking invalid values / Then: no misspelled values (windows not win, linux not lnx), no extra platforms (FreeBSD excluded), no singular forms
- [x] **T01-09-04** Given: enum defined / When: checking edge cases / Then: all lowercase, no spaces or hyphens, no capital letters (macOS not MacOS or macos with capital O)
- [x] **T01-09-05** Given: enum defined / When: checking type / Then: enum is properly exported and accessible as AGTOSType

### T01-10: Define AGTShellType Enum in os2shell.types.ts (5 tasks)

- [x] **T01-10-01** Given: os2shell.types.ts updating / When: defining AGTShellType enum / Then: public enum created
- [x] **T01-10-02** Given: enum defined / When: checking normal values / Then: PowerShell='pwsh.exe', Zsh='/bin/zsh', Bash='/bin/bash'
- [x] **T01-10-03** Given: enum defined / When: checking invalid values / Then: no incorrect paths (bash not /bin/bash, /bin/sh excluded), no alternative names (bash not sh, zsh not sh)
- [x] **T01-10-04** Given: enum defined / When: checking edge cases / Then: correct path format (Windows uses exe name only, Unix uses absolute paths), no trailing slashes, correct casing (pwsh.exe not PWSH.EXE)
- [x] **T01-10-05** Given: enum defined / When: checking type / Then: enum is properly exported and accessible as AGTShellType

### T01-11: Define AG_OS_TO_SHELL_MAP Constant (5 tasks)

- [x] **T01-11-01** Given: os2shell.types.ts complete / When: creating AG_OS_TO_SHELL_MAP / Then: public const defined
- [x] **T01-11-02** Given: constant created / When: checking normal mapping / Then: Windows→pwsh.exe, macOS→/bin/zsh, Linux→/bin/bash
- [x] **T01-11-03** Given: mapping defined / When: checking invalid mapping / Then: no wrong pairings (Windows→/bin/bash excluded), no missing platforms, all platforms mapped
- [x] **T01-11-04** Given: mapping defined / When: checking edge cases / Then: map is complete (not partial), keys match AGTOSType values exactly, values match AGTShellType values exactly
- [x] **T01-11-05** Given: constant complete / When: checking type / Then: has Record<AGTOSType, AGTShellType> type annotation and is properly exported

### T01-12: Update shared/types/index.ts Barrel Export (3 tasks)

- [x] **T01-12-01** Given: shared/types/index.ts / When: updating barrel exports / Then: exports added from command-result.types.ts and os2shell.types.ts
- [x] **T01-12-02** Given: barrel file updated / When: checking structure / Then: exports grouped by source file and runtime.types.ts exports preserved
- [x] **T01-12-03** Given: barrel complete / When: running type check / Then: no circular dependencies or duplicate exports; all imports resolve correctly

---

## セクション02: Runtime Detection - _getRawOSPlatform() (60 tasks)

### T02-01: Node.js Platform Detection (6 tasks)

- [x] **T02-01-01** Given: Node.js runtime available / When: calling _getRawOSPlatform() / Then: function detects Node.js correctly
- [x] **T02-01-02** Given: Node.js running on Windows / When: checking detected platform / Then: returns 'win32'
- [x] **T02-01-03** Given: Node.js running on macOS / When: checking detected platform / Then: returns 'darwin'
- [x] **T02-01-04** Given: Node.js running on Linux / When: checking detected platform / Then: returns 'linux'
- [x] **T02-01-05** Given: Node.js with process.platform set / When: validating against standard values / Then: no unexpected platform values
- [x] **T02-01-06** Given: Node.js platform detection completed / When: running type check / Then: return value is _RawOSPlatformType

### T02-02: Deno Platform Detection (6 tasks)

- [x] **T02-02-01** Given: Deno runtime available / When: calling _getRawOSPlatform() / Then: function detects Deno correctly
- [x] **T02-02-02** Given: Deno running on Windows / When: checking detected platform / Then: returns 'win32'
- [x] **T02-02-03** Given: Deno running on macOS / When: checking detected platform / Then: returns 'darwin'
- [x] **T02-02-04** Given: Deno running on Linux / When: checking detected platform / Then: returns 'linux'
- [x] **T02-02-05** Given: Deno.build.os available / When: validating against standard values / Then: no unexpected platform values
- [x] **T02-02-06** Given: Deno platform detection completed / When: running type check / Then: return value is _RawOSPlatformType

### T02-03: Bun Platform Detection (6 tasks)

- [x] **T02-03-01** Given: Bun runtime available / When: calling _getRawOSPlatform() / Then: function detects Bun correctly
- [x] **T02-03-02** Given: Bun running on Windows / When: checking detected platform / Then: returns appropriate value
- [x] **T02-03-03** Given: Bun running on macOS / When: checking detected platform / Then: returns appropriate value
- [x] **T02-03-04** Given: Bun running on Linux / When: checking detected platform / Then: returns appropriate value
- [x] **T02-03-05** Given: Bun.env or Bun.platform available / When: validating against standard values / Then: consistent with other runtimes
- [x] **T02-03-06** Given: Bun platform detection completed / When: running type check / Then: return value is _RawOSPlatformType

### T02-04: Unsupported Runtime Handling (6 tasks)

- [x] **T02-04-01** Given: Unknown runtime environment / When: calling _getRawOSPlatform() / Then: function handles gracefully
- [x] **T02-04-02** Given: No runtime detection available / When: checking fallback behavior / Then: returns undefined or throws appropriate error
- [x] **T02-04-03** Given: Invalid runtime detection method / When: attempting detection / Then: doesn't crash, returns safe value
- [x] **T02-04-04** Given: Partial runtime information / When: attempting detection / Then: uses best available information
- [x] **T02-04-05** Given: Runtime detection in sandbox / When: accessing restricted APIs / Then: handles permission errors
- [x] **T02-04-06** Given: Error handling completed / When: checking error messages / Then: provides meaningful error context

### T02-05: Platform Validation (6 tasks)

- [ ] **T02-05-01** Given: Detected platform value / When: validating against union type / Then: value is one of ('win32', 'darwin', 'linux')
- [ ] **T02-05-02** Given: Invalid platform detected / When: checking error handling / Then: no invalid values propagate
- [ ] **T02-05-03** Given: Case-sensitive platform check / When: validating detected value / Then: uses exact lowercase format
- [ ] **T02-05-04** Given: Extra whitespace in platform / When: sanitizing / Then: trims or rejects invalid format
- [ ] **T02-05-05** Given: Platform value validation / When: checking type safety / Then: only defined enum values allowed
- [ ] **T02-05-06** Given: Validation completed / When: running comprehensive test / Then: all paths handled

### T02-06: Return Type Verification (6 tasks)

- [ ] **T02-06-01** Given: Function execution completed / When: checking return type / Then: returns _RawOSPlatformType (union of strings)
- [ ] **T02-06-02** Given: Normal runtime detection / When: checking return value type / Then: is string type, not null/undefined initially
- [ ] **T02-06-03** Given: Failed runtime detection / When: checking return value type / Then: returns undefined if fallback unavailable
- [ ] **T02-06-04** Given: Type narrowing scenario / When: checking return value / Then: supports type guards correctly
- [ ] **T02-06-05** Given: TypeScript strict mode / When: compiling code / Then: no type errors for return value usage
- [ ] **T02-06-06** Given: Type verification completed / When: running type check / Then: _RawOSPlatformType or undefined union correct

### T02-07: Default Behavior (6 tasks)

- [ ] **T02-07-01** Given: Function called without parameters / When: executing with defaults / Then: auto-detects current runtime platform
- [ ] **T02-07-02** Given: First invocation / When: checking caching behavior / Then: detects platform on first call
- [ ] **T02-07-03** Given: Subsequent invocations / When: checking consistency / Then: returns same value as first call
- [ ] **T02-07-04** Given: Runtime environment unchanged / When: calling multiple times / Then: consistent results
- [ ] **T02-07-05** Given: Default fallback / When: detection method unavailable / Then: uses fallback gracefully
- [ ] **T02-07-06** Given: Default behavior tested / When: comprehensive check / Then: reliable detection

### T02-08: Error Recovery (6 tasks)

- [ ] **T02-08-01** Given: Detection error occurs / When: implementing error handling / Then: doesn't throw uncaught exceptions
- [ ] **T02-08-02** Given: API access denied / When: handling permission errors / Then: falls back to alternative method
- [ ] **T02-08-03** Given: Partial detection failure / When: recovering from error / Then: uses available information
- [ ] **T02-08-04** Given: Multiple detection methods available / When: one fails / Then: tries next method
- [ ] **T02-08-05** Given: All detection methods fail / When: handling final fallback / Then: returns reasonable default
- [ ] **T02-08-06** Given: Error recovery completed / When: checking robustness / Then: function never completely fails

### T02-09: Cross-Runtime Consistency (6 tasks)

- [ ] **T02-09-01** Given: Same platform, different runtimes / When: comparing detection results / Then: all return same value
- [ ] **T02-09-02** Given: Node.js and Deno on same system / When: calling function in both / Then: identical platform values
- [ ] **T02-09-03** Given: Bun and Node.js on same system / When: calling function in both / Then: identical platform values
- [ ] **T02-09-04** Given: Platform-specific tests / When: running on multiple runtimes / Then: consistent behavior
- [ ] **T02-09-05** Given: Cross-runtime test suite / When: executing tests / Then: no divergence in results
- [ ] **T02-09-06** Given: Consistency verified / When: comprehensive cross-runtime check / Then: all runtimes return same platform

### T02-10: Internal API Contract (6 tasks)

- [ ] **T02-10-01** Given: *getRawOSPlatform function / When: checking visibility / Then: private/internal (prefixed with `_`)
- [ ] **T02-10-02** Given: Function signature / When: checking parameters / Then: accepts no required parameters
- [ ] **T02-10-03** Given: Return type / When: checking definition / Then: returns _RawOSPlatformType (or undefined)
- [ ] **T02-10-04** Given: Error handling / When: checking contract / Then: doesn't throw, returns safe value
- [ ] **T02-10-05** Given: Side effects / When: checking pure function behavior / Then: no side effects on platform detection
- [ ] **T02-10-06** Given: Contract validation / When: comprehensive check / Then: follows internal API patterns

---

## セクション03: OS Platform Conversion (30 tasks)

### T03-01: Windows Platform Mapping (6 tasks)

- [ ] **T03-01-01** Given: Raw platform 'win32' detected / When: converting to virtual platform / Then: maps to AGTOSType.Windows
- [ ] **T03-01-02** Given: Windows conversion / When: checking output value / Then: returns 'windows' (lowercase)
- [ ] **T03-01-03** Given: Invalid Windows value / When: attempting conversion / Then: no spurious mappings
- [ ] **T03-01-04** Given: Windows-like values / When: checking edge cases / Then: only 'win32' maps to windows
- [ ] **T03-01-05** Given: Conversion logic / When: validating mapping / Then: consistent for all test runs
- [ ] **T03-01-06** Given: Type check completed / When: verifying output type / Then: returns AGTOSType

### T03-02: macOS Platform Mapping (6 tasks)

- [ ] **T03-02-01** Given: Raw platform 'darwin' detected / When: converting to virtual platform / Then: maps to AGTOSType.macOS
- [ ] **T03-02-02** Given: macOS conversion / When: checking output value / Then: returns 'macos' (lowercase)
- [ ] **T03-02-03** Given: Invalid macOS value / When: attempting conversion / Then: no spurious mappings
- [ ] **T03-02-04** Given: darwin-like values / When: checking edge cases / Then: only 'darwin' maps to macos
- [ ] **T03-02-05** Given: Conversion logic / When: validating mapping / Then: consistent for all test runs
- [ ] **T03-02-06** Given: Type check completed / When: verifying output type / Then: returns AGTOSType

### T03-03: Linux Platform Mapping (6 tasks)

- [ ] **T03-03-01** Given: Raw platform 'linux' detected / When: converting to virtual platform / Then: maps to AGTOSType.Linux
- [ ] **T03-03-02** Given: Linux conversion / When: checking output value / Then: returns 'linux' (lowercase)
- [ ] **T03-03-03** Given: Invalid Linux value / When: attempting conversion / Then: no spurious mappings
- [ ] **T03-03-04** Given: linux-like values / When: checking edge cases / Then: only 'linux' maps to linux
- [ ] **T03-03-05** Given: Conversion logic / When: validating mapping / Then: consistent for all test runs
- [ ] **T03-03-06** Given: Type check completed / When: verifying output type / Then: returns AGTOSType

### T03-04: Invalid Platform Handling (6 tasks)

- [ ] **T03-04-01** Given: Invalid platform value / When: attempting conversion / Then: handles gracefully
- [ ] **T03-04-02** Given: Null or undefined platform / When: converting / Then: returns safe value or throws
- [ ] **T03-04-03** Given: Unknown platform string / When: checking error handling / Then: doesn't crash
- [ ] **T03-04-04** Given: Malformed platform input / When: validating input / Then: sanitizes or rejects
- [ ] **T03-04-05** Given: Invalid conversion attempt / When: checking error message / Then: provides meaningful feedback
- [ ] **T03-04-06** Given: Error handling verified / When: comprehensive test / Then: robustness confirmed

### T03-05: Graceful Degradation (6 tasks)

- [ ] **T03-05-01** Given: Platform conversion unavailable / When: calling conversion function / Then: has reasonable fallback
- [ ] **T03-05-02** Given: Partial platform information / When: converting / Then: uses available data
- [ ] **T03-05-03** Given: Missing platform data / When: degrading gracefully / Then: returns safe default
- [ ] **T03-05-04** Given: Conversion error / When: implementing fallback / Then: continues operation
- [ ] **T03-05-05** Given: Multiple conversion paths / When: one fails / Then: tries alternative
- [ ] **T03-05-06** Given: Degradation test completed / When: checking robustness / Then: never completely fails

---

## セクション04: getOSPlatform() Function (36 tasks)

### T04-01: No Parameters Behavior (6 tasks)

- [ ] **T04-01-01** Given: getOSPlatform() called without parameters / When: executing function / Then: uses auto-detected platform
- [ ] **T04-01-02** Given: Current runtime platform / When: calling without args / Then: returns virtual platform for current runtime
- [ ] **T04-01-03** Given: No parameters provided / When: checking function behavior / Then: no errors, returns valid AGTOSType
- [ ] **T04-01-04** Given: Parameter-less call / When: checking cache behavior / Then: consistent results
- [ ] **T04-01-05** Given: Multiple no-parameter calls / When: executing sequentially / Then: returns same value
- [ ] **T04-01-06** Given: Default behavior verified / When: comprehensive check / Then: works reliably

### T04-02: With Test Parameters (6 tasks)

- [ ] **T04-02-01** Given: Test parameter 'win32' provided / When: converting test platform / Then: returns AGTOSType.Windows
- [ ] **T04-02-02** Given: Test parameter 'darwin' provided / When: converting test platform / Then: returns AGTOSType.macOS
- [ ] **T04-02-03** Given: Test parameter 'linux' provided / When: converting test platform / Then: returns AGTOSType.Linux
- [ ] **T04-02-04** Given: All valid test parameters / When: checking conversions / Then: all map correctly
- [ ] **T04-02-05** Given: Test parameter injection / When: validating behavior / Then: overrides auto-detection
- [ ] **T04-02-06** Given: Parameter tests completed / When: comprehensive check / Then: parameter handling correct

### T04-03: Invalid Parameters (6 tasks)

- [ ] **T04-03-01** Given: Invalid platform string / When: passing as parameter / Then: handles error gracefully
- [ ] **T04-03-02** Given: Null parameter / When: passing null / Then: doesn't crash, returns safe value
- [ ] **T04-03-03** Given: Undefined parameter / When: passing undefined / Then: treats as no parameter
- [ ] **T04-03-04** Given: Wrong type parameter / When: passing non-string / Then: rejects or coerces safely
- [ ] **T04-03-05** Given: Invalid parameter validation / When: checking error handling / Then: meaningful error message
- [ ] **T04-03-06** Given: Error handling tested / When: comprehensive check / Then: robust to invalid inputs

### T04-04: Parameter Type Checking (6 tasks)

- [ ] **T04-04-01** Given: String parameter expected / When: passing correct type / Then: processes normally
- [ ] **T04-04-02** Given: Type validation / When: checking parameter type / Then: enforces _RawOSPlatformType
- [ ] **T04-04-03** Given: TypeScript strict mode / When: compiling calls / Then: no type errors for valid params
- [ ] **T04-04-04** Given: Type narrowing / When: using result / Then: properly narrowed to AGTOSType
- [ ] **T04-04-05** Given: Parameter type mismatch / When: attempting conversion / Then: caught at compile or runtime
- [ ] **T04-04-06** Given: Type checking completed / When: comprehensive verify / Then: type safety maintained

### T04-05: Return Value Structure (6 tasks)

- [ ] **T04-05-01** Given: Function execution / When: checking return value / Then: returns AGTOSType enum value
- [ ] **T04-05-02** Given: Successful conversion / When: validating return / Then: value is one of (windows, macos, linux)
- [ ] **T04-05-03** Given: Return type check / When: verifying type / Then: is AGTOSType not string
- [ ] **T04-05-04** Given: Type narrowing scenario / When: using return in switch / Then: type guard works
- [ ] **T04-05-05** Given: Return value consistency / When: calling multiple times / Then: same return type
- [ ] **T04-05-06** Given: Return validation completed / When: comprehensive test / Then: structure correct

### T04-06: Edge Cases and Undefined (6 tasks)

- [ ] **T04-06-01** Given: Undefined parameter / When: calling with undefined / Then: auto-detects current platform
- [ ] **T04-06-02** Given: Empty string parameter / When: passing empty string / Then: treated as invalid or auto-detect
- [ ] **T04-06-03** Given: Case sensitivity / When: passing 'WIN32' / Then: rejects uppercase variant
- [ ] **T04-06-04** Given: Whitespace in parameter / When: passing ' win32 ' / Then: rejects or sanitizes
- [ ] **T04-06-05** Given: Special characters / When: passing invalid chars / Then: rejects safely
- [ ] **T04-06-06** Given: Edge case testing / When: comprehensive check / Then: all edge cases handled

---

## セクション05: resolveShell() Function (30 tasks)

### T05-01: Shell Resolution for Windows (6 tasks)

- [ ] **T05-01-01** Given: Windows platform / When: calling resolveShell() / Then: returns PowerShell path
- [ ] **T05-01-02** Given: Windows parameter / When: checking shell resolution / Then: returns 'pwsh.exe'
- [ ] **T05-01-03** Given: Windows environment / When: validating shell path / Then: correct executable name
- [ ] **T05-01-04** Given: Path validation / When: checking resolved shell / Then: no path separators for Windows executable
- [ ] **T05-01-05** Given: Windows-specific test / When: running shell resolution / Then: PowerShell is primary shell
- [ ] **T05-01-06** Given: Windows resolution verified / When: comprehensive check / Then: consistent behavior

### T05-02: Shell Resolution for macOS (6 tasks)

- [ ] **T05-02-01** Given: macOS platform / When: calling resolveShell() / Then: returns Zsh path
- [ ] **T05-02-02** Given: macOS parameter / When: checking shell resolution / Then: returns '/bin/zsh'
- [ ] **T05-02-03** Given: macOS environment / When: validating shell path / Then: correct absolute path
- [ ] **T05-02-04** Given: Path validation / When: checking resolved shell / Then: unix-style absolute path
- [ ] **T05-02-05** Given: macOS-specific test / When: running shell resolution / Then: Zsh is default shell
- [ ] **T05-02-06** Given: macOS resolution verified / When: comprehensive check / Then: consistent behavior

### T05-03: Shell Resolution for Linux (6 tasks)

- [ ] **T05-03-01** Given: Linux platform / When: calling resolveShell() / Then: returns Bash path
- [ ] **T05-03-02** Given: Linux parameter / When: checking shell resolution / Then: returns '/bin/bash'
- [ ] **T05-03-03** Given: Linux environment / When: validating shell path / Then: correct absolute path
- [ ] **T05-03-04** Given: Path validation / When: checking resolved shell / Then: unix-style absolute path
- [ ] **T05-03-05** Given: Linux-specific test / When: running shell resolution / Then: Bash is standard shell
- [ ] **T05-03-06** Given: Linux resolution verified / When: comprehensive check / Then: consistent behavior

### T05-04: Undefined Parameter Handling (6 tasks)

- [ ] **T05-04-01** Given: resolveShell() called without parameter / When: using current platform / Then: auto-resolves correct shell
- [ ] **T05-04-02** Given: Undefined parameter / When: checking fallback / Then: uses current environment
- [ ] **T05-04-03** Given: Auto-detection / When: testing on different platforms / Then: platform-appropriate shell
- [ ] **T05-04-04** Given: No parameter provided / When: validating behavior / Then: doesn't crash
- [ ] **T05-04-05** Given: Default parameter handling / When: checking consistency / Then: reliable defaults
- [ ] **T05-04-06** Given: Undefined handling tested / When: comprehensive check / Then: graceful fallback

### T05-05: Invalid Type Handling (6 tasks)

- [ ] **T05-05-01** Given: Invalid type parameter / When: passing non-AGTOSType / Then: rejects or coerces safely
- [ ] **T05-05-02** Given: Null parameter / When: passing null / Then: treats as undefined
- [ ] **T05-05-03** Given: Number parameter / When: passing wrong type / Then: type error at compile or runtime
- [ ] **T05-05-04** Given: Boolean parameter / When: passing wrong type / Then: rejected safely
- [ ] **T05-05-05** Given: Type validation / When: checking errors / Then: meaningful error message
- [ ] **T05-05-06** Given: Type checking tested / When: comprehensive verify / Then: type safety maintained

---

## セクション06: Integration & Public API (36 tasks)

### T06-01: Public Constant Exports (6 tasks)

- [ ] **T06-01-01** Given: AG_OS_TO_SHELL_MAP constant / When: importing from public API / Then: accessible and usable
- [ ] **T06-01-02** Given: Constant import / When: checking type / Then: Record<AGTOSType, AGTShellType> type
- [ ] **T06-01-03** Given: Constant values / When: accessing mapping / Then: all platform-shell pairs present
- [ ] **T06-01-04** Given: Readonly constant / When: attempting modification / Then: TypeScript prevents mutation
- [ ] **T06-01-05** Given: Constant export / When: checking module export / Then: properly exported in barrel file
- [ ] **T06-01-06** Given: Constant verification / When: comprehensive test / Then: public API correct

### T06-02: Enum Exports (6 tasks)

- [ ] **T06-02-01** Given: AGTOSType enum / When: importing from public API / Then: accessible and usable
- [ ] **T06-02-02** Given: AGTShellType enum / When: importing from public API / Then: accessible and usable
- [ ] **T06-02-03** Given: AGTCommandErrorType enum / When: importing / Then: accessible for error handling
- [ ] **T06-02-04** Given: Enum values / When: checking completeness / Then: all enum members exported
- [ ] **T06-02-05** Given: Enum type safety / When: using in code / Then: type guards work correctly
- [ ] **T06-02-06** Given: Enum verification / When: comprehensive test / Then: public API complete

### T06-03: Function Exports (6 tasks)

- [ ] **T06-03-01** Given: getOSPlatform() function / When: importing from public API / Then: accessible and callable
- [ ] **T06-03-02** Given: resolveShell() function / When: importing from public API / Then: accessible and callable
- [ ] **T06-03-03** Given: Function signature / When: checking export / Then: correct signature exported
- [ ] **T06-03-04** Given: Public functions / When: checking visibility / Then: private functions not exposed
- [ ] **T06-03-05** Given: Function documentation / When: checking JSDoc / Then: available in IDE
- [ ] **T06-03-06** Given: Function verification / When: comprehensive test / Then: public API correct

### T06-04: Type Exports (6 tasks)

- [ ] **T06-04-01** Given: AGTCommandResult type / When: importing / Then: accessible for return types
- [ ] **T06-04-02** Given: AGTCommandError type / When: importing / Then: accessible for error handling
- [ ] **T06-04-03** Given: AGTCommandSuccess type / When: importing / Then: accessible for success handling
- [ ] **T06-04-04** Given: Public types / When: checking export / Then: all public types available
- [ ] **T06-04-05** Given: Type safety / When: using exported types / Then: full type checking works
- [ ] **T06-04-06** Given: Type verification / When: comprehensive test / Then: type system correct

### T06-05: Barrel File Integration (6 tasks)

- [ ] **T06-05-01** Given: shared/types/index.ts barrel / When: importing from barrel / Then: all exports available
- [ ] **T06-05-02** Given: Barrel file / When: checking re-exports / Then: no circular dependencies
- [ ] **T06-05-03** Given: Multiple imports from barrel / When: importing different items / Then: all resolve correctly
- [ ] **T06-05-04** Given: Barrel organization / When: checking structure / Then: well-organized sections
- [ ] **T06-05-05** Given: Import paths / When: checking alternatives / Then: both barrel and direct imports work
- [ ] **T06-05-06** Given: Barrel verification / When: comprehensive test / Then: integration correct

### T06-06: Type Safety Verification (6 tasks)

- [ ] **T06-06-01** Given: TypeScript strict mode / When: compiling entire module / Then: no type errors
- [ ] **T06-06-02** Given: Type narrowing / When: using discriminated union / Then: type guards work
- [ ] **T06-06-03** Given: Function calls / When: passing wrong types / Then: TypeScript catches errors
- [ ] **T06-06-04** Given: Return types / When: using function results / Then: type system enforces contracts
- [ ] **T06-06-05** Given: Generic constraints / When: checking type variables / Then: properly constrained
- [ ] **T06-06-06** Given: Type safety verified / When: comprehensive check / Then: full type system correct

---

## セクション07: Runtime Tests (54 tasks)

### T07-01: Node.js Platform Tests (6 tasks)

- [ ] **T07-01-01** Given: Node.js test environment / When: running platform detection / Then: correctly identifies Node.js
- [ ] **T07-01-02** Given: Node.js on Windows / When: testing platform / Then: detects Windows correctly
- [ ] **T07-01-03** Given: Node.js on macOS / When: testing platform / Then: detects macOS correctly
- [ ] **T07-01-04** Given: Node.js on Linux / When: testing platform / Then: detects Linux correctly
- [ ] **T07-01-05** Given: Node.js version / When: testing compatibility / Then: works on multiple versions
- [ ] **T07-01-06** Given: Node.js test suite / When: comprehensive test / Then: all tests pass

### T07-02: Deno Platform Tests (6 tasks)

- [ ] **T07-02-01** Given: Deno test environment / When: running platform detection / Then: correctly identifies Deno
- [ ] **T07-02-02** Given: Deno on Windows / When: testing platform / Then: detects Windows correctly
- [ ] **T07-02-03** Given: Deno on macOS / When: testing platform / Then: detects macOS correctly
- [ ] **T07-02-04** Given: Deno on Linux / When: testing platform / Then: detects Linux correctly
- [ ] **T07-02-05** Given: Deno version / When: testing compatibility / Then: works on supported versions
- [ ] **T07-02-06** Given: Deno test suite / When: comprehensive test / Then: all tests pass

### T07-03: Bun Platform Tests (6 tasks)

- [ ] **T07-03-01** Given: Bun test environment / When: running platform detection / Then: correctly identifies Bun
- [ ] **T07-03-02** Given: Bun on Windows / When: testing platform / Then: detects platform correctly
- [ ] **T07-03-03** Given: Bun on macOS / When: testing platform / Then: detects platform correctly
- [ ] **T07-03-04** Given: Bun on Linux / When: testing platform / Then: detects platform correctly
- [ ] **T07-03-05** Given: Bun version / When: testing compatibility / Then: works on supported versions
- [ ] **T07-03-06** Given: Bun test suite / When: comprehensive test / Then: all tests pass

### T07-04: Cross-Platform Integration (6 tasks)

- [ ] **T07-04-01** Given: Multiple platforms / When: running same test / Then: platform-specific behavior correct
- [ ] **T07-04-02** Given: Platform detection / When: testing across platforms / Then: consistent API
- [ ] **T07-04-03** Given: Function behavior / When: testing on different platforms / Then: correct implementation
- [ ] **T07-04-04** Given: Return values / When: comparing across platforms / Then: expected results
- [ ] **T07-04-05** Given: Error handling / When: testing edge cases / Then: consistent error behavior
- [ ] **T07-04-06** Given: Integration test / When: comprehensive cross-platform / Then: all scenarios work

### T07-05: Shell Resolution Tests (6 tasks)

- [ ] **T07-05-01** Given: Shell resolution on Windows / When: testing resolveShell() / Then: returns pwsh.exe
- [ ] **T07-05-02** Given: Shell resolution on macOS / When: testing resolveShell() / Then: returns /bin/zsh
- [ ] **T07-05-03** Given: Shell resolution on Linux / When: testing resolveShell() / Then: returns /bin/bash
- [ ] **T07-05-04** Given: Shell path validation / When: testing resolved path / Then: path is valid
- [ ] **T07-05-05** Given: Shell availability / When: checking shell exists / Then: executable found
- [ ] **T07-05-06** Given: Shell tests completed / When: comprehensive test / Then: all platforms work

### T07-06: Error Handling Tests (6 tasks)

- [ ] **T07-06-01** Given: Invalid input / When: testing error handling / Then: graceful failure
- [ ] **T07-06-02** Given: Missing API / When: testing fallback / Then: doesn't crash
- [ ] **T07-06-03** Given: Permission denied / When: handling errors / Then: continues safely
- [ ] **T07-06-04** Given: Error messages / When: checking clarity / Then: meaningful messages
- [ ] **T07-06-05** Given: Error recovery / When: testing resilience / Then: recovers properly
- [ ] **T07-06-06** Given: Error tests completed / When: comprehensive test / Then: robust behavior

### T07-07: Type Safety Tests (6 tasks)

- [ ] **T07-07-01** Given: TypeScript compilation / When: running compiler / Then: no type errors
- [ ] **T07-07-02** Given: Type narrowing / When: testing discriminators / Then: type guards work
- [ ] **T07-07-03** Given: Function signatures / When: type checking / Then: signatures correct
- [ ] **T07-07-04** Given: Return types / When: verifying types / Then: types match contracts
- [ ] **T07-07-05** Given: Type constraints / When: checking limits / Then: properly enforced
- [ ] **T07-07-06** Given: Type tests completed / When: comprehensive test / Then: type system correct

### T07-08: Performance Tests (6 tasks)

- [ ] **T07-08-01** Given: Platform detection / When: measuring performance / Then: runs in reasonable time
- [ ] **T07-08-02** Given: Multiple calls / When: testing overhead / Then: minimal caching overhead
- [ ] **T07-08-03** Given: Memory usage / When: monitoring allocation / Then: no memory leaks
- [ ] **T07-08-04** Given: Load test / When: repeated calls / Then: performance stable
- [ ] **T07-08-05** Given: Benchmark / When: comparing implementations / Then: acceptable performance
- [ ] **T07-08-06** Given: Performance tests / When: comprehensive check / Then: meets requirements

### T07-09: Compatibility Tests (6 tasks)

- [ ] **T07-09-01** Given: Legacy code / When: testing backward compatibility / Then: no breaking changes
- [ ] **T07-09-02** Given: Different Node.js versions / When: testing compatibility / Then: works on supported versions
- [ ] **T07-09-03** Given: Browser environment / When: checking applicability / Then: appropriate limitations
- [ ] **T07-09-04** Given: CommonJS import / When: testing module format / Then: works with CommonJS
- [ ] **T07-09-05** Given: ES modules / When: testing module format / Then: works with ESM
- [ ] **T07-09-06** Given: Compatibility tests / When: comprehensive check / Then: wide compatibility

---

## セクション08: Quality Assurance (52 tasks)

### T08-01: TypeScript Compilation (4 tasks)

- [ ] **T08-01-01** Given: TypeScript source files / When: running compiler / Then: compiles without errors
- [ ] **T08-01-02** Given: Strict mode enabled / When: type checking / Then: all types correct
- [ ] **T08-01-03** Given: Declaration files / When: generating .d.ts / Then: types properly exported
- [ ] **T08-01-04** Given: Build output / When: checking artifacts / Then: valid JavaScript generated

### T08-02: Code Formatting (4 tasks)

- [ ] **T08-02-01** Given: Source code / When: running dprint / Then: formatting correct
- [ ] **T08-02-02** Given: Code style / When: checking conventions / Then: follows project style
- [ ] **T08-02-03** Given: Whitespace / When: validating formatting / Then: consistent indentation
- [ ] **T08-02-04** Given: Line length / When: checking limits / Then: respects 120 char limit

### T08-03: Linting Checks (4 tasks)

- [ ] **T08-03-01** Given: ESLint rules / When: running linter / Then: no violations
- [ ] **T08-03-02** Given: Code quality / When: checking warnings / Then: best practices followed
- [ ] **T08-03-03** Given: Naming conventions / When: validating names / Then: consistent naming
- [ ] **T08-03-04** Given: Import statements / When: checking organization / Then: properly organized

### T08-04: Test Coverage (4 tasks)

- [ ] **T08-04-01** Given: Unit tests / When: running test suite / Then: all tests pass
- [ ] **T08-04-02** Given: Coverage report / When: analyzing coverage / Then: meets minimum threshold
- [ ] **T08-04-03** Given: Integration tests / When: testing interactions / Then: all pass
- [ ] **T08-04-04** Given: Edge cases / When: testing boundaries / Then: properly covered

### T08-05: Spell Check (4 tasks)

- [ ] **T08-05-01** Given: Documentation / When: spell checking / Then: no misspellings
- [ ] **T08-05-02** Given: Code comments / When: checking spelling / Then: correct English
- [ ] **T08-05-03** Given: Type names / When: validating names / Then: correct spelling
- [ ] **T08-05-04** Given: Error messages / When: checking text / Then: properly spelled

### T08-06: Documentation Quality (4 tasks)

- [ ] **T08-06-01** Given: JSDoc comments / When: checking documentation / Then: complete and accurate
- [ ] **T08-06-02** Given: README file / When: validating docs / Then: clear and helpful
- [ ] **T08-06-03** Given: API documentation / When: checking completeness / Then: all functions documented
- [ ] **T08-06-04** Given: Examples / When: validating samples / Then: correct and runnable

### T08-07: Build Verification (4 tasks)

- [ ] **T08-07-01** Given: Build command / When: executing build / Then: completes successfully
- [ ] **T08-07-02** Given: Build output / When: checking artifacts / Then: properly generated
- [ ] **T08-07-03** Given: Bundle size / When: analyzing size / Then: within acceptable limits
- [ ] **T08-07-04** Given: Source maps / When: checking debugging / Then: properly generated

### T08-08: Export Validation (4 tasks)

- [ ] **T08-08-01** Given: Barrel exports / When: checking index file / Then: all exports present
- [ ] **T08-08-02** Given: Type exports / When: validating types / Then: properly exported
- [ ] **T08-08-03** Given: Public API / When: checking visibility / Then: correct exports only
- [ ] **T08-08-04** Given: Circular dependencies / When: analyzing imports / Then: none detected

### T08-09: Error Handling (4 tasks)

- [ ] **T08-09-01** Given: Error scenarios / When: testing error paths / Then: handled gracefully
- [ ] **T08-09-02** Given: Error messages / When: checking clarity / Then: meaningful and helpful
- [ ] **T08-09-03** Given: Stack traces / When: debugging errors / Then: clear and usable
- [ ] **T08-09-04** Given: Recovery paths / When: testing resilience / Then: proper fallbacks

### T08-10: Performance Optimization (4 tasks)

- [ ] **T08-10-01** Given: Function calls / When: profiling performance / Then: no bottlenecks
- [ ] **T08-10-02** Given: Memory usage / When: monitoring allocation / Then: efficient memory
- [ ] **T08-10-03** Given: Startup time / When: measuring latency / Then: acceptable startup
- [ ] **T08-10-04** Given: Caching / When: validating cache / Then: improves performance

### T08-11: Compatibility Verification (4 tasks)

- [ ] **T08-11-01** Given: Target environments / When: testing compatibility / Then: works on all targets
- [ ] **T08-11-02** Given: Different runtimes / When: testing across runtimes / Then: consistent behavior
- [ ] **T08-11-03** Given: Module systems / When: testing CommonJS/ESM / Then: both work
- [ ] **T08-11-04** Given: Versions / When: testing backward compatibility / Then: no breaking changes

### T08-12: Security Review (4 tasks)

- [ ] **T08-12-01** Given: Dependencies / When: scanning for vulnerabilities / Then: no known issues
- [ ] **T08-12-02** Given: Code / When: checking for injection risks / Then: properly sanitized
- [ ] **T08-12-03** Given: Secrets / When: scanning for leaks / Then: no secrets exposed
- [ ] **T08-12-04** Given: Permissions / When: checking access control / Then: properly restricted

### T08-13: Release Readiness (4 tasks)

- [ ] **T08-13-01** Given: Version number / When: checking semver / Then: correctly bumped
- [ ] **T08-13-02** Given: Changelog / When: validating documentation / Then: complete and accurate
- [ ] **T08-13-03** Given: Package metadata / When: checking package.json / Then: all fields correct
- [ ] **T08-13-04** Given: Release checklist / When: verifying completion / Then: all items checked

## Full Task List Format

Each task follows the pattern:

```markdown
- [ ] **T<SECTION>-<SUBSECTION>-<CASE>** Given: [condition] / When: [action] / Then: [expected result]
```

**Categories per subsection:**

1. **正常系 (Normal Cases)** - Expected behavior with valid inputs
2. **異常系 (Error Cases)** - Error conditions and invalid inputs
3. **エッジケース (Edge Cases)** - Boundary conditions and special scenarios

## Implementation Progress

Use these checkboxes to track completion:

```markdown
- [ ] T01-01-01 (Pending - Red)
- [x] T01-01-02 (Completed - Green)
```

## Quality Gates

Execute before each commit:

```bash
pnpm format:dprint
pnpm check:types
pnpm lint:*
pnpm check:spells
pnpm test:develop
pnpm test:functional
pnpm test:runtime
pnpm exec tsup
```

## Usage with /tasks Skill

For detailed task management format guidelines, refer to `/tasks` skill at `.claude/skills/tasks.md`.

---

## Document Metadata

- **File:** `docs/.deckrd/command-runner/os2shell/tasks/tasks.md`
- **Section 01 Tasks:** 52 (3 for structural items, 5 for value-bearing items)
- **Task Distribution:**
  - File/Structure only (3 tasks): T01-03, T01-07, T01-08, T01-12
  - Value-bearing items (5 tasks): T01-01, T01-02, T01-04, T01-05, T01-06, T01-09, T01-10, T01-11
- **Format:** Markdown with Checkbox Tracking
- **Task ID Format:** T<2-digit section>-<2-digit subsection>-<2-digit test case>
- **Created:** 2025-12-31
- **Last Updated:** 2025-12-31
- **Status:** Section 01 Complete (52 actionable tasks with full value coverage), Sections 02-08 Summary
- **Based on:** Deckrd Workflow - os2shell Implementation Plan v1.1
- **Test Coverage:** 正常系 (Normal Cases) / 異常系 (Invalid Cases) / エッジケース (Edge Cases) / Type & Export Verification
- **Linked Documentation:**
  - Implementation spec: `implementation.md`
  - Specifications: `specifications.md`
  - Requirements: `requirements.md`
  - Decisions: `DecisionRecords.md`
  - Task management format: `.claude/skills/tasks.md`
