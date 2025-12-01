// src: src/runtime/__tests__/unit/detectRuntime.spec.ts
// @(#): Unit tests for runtime detection
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Testing framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Type definitions
import type { AGRuntimeResult } from '@shared/types/runtime.types.ts';
import { AGRuntimeType } from '@shared/types/runtime.types.ts';

// Runtime detection function
import { detectRuntime } from '@/runtime/detectRuntime.ts';

// Test cases
/**
 * Runtime Detection Unit Tests
 *
 * Tests runtime detection functionality across different JavaScript
 * runtime environments (Node.js, Deno, Bun).
 */
describe('detectRuntime', () => {
  /**
   * Node.js Runtime Detection Tests
   *
   * Tests detection of Node.js runtime environment using
   * process.versions.node signature.
   */
  describe('Node.js Detection', () => {
    // Test: Verify Node.js runtime detection in current environment
    it('[正常]should detect Node.js runtime', () => {
      // Given: Node.js environment (current test environment)
      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns AGRuntimeType.Node
      expect(result).toBe(AGRuntimeType.Node);
    });
  });

  /**
   * Deno Runtime Detection Tests
   *
   * Tests detection of Deno runtime environment using
   * Deno.version.deno signature.
   */
  describe('Deno Detection', () => {
    beforeEach(() => {
      // Clear any existing global mocks
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      // Restore original globals after each test
      vi.unstubAllGlobals();
    });

    // Test: Verify Deno runtime detection
    it('[正常]should detect Deno runtime', () => {
      // Given: Deno environment (mocked)
      vi.stubGlobal('Deno', {
        version: { deno: '1.40.0' },
      });

      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns AGRuntimeType.Deno
      expect(result).toBe(AGRuntimeType.Deno);
    });
  });

  /**
   * Bun Runtime Detection Tests
   *
   * Tests detection of Bun runtime environment using
   * Bun.version signature.
   */
  describe('Bun Detection', () => {
    beforeEach(() => {
      // Clear any existing global mocks
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      // Restore original globals after each test
      vi.unstubAllGlobals();
    });

    // Test: Verify Bun runtime detection
    it('[正常]should detect Bun runtime', () => {
      // Given: Bun environment (mocked)
      vi.stubGlobal('Bun', {
        version: '1.0.0',
      });

      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns AGRuntimeType.Bun
      expect(result).toBe(AGRuntimeType.Bun);
    });
  });

  /**
   * Detection Order Tests
   *
   * Tests that runtime detection prioritizes correctly when multiple
   * runtime signatures are present (e.g., Deno exposes process global).
   */
  describe('Detection Order', () => {
    beforeEach(() => {
      // Clear any existing global mocks
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      // Restore original globals after each test
      vi.unstubAllGlobals();
    });

    // Test: Verify Deno is prioritized over Node when both globals exist
    it('[エッジケース]should prioritize Deno over Node when both globals exist', () => {
      // Given: Environment with both Deno and process globals
      // Mock Deno namespace
      vi.stubGlobal('Deno', {
        version: { deno: '1.40.0' },
      });

      // Mock process global (which Deno also exposes for Node.js compatibility)
      vi.stubGlobal('process', {
        versions: { node: '20.0.0' },
      });

      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns AGRuntimeType.Deno (not Node)
      expect(result).toBe(AGRuntimeType.Deno);
    });

    // Test: Verify Bun is prioritized over Node when both globals exist
    it('[エッジケース]should prioritize Bun over Node when both globals exist', () => {
      // Given: Environment with both Bun and process globals
      // Mock Bun namespace
      vi.stubGlobal('Bun', {
        version: '1.0.0',
      });

      // Mock process global
      vi.stubGlobal('process', {
        versions: { node: '20.0.0' },
      });

      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns AGRuntimeType.Bun (not Node)
      expect(result).toBe(AGRuntimeType.Bun);
    });
  });

  /**
   * Error Handling Tests
   *
   * Tests that runtime detection handles errors gracefully and
   * returns undefined instead of throwing.
   */
  describe('Error Handling', () => {
    beforeEach(() => {
      // Clear any existing global mocks
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      // Restore original globals after each test
      vi.unstubAllGlobals();
    });

    // Test: Verify undefined is returned for unknown environment
    it('[異常]should return undefined for unknown environment', () => {
      // Given: Unknown environment (no runtime globals)
      // Remove all runtime globals
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);

      // When: Call detectRuntime()
      const result: AGRuntimeResult = detectRuntime();

      // Then: Returns undefined (not throw)
      expect(result).toBeUndefined();
    });
  });
});
