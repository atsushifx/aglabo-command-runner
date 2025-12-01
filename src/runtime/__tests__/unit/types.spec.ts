// src: src/runtime/__tests__/unit/types.spec.ts
// @(#): Unit tests for runtime type definitions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Testing framework
import { describe, expect, it } from 'vitest';

// Type definitions
import type { AGCommandError, AGCommandResult, AGRuntimeResult } from '@shared/types/runtime.types.ts';
import { AGCommandErrorType, AGRuntimeType } from '@shared/types/runtime.types.ts';

// Test cases
/**
 * Runtime Type Definition Unit Tests
 *
 * Tests type definitions for cross-runtime support including runtime types,
 * command result types, and error types with AG prefix convention.
 */
describe('Runtime Types', () => {
  /**
   * AGRuntimeType Enum Tests
   *
   * Tests runtime type enum values (Node, Deno, Bun) for correct
   * string literal values.
   */
  describe('AGRuntimeType Enum', () => {
    // Test: Verify enum has all supported runtime values
    it('[正常]should have Node, Deno, and Bun values', () => {
      // Given: TypeScript runtime
      // When: Import AGRuntimeType enum
      // Then: Enum has correct values
      expect(AGRuntimeType.Node).toBe('node');
      expect(AGRuntimeType.Deno).toBe('deno');
      expect(AGRuntimeType.Bun).toBe('bun');
    });
  });

  /**
   * AGRuntimeResult Type Tests
   *
   * Tests runtime result type that represents detection outcomes,
   * accepting either AGRuntimeType enum values or undefined.
   */
  describe('AGRuntimeResult Type', () => {
    // Test: Verify type accepts all runtime enum values
    it('[正常]should accept AGRuntimeType values', () => {
      // Given: TypeScript runtime
      // When: Use AGRuntimeResult type
      // Then: Accepts all AGRuntimeType enum values
      const nodeResult: AGRuntimeResult = AGRuntimeType.Node;
      const denoResult: AGRuntimeResult = AGRuntimeType.Deno;
      const bunResult: AGRuntimeResult = AGRuntimeType.Bun;

      expect(nodeResult).toBe('node');
      expect(denoResult).toBe('deno');
      expect(bunResult).toBe('bun');
    });

    // Test: Verify type accepts undefined for failed detection
    it('[正常]should accept undefined', () => {
      // Given: TypeScript runtime
      // When: Use AGRuntimeResult type
      // Then: Accepts undefined value
      const undefinedResult: AGRuntimeResult = undefined;

      expect(undefinedResult).toBeUndefined();
    });
  });

  /**
   * AGCommandErrorType Enum Tests
   *
   * Tests error type enum values for command execution failures
   * including timeout, spawn failure, and unsupported runtime errors.
   */
  describe('AGCommandErrorType Enum', () => {
    // Test: Verify enum has all error type values
    it('[正常]should have Timeout, SpawnFailed, and UnsupportedRuntime values', () => {
      // Given: TypeScript runtime
      // When: Import AGCommandErrorType enum
      // Then: Enum has Timeout, SpawnFailed, UnsupportedRuntime values
      expect(AGCommandErrorType.Timeout).toBe('timeout');
      expect(AGCommandErrorType.SpawnFailed).toBe('spawn-failed');
      expect(AGCommandErrorType.UnsupportedRuntime).toBe('unsupported-runtime');
    });
  });

  /**
   * AGCommandError Interface Tests
   *
   * Tests error result interface structure with discriminated union
   * pattern (success: false) for type-safe error handling.
   */
  describe('AGCommandError Interface', () => {
    // Test: Verify error interface has all required properties
    it('[正常]should have success, error, message, and stderr properties', () => {
      // Given: TypeScript runtime
      // When: Create AGCommandError object
      // Then: Has success (false), error (AGCommandErrorType), message (string), stderr (string) properties
      const errorResult: AGCommandError = {
        success: false,
        error: AGCommandErrorType.Timeout,
        message: 'Command execution exceeded timeout',
        stderr: 'Error output',
      };

      expect(errorResult.success).toBe(false);
      expect(errorResult.error).toBe(AGCommandErrorType.Timeout);
      expect(errorResult.message).toBe('Command execution exceeded timeout');
      expect(errorResult.stderr).toBe('Error output');
    });
  });

  /**
   * AGCommandResult Type Tests
   *
   * Tests discriminated union type for command execution results,
   * verifying type narrowing with success property as discriminator.
   */
  describe('AGCommandResult Type', () => {
    // Test: Verify discriminated union type guards work correctly
    it('[正常]should support discriminated union with success property', () => {
      // Given: TypeScript runtime
      // When: Use AGCommandResult type with type guards
      // Then: TypeScript narrows type based on success property
      const errorResult: AGCommandResult = {
        success: false,
        error: AGCommandErrorType.SpawnFailed,
        message: 'Command not found',
      };

      const successResult: AGCommandResult = {
        success: true,
        stdout: 'Command output',
        stderr: '',
        exitCode: 0,
        signal: null,
      };

      // Type guard: error case
      expect(errorResult.success).toBe(false);
      expect(errorResult.error).toBe(AGCommandErrorType.SpawnFailed);
      expect(errorResult.message).toBe('Command not found');

      // Type guard: success case
      expect(successResult.success).toBe(true);
      expect(successResult.stdout).toBe('Command output');
      expect(successResult.exitCode).toBe(0);
    });
  });
});
