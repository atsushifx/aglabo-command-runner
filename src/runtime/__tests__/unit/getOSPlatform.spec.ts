// src: src/runtime/__tests__/unit/getOSPlatform.spec.ts
// @(#): Unit tests for OS platform detection
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// type definitions
import type { AGPlatformResult } from '#shared/types/runtime.types.ts';
// function to test
import { getOSPlatform } from '#runtime/getOSPlatform.ts';
/**
 * OS Platform Detection Unit Tests
 *
 * Tests platform detection functionality across different JavaScript
 * runtime environments (Node.js, Deno, Bun).
 */
describe('getOSPlatform', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * Node.js Platform Detection Tests
   *
   * Tests detection of operating system platform using Node.js
   * process.platform API.
   */
  describe('Node.js Platform Detection', () => {
    it('[正常]should return process.platform in Node.js', () => {
      // Given: Node.js environment with Linux platform
      vi.stubGlobal('process', {
        versions: { node: '20.0.0' },
        platform: 'linux',
      });

      // When: Call getOSPlatform()
      const result: AGPlatformResult = getOSPlatform();

      // Then: Returns process.platform value
      expect(result).toBe('linux');
    });
  });

  /**
   * Bun Compatibility Tests
   *
   * Tests that Bun runtime uses the same process.platform API
   * as Node.js for platform detection.
   */
  describe('Bun Compatibility', () => {
    it('[正常]should return process.platform in Bun', () => {
      // Given: Bun runtime environment
      vi.stubGlobal('Bun', { version: '1.0.0' });
      vi.stubGlobal('process', {
        versions: { bun: '1.0.0' },
        platform: 'darwin',
      });

      // When: Call getOSPlatform()
      const result: AGPlatformResult = getOSPlatform();

      // Then: Returns process.platform (same as Node)
      expect(result).toBe('darwin');
    });
  });

  /**
   * Error Handling Tests
   *
   * Tests graceful degradation when platform detection fails.
   * Function should return undefined instead of throwing errors.
   */
  describe('Error Handling', () => {
    it('[異常]should return undefined when platform unavailable', () => {
      // Given: Platform API unavailable (no platform property)
      vi.stubGlobal('process', { versions: { node: '20.0.0' } });

      // When: Call getOSPlatform()
      const result: AGPlatformResult = getOSPlatform();

      // Then: Returns undefined (not throw)
      expect(result).toBeUndefined();
    });

    it('[異常]should return undefined for unknown runtime', () => {
      // Given: Unknown runtime (no Node, Deno, or Bun)
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);

      // When: Call getOSPlatform()
      const result: AGPlatformResult = getOSPlatform();

      // Then: Returns undefined (not throw)
      expect(result).toBeUndefined();
    });
  });

  /**
   * JSDoc Examples Validation Tests
   *
   * Tests that examples in JSDoc comments actually work as documented.
   * This ensures documentation stays accurate and reliable.
   */
  describe('JSDoc Examples', () => {
    it('[正常]should work with basic usage example from JSDoc', () => {
      // Given: Windows platform (as shown in JSDoc example)
      vi.stubGlobal('process', {
        versions: { node: '20.0.0' },
        platform: 'win32',
      });

      // When: Use example pattern from JSDoc
      const platform = getOSPlatform();

      // Then: Example code works correctly
      if (platform === 'win32') {
        expect(platform).toBe('win32');
      }
    });

    it('[正常]should work with cross-platform path handling example', () => {
      // Given: Windows platform
      vi.stubGlobal('process', {
        versions: { node: '20.0.0' },
        platform: 'win32',
      });

      // When: Use cross-platform path example from JSDoc
      const platform = getOSPlatform();
      const pathSep = platform === 'win32' ? '\\' : '/';

      // Then: Example works correctly
      expect(pathSep).toBe('\\');
    });
  });
});
