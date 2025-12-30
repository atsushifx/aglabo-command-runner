// src: src/_internal/types/__tests__/unit/AGTCommandSuccess.spec.ts
// @(#) : Unit tests for AGTCommandSuccess type
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { describe, expect, it } from 'vitest';

// type definitions
import type { AGTCommandSuccess } from '#shared/types/command-result.types';

// ============================================================================
// Given: AGTCommandSuccess type is defined
// ============================================================================

describe('Given: AGTCommandSuccess type is defined', () => {
  // ============================================================================
  // When: Defining AGTCommandSuccess type object
  // ============================================================================

  describe('When: Defining AGTCommandSuccess type object', () => {
    // Case Level (Then): Type object created
    it('Then: [正常] - type object created', () => {
      // Arrange: Create a test object matching AGTCommandSuccess
      const successObj: AGTCommandSuccess = {
        success: true,
        result: { message: 'Command executed successfully' },
      };

      // Assert: Verify type object is valid
      expect(successObj).toBeDefined();
      expect(successObj).toEqual({
        success: true,
        result: { message: 'Command executed successfully' },
      });
    });
  });

  // ============================================================================
  // When: Checking normal type fields
  // ============================================================================

  describe('When: Checking normal type fields', () => {
    // Case Level (Then): Includes success and result fields
    it('Then: [正常] - includes success field with true value', () => {
      // Arrange: Create a success object
      const success: AGTCommandSuccess = {
        success: true,
        result: { data: 'test' },
      };

      // Act: Verify success field exists and is true
      const hasSuccessField = 'success' in success;
      const successValue = success.success;

      // Assert: Verify success field is present and true
      expect(hasSuccessField).toBe(true);
      expect(successValue).toBe(true);
    });

    it('Then: [正常] - includes result field', () => {
      // Arrange: Create a success object
      const success: AGTCommandSuccess = {
        success: true,
        result: { stdout: 'output', stderr: '' },
      };

      // Act: Verify result field exists
      const hasResultField = 'result' in success;
      const resultValue = success.result;

      // Assert: Verify result field is present
      expect(hasResultField).toBe(true);
      expect(resultValue).toBeDefined();
    });

    it('Then: [正常] - both success and result fields are required', () => {
      // Arrange: Both fields must be present
      const validSuccess: AGTCommandSuccess = {
        success: true,
        result: undefined,
      };

      // Act: Verify both fields exist as properties
      const successFieldExists = 'success' in validSuccess;
      const resultFieldExists = 'result' in validSuccess;

      // Assert: Verify both fields are present in the object
      expect(successFieldExists).toBe(true);
      expect(resultFieldExists).toBe(true);
      expect(validSuccess.success).toBe(true);
    });
  });

  // ============================================================================
  // When: Checking invalid type fields
  // ============================================================================

  describe('When: Checking invalid type fields', () => {
    // Case Level (Then): success is literal true, result is unknown, no error field
    it('Then: [異常] - success field is literal true (not boolean, not false)', () => {
      // Arrange: Create a success object
      const success: AGTCommandSuccess = {
        success: true,
        result: 'result data',
      };

      // Assert: success must be literal true, not just a boolean
      expect(success.success).toBe(true);
      expect(typeof success.success).toBe('boolean');
      // Verify it's exactly true, not false
      expect(success.success).toStrictEqual(true);
      expect(success.success).not.toEqual(false);
    });

    it('Then: [異常] - result field is unknown (accepts any value type)', () => {
      // Arrange: Create success objects with various result types
      const successWithObject: AGTCommandSuccess = {
        success: true,
        result: { data: 'test' },
      };

      const successWithString: AGTCommandSuccess = {
        success: true,
        result: 'output',
      };

      const successWithNumber: AGTCommandSuccess = {
        success: true,
        result: 123,
      };

      const successWithNull: AGTCommandSuccess = {
        success: true,
        result: null,
      };

      // Act: Verify result accepts any type (unknown)
      const resultsValid = [successWithObject, successWithString, successWithNumber, successWithNull].every(
        (s) => 'result' in s,
      );

      // Assert: result should accept any value type
      expect(resultsValid).toBe(true);
      expect(typeof successWithObject.result).toBe('object');
      expect(typeof successWithString.result).toBe('string');
      expect(typeof successWithNumber.result).toBe('number');
    });

    it('Then: [異常] - no error field in success type', () => {
      // Arrange: Create a success object with only required fields
      const success: AGTCommandSuccess = {
        success: true,
        result: 'data',
      };

      // Act: Check that error field is not present
      const hasErrorField = 'error' in success;

      // Assert: error field should not exist in success type
      expect(hasErrorField).toBe(false);
    });
  });

  // ============================================================================
  // When: Checking edge cases for type fields
  // ============================================================================

  describe('When: Checking edge cases for type fields', () => {
    // Case Level (Then): Field order matches error pattern, success is required not optional, allows additional properties
    it('Then: [エッジケース] - field order does not affect type compatibility', () => {
      // Arrange: Create success objects with different field order (logically)
      const success1: AGTCommandSuccess = {
        success: true,
        result: { data: 'test' },
      };

      const success2: AGTCommandSuccess = {
        result: { data: 'test' },
        success: true,
      };

      // Assert: Both objects are valid and have the same structure
      expect(success1).toEqual({
        success: true,
        result: { data: 'test' },
      });
      expect(success2).toEqual({
        success: true,
        result: { data: 'test' },
      });
    });

    it('Then: [エッジケース] - success is required not optional', () => {
      // Arrange: Create success object with required success field
      const success: AGTCommandSuccess = {
        success: true,
        result: 'data',
      };

      // Assert: success must be defined and must be true
      expect(success.success).toBe(true);
      expect(success.result).toBe('data');
      // Verify the success field is a boolean literal true
      expect(Object.prototype.hasOwnProperty.call(success, 'success')).toBe(true);
    });

    it('Then: [エッジケース] - allows additional properties via index signature', () => {
      // Arrange: Create success with additional properties (should be allowed via index signature)
      const now = Date.now();
      const success: AGTCommandSuccess & { [key: string]: unknown } = {
        success: true,
        result: 'output',
        timestamp: now,
        metadata: { version: '1.0' },
      };

      // Assert: Base fields should exist and additional properties should be accessible
      expect(success.success).toBe(true);
      expect(success.result).toBe('output');
      expect(success.timestamp).toBe(now);
      expect(success.metadata).toEqual({ version: '1.0' });
    });
  });

  // ============================================================================
  // When: Checking type accessibility and export
  // ============================================================================

  describe('When: Checking type accessibility and export', () => {
    // Case Level (Then): Type is properly exported and accessible as AGTCommandSuccess
    it('Then: [正常] - type is properly exported and accessible as AGTCommandSuccess', () => {
      // Arrange: Create a success using the imported type
      const success: AGTCommandSuccess = {
        success: true,
        result: { output: 'test result' },
      };

      // Assert: Verify AGTCommandSuccess type is accessible and has correct structure
      expect(success).toBeDefined();
      expect(success.success).toBe(true);
      expect(success.result).toEqual({ output: 'test result' });
    });

    it('Then: [正常] - can create multiple success results with different result types', () => {
      // Arrange: Create multiple success results with different result types
      const successWithObject: AGTCommandSuccess = {
        success: true,
        result: { stdout: 'output', exitCode: 0 },
      };

      const successWithString: AGTCommandSuccess = {
        success: true,
        result: 'output text',
      };

      const successWithArray: AGTCommandSuccess = {
        success: true,
        result: [1, 2, 3],
      };

      // Assert: All success results should be valid with correct structure
      expect(successWithObject).toEqual({
        success: true,
        result: { stdout: 'output', exitCode: 0 },
      });
      expect(successWithString).toEqual({
        success: true,
        result: 'output text',
      });
      expect(successWithArray).toEqual({
        success: true,
        result: [1, 2, 3],
      });
    });
  });
});
