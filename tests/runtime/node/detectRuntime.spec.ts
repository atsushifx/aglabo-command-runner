// src: src/runtime/__tests__/runtime/node/detectRuntime.spec.ts
// @(#): Runtime tests for Node.js environment
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
import { detectRuntime } from '#/runtime/detectRuntime.ts';

/**
 * Node.js Runtime Detection Tests
 *
 * These tests verify runtime detection when running in an actual Node.js environment.
 * Unlike unit tests that use mocks, these tests validate the real runtime behavior.
 *
 * @remarks
 * - Tests run in actual Node.js environment (no mocks)
 * - Validates that detectRuntime() correctly identifies Node.js
 * - Ensures the returned value is the string 'node'
 */
describe('Runtime Detection in Node.js Environment', () => {
  /**
   * Test: Verify that detectRuntime() returns 'node' when running in Node.js
   *
   * @remarks
   * This test runs in the actual Node.js runtime environment.
   * It verifies that the runtime detection correctly identifies Node.js
   * and returns the AGRuntimeType.Node enum value (which is 'node').
   */
  it('[正常]should detect Node.js runtime and return "node"', () => {
    // Given: Running in actual Node.js environment
    // When: Call detectRuntime()
    const result = detectRuntime();

    // Then: Should return 'node' (AGRuntimeType.Node)
    expect(result).toBe(AGRuntimeType.Node);
    expect(result).toBe('node');
  });

  /**
   * Test: Verify that the result is exactly the string 'node'
   *
   * @remarks
   * This test explicitly checks that the returned value is
   * the string 'node', not undefined or any other value.
   */
  it('[正常]should return the string "node" as the runtime type', () => {
    // Given: Running in actual Node.js environment
    // When: Call detectRuntime()
    const result = detectRuntime();

    // Then: Should be exactly the string 'node'
    expect(result).toBeTypeOf('string');
    expect(result).toBe('node');
  });

  /**
   * Test: Verify that Node.js process global is available
   *
   * @remarks
   * This test confirms that the Node.js-specific process global
   * is available and has the expected version property.
   */
  it('[正常]should have access to Node.js process global', () => {
    // Given: Running in actual Node.js environment
    // When: Access process.versions.node
    // deno-lint-ignore no-process-global
    const nodeVersion = process.versions.node;

    // Then: Should be defined and non-empty
    expect(nodeVersion).toBeDefined();
    expect(nodeVersion).toBeTruthy();
    expect(typeof nodeVersion).toBe('string');
  });
});
