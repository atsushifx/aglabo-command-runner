// src: src/_internal/types/__tests__/unit/AGTCommandResult.spec.ts
// @(#) : BDD tests for AGTCommandResult union type
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTCommandError, AGTCommandResult, AGTCommandSuccess } from '#shared/types/command-result.types';
import { AGTCommandErrorType } from '#shared/types/command-result.types';
import { describe, expect, it } from 'vitest';

describe('AGTCommandResult Union Type', () => {
  // ============================================================================
  // T01-07-02: Discriminator Field (Type Narrowing)
  // ============================================================================

  describe('[正常系] Type Narrowing with success discriminator', () => {
    // Given: AGTCommandSuccess object
    // When: checking the success field
    // Then: TypeScript narrows type to AGTCommandSuccess in if block
    it('should narrow to AGTCommandSuccess when success is true', () => {
      const result: AGTCommandResult = {
        success: true,
        result: { data: 'test' },
      };

      // Type narrowing test
      expect(result.success).toBe(true);
      expect(result.result).toEqual({ data: 'test' });
    });

    // Given: AGTCommandError object
    // When: checking the success field in else block
    // Then: TypeScript narrows type to AGTCommandError
    it('should narrow to AGTCommandError when success is false (else block)', () => {
      const result: AGTCommandResult = {
        type: AGTCommandErrorType.RuntimeErrors,
        message: 'Command failed',
      };

      // In this block, result should be AGTCommandError
      expect(result.type).toBe(AGTCommandErrorType.RuntimeErrors);
      expect(result.message).toBe('Command failed');
      // Verify the properties exist and have the correct types
      expect(typeof result.type).toBe('string');
      expect(typeof result.message).toBe('string');
    });

    // Given: AGTCommandSuccess with multiple properties
    // When: using type discriminator in if block
    // Then: all properties are accessible without type errors
    it('should allow access to AGTCommandSuccess properties after narrowing', () => {
      const success: AGTCommandSuccess = {
        success: true,
        result: { output: 'test', code: 0 },
      };
      const result: AGTCommandResult = success;

      expect(result.success).toBe(true);
      expect(result.result).toEqual({ output: 'test', code: 0 });
    });

    // Given: AGTCommandError with multiple properties
    // When: using type discriminator in else block
    // Then: all error properties are accessible
    it('should allow access to AGTCommandError properties after narrowing', () => {
      const error: AGTCommandError = {
        type: AGTCommandErrorType.ValidationErrors,
        message: 'Invalid input',
      };
      const result: AGTCommandResult = error;

      expect(result.type).toBe(AGTCommandErrorType.ValidationErrors);
      expect(result.message).toBe('Invalid input');
      // Type narrowing verified - these properties are accessible
      expect('type' in result && 'message' in result).toBe(true);
    });
  });

  describe('[異常系] Discriminator Edge Cases', () => {
    // Given: AGTCommandResult that is AGTCommandSuccess
    // When: checking with conditional on 'success' field
    // Then: true branch is executed
    it('should work with conditional on success field', () => {
      const result: AGTCommandResult = {
        success: true,
        result: { test: 'data' },
      };

      expect(result.success).toBe(true);
      expect(result.result).toEqual({ test: 'data' });
    });

    // Given: AGTCommandResult union with additional properties
    // When: accessing extra properties via index signature
    // Then: type narrowing still works correctly
    it('should maintain type narrowing with extra properties', () => {
      const result: AGTCommandResult = {
        success: true,
        result: { value: 42 },
        customField: 'extra',
      };

      expect(result.success).toBe(true);
      expect(result.result).toEqual({ value: 42 });
      expect((result as Record<string, unknown>).customField).toBe('extra');
    });
  });

  // ============================================================================
  // T01-07-03: Export Verification
  // ============================================================================

  describe('[正常系] Export Structure and Accessibility', () => {
    // Given: AGTCommandResult type is exported
    // When: importing AGTCommandResult
    // Then: type can be used in type annotations
    it('should export AGTCommandResult type', () => {
      const result: AGTCommandResult = {
        success: true,
        result: { test: 'value' },
      };

      expect(result).toBeDefined();
      expect(result.result).toEqual({ test: 'value' });
    });

    // Given: AGTCommandSuccess and AGTCommandError are members of union
    // When: creating success or error instances
    // Then: both can be assigned to AGTCommandResult type
    it('should accept AGTCommandSuccess as AGTCommandResult', () => {
      const success: AGTCommandSuccess = {
        success: true,
        result: { data: 'test' },
      };

      const result: AGTCommandResult = success;
      expect(result).toBe(success);
    });

    it('should accept AGTCommandError as AGTCommandResult', () => {
      const error: AGTCommandError = {
        type: AGTCommandErrorType.RuntimeErrors,
        message: 'Error occurred',
      };

      const result: AGTCommandResult = error;
      expect(result).toBe(error);
    });

    // Given: union type with AGTCommandSuccess | AGTCommandError
    // When: accessing union members
    // Then: both success and error paths are valid
    it('should support both union members', () => {
      const results: AGTCommandResult[] = [
        {
          success: true,
          result: { value: 1 },
        },
        {
          type: AGTCommandErrorType.TypeErrors,
          message: 'Type mismatch',
        },
      ];

      results.forEach((result) => {
        if (result.success) {
          expect(result.result).toBeDefined();
        } else {
          expect(result.type).toBeDefined();
          expect(result.message).toBeDefined();
        }
      });
    });
  });

  describe('[エッジケース] Union Type Completeness', () => {
    // Given: AGTCommandResult is defined as discriminated union
    // When: checking union composition
    // Then: only success:true and error cases exist
    it('should not allow invalid union states', () => {
      // This test verifies type safety at compile time
      // Valid states:
      const validSuccess: AGTCommandResult = {
        success: true,
        result: null,
      };

      const validError: AGTCommandResult = {
        type: AGTCommandErrorType.RuntimeErrors,
        message: 'error',
      };

      expect(validSuccess.result).toBeNull();
      expect(validError.type).toBe(AGTCommandErrorType.RuntimeErrors);
      expect(validError.message).toBe('error');
    });

    // Given: AGTCommandResult with various result types
    // When: assigning different result values
    // Then: unknown type allows any value
    it('should accept any result value due to unknown type', () => {
      const resultCases: AGTCommandResult[] = [
        { success: true, result: undefined },
        { success: true, result: null },
        { success: true, result: { complex: { nested: 'object' } } },
        { success: true, result: 'string' },
        { success: true, result: 42 },
        { success: true, result: true },
      ];

      // Verify all cases are valid AGTCommandResult types
      expect(resultCases.length).toBe(6);

      resultCases.forEach((result) => {
        if (result.success) {
          // Verify that result field exists (can be any value including undefined)
          expect(Object.prototype.hasOwnProperty.call(result, 'result')).toBe(true);
        }
      });
    });
  });

  // ============================================================================
  // Type System Verification
  // ============================================================================

  describe('[正常系] TypeScript Strict Mode Compatibility', () => {
    // Given: strict mode enabled
    // When: using AGTCommandResult type
    // Then: no type errors occur
    it('should compile without type errors in strict mode', () => {
      // This test verifies that the union type is properly defined
      // and works correctly with TypeScript strict mode
      const handler = (result: AGTCommandResult): string => {
        if (result.success) {
          return JSON.stringify(result.result);
        }
        return result.message as string;
      };

      const success: AGTCommandResult = {
        success: true,
        result: { data: 'test' },
      };

      const error: AGTCommandResult = {
        type: AGTCommandErrorType.ValidationErrors,
        message: 'Invalid',
      };

      const successResult = handler(success);
      const errorResult = handler(error);

      expect(successResult).toBe(JSON.stringify({ data: 'test' }));
      expect(errorResult).toBe('Invalid');
      expect(typeof successResult).toBe('string');
      expect(typeof errorResult).toBe('string');
    });
  });
});
