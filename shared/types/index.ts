// src: shared/types/index.ts
// @(#) : Barrel exports for shared type definitions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// ============================================================================
// Type Exports
// ============================================================================

// Runtime types (core platform and runtime definitions)
export type {
  _RawOSPlatformResult,
  _RawOSPlatformType,
  AGCommandError,
  AGCommandResult,
  AGCommandSuccess,
  AGPlatformResult,
  AGRuntimeResult,
} from './runtime.types';

// Command result types (AGT-prefixed versions for backward compatibility)
export type {
  AGTCommandError,
  AGTCommandResult,
  AGTCommandSuccess,
} from './command-result.types';

// ============================================================================
// Value Exports
// ============================================================================

// Runtime types (constants and enums)
export {
  AGCommandErrorType,
  AGPlatformType,
  AGRuntimeType,
} from './runtime.types';

// Command result types (constants and enums)
export { AGTCommandErrorType } from './command-result.types';

// OS to Shell mapping types (constants and enums)
export { AGTOSType, AGTShellType, AG_OS_TO_SHELL_MAP } from './os2shell.types';
