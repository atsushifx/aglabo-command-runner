// src: src/runtime/runCommand.ts
// @(#): Cross-runtime command execution with timeout support
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Node.js APIs
import { spawn } from 'child_process';

// Type definitions
import type { AGCommandResult } from '@shared/types/commandRunner.types.ts';
import { AGCommandErrorType } from '@shared/types/commandRunner.types.ts';
import { AGRuntimeType } from '@shared/types/runtime.types.ts';

// Runtime detection
import { detectRuntime } from '@/runtime/detectRuntime.ts';

// ============================================================================
// Internal Helper Functions
// ============================================================================

const _executeNodeCommand = (
  command: string,
  args: string[],
  timeout: number,
): Promise<AGCommandResult> => {
  // ---- 外側状態（spawn + timeout の共有領域）----
  let stdout = '';
  let stderr = '';

  // ---- 内側：spawn プロセス実行 ----
  const spawnPromise = (): Promise<AGCommandResult> =>
    new Promise((resolve) => {
      const proc = spawn(command, args);

      proc.stdout?.on('data', (d: Buffer) => (stdout += d.toString()));
      proc.stderr?.on('data', (d: Buffer) => (stderr += d.toString()));

      proc.on('error', (err: Error) => {
        resolve({
          success: false,
          error: AGCommandErrorType.SpawnFailed,
          message: err.message,
          stdout,
          stderr,
        });
      });

      proc.on('close', (code: number | null, signal: string | null) => {
        resolve({
          success: true,
          exitCode: code ?? -1,
          stdout,
          stderr,
          signal: signal ?? null,
        });
      });
    });

  // ---- timeout promise ----
  const timeoutPromise = (): Promise<AGCommandResult> =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          success: false,
          error: AGCommandErrorType.Timeout,
          message: `Command timed out after ${timeout}ms`,
          stdout,
          stderr,
        });
      }, timeout)
    );

  // ---- 競合判定 ----
  return Promise.race([
    spawnPromise(),
    timeoutPromise(),
  ]);
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Execute a shell command with timeout support across JavaScript runtimes
 *
 * @param command - Command executable name (e.g., 'echo', 'node', 'git')
 * @param args - Array of command arguments
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 * @returns Promise resolving to discriminated union result
 *
 * @remarks
 * **Design Principle**: Runtime-agnostic public API
 *
 * This function provides a unified interface that works identically across
 * different JavaScript runtimes (Node.js, Deno, Bun). Users don't need to
 * know which runtime they're on - the function handles runtime-specific
 * implementation details internally.
 *
 * **Supported Runtimes**
 *
 * - Node.js: Uses `child_process.spawn()`
 * - Bun: Uses `child_process.spawn()` (Node.js compatible)
 * - Deno: Not yet implemented (returns UnsupportedRuntime error)
 *
 * **Error Handling**
 *
 * This function never throws errors. All failures return error results:
 * - `AGCommandErrorType.Timeout` - Command exceeded timeout limit
 * - `AGCommandErrorType.SpawnFailed` - Failed to start process
 * - `AGCommandErrorType.UnsupportedRuntime` - Runtime not detected or unsupported
 *
 * @example
 * Basic command execution
 * ```typescript
 * import { runCommand } from '@aglabo/command-runner';
 *
 * const result = await runCommand('echo', ['Hello, World!']);
 * if (result.success) {
 *   console.log(result.stdout); // "Hello, World!"
 *   console.log(result.exitCode); // 0
 * } else {
 *   console.error(result.error, result.message);
 * }
 * ```
 */
export async function runCommand(
  command: string,
  args: string[],
  timeout: number = 5_000,
): Promise<AGCommandResult> {
  const runtime = detectRuntime();

  // Runtime validation
  if (!runtime) { // falsy === could not detect runtime
    return {
      success: false,
      error: AGCommandErrorType.UnsupportedRuntime,
      message: 'Runtime could not be detected',
    };
  }

  // Route to runtime-specific executor
  switch (runtime) {
    case AGRuntimeType.Node:
    case AGRuntimeType.Bun:
      // Node.js and Bun use the same child_process.spawn API
      return await _executeNodeCommand(command, args, timeout);

    default:
      // Deno or unknown runtime
      return {
        success: false,
        error: AGCommandErrorType.UnsupportedRuntime,
        message: `Runtime ${runtime} is not supported for command execution`,
      };
  }
}
