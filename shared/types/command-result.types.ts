// src: shared/types/command-result.types.ts
// @(#) : Type definitions for command execution results
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Command Error Types Enum
 *
 * @remarks
 * Defines the various error types that can occur during command execution.
 *
 * @example
 * ```typescript
 * import { AGTCommandErrorType } from '@aglabo/command-runner/types';
 *
 * const errorType = AGTCommandErrorType.TypeErrors;
 * ```
 */
export enum AGTCommandErrorType {
  TypeErrors = 'TypeErrors',
  RuntimeErrors = 'RuntimeErrors',
  ValidationErrors = 'ValidationErrors',
}

/**
 * Command Error Type
 *
 * @remarks
 * Represents an error that occurred during command execution.
 * Contains error type and descriptive message.
 *
 * @example
 * ```typescript
 * import type { AGTCommandError } from '@aglabo/command-runner/types';
 *
 * const error: AGTCommandError = {
 *   type: AGTCommandErrorType.RuntimeErrors,
 *   message: 'Command failed',
 * };
 * ```
 */
export type AGTCommandError = {
  type: AGTCommandErrorType;
  message: string;
  [key: string]: unknown;
};

/**
 * Command Success Type
 *
 * @remarks
 * Represents a successful command execution result.
 * Contains success flag and result data.
 *
 * @example
 * ```typescript
 * import type { AGTCommandSuccess } from '@aglabo/command-runner/types';
 *
 * const success: AGTCommandSuccess = {
 *   success: true,
 *   result: { stdout: '...' },
 * };
 * ```
 */
export type AGTCommandSuccess = {
  success: true;
  result: unknown;
  [key: string]: unknown;
};

/**
 * Command Result Union Type
 *
 * @remarks
 * Discriminated union of command execution outcomes.
 * Can be either a successful result or an error.
 * Uses 'success' field as discriminator for type narrowing.
 *
 * @example
 * ```typescript
 * import type { AGTCommandResult } from '@aglabo/command-runner/types';
 *
 * const result: AGTCommandResult = { success: true, result: { data: 'value' } };
 *
 * if (result.success) {
 *   // TypeScript narrows to AGTCommandSuccess here
 *   console.log(result.result);
 * } else {
 *   // TypeScript narrows to AGTCommandError here
 *   console.log(result.message);
 * }
 * ```
 */
export type AGTCommandResult = AGTCommandSuccess | AGTCommandError;
