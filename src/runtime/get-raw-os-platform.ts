// src: src/runtime/get-raw-os-platform.ts
// @(#) : Cross-runtime platform detection for raw OS platform type
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// type definitions
import type { _RawOSPlatformResult } from '#shared/types/runtime.types.ts';
import { AGPlatformType, AGRuntimeType } from '#shared/types/runtime.types.ts';
// runtime detection
import { detectRuntime } from './detect-runtime.ts';

/**
 * Detects the runtime platform and returns the appropriate raw OS platform value.
 *
 * @remarks
 * This is a low-level platform detection function that works across multiple runtimes:
 * - **Deno**: Reads `Deno.build.os` and maps to Node.js-style platform values
 * - **Bun**: Reads `process.platform` (Node.js-compatible API)
 * - **Node.js**: Reads `process.platform`
 *
 * The function maps detected platform values to Node.js-style format for consistency:
 * - 'win32': Microsoft Windows
 * - 'darwin': Apple macOS (including Deno's 'darwin')
 * - 'linux': Linux (all distributions)
 *
 * Detection order (Deno → Bun → Node.js) ensures correct identification since
 * Deno and Bun may expose Node.js-compatible APIs that could cause false positives.
 *
 * @param runtime - Optional runtime type to use instead of auto-detecting (useful for testing)
 * @returns The detected platform as `_RawOSPlatformType`, or `undefined` if platform cannot be determined
 *
 * @remarks
 * **Return value semantics:**
 * - Returns a valid platform string ('win32', 'darwin', 'linux') if detection succeeds
 * - Returns `undefined` if any of these occur:
 *   - Runtime is unknown or unsupported (not Node.js, Deno, or Bun)
 *   - Runtime global object is unavailable or invalid (e.g., null, wrong type)
 *   - Platform property is missing or invalid in the runtime global
 *   - Detected platform value is not one of the known platform values
 *   - Runtime environment is sandboxed with incomplete runtime information
 *
 * @example
 * ```typescript
 * import { _getRawOSPlatform } from '@aglabo/command-runner/internal';
 *
 * const platform = _getRawOSPlatform();
 * if (platform === 'win32') {
 *   console.log('Running on Windows');
 * } else if (platform === 'darwin') {
 *   console.log('Running on macOS');
 * } else if (platform === 'linux') {
 *   console.log('Running on Linux');
 * } else {
 *   // platform is undefined - handle unsupported or detection-failed scenario
 *   console.log('Platform could not be determined');
 *   // Provide fallback behavior or error handling
 * }
 * ```
 *
 * @internal
 */

// Map Deno.build.os to Node.js-style platform values
const denoToPlatformMap: Record<string, _RawOSPlatformResult> = {
  'windows': AGPlatformType.Win32,
  'darwin': AGPlatformType.Darwin,
  'linux': AGPlatformType.Linux,
};

/**
 * Attempts to detect platform from Deno.build.os
 * Maps Deno platform values to Node.js-style format for consistency.
 *
 * @remarks
 * Deno uses different platform naming than Node.js:
 * - Deno: 'windows', 'darwin', 'linux'
 * - Node.js: 'win32', 'darwin', 'linux'
 *
 * @param denoGlobal - The Deno global object or undefined
 * @returns Platform string if detected, undefined otherwise
 */
const _detectDenoPlatform = (denoGlobal: unknown): _RawOSPlatformResult => {
  if (typeof denoGlobal !== 'object' || denoGlobal === null) { return undefined; }
  const denoOs = (denoGlobal as Record<string, unknown>).build;
  if (typeof denoOs !== 'object' || denoOs === null) { return undefined; }
  return denoToPlatformMap[(denoOs as Record<string, unknown>).os as string] ?? undefined;
};

/**
 * Gets platform value from the global process object.
 * Safely accesses globalThis.process.platform and returns the raw value.
 *
 * @returns The raw platform value or undefined if unavailable
 */
const _getGlobalPlatform = (): unknown => {
  const processGlobal = (globalThis as Record<string, unknown>).process;
  if (typeof processGlobal !== 'object' || processGlobal === null) { return undefined; }
  return (processGlobal as Record<string, unknown>).platform;
};

/**
 * Validates platform value against known AGPlatformType values.
 *
 * @param platform - The platform value to validate
 * @returns true if platform is valid, false otherwise
 */
const _isValidPlatform = (platform: unknown): platform is _RawOSPlatformResult => {
  const validPlatforms = Object.values(AGPlatformType) as _RawOSPlatformResult[];
  return typeof platform === 'string' && validPlatforms.includes(platform as _RawOSPlatformResult);
};

/**
 * Attempts to detect platform from Bun runtime
 * Bun provides Node.js-compatible process.platform API for platform detection.
 * Returns the platform value directly if valid.
 *
 * @remarks
 * Bun provides Node.js API compatibility, including process.platform.
 * This function validates the platform value against known values
 * before returning it.
 *
 * @param bunGlobal - The Bun global object or undefined
 * @returns Platform string if detected and valid, undefined otherwise
 */
const _detectBunPlatform = (bunGlobal: unknown): _RawOSPlatformResult => {
  if (typeof bunGlobal !== 'object' || bunGlobal === null) { return undefined; }

  // Bun uses Node.js-compatible process.platform API
  const platform = _getGlobalPlatform();
  return _isValidPlatform(platform) ? platform : undefined;
};

/**
 * Attempts to detect platform from Node.js process.platform
 * Returns the platform value directly if valid.
 *
 * @returns Platform string if valid, undefined otherwise
 */
const _detectNodePlatform = (): _RawOSPlatformResult => {
  const platform = _getGlobalPlatform();
  return _isValidPlatform(platform) ? platform : undefined;
};

export const _getRawOSPlatform = (runtime?: AGRuntimeType): _RawOSPlatformResult => {
  // Use provided runtime or detect it if not specified
  // This avoids duplicating runtime detection logic and enables testing with specific runtimes
  const detectedRuntime = runtime ?? detectRuntime();

  switch (detectedRuntime) {
    case AGRuntimeType.Deno:
      return _detectDenoPlatform((globalThis as Record<string, unknown>).Deno);
    case AGRuntimeType.Bun:
      return _detectBunPlatform((globalThis as Record<string, unknown>).Bun);
    case AGRuntimeType.Node:
      return _detectNodePlatform();
    default:
      return undefined;
  }
};
