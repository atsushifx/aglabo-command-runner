// src: tests/runtime/deno/get-raw-os-platform.spec.ts
// @(#): BDD tests for _getRawOSPlatform() function on Deno runtime
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Deno standard assertions
import { assertEquals, assertExists } from '@std/assert';

// Type definitions
import type { _RawOSPlatformResult, _RawOSPlatformType } from '#shared/types/runtime.types';

// Platform detection function
import { _getRawOSPlatform } from '#runtime/get-raw-os-platform.ts';

/**
 * Deno Platform Detection Tests for _getRawOSPlatform()
 *
 * These tests verify the _getRawOSPlatform() function behavior when running
 * in an actual Deno environment. Unlike unit tests that might use mocks,
 * these tests validate the real Deno runtime detection behavior.
 *
 * @remarks
 * - Tests run in actual Deno environment (no mocks)
 * - Validates that _getRawOSPlatform() correctly detects Deno's platform
 * - Ensures the returned value conforms to _RawOSPlatformType
 * - Uses Deno.test for Deno-native testing
 * - Verifies correct mapping from Deno.build.os to Node.js-style platform values
 */

// ============================================================================
// Global Constants
// ============================================================================

/**
 * Mapping from Deno.build.os to Node.js-style platform values
 */
const PLATFORM_MAPPING: Record<string, _RawOSPlatformType> = {
  'windows': 'win32',
  'darwin': 'darwin',
  'linux': 'linux',
} as const;

/**
 * Test: Deno Platform Detection (T02-02-01)
 *
 * Verify that _getRawOSPlatform() correctly detects and maps Deno platform
 * to Node.js-style platform values.
 */
Deno.test('[正常] T02-02-01: Given Deno runtime available, when calling _getRawOSPlatform(), then function detects Deno correctly', () => {
  // ============================================================================
  // Given: Deno runtime is available
  // ============================================================================
  assertExists(Deno);
  assertExists(Deno.build);

  const denoOs = Deno.build.os;

  // ============================================================================
  // When: Calling _getRawOSPlatform()
  // ============================================================================
  const result = _getRawOSPlatform();

  // ============================================================================
  // Then: Function detects Deno correctly
  // ============================================================================

  // Test 1: Result must be a valid platform string (not undefined)
  assertEquals(
    typeof result === 'string',
    true,
    `Platform detection in Deno should return string, got ${typeof result}`,
  );

  // Test 2: Result must be one of the valid platforms
  const validPlatforms: _RawOSPlatformType[] = Object.values(PLATFORM_MAPPING);
  assertEquals(
    validPlatforms.includes(result as _RawOSPlatformType),
    true,
    `Result must be one of ${validPlatforms.join(', ')}, got '${result}'`,
  );

  // Test 3: Result must correctly map from Deno.build.os
  const expectedPlatform = PLATFORM_MAPPING[denoOs];
  assertEquals(
    result,
    expectedPlatform,
    `Deno.build.os='${denoOs}' should map to '${expectedPlatform}', got '${result}'`,
  );

  // Test 4: Verify Deno.build.os is one of the expected values
  assertEquals(
    Object.keys(PLATFORM_MAPPING).includes(denoOs),
    true,
    `Deno.build.os should be one of [${Object.keys(PLATFORM_MAPPING).join(', ')}], got '${denoOs}'`,
  );
});

/**
 * Test: Return type conforms to _RawOSPlatformResult
 */
Deno.test('[正常] T02-02-01-Type: Return value is _RawOSPlatformResult type', () => {
  // Given: Deno runtime available
  assertExists(Deno);

  // When: Call _getRawOSPlatform() and assign to typed variable
  const result: _RawOSPlatformResult = _getRawOSPlatform();

  // Then: Type should conform to _RawOSPlatformResult
  assertEquals(
    result === undefined || typeof result === 'string',
    true,
    'Result should be string or undefined',
  );

  // Additional validation: In Deno environment, should return string (not undefined)
  assertEquals(
    result !== undefined,
    true,
    'In Deno environment, platform detection should return a string value',
  );

  // Verify result is one of the valid platforms
  const validPlatforms: _RawOSPlatformResult[] = ['win32', 'darwin', 'linux', undefined];
  assertEquals(validPlatforms.includes(result), true, 'Result must be valid platform or undefined');
});

/**
 * Test: Deno platform detection for each supported OS (T02-02-02 ~ T02-02-04)
 *
 * Verify that _getRawOSPlatform() correctly returns the expected Node.js-style
 * platform value for each supported OS (Windows, macOS, Linux).
 */
const platformTests = [
  { os: 'windows' as const, expected: 'win32', taskId: 'T02-02-02' },
  { os: 'darwin' as const, expected: 'darwin', taskId: 'T02-02-03' },
  { os: 'linux' as const, expected: 'linux', taskId: 'T02-02-04' },
];

platformTests.forEach(({ os, expected, taskId }) => {
  Deno.test(`[正常] ${taskId}: Given Deno running on ${os}, when checking detected platform, then returns "${expected}"`, () => {
    // ============================================================================
    // Given: Deno runtime is available
    // ============================================================================
    assertExists(Deno);

    // Skip test if not running on the target platform
    if (Deno.build.os !== os) {
      console.warn(
        `Skipping ${taskId}: Test expects ${os} platform, but Deno.build.os='${Deno.build.os}'`,
      );
      return;
    }

    // ============================================================================
    // When: Calling _getRawOSPlatform()
    // ============================================================================
    const result = _getRawOSPlatform();

    // ============================================================================
    // Then: Function returns the expected platform value
    // ============================================================================
    assertEquals(
      result,
      expected,
      `Expected '${expected}' on ${os}, but got '${result}'`,
    );
  });
});

/**
 * Test: Type safety - Return value conforms to _RawOSPlatformType (T02-02-05)
 *
 * Verify that the return value of _getRawOSPlatform() conforms to _RawOSPlatformType.
 * This validates both compile-time type safety and runtime correctness.
 */
Deno.test('[正常] T02-02-05: Given Deno platform detection completed, when running type check, then return value is _RawOSPlatformType', () => {
  // ============================================================================
  // Given: Deno runtime is available
  // ============================================================================
  assertExists(Deno);

  // ============================================================================
  // When: Calling _getRawOSPlatform() and validating type
  // ============================================================================
  // Type assignment at compile-time validates that return type matches _RawOSPlatformType
  const result: _RawOSPlatformType = _getRawOSPlatform() as _RawOSPlatformType;

  // ============================================================================
  // Then: Return value is _RawOSPlatformType (valid enum value)
  // ============================================================================
  const validPlatforms: _RawOSPlatformType[] = ['win32', 'darwin', 'linux'];
  assertEquals(
    validPlatforms.includes(result),
    true,
    `Platform must be one of: ${validPlatforms.join(', ')}, got '${result}'`,
  );
});
