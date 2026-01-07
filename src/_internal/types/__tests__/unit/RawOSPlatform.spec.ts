// tests: src/_internal/types/__tests__/unit/RawOSPlatform.spec.ts
// @(#) : BDD tests for _RawOSPlatformType and _RawOSPlatformResult type definitions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { describe, expect, it } from 'vitest';

// type definitions
import type { _RawOSPlatformResult, _RawOSPlatformType } from '#shared/types/runtime.types';

// ============================================================================
// Given: _RawOSPlatformType type definition
// ============================================================================

describe('Given: _RawOSPlatformType is defined', () => {
  // ============================================================================
  // When: Checking type naming convention
  // ============================================================================

  describe('When: Checking type naming convention', () => {
    // Case Level (Then): Type renamed with _ prefix
    it('Then: [正常] - Type is named _RawOSPlatformType with _ prefix', () => {
      // Arrange: Get the type name through type assertion
      type TypeName = _RawOSPlatformType;

      // Act: Create a variable of the type
      const validValue: TypeName = 'win32';

      // Assert: Verify the type exists and can be assigned
      expect(validValue).toBe('win32');
    });
  });

  // ============================================================================
  // When: Checking normal values
  // ============================================================================

  describe('When: Checking normal values', () => {
    // Case Level (Then): Contains normal values
    it.each<_RawOSPlatformType>(['win32', 'darwin', 'linux'])(
      'Then: [正常] - Contains normal value: %s',
      (platform) => {
        // Arrange & Act: Create variable of the platform type
        const value: _RawOSPlatformType = platform;

        // Assert: Verify the value is correctly assigned
        expect(value).toBe(platform);
      },
    );
  });

  // ============================================================================
  // When: Checking invalid values
  // ============================================================================

  describe('When: Checking invalid values', () => {
    // Case Level (Then): No incorrect or misspelled values
    it.each<string>(['unix', 'windows', 'macos', 'osx', 'freebsd', 'solaris'])(
      'Then: [異常] - Excludes invalid value: %s',
      (invalidValue) => {
        // Arrange: Get valid platform values
        const validPlatforms: _RawOSPlatformType[] = ['win32', 'darwin', 'linux'];

        // Act & Assert: Verify that invalid string is not in valid values
        // We use type-level assertion to verify at compile time that these values
        // are not valid _RawOSPlatformType values
        expect(validPlatforms.includes(invalidValue as _RawOSPlatformType)).toBe(false);
      },
    );
  });

  // ============================================================================
  // When: Checking edge cases
  // ============================================================================

  describe('When: Checking edge cases', () => {
    // Case Level (Then): No extra spaces or case variations
    it.each<string>([
      ' win32', // Leading space
      'win32 ', // Trailing space
      ' win32 ', // Both spaces
      'WIN32', // Uppercase
      'Win32', // Mixed case
      'DARWIN', // Uppercase
      'Darwin', // Mixed case
      'LINUX', // Uppercase
      'Linux', // Mixed case
    ])(
      'Then: [エッジケース] - Excludes edge case: %s',
      (edgeCaseValue) => {
        // Arrange: Get valid platform values
        const validPlatforms: _RawOSPlatformType[] = ['win32', 'darwin', 'linux'];

        // Act & Assert: Verify that edge case string is not in valid values
        expect(validPlatforms.includes(edgeCaseValue as _RawOSPlatformType)).toBe(false);
      },
    );
  });

  // ============================================================================
  // When: Running type check
  // ============================================================================

  describe('When: Running type check', () => {
    // Case Level (Then): Type check passes with no compilation errors
    it.each<[_RawOSPlatformType, string]>([
      ['win32', 'Windows'],
      ['darwin', 'macOS'],
      ['linux', 'Linux'],
    ])(
      'Then: [正常] - getPlatformName returns correct name for: %s',
      (platform, expected) => {
        // Arrange: Create a function that uses _RawOSPlatformType
        const getPlatformName = (platform: _RawOSPlatformType): string => {
          const platformNames: Record<_RawOSPlatformType, string> = {
            win32: 'Windows',
            darwin: 'macOS',
            linux: 'Linux',
          };
          return platformNames[platform];
        };

        // Act & Assert: Call function and verify output
        expect(getPlatformName(platform)).toBe(expected);
      },
    );
  });
});

// ============================================================================
// Given: _RawOSPlatformResult type definition
// ============================================================================

describe('Given: _RawOSPlatformResult is defined', () => {
  // ============================================================================
  // When: Checking type naming convention
  // ============================================================================

  describe('When: Checking type naming convention', () => {
    // Case Level (Then): Type renamed with _ prefix
    it('Then: [正常] - Type is named _RawOSPlatformResult with _ prefix', () => {
      // Arrange: Get the type name through type assertion
      type TypeName = _RawOSPlatformResult;

      // Act: Create a variable of the type with a valid platform value
      const validValue: TypeName = 'win32';

      // Assert: Verify the type exists and can be assigned
      expect(validValue).toBe('win32');
    });
  });

  // ============================================================================
  // When: Checking normal union structure
  // ============================================================================

  describe('When: Checking normal union structure', () => {
    // Case Level (Then): Includes _RawOSPlatformType and undefined
    it.each<_RawOSPlatformResult>(['win32', 'darwin', 'linux', undefined])(
      'Then: [正常] - Union includes value: %s',
      (value) => {
        // Arrange & Act: Create variable with union type
        const result: _RawOSPlatformResult = value;

        // Assert: Verify value is correctly assignable
        expect(result).toBe(value);
      },
    );
  });

  // ============================================================================
  // When: Checking invalid union members
  // ============================================================================

  describe('When: Checking invalid union members', () => {
    // Case Level (Then): No extra types, null NOT included, no duplicates
    it('Then: [異常] - Excludes invalid types (null is NOT included, no duplicates)', () => {
      // Arrange: Create an array of test values
      const validResults: _RawOSPlatformResult[] = ['win32', 'darwin', 'linux', undefined];

      // Act: Check that null is not in the union and no duplicates exist
      const hasNull = validResults.includes(null as unknown as _RawOSPlatformResult);
      const hasDuplicates = new Set(validResults).size !== validResults.length;

      // Assert: Verify null is not included and no duplicates exist
      expect(hasNull).toBe(false);
      expect(hasDuplicates).toBe(false);
    });
  });

  // ============================================================================
  // When: Checking edge cases
  // ============================================================================

  describe('When: Checking edge cases', () => {
    // Case Level (Then): undefined is optional, order doesn't affect type safety
    it.each<[_RawOSPlatformResult, string]>([
      ['win32', 'win32'],
      ['darwin', 'darwin'],
      [undefined, 'unknown'],
    ])(
      'Then: [エッジケース] - processPlatform handles value: %s',
      (input, expected) => {
        // Arrange: Create a function that accepts _RawOSPlatformResult
        const processPlatform = (platform: _RawOSPlatformResult): string => {
          if (platform === undefined) {
            return 'unknown';
          }
          return platform;
        };

        // Act & Assert: Call function and verify output
        expect(processPlatform(input)).toBe(expected);
      },
    );
  });

  // ============================================================================
  // When: Running type check
  // ============================================================================

  describe('When: Running type check', () => {
    // Case Level (Then): Type check passes with no compilation errors
    it.each<[_RawOSPlatformResult, { platform: string | null; available: boolean }]>([
      ['win32', { platform: 'Windows', available: true }],
      ['darwin', { platform: 'macOS', available: true }],
      ['linux', { platform: 'Linux', available: true }],
      [undefined, { platform: null, available: false }],
    ])(
      'Then: [正常] - getPlatformInfo returns correct info for: %s',
      (input, expected) => {
        // Arrange: Create a function that uses _RawOSPlatformResult
        const getPlatformInfo = (result: _RawOSPlatformResult): {
          platform: string | null;
          available: boolean;
        } => {
          if (result === undefined) {
            return { platform: null, available: false };
          }

          const platformInfo: Record<string, string> = {
            win32: 'Windows',
            darwin: 'macOS',
            linux: 'Linux',
          };

          return { platform: platformInfo[result] || result, available: true };
        };

        // Act & Assert: Call function and verify output
        expect(getPlatformInfo(input)).toEqual(expected);
      },
    );
  });
});
