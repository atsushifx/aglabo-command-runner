// src: shared/types/platform.types.ts
// @(#) : Type definitions for operating system platform detection
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

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
 * if (platform === AGPlatformType.Windows) {
 *   console.log('Running on Windows');
 * }
 */
export enum AGPlatformType {
  /** Windows operating system (32-bit and 64-bit) */
  Windows = 'windows',

  /** macOS operating system (Apple Darwin kernel) */
  MacOS = 'macos',

  /** Linux operating system (various distributions) */
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
