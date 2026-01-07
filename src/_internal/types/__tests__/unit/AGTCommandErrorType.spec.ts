// src: src/_internal/types/__tests__/unit/AGTCommandErrorType.spec.ts
// @(#) : Unit tests for AGTCommandErrorType enum
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { describe, expect, it } from 'vitest';

// type definitions
import type { AGTCommandErrorType as AGTCommandErrorTypeEnum } from '#shared/types/command-result.types';
import { AGTCommandErrorType } from '#shared/types/command-result.types';

// ============================================================================
// Given: AGTCommandErrorType enum is defined
// ============================================================================

describe('Given: AGTCommandErrorType enum is defined', () => {
  // ============================================================================
  // When: Creating command-result.types.ts with AGTCommandErrorType
  // ============================================================================

  describe('When: Creating command-result.types.ts with AGTCommandErrorType', () => {
    // Case Level (Then): Public enum created
    it('Then: [正常] - public enum created', () => {
      // Assert: Verify enum is defined and is an object
      expect(AGTCommandErrorType).toBeDefined();
      expect(typeof AGTCommandErrorType).toBe('object');
      expect(AGTCommandErrorType).not.toBeNull();
    });
  });

  // ============================================================================
  // When: Checking normal enum values
  // ============================================================================

  describe('When: Checking normal enum values', () => {
    // Case Level (Then): Includes TypeErrors, RuntimeErrors, ValidationErrors
    it.each<[keyof typeof AGTCommandErrorType, string]>([
      ['TypeErrors', 'TypeErrors'],
      ['RuntimeErrors', 'RuntimeErrors'],
      ['ValidationErrors', 'ValidationErrors'],
    ])('Then: [正常] - includes normal value: %s = %s', (key, expectedValue) => {
      // Arrange: Get enum member
      const value = AGTCommandErrorType[key];

      // Act: Verify value
      const isCorrect = value === expectedValue;

      // Assert: Verify the enum member has correct value
      expect(isCorrect).toBe(true);
      expect(value).toBe(expectedValue);
    });
  });

  // ============================================================================
  // When: Checking invalid values
  // ============================================================================

  describe('When: Checking invalid values', () => {
    // Case Level (Then): No extra or misspelled values (singular forms excluded)
    it.each<string>([
      'TypeError',
      'RuntimeError',
      'ValidationError',
      'typeErrors',
      'runtimeErrors',
      'validationErrors',
    ])(
      'Then: [異常] - excludes invalid value: %s',
      (invalidKey) => {
        // Arrange: Check if invalid key exists
        const keyExists = invalidKey in AGTCommandErrorType;

        // Act: Verify the key is not in enum
        const isNotPresent = !keyExists;

        // Assert: Verify invalid values are not present
        expect(isNotPresent).toBe(true);
        expect((AGTCommandErrorType as Record<string, unknown>)[invalidKey]).toBeUndefined();
      },
    );
  });

  // ============================================================================
  // When: Checking edge cases
  // ============================================================================

  describe('When: Checking edge cases', () => {
    // Case Level (Then): No duplicate values, correct casing, no extra spaces
    it('Then: [エッジケース] - no duplicate values, correct casing, no extra spaces', () => {
      // Arrange: Get all enum string values (TypeScript enums have both numeric and string keys)
      const allValues = Object.values(AGTCommandErrorType);
      const stringValues = allValues.filter((value) => typeof value === 'string') as string[];

      // Act: Check for duplicates among string values
      const uniqueValues = new Set(stringValues);
      const hasDuplicates = uniqueValues.size !== stringValues.length;

      // Assert: Verify no duplicates
      expect(hasDuplicates).toBe(false);

      // Assert: Verify exactly 3 enum members (string values only)
      expect(stringValues.length).toBe(3);

      // Assert: Verify no extra spaces in any value
      stringValues.forEach((value) => {
        expect(value).not.toMatch(/^\s/); // No leading space
        expect(value).not.toMatch(/\s$/); // No trailing space
        expect(value).not.toMatch(/\s{2,}/); // No multiple consecutive spaces
      });

      // Assert: Verify correct casing (PascalCase with plural form)
      expect(stringValues).toContain('TypeErrors');
      expect(stringValues).toContain('RuntimeErrors');
      expect(stringValues).toContain('ValidationErrors');
    });
  });

  // ============================================================================
  // When: Checking type accessibility and export
  // ============================================================================

  describe('When: Checking type accessibility and export', () => {
    // Case Level (Then): Enum is properly exported and accessible
    it('Then: [正常] - enum is properly exported and accessible as AGTCommandErrorType', () => {
      // Arrange: Create a variable with enum type
      const errorType: AGTCommandErrorTypeEnum = AGTCommandErrorType.TypeErrors;

      // Assert: Verify type is accessible and has correct value
      expect(errorType).toBe('TypeErrors');

      // Assert: Verify all enum values are strings
      Object.values(AGTCommandErrorType).forEach((value) => {
        if (typeof value === 'string') {
          expect(['TypeErrors', 'RuntimeErrors', 'ValidationErrors']).toContain(value);
        }
      });
    });
  });
});
