// src: src/runtime/__tests__/runtime/bun/detectRuntime.spec.ts
// @(#): Runtime tests for Bun environment
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Testing framework
import { describe, expect, it } from 'vitest';

// Type definitions
import { AGRuntimeType } from '#shared/types/runtime.types.ts';

// Runtime detection function
import { detectRuntime } from '#runtime/detectRuntime.ts';

/**
 * Bun Runtime Detection Tests
 *
 * These tests verify runtime detection when running in an actual Bun environment.
 * Unlike unit tests that use mocks, these tests validate the real runtime behavior.
 *
 * @remarks
 * - Tests run in actual Bun environment (no mocks)
 * - Validates that detectRuntime() correctly identifies Bun
 * - Ensures the returned value is the string 'bun'
 */
describe('Runtime Detection in Bun Environment', () => {
  /**
   * Test: Verify that detectRuntime() returns 'bun' when running in Bun
   *
   * @remarks
   * This test runs in the actual Bun runtime environment.
   * It verifies that the runtime detection correctly identifies Bun
   * and returns the AGRuntimeType.Bun enum value (which is 'bun').
   */
  it('[正常]should detect Bun runtime and return "bun"', () => {
    // Given: Running in actual Bun environment
    // When: Call detectRuntime()
    const result = detectRuntime();

    // Then: Should return 'bun' (AGRuntimeType.Bun)
    expect(result).toBe(AGRuntimeType.Bun);
    expect(result).toBe('bun');
  });

  /**
   * Test: Verify that the result is exactly the string 'bun'
   *
   * @remarks
   * This test explicitly checks that the returned value is
   * the string 'bun', not undefined or any other value.
   */
  it('[正常]should return the string "bun" as the runtime type', () => {
    // Given: Running in actual Bun environment
    // When: Call detectRuntime()
    const result = detectRuntime();

    // Then: Should be exactly the string 'bun'
    expect(result).toBeTypeOf('string');
    expect(result).toBe('bun');
  });

  /**
   * Test: Verify that Bun global is available
   *
   * @remarks
   * This test confirms that the Bun-specific global object
   * is available and has the expected version property.
   */
  it('[正常]should have access to Bun global object', () => {
    // Given: Running in actual Bun environment
    // When: Access Bun.version
    const bunVersion = Bun.version;

    // Then: Should be defined and non-empty
    expect(bunVersion).toBeDefined();
    expect(bunVersion).toBeTruthy();
    expect(typeof bunVersion).toBe('string');
  });

  /**
   * Test: Verify that Bun is detected even when process global exists
   *
   * @remarks
   * Bun provides a Node.js-compatible process global for compatibility.
   * This test verifies that detectRuntime() correctly identifies Bun
   * even when process global is available.
   */
  it('[正常]should detect Bun even when process global exists', () => {
    // Given: Running in actual Bun environment (which has process global for Node.js compatibility)
    // When: Call detectRuntime()
    const result = detectRuntime();

    // Then: Should still return 'bun', not 'node'
    expect(result).toBe(AGRuntimeType.Bun);
    expect(result).toBe('bun');
  });
});
