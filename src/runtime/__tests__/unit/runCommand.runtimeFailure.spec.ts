// src: src/runtime/__tests__/unit/runCommand.spec.ts
// @(#): Unit tests for command execution
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Testing framework
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Type definitions
import type { AGCommandResult } from '@shared/types/commandRunner.types.ts';
import { AGCommandErrorType } from '@shared/types/commandRunner.types.ts';
// Function to test
// import { runCommand } from '@/runtime/runCommand.ts';

/**
 * Command Execution Unit Tests
 *
 * Tests runtime-agnostic command execution functionality with timeout support.
 * Public API should work identically on Node.js, Deno, and Bun.
 */
describe('runCommand with unsupported runtime ', () => {
  beforeEach(() => {
    // Reset module registry before each test to ensure fresh imports
    vi.resetModules();
    vi.doMock('@/runtime/detectRuntime.ts', () => ({
      detectRuntime: () => undefined, // Simulate unsupported runtime
    }));
  });

  // Task: T04-04: Handle unsupported runtime gracefully
  it('[異常]should handle unsupported runtime', async () => {
    const { runCommand } = await import('@/runtime/runCommand.ts');
    // When: Execute command
    const result: AGCommandResult = await runCommand('echo', ['Hello']);

    // Then: Returns failure with unsupported runtime error
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(AGCommandErrorType.UnsupportedRuntime);
      expect(result.stdout).toBeUndefined();
      expect(result.stderr).toBeUndefined();
    }
  });
});
