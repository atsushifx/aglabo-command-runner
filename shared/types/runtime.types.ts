// src: shared/types/runtime.types.ts
// @(#) : Type definitions for JavaScript runtime environment detection
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
