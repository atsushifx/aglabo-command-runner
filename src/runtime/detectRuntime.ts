// src: src/runtime/detectRuntime.ts
// @(#): Runtime detection for cross-runtime support
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Type definitions
import type { AGRuntimeResult } from '@shared/types/runtime.types.ts';
import { AGRuntimeType } from '@shared/types/runtime.types.ts';

// ============================================================================
// Global Type Extensions
// ============================================================================

/**
 * Type definition for globalThis with Deno property
 * @internal
 */
type GlobalWithDeno = {
  Deno?: {
    version?: {
      deno?: string;
    };
  };
};

/**
 * Type definition for globalThis with Bun property
 * @internal
 */
type GlobalWithBun = {
  Bun?: {
    version?: string;
  };
};

// ============================================================================
// Internal Helper Functions
// ============================================================================

/**
 * Internal helper: Check if running in Deno environment
 *
 * @internal
 * @returns true if running in Deno, false otherwise
 */
const _isDeno = (): boolean => {
  // Use globalThis for safe access across all runtimes
  const deno = (globalThis as unknown as GlobalWithDeno).Deno;
  return deno?.version?.deno !== undefined;
};

/**
 * Internal helper: Check if running in Bun environment
 *
 * @internal
 * @returns true if running in Bun, false otherwise
 */
const _isBun = (): boolean => {
  // Use globalThis for safe access across all runtimes
  const bun = (globalThis as unknown as GlobalWithBun).Bun;
  return bun?.version !== undefined;
};

/**
 * Internal helper: Check if running in Node.js environment
 *
 * @internal
 * @returns true if running in Node.js, false otherwise
 */
const _isNode = (): boolean => {
  // deno-lint-ignore no-process-global
  return typeof process !== 'undefined' && Boolean(process.versions.node);
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Detect the current JavaScript runtime environment
 *
 * @returns The detected runtime type (Node, Deno, or Bun), or undefined if unknown
 *
 * @remarks
 * This function never throws errors. If runtime detection fails for any reason,
 * it returns undefined. This makes it safe to use in all environments.
 *
 * Detection order: Deno → Bun → Node.js → Unknown
 *
 * **Why this order matters:**
 * - Deno exposes a Node.js-compatible `process` global for compatibility
 * - Checking Node.js first would cause false positives for Deno
 * - Bun also may expose Node.js APIs, so must be checked before Node.js
 *
 * **Edge Cases:**
 * - Returns undefined in browsers and unknown environments
 * - Uses `typeof` and optional chaining for safe global access
 * - Works correctly when multiple runtime signatures exist (e.g., Deno with process)
 *
 * @example
 * Basic usage with all three runtimes:
 * ```typescript
 * import { detectRuntime, AGRuntimeType } from '@aglabo/command-runner';
 *
 * const runtime = detectRuntime();
 *
 * switch (runtime) {
 *   case AGRuntimeType.Node:
 *     console.log('Running in Node.js');
 *     break;
 *   case AGRuntimeType.Deno:
 *     console.log('Running in Deno');
 *     break;
 *   case AGRuntimeType.Bun:
 *     console.log('Running in Bun');
 *     break;
 *   default:
 *     console.log('Unknown or unsupported runtime');
 * }
 * ```
 *
 * @example
 * Handling unknown runtimes:
 * ```typescript
 * const runtime = detectRuntime();
 *
 * if (runtime === undefined) {
 *   throw new Error('Unsupported runtime environment');
 * }
 *
 * // Safe to use runtime here
 * console.log(`Running in ${runtime}`);
 * ```
 *
 * @example
 * Using with conditional logic:
 * ```typescript
 * const runtime = detectRuntime();
 * const isNode = runtime === AGRuntimeType.Node;
 * const isDeno = runtime === AGRuntimeType.Deno;
 * const isBun = runtime === AGRuntimeType.Bun;
 *
 * if (isNode || isBun) {
 *   // Use Node.js-compatible APIs
 * } else if (isDeno) {
 *   // Use Deno-specific APIs
 * }
 * ```
 */
export const detectRuntime = (): AGRuntimeResult => {
  // IMPORTANT: Detection order matters!
  //
  // Deno must be checked first because it exposes a process global
  // for Node.js compatibility. Checking Node first would incorrectly
  // identify Deno as Node.js.
  //
  // Priority: Deno → Bun → Node.js → Unknown

  // Check Deno first (exposes process global for compatibility)
  if (_isDeno()) {
    return AGRuntimeType.Deno;
  }

  // Check Bun second (also may expose process global)
  if (_isBun()) {
    return AGRuntimeType.Bun;
  }

  // Check Node.js last
  if (_isNode()) {
    return AGRuntimeType.Node;
  }

  // Unknown runtime
  return undefined;
};
