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
describe('runCommand', () => {
  /**
   * Basic Command Execution Tests
   *
   * Tests basic command execution with runtime-agnostic echo command.
   * Should work on all supported runtimes (Node.js/Deno/Bun).
   */
  describe('Basic Command Execution', () => {
    // T04-01-01: RED - Test echo command execution
    it('[正常]should execute echo command and return stdout', async () => {
      const { runCommand } = await import('@/runtime/runCommand.ts');
      // Given: Simple echo command (available on all platforms)
      const command = 'echo';
      const args = ['Hello'];

      // When: Execute command
      const result: AGCommandResult = await runCommand(command, args);

      // Then: Returns success with stdout containing the text
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Hello');
        expect(result.stderr).toBe('');
      }
    });
  });

  // Task: T04-02: Timeout Handling Tests
  it('[異常]should handle invalid command execution error', async () => {
    const { runCommand } = await import('@/runtime/runCommand.ts');
    // Given: Invalid command name
    const command = 'sleep';
    const args: string[] = ['2'];

    // When: Execute command
    const result: AGCommandResult = await runCommand(command, args, 100);

    // Then: Returns failure with command error type
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(AGCommandErrorType.Timeout);
      expect(result.stderr).toBeDefined();
    }
  });

  // Task: T04-03: Spawn Failure Tests
  it('[異常]should handle spawn failure for non-existent command', async () => {
    const { runCommand } = await import('@/runtime/runCommand.ts');
    // Given: Non-existent command name
    const command = 'nonexistent_command_xyz';
    const args: string[] = [];

    // When: Execute command
    const result: AGCommandResult = await runCommand(command, args, 1000);

    // Then: Returns failure with command error type
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(AGCommandErrorType.SpawnFailed);
      expect(result.stderr).toBeDefined();
      expect(result.stdout).toBeDefined();
    }
  });
});
