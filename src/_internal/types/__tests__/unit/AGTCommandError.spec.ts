// src: src/_internal/types/__tests__/unit/AGTCommandError.spec.ts
// @(#) : Unit tests for AGTCommandError type
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { describe, expect, it } from 'vitest';

// type definitions
import type { AGTCommandError } from '#shared/types/command-result.types';
import { AGTCommandErrorType as AGTCommandErrorTypeEnum } from '#shared/types/command-result.types';

// ============================================================================
// Given: AGTCommandError type is defined
// ============================================================================

describe('Given: AGTCommandError type is defined', () => {
  // ============================================================================
  // When: Defining AGTCommandError type object
  // ============================================================================

  describe('When: Defining AGTCommandError type object', () => {
    // Case Level (Then): Type object created
    it('Then: [正常] - type object created', () => {
      // Arrange: Create a test object matching AGTCommandError
      const errorObj: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Test error message',
      };

      // Assert: Verify type object is valid
      expect(errorObj).toBeDefined();
      expect(errorObj).toEqual({
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Test error message',
      });
    });
  });

  // ============================================================================
  // When: Checking normal type fields
  // ============================================================================

  describe('When: Checking normal type fields', () => {
    // Case Level (Then): Includes type and message fields, both required
    it('Then: [正常] - includes type field with AGTCommandErrorType', () => {
      // Arrange: Create an error object
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.TypeErrors,
        message: 'A type error occurred',
      };

      // Act: Verify type field exists and is correct
      const hasTypeField = 'type' in error;
      const typeValue = error.type;

      // Assert: Verify type field is present and correct type
      expect(hasTypeField).toBe(true);
      expect(typeValue).toBe(AGTCommandErrorTypeEnum.TypeErrors);
      expect(['TypeErrors', 'RuntimeErrors', 'ValidationErrors']).toContain(typeValue);
    });

    it('Then: [正常] - includes message field with string type', () => {
      // Arrange: Create an error object
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.ValidationErrors,
        message: 'Validation failed',
      };

      // Act: Verify message field exists and is string
      const hasMessageField = 'message' in error;
      const messageValue = error.message;

      // Assert: Verify message field is present and is string
      expect(hasMessageField).toBe(true);
      expect(typeof messageValue).toBe('string');
      expect(messageValue).toBe('Validation failed');
    });

    it('Then: [正常] - both type and message fields are required', () => {
      // Arrange: Both fields must be present
      const validError: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Error message',
      };

      // Assert: Verify both required fields are present and have correct types
      expect(validError.type).toBe(AGTCommandErrorTypeEnum.RuntimeErrors);
      expect(validError.message).toBe('Error message');
    });
  });

  // ============================================================================
  // When: Checking invalid type fields
  // ============================================================================

  describe('When: Checking invalid type fields', () => {
    // Case Level (Then): No extra required fields (code, stack), correct types
    it('Then: [異常] - type field is AGTCommandErrorType (not other types)', () => {
      // Arrange: Create a test error
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Test error',
      };

      // Act: Verify type field is correct type
      const isEnumValue = Object.values(AGTCommandErrorTypeEnum)
        .filter((v) => typeof v === 'string')
        .includes(error.type);

      // Assert: Verify type is AGTCommandErrorType, not other types
      expect(isEnumValue).toBe(true);
      expect(typeof error.type).toBe('string');
      // Type should not be number, boolean, or other values
      expect(error.type).not.toBe(123 as unknown);
      expect(error.type).not.toBe(true as unknown);
    });

    it('Then: [異常] - message field is string (not number, boolean, etc)', () => {
      // Arrange: Create a test error
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.TypeErrors,
        message: 'String message',
      };

      // Act: Verify message is string type
      const isString = typeof error.message === 'string';

      // Assert: Verify message is string
      expect(isString).toBe(true);
      // Message should not be number or boolean
      expect(typeof error.message).not.toBe('number');
      expect(typeof error.message).not.toBe('boolean');
    });

    it('Then: [異常] - no extra required fields like code, stack', () => {
      // Arrange: Create an error object with only required fields
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Error occurred',
      };

      // Act: Check that code and stack are not required fields
      // If they were required, TypeScript would error
      const errorObj = error as Record<string, unknown>;
      const hasCode = 'code' in errorObj;
      const hasStack = 'stack' in errorObj;

      // Assert: These fields should not be in a minimal error object
      expect(hasCode).toBe(false);
      expect(hasStack).toBe(false);
    });
  });

  // ============================================================================
  // When: Checking edge cases for type fields
  // ============================================================================

  describe('When: Checking edge cases for type fields', () => {
    // Case Level (Then): No optional required fields, field order doesn't matter, allows additional properties
    it('Then: [エッジケース] - no optional required fields, all fields are mandatory', () => {
      // Arrange: Try to create error with minimal fields
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.ValidationErrors,
        message: 'Required fields present',
      };

      // Assert: Verify both required fields are present with correct values
      expect(error.type).toBe(AGTCommandErrorTypeEnum.ValidationErrors);
      expect(error.message).toBe('Required fields present');
    });

    it('Then: [エッジケース] - field order does not matter for type compatibility', () => {
      // Arrange: Create errors with different field order (logically)
      const error1: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Error 1',
      };

      const error2: AGTCommandError = {
        message: 'Error 2',
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
      };

      // Assert: Both objects are valid and have the same structure
      expect(error1).toEqual({
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Error 1',
      });
      expect(error2).toEqual({
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Error 2',
      });
    });

    it('Then: [エッジケース] - allows additional properties via index signature', () => {
      // Arrange: Create error with additional properties (should be allowed via index signature)
      const now = Date.now();
      const error: AGTCommandError & { [key: string]: unknown } = {
        type: AGTCommandErrorTypeEnum.TypeErrors,
        message: 'Error with extra properties',
        customField: 'extra data',
        timestamp: now,
      };

      // Assert: Base fields should exist and additional properties should be accessible
      expect(error.type).toBe(AGTCommandErrorTypeEnum.TypeErrors);
      expect(error.message).toBe('Error with extra properties');
      expect(error.customField).toBe('extra data');
      expect(error.timestamp).toBe(now);
    });
  });

  // ============================================================================
  // When: Checking type accessibility and export
  // ============================================================================

  describe('When: Checking type accessibility and export', () => {
    // Case Level (Then): Type is properly exported and accessible as AGTCommandError
    it('Then: [正常] - type is properly exported and accessible as AGTCommandError', () => {
      // Arrange: Create an error using the imported type
      const error: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Exported type test',
      };

      // Act: Verify the type can be used in type annotations
      const isAccessible = error.type === AGTCommandErrorTypeEnum.RuntimeErrors && typeof error.message === 'string';

      // Assert: Verify AGTCommandError type is accessible
      expect(isAccessible).toBe(true);
      expect(error).toBeDefined();
      expect(error.type).toBeDefined();
      expect(error.message).toBeDefined();
    });

    it('Then: [正常] - can create multiple errors with different error types', () => {
      // Arrange: Create multiple errors with different types
      const typeError: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.TypeErrors,
        message: 'Type error message',
      };

      const runtimeError: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.RuntimeErrors,
        message: 'Runtime error message',
      };

      const validationError: AGTCommandError = {
        type: AGTCommandErrorTypeEnum.ValidationErrors,
        message: 'Validation error message',
      };

      // Assert: All errors should have correct types and messages
      expect(typeError.type).toBe(AGTCommandErrorTypeEnum.TypeErrors);
      expect(typeError.message).toBe('Type error message');
      expect(runtimeError.type).toBe(AGTCommandErrorTypeEnum.RuntimeErrors);
      expect(runtimeError.message).toBe('Runtime error message');
      expect(validationError.type).toBe(AGTCommandErrorTypeEnum.ValidationErrors);
      expect(validationError.message).toBe('Validation error message');
    });
  });
});
