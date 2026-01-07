// src: shared/types/runtime.types.ts
// @(#) : Type definitions for cross-runtime support (AG-prefixed)
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Supported JavaScript runtime environments
 *
 * @remarks
 * This enum defines the runtime environments supported by the command runner.
 * Each value corresponds to a specific runtime's detection signature.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGRuntimeType } from '@aglabo/command-runner/types';
 *
 * const runtime = AGRuntimeType.Node;
 * console.log(runtime); // Output: 'node'
 * ```
 */
export enum AGRuntimeType {
  /** Node.js runtime environment */
  Node = 'node',

  /** Deno runtime environment */
  Deno = 'deno',

  /** Bun runtime environment */
  Bun = 'bun',
}

/**
 * Result type for runtime detection operations
 *
 * @remarks
 * This type represents the outcome of runtime detection.
 * Returns a specific {@link AGRuntimeType} when detection succeeds,
 * or `undefined` when the runtime cannot be determined.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGRuntimeResult, AGRuntimeType } from '@aglabo/command-runner/types';
 *
 * // Successful detection
 * const detected: AGRuntimeResult = AGRuntimeType.Node;
 *
 * // Failed detection
 * const unknown: AGRuntimeResult = undefined;
 *
 * // Type guard usage
 * if (detected !== undefined) {
 *   console.log(`Running on ${detected}`); // Type-safe: detected is AGRuntimeType
 * }
 * ```
 */
export type AGRuntimeResult = AGRuntimeType | undefined;

/**
 * Supported operating system platforms
 *
 * @remarks
 * This enum defines the operating system platforms supported across different
 * JavaScript runtime environments (Node.js, Deno, Bun).
 * Values are based on Node.js `process.platform` and cover all major platforms.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @see {@link https://nodejs.org/api/process.html#process_process_platform | Node.js process.platform documentation}
 *
 * @example
 * ```typescript
 * import { AGPlatformType } from '@aglabo/command-runner/types';
 *
 * // Check Windows platform
 * if (platform === AGPlatformType.Win32) {
 *   console.log('Running on Windows');
 * }
 *
 * // Check Unix-like platforms
 * const isUnix = [AGPlatformType.Darwin, AGPlatformType.Linux].includes(platform);
 * ```
 */
export enum AGPlatformType {
  /** Windows operating system */
  Win32 = 'win32',

  /** macOS operating system */
  Darwin = 'darwin',

  /** Linux operating system */
  Linux = 'linux',
}

/**
 * Result type for platform detection operations
 *
 * @remarks
 * This type represents the outcome of platform detection.
 * Returns a specific {@link AGPlatformType} when detection succeeds,
 * or `undefined` when the platform cannot be determined.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGPlatformResult, AGPlatformType } from '@aglabo/command-runner/types';
 *
 * // Successful detection
 * const detected: AGPlatformResult = AGPlatformType.Linux;
 *
 * // Failed detection
 * const unknown: AGPlatformResult = undefined;
 *
 * // Type guard usage
 * if (detected !== undefined) {
 *   console.log(`Running on ${detected}`); // Type-safe: detected is AGPlatformType
 * }
 * ```
 */
export type AGPlatformResult = AGPlatformType | undefined;

/**
 * Error types for command execution failures
 *
 * @remarks
 * This enum defines the possible error conditions that can occur during
 * command execution across different runtime environments.
 * Each error type corresponds to a specific failure scenario.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGCommandErrorType } from '@aglabo/command-runner/types';
 *
 * // Timeout error
 * const timeoutError = {
 *   success: false,
 *   error: AGCommandErrorType.Timeout,
 *   message: 'Command execution exceeded 5000ms timeout',
 * };
 *
 * // Spawn failure
 * const spawnError = {
 *   success: false,
 *   error: AGCommandErrorType.SpawnFailed,
 *   message: 'ENOENT: command not found',
 * };
 *
 * // Unsupported runtime
 * const runtimeError = {
 *   success: false,
 *   error: AGCommandErrorType.UnsupportedRuntime,
 *   message: 'Runtime could not be detected',
 * };
 * ```
 */
export enum AGCommandErrorType {
  /** Command execution exceeded timeout limit */
  Timeout = 'timeout',

  /** Failed to spawn command process */
  SpawnFailed = 'spawn-failed',

  /** Runtime environment is not supported */
  UnsupportedRuntime = 'unsupported-runtime',
}

/**
 * Command execution error result type
 *
 * @remarks
 * This type represents a failed command execution result in a discriminated union.
 * The `success: false` literal type serves as the discriminator, allowing TypeScript
 * to narrow types when checking the success property.
 * Use this with {@link AGCommandSuccess} to create {@link AGCommandResult} type.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGCommandError, AGCommandErrorType } from '@aglabo/command-runner/types';
 *
 * // Timeout error with stderr
 * const timeoutError: AGCommandError = {
 *   success: false,
 *   error: AGCommandErrorType.Timeout,
 *   message: 'Command execution exceeded 5000ms timeout',
 *   stderr: 'Process killed',
 * };
 *
 * // Spawn failure without stderr
 * const spawnError: AGCommandError = {
 *   success: false,
 *   error: AGCommandErrorType.SpawnFailed,
 *   message: 'ENOENT: command not found',
 * };
 *
 * // Type guard usage
 * function handleResult(result: AGCommandResult) {
 *   if (!result.success) {
 *     console.error(`Error: ${result.message}`);
 *     if (result.stderr) {
 *       console.error(`Stderr: ${result.stderr}`);
 *     }
 *   }
 * }
 * ```
 */
export type AGCommandError = {
  /** Discriminator for failed command execution */
  success: false;

  /** Error type classification */
  error: AGCommandErrorType;

  /** Human-readable error message */
  message: string;

  /** Optional standard error output */
  stderr?: string;
};

/**
 * Represents a successful command execution result
 *
 * @remarks
 * This type defines the structure for successful command execution outcomes.
 * The `success` property is a literal `true` to enable discriminated union pattern
 * with {@link AGCommandError}.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGCommandSuccess } from '@aglabo/command-runner/types';
 *
 * // Successful command execution
 * const result: AGCommandSuccess = {
 *   success: true,
 *   exitCode: 0,
 *   stdout: 'Hello, World!\n',
 *   stderr: '',
 *   signal: null,
 * };
 *
 * // Command terminated by signal
 * const signalResult: AGCommandSuccess = {
 *   success: true,
 *   exitCode: 0,
 *   stdout: '',
 *   stderr: '',
 *   signal: 'SIGTERM',
 * };
 * ```
 */
export type AGCommandSuccess = {
  /** Always true for successful execution */
  success: true;

  /** Exit code returned by the command (typically 0 for success) */
  exitCode: number;

  /** Standard output from the command */
  stdout: string;

  /** Standard error from the command */
  stderr: string;

  /** Signal that terminated the process, or null if exited normally */
  signal: string | null;
};

/**
 * Discriminated union type for command execution results
 *
 * @remarks
 * This type represents the outcome of a command execution operation.
 * It is a discriminated union of {@link AGCommandSuccess} and {@link AGCommandError},
 * using the `success` property as the discriminator for type narrowing.
 * The AG prefix prevents naming conflicts with other libraries.
 *
 * @example
 * ```typescript
 * import { AGCommandResult } from '@aglabo/command-runner/types';
 *
 * function handleResult(result: AGCommandResult) {
 *   if (result.success) {
 *     // TypeScript knows this is AGCommandSuccess
 *     console.log(`Exit code: ${result.exitCode}`);
 *     console.log(`Output: ${result.stdout}`);
 *   } else {
 *     // TypeScript knows this is AGCommandError
 *     console.error(`Error: ${result.message}`);
 *     console.error(`Type: ${result.error}`);
 *   }
 * }
 * ```
 */
export type AGCommandResult = AGCommandSuccess | AGCommandError;

/**
 * Raw OS platform type (internal)
 *
 * @remarks
 * This is the internal representation of supported OS platforms as returned
 * by Node.js `process.platform`, Deno `Deno.build.os`, and similar runtime APIs.
 * The underscore prefix indicates this is a low-level type definition
 * that should typically be used through higher-level abstractions
 * like {@link AGPlatformType}.
 *
 * Supported values:
 * - 'win32': Microsoft Windows
 * - 'darwin': Apple macOS
 * - 'linux': Linux (all distributions)
 *
 * @internal
 */
export type _RawOSPlatformType = 'win32' | 'darwin' | 'linux';

/**
 * Result type for raw OS platform detection operations (internal)
 *
 * @remarks
 * This type represents the outcome of raw OS platform detection.
 * Returns a specific {@link _RawOSPlatformType} when detection succeeds,
 * or `undefined` when the platform cannot be determined.
 * The underscore prefix indicates this is a low-level type definition
 * that should typically be used through higher-level abstractions.
 *
 * @example
 * ```typescript
 * import { _RawOSPlatformResult } from '@aglabo/command-runner/types';
 *
 * // Successful detection
 * const detected: _RawOSPlatformResult = 'win32';
 *
 * // Failed detection
 * const unknown: _RawOSPlatformResult = undefined;
 *
 * // Type guard usage
 * if (detected !== undefined) {
 *   console.log(`Platform detected: ${detected}`); // Type-safe
 * }
 * ```
 *
 * @internal
 */
export type _RawOSPlatformResult = _RawOSPlatformType | undefined;
