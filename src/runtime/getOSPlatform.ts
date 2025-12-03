// src: src/runtime/getOSPlatform.ts
// @(#): OS platform detection across JavaScript runtimes
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { detectRuntime } from '@/runtime/detectRuntime.ts';
import type { AGPlatformResult } from '@shared/types/runtime.types.ts';
import { AGRuntimeType } from '@shared/types/runtime.types.ts';

// ============================================================================
// Internal Helper Functions
// ============================================================================

/**
 * Get platform from process global (Node.js/Bun)
 *
 * @internal
 * @returns Platform string or undefined
 *
 * @remarks
 * Safely accesses process.platform using optional chaining.
 * Returns undefined if process global doesn't exist or lacks platform property.
 */
const _getPlatformFromProcess = (): string | undefined => {
  return globalThis.process.platform as string | undefined;
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Detect operating system platform across JavaScript runtimes
 *
 * @returns Platform type string or undefined if detection fails.
 *          Possible values: `'win32'`, `'darwin'`, `'linux'`, or `undefined`.
 *
 * @remarks
 * **Detection Strategy**
 *
 * Platform detection varies by JavaScript runtime:
 * - **Node.js/Bun**: Uses `process.platform` API
 * - **Deno**: Not yet implemented (returns `undefined`)
 *
 * **Error Handling**
 *
 * Returns `undefined` instead of throwing on error for graceful degradation.
 * This allows applications to handle missing platform information gracefully
 * without try-catch blocks.
 *
 * **Platform Values**
 *
 * All values follow Node.js `process.platform` conventions:
 * - **`'win32'`** - Windows (both 32-bit and 64-bit systems)
 * - **`'darwin'`** - macOS (Apple Darwin kernel)
 * - **`'linux'`** - Linux distributions
 *
 * @example
 * Basic platform detection
 * ```typescript
 * import { getOSPlatform } from '@aglabo/command-runner/runtime';
 *
 * const platform = getOSPlatform();
 * if (platform === 'win32') {
 *   console.log('Running on Windows');
 * } else if (platform === 'darwin') {
 *   console.log('Running on macOS');
 * } else if (platform === 'linux') {
 *   console.log('Running on Linux');
 * }
 * ```
 *
 * @example
 * Cross-platform path handling (Windows vs Unix)
 * ```typescript
 * import { getOSPlatform } from '@aglabo/command-runner/runtime';
 *
 * const platform = getOSPlatform();
 * const pathSep = platform === 'win32' ? '\\' : '/';
 * const configPath = `home${pathSep}user${pathSep}config.json`;
 * // Windows: "home\\user\\config.json"
 * // Unix:    "home/user/config.json"
 * ```
 *
 * @example
 * Graceful degradation with fallback
 * ```typescript
 * import { getOSPlatform } from '@aglabo/command-runner/runtime';
 *
 * const platform = getOSPlatform();
 * if (platform === undefined) {
 *   console.warn('Could not detect platform, using defaults');
 *   // Use safe defaults that work across platforms
 *   const pathSep = '/'; // Unix-style paths work on most systems
 * }
 * ```
 *
 * @example
 * Platform-specific command execution
 * ```typescript
 * import { getOSPlatform } from '@aglabo/command-runner/runtime';
 *
 * const platform = getOSPlatform();
 * const shellCmd = platform === 'win32' ? 'cmd.exe' : '/bin/sh';
 * const listCmd = platform === 'win32' ? 'dir' : 'ls -la';
 * ```
 */
export const getOSPlatform = (): AGPlatformResult => {
  const runtime = detectRuntime();

  // Handle each runtime's platform API
  // Note: Order doesn't matter here since detectRuntime() already prioritizes correctly
  switch (runtime) {
    case AGRuntimeType.Node:
    case AGRuntimeType.Bun:
      // Both Node.js and Bun use the same process.platform API
      // Returns standard platform strings: 'win32', 'darwin', 'linux', etc.
      return _getPlatformFromProcess() as AGPlatformResult;

    default:
      // Unknown or unsupported runtime
      // Returns undefined for graceful degradation
      return undefined;
  }
};
