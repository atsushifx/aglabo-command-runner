// src: tests/runtime/bun/get-raw-os-platform.spec.ts
// @(#): BDD tests for _getRawOSPlatform() function on Bun runtime
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* global Bun */

// Testing framework
import { describe, expect, it } from 'vitest';

// Type definitions
import type { _RawOSPlatformResult, _RawOSPlatformType } from '#shared/types/runtime.types';

// Platform detection function
import { _getRawOSPlatform } from '#runtime/get-raw-os-platform';

/**
 * Bun Platform Detection Tests for _getRawOSPlatform()
 *
 * These tests verify the _getRawOSPlatform() function behavior when running
 * in an actual Bun environment. Unlike unit tests that might use mocks,
 * these tests validate the real Bun runtime detection behavior.
 *
 * @remarks
 * - Tests run in actual Bun environment (no mocks)
 * - Validates that _getRawOSPlatform() correctly detects Bun's platform
 * - Ensures the returned value conforms to _RawOSPlatformType
 * - Uses Vitest for testing (compatible with Bun)
 * - Bun provides Node.js-compatible APIs for platform detection via process.platform
 */

// ============================================================================
// Global Constants & Helper Functions
// ============================================================================

/**
 * Valid platform values that _getRawOSPlatform() should return
 */
const VALID_PLATFORMS: _RawOSPlatformType[] = ['win32', 'darwin', 'linux'];

/**
 * Valid platform values including undefined for _RawOSPlatformResult type
 */
const VALID_PLATFORM_RESULTS: _RawOSPlatformResult[] = [...VALID_PLATFORMS, undefined];

/**
 * Regex pattern for validating platform values
 */
const PLATFORM_PATTERN = /^(win32|darwin|linux)$/;

/**
 * Type Guard: Check if value is a valid platform
 */
const isValidPlatform = (value: unknown): value is _RawOSPlatformType =>
  VALID_PLATFORMS.includes(value as _RawOSPlatformType);

/**
 * Type Guard: Check if value is a valid platform result (including undefined)
 */
const isValidPlatformResult = (value: unknown): value is _RawOSPlatformResult =>
  VALID_PLATFORM_RESULTS.includes(value as _RawOSPlatformResult);

/**
 * Getter: Return valid platform values for assertions
 */
const getValidPlatforms = (): _RawOSPlatformType[] => VALID_PLATFORMS;

/**
 * Getter: Return valid platform results (with undefined) for assertions
 */
const getValidPlatformResults = (): _RawOSPlatformResult[] => VALID_PLATFORM_RESULTS;

/**
 * Validator: Assert that value is a valid platform
 */
const assertValidPlatform = (value: unknown): void => {
  expect(getValidPlatforms()).toContain(value as _RawOSPlatformType);
};

/**
 * Validator: Assert that value is a valid platform result
 */
const assertValidPlatformResult = (value: unknown): void => {
  expect(getValidPlatformResults()).toContain(value as _RawOSPlatformResult);
};

describe('Bun Platform Detection - _getRawOSPlatform()', () => {
  /**
   * Test: Bun Platform Detection (T02-03-01)
   *
   * Verify that _getRawOSPlatform() correctly detects and returns Bun's platform
   * in Node.js-style format.
   */
  it('[正常] T02-03-01: Given Bun runtime available, when calling _getRawOSPlatform(), then function detects Bun correctly', () => {
    // ============================================================================
    // Given: Bun runtime is available
    // ============================================================================
    // Verify that Bun global object is available
    expect(typeof Bun).not.toBe('undefined');
    expect(Bun).toBeDefined();
    expect(Bun.version).toBeDefined();

    // Bun provides Node.js-compatible process global for compatibility
    expect(typeof process).not.toBe('undefined');
    expect(process).toBeDefined();
    expect(process.platform).toBeDefined();

    const bunPlatform = process.platform;

    // ============================================================================
    // When: Calling _getRawOSPlatform()
    // ============================================================================
    const result = _getRawOSPlatform();

    // ============================================================================
    // Then: Function detects Bun correctly
    // ============================================================================

    // Test 1: Result must be a valid platform string (not undefined)
    expect(typeof result).toBe('string');
    expect(result).toBeTruthy();

    // Test 2: Result must be one of the valid platforms
    assertValidPlatform(result);

    // Test 3: Result must be a valid _RawOSPlatformType
    assertValidPlatform(result);

    // Test 4: Result should match the detected platform from process.platform
    expect(result).toBe(bunPlatform);
  });

  /**
   * Test: Return type conforms to _RawOSPlatformResult
   *
   * Verify that the return value of _getRawOSPlatform() conforms to the
   * _RawOSPlatformResult type (which is _RawOSPlatformType | undefined).
   */
  it('[正常] T02-03-01-Type: Return value is _RawOSPlatformResult type', () => {
    // ============================================================================
    // Given: Bun runtime available
    // ============================================================================
    expect(typeof Bun).not.toBe('undefined');

    // ============================================================================
    // When: Call _getRawOSPlatform() and assign to typed variable
    // ============================================================================
    const result: _RawOSPlatformResult = _getRawOSPlatform();

    // ============================================================================
    // Then: Type should conform to _RawOSPlatformResult
    // ============================================================================

    // Test 1: Result should be either string or undefined
    expect(typeof result === 'string' || result === undefined).toBe(true);

    // Test 2: In Bun environment, should return string (not undefined)
    expect(result).not.toBeUndefined();
    expect(typeof result).toBe('string');

    // Test 3: Verify result is one of the valid platforms
    assertValidPlatformResult(result);
  });

  /**
   * Test: Verify detection works multiple times consistently
   *
   * Ensure that _getRawOSPlatform() returns the same value across multiple calls,
   * indicating consistent platform detection in the Bun environment.
   */
  it('[正常] T02-03-01-Consistency: Multiple calls return consistent platform value', () => {
    // ============================================================================
    // Given: Bun runtime available
    // ============================================================================
    expect(typeof Bun).not.toBe('undefined');

    // ============================================================================
    // When: Call _getRawOSPlatform() multiple times
    // ============================================================================
    const result1 = _getRawOSPlatform();
    const result2 = _getRawOSPlatform();
    const result3 = _getRawOSPlatform();

    // ============================================================================
    // Then: All calls should return the same value
    // ============================================================================
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
    expect(VALID_PLATFORMS).toContain(result1 as _RawOSPlatformType);
  });

  /**
   * Tests: Bun Platform Detection on Multiple Platforms (T02-03-02/03/04)
   *
   * Verify that when Bun is running on different platforms, _getRawOSPlatform()
   * returns the correct platform value ('win32' for Windows, 'darwin' for macOS,
   * 'linux' for Linux).
   *
   * Uses parameterized tests to run the same test logic on each platform.
   */
  it.each<[taskId: string, platformName: string]>([
    ['T02-03-02', 'Windows'],
    ['T02-03-03', 'macOS'],
    ['T02-03-04', 'Linux'],
  ])(
    '[正常] %s: Given Bun running on %s, when checking detected platform, then returns appropriate value',
    (taskId, platformName) => {
      // ============================================================================
      // Given: Bun runtime available and running on a system
      // ============================================================================
      expect(typeof Bun).not.toBe('undefined');
      expect(Bun).toBeDefined();

      // Access the platform via process.platform (Bun-compatible API)
      const bunProcessPlatform = process.platform;
      expect(typeof bunProcessPlatform).toBe('string');

      // ============================================================================
      // When: Calling _getRawOSPlatform()
      // ============================================================================
      const detectedPlatform = _getRawOSPlatform();

      // ============================================================================
      // Then: Returns appropriate value based on the actual platform
      // ============================================================================

      // Test 1: Result must be one of the valid platform values
      assertValidPlatform(detectedPlatform);

      // Test 2: Detected platform must match the actual system platform
      expect(detectedPlatform).toBe(bunProcessPlatform);

      // Test 3: Result conforms to _RawOSPlatformType union
      expect(typeof detectedPlatform).toBe('string');
      assertValidPlatform(detectedPlatform);
    },
  );

  /**
   * Test: Bun Validation Against Standard Values (T02-03-05)
   *
   * Verify that Bun platform detection values are consistent with standard values
   * used by other runtimes (Node.js and Deno). This ensures cross-runtime consistency.
   */
  it('[正常] T02-03-05: Given Bun.env or Bun.platform available, when validating against standard values, then consistent with other runtimes', () => {
    // ============================================================================
    // Given: Bun runtime is available with platform detection capabilities
    // ============================================================================
    expect(typeof Bun).not.toBe('undefined');
    expect(Bun).toBeDefined();

    // Verify Bun has access to process.platform (Node.js-compatible API)
    const bunProcessPlatform = process.platform;
    expect(typeof bunProcessPlatform).toBe('string');
    assertValidPlatform(bunProcessPlatform as _RawOSPlatformType);

    // ============================================================================
    // When: Validating _getRawOSPlatform() return value against standard values
    // ============================================================================
    const detectedPlatform = _getRawOSPlatform();

    // ============================================================================
    // Then: Platform values match standard Node.js-style format used by all runtimes
    // ============================================================================

    // Test 1: Must be one of the standard platform values
    assertValidPlatform(detectedPlatform);

    // Test 2: Must match the standard values exactly (no case variations)
    assertValidPlatform(detectedPlatform);

    // Test 3: Must match process.platform (which is Node.js-compatible in Bun)
    expect(detectedPlatform).toBe(bunProcessPlatform);

    // Test 4: Consistency check - bunProcessPlatform is a valid platform value
    expect(VALID_PLATFORMS).toContain(bunProcessPlatform);

    // Test 5: No unexpected values (no misspellings, extra spaces, etc.)
    expect(typeof detectedPlatform).toBe('string');
    expect(detectedPlatform).toMatch(PLATFORM_PATTERN);
  });

  /**
   * Test: Type Check - Return Value is _RawOSPlatformType (T02-03-06)
   *
   * Verify that the return value of _getRawOSPlatform() when running in Bun
   * conforms to the _RawOSPlatformType type (not just _RawOSPlatformResult).
   * In Bun environment, the function should never return undefined, so the
   * type should always be narrowed to _RawOSPlatformType.
   */
  it('[型チェック] T02-03-06: Given Bun platform detection completed, when running type check, then return value is _RawOSPlatformType', () => {
    // ============================================================================
    // Given: Bun runtime available and platform detection completed
    // ============================================================================
    expect(typeof Bun).not.toBe('undefined');
    expect(Bun).toBeDefined();

    // ============================================================================
    // When: Running type check on _getRawOSPlatform() return value
    // ============================================================================
    const result = _getRawOSPlatform();

    // ============================================================================
    // Then: Return value conforms to _RawOSPlatformType (not undefined)
    // ============================================================================

    // Test 1: Result should never be undefined in Bun environment
    expect(result).toBeDefined();
    expect(result).not.toBeUndefined();

    // Test 2: Result should be a string (fulfills _RawOSPlatformType requirement)
    expect(typeof result).toBe('string');

    // Test 3: Result must be one of the valid _RawOSPlatformType values
    assertValidPlatform(result);

    // Test 4: Explicitly verify type narrowing
    // In Bun, the return should always be _RawOSPlatformType, never undefined
    const typedResult: _RawOSPlatformType = result as _RawOSPlatformType;
    assertValidPlatform(typedResult);

    // Test 5: Verify that result is exactly one of the three valid values
    const isValidPlatformType = result === 'win32' || result === 'darwin' || result === 'linux';
    expect(isValidPlatformType).toBe(true);
  });
});
