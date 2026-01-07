// src: tests/runtime/deno/detect-runtime.spec.ts
// @(#): Runtime tests for Deno environment
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Deno standard assertions
import { assertEquals, assertExists } from '@std/assert';

// Type definitions
import { AGRuntimeType } from '#shared/types/runtime.types.ts';

// Runtime detection function
import { detectRuntime } from '#runtime/detect-runtime.ts';

/**
 * Deno Runtime Detection Tests
 *
 * These tests verify runtime detection when running in an actual Deno environment.
 * Unlike unit tests that use mocks, these tests validate the real runtime behavior.
 *
 * @remarks
 * - Tests run in actual Deno environment (no mocks)
 * - Validates that detectRuntime() correctly identifies Deno
 * - Ensures the returned value is the string 'deno'
 * - Uses Deno.test instead of Vitest for Deno-native testing
 */

/**
 * Test: Verify that detectRuntime() returns 'deno' when running in Deno
 *
 * @remarks
 * This test runs in the actual Deno runtime environment.
 * It verifies that the runtime detection correctly identifies Deno
 * and returns the AGRuntimeType.Deno enum value (which is 'deno').
 */
Deno.test('[正常]should detect Deno runtime and return "deno"', () => {
  // Given: Running in actual Deno environment
  // When: Call detectRuntime()
  const result = detectRuntime();

  // Then: Should return 'deno' (AGRuntimeType.Deno)
  assertEquals(result, AGRuntimeType.Deno);
  assertEquals(result, 'deno');
});

/**
 * Test: Verify that the result is exactly the string 'deno'
 *
 * @remarks
 * This test explicitly checks that the returned value is
 * the string 'deno', not undefined or any other value.
 */
Deno.test('[正常]should return the string "deno" as the runtime type', () => {
  // Given: Running in actual Deno environment
  // When: Call detectRuntime()
  const result = detectRuntime();

  // Then: Should be exactly the string 'deno'
  assertEquals(typeof result, 'string');
  assertEquals(result, 'deno');
});

/**
 * Test: Verify that Deno global is available
 *
 * @remarks
 * This test confirms that the Deno-specific global object
 * is available and has the expected version property.
 */
Deno.test('[正常]should have access to Deno global object', () => {
  // Given: Running in actual Deno environment
  // When: Access Deno.version.deno
  const denoVersion = Deno.version.deno;

  // Then: Should be defined and non-empty
  assertExists(denoVersion);
  assertEquals(typeof denoVersion, 'string');
});

/**
 * Test: Verify that Deno is detected even when process global exists
 *
 * @remarks
 * Deno provides a Node.js-compatible process global for compatibility.
 * This test verifies that detectRuntime() correctly identifies Deno
 * even when process global is available.
 */
Deno.test('[正常]should detect Deno even when process global exists', () => {
  // Given: Running in actual Deno environment (which may have process global)
  // When: Call detectRuntime()
  const result = detectRuntime();

  // Then: Should still return 'deno', not 'node'
  assertEquals(result, AGRuntimeType.Deno);
  assertEquals(result, 'deno');
});
