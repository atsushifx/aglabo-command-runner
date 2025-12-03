// src: src/runtime/getOSPlatform.ts
// @(#): OS platform detection across JavaScript runtimes
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { detectRuntime } from '@/runtime/detectRuntime.ts';
import type { AGPlatformResult, AGPlatformType } from '@shared/types/runtime.types.ts';
import { AGRuntimeType } from '@shared/types/runtime.types.ts';

// ============================================================================
// Internal Helper Functions
// ============================================================================

/**
 * Normalize process.platform to AGPlatformType
 *
 * @internal
 * @param platform - Raw platform string from process.platform
 * @returns Normalized platform type or undefined
 *
 * @remarks
 * Converts Node.js process.platform values to standard AGPlatformType values:
 * - 'win32' → 'windows'
 * - 'darwin' → 'macos'
 * - 'linux' → 'linux'
 */
const _normalizePlatform = (platform: string): AGPlatformType | undefined => {
  switch (platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'macos';
    case 'linux':
      return 'linux';
    default:
      return undefined;
  }
};

/**
 * Get platform from process global (Node.js/Bun)
 *
 * @internal
 * @returns Normalized platform type or undefined
 *
 * @remarks
 * Safely accesses process.platform and normalizes it to AGPlatformType.
 * Returns undefined if process global doesn't exist or platform cannot be normalized.
 */
const _getPlatformFromProcess = (): AGPlatformType | undefined => {
  const platform = globalThis.process?.platform as string | undefined;
  if (!platform) {
    return undefined;
  }
  return _normalizePlatform(platform);
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Detect operating system platform across JavaScript runtimes
 *
 * @returns Normalized platform type or undefined if detection fails.
 *          Possible values: `'windows'`, `'macos'`, `'linux'`, or `undefined`.
 *
 * @remarks
 * **Detection Strategy**
 *
 * Platform detection varies by JavaScript runtime:
 * - **Node.js/Bun**: Uses `process.platform` API and normalizes values
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
 * All values are normalized to standard platform names:
 * - **`'windows'`** - Windows (both 32-bit and 64-bit systems)
 * - **`'macos'`** - macOS (Apple Darwin kernel)
 * - **`'linux'`** - Linux distributions
 *
 * @example
 * Basic platform detection
 * ```typescript
 * import { getOSPlatform } from '@aglabo/command-runner/runtime';
 *
 * const platform = getOSPlatform();
 * if (platform === 'windows') {
 *   console.log('Running on Windows');
 * } else if (platform === 'macos') {
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
 * const pathSep = platform === 'windows' ? '\\' : '/';
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
 * const shellCmd = platform === 'windows' ? 'cmd.exe' : '/bin/sh';
 * const listCmd = platform === 'windows' ? 'dir' : 'ls -la';
 * ```
 */
export const getOSPlatform = (_testPlatform?: string): AGPlatformResult => {
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
