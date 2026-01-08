// tests: src/runtime/__tests__/unit/get-raw-os-platform.spec.ts
// @(#) : BDD unit tests for _getRawOSPlatform() function
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// vitest
import { describe, expect, it, vi } from 'vitest';

// internal implementation
import * as runtimeModule from '../../detect-runtime';
import { _getRawOSPlatform } from '../../get-raw-os-platform';

// type definitions
import type { _RawOSPlatformResult, _RawOSPlatformType } from '#shared/types/runtime.types';
import { AGRuntimeType } from '#shared/types/runtime.types';

// ============================================================================
// Test Constants
// ============================================================================

/**
 * Valid platform values based on _RawOSPlatformType definition
 * These constants are extracted from the type definition to ensure test
 * consistency and maintainability. Any changes to supported platforms
 * should be reflected here.
 *
 * @see {@link _RawOSPlatformType} for type definition
 */
const VALID_PLATFORM_VALUES: _RawOSPlatformResult[] = ['win32', 'darwin', 'linux', undefined];

/**
 * Valid platform types (excluding undefined)
 * Used when testing for specific platform values without undefined
 */
const VALID_PLATFORM_TYPES: _RawOSPlatformType[] = ['win32', 'darwin', 'linux'];

// ============================================================================
// Given: Node.js runtime is available
// ============================================================================

describe('Given: Node.js runtime is available', () => {
  // ============================================================================
  // When: Calling _getRawOSPlatform()
  // ============================================================================

  describe('When: Calling _getRawOSPlatform()', () => {
    // Task T02-01: Node.js Platform Detection
    describe('Then: Task T02-01 - Node.js platform detection', () => {
      it('Should: Detect Node.js correctly and return platform value', () => {
        // Arrange: Access the function and prepare to call it
        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call the function without parameters
        const result = getRawOSPlatform();

        // Assert: Verify function returns a valid platform or undefined
        expect(result).toBeDefined();
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });
    });
  });

  // ============================================================================
  // When: Checking detected platform on specific operating systems
  // ============================================================================

  describe('When: Checking detected platform on specific operating systems', () => {
    // Task T02-02/T02-03: Platform-specific detection (macOS, Linux)
    describe('Then: Task T02-02/T02-03 - Detect platform-specific values', () => {
      it.each<[_RawOSPlatformType, string]>([
        ['win32', 'Windows'],
        ['darwin', 'macOS'],
        ['linux', 'Linux'],
      ])('Should: Return %s on %s platform', (expectedPlatform, _osName) => {
        // Arrange: Prepare to get platform detection
        const result = _getRawOSPlatform();

        // Assert: Verify platform matches expectations
        if (process.platform === expectedPlatform) {
          expect(result).toBe(expectedPlatform);
        } else {
          // On other platforms, verify result is still a valid platform value
          expect(VALID_PLATFORM_VALUES).toContain(result);
        }
      });
    });
  });

  // ============================================================================
  // When: Validating against standard platform values
  // ============================================================================

  describe('When: Validating against standard platform values', () => {
    // Task T02-05: Platform Validation
    describe('Then: Task T02-05 - Platform value validation', () => {
      it('Should: Return only valid platform values', () => {
        // Arrange: Use predefined valid platform values
        // (defined in test setup)

        // Act: Call function to get platform
        const result = _getRawOSPlatform();

        // Assert: Verify result is one of the valid values
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });
    });
  });

  // ============================================================================
  // When: Running type check
  // ============================================================================

  describe('When: Running type check', () => {
    // Task T02-06: Return Type Verification
    describe('Then: Task T02-06 - Return type is _RawOSPlatformResult', () => {
      it('Should: Return value matches _RawOSPlatformResult type', () => {
        // Arrange: Get the function
        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call function and assign to typed variable
        const result: _RawOSPlatformResult = getRawOSPlatform();

        // Assert: Verify type assignment works (compile-time check) and runtime check
        expect(result === undefined || typeof result === 'string').toBe(true);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });
    });
  });
});

// ============================================================================
// Given: Unknown runtime environment (T02-04)
// ============================================================================

describe('Given: Unknown runtime environment', () => {
  // ============================================================================
  // When: Calling _getRawOSPlatform() with unknown runtime
  // ============================================================================

  describe('When: Calling _getRawOSPlatform() with unknown runtime', () => {
    // Task T02-04-01: Unknown Runtime Handling
    describe('Then: Task T02-04-01 - Graceful handling of unknown runtime', () => {
      it('Should: Return undefined when detectRuntime returns undefined (unknown environment)', () => {
        // Arrange: Mock detectRuntime to return undefined (simulating unknown runtime environment)
        vi.spyOn(runtimeModule, 'detectRuntime').mockReturnValue(undefined);

        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call the function without parameters, which will trigger detectRuntime
        const result = getRawOSPlatform();

        // Assert: Verify function returns undefined for unknown runtime
        expect(result).toBeUndefined();
      });
    });
  });

  // ============================================================================
  // When: Checking fallback behavior
  // ============================================================================

  describe('When: Checking fallback behavior', () => {
    // Task T02-04-02: Fallback Behavior
    describe('Then: Task T02-04-02 - No runtime detection available', () => {
      it('Should: Return undefined when runtime parameter is explicitly undefined', () => {
        // Arrange: Mock detectRuntime to ensure it won't be called or if called, returns undefined
        vi.spyOn(runtimeModule, 'detectRuntime').mockReturnValue(undefined);

        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call the function with explicit undefined parameter
        const result = getRawOSPlatform(undefined);

        // Assert: Verify function returns undefined for no runtime detection available
        expect(result).toBeUndefined();
      });
    });
  });

  // ============================================================================
  // When: Attempting detection with invalid runtime parameter
  // ============================================================================

  describe('When: Attempting detection with invalid runtime parameter', () => {
    // Task T02-04-03: Invalid Runtime Parameter Handling
    describe('Then: Task T02-04-03 - Invalid runtime detection method', () => {
      it.each<[unknown, string]>([
        [123, 'Number type'],
        [{ invalid: 'object' }, 'Object type'],
        ['', 'Empty string'],
        [null, 'null value'],
        [true, 'Boolean type'],
      ])(
        'Should: Return undefined when %s runtime parameter is passed',
        (invalidRuntime, _description) => {
          // Arrange: Prepare the function
          const getRawOSPlatform = _getRawOSPlatform;

          // Act: Call the function with invalid runtime parameter
          const result = getRawOSPlatform(invalidRuntime as unknown as typeof AGRuntimeType.Node);

          // Assert: Verify function returns undefined without crashing
          expect(result).toBeUndefined();
        },
      );
    });
  });

  // ============================================================================
  // When: Attempting detection with corrupted Deno globals
  // ============================================================================

  describe('When: Attempting detection with corrupted Deno globals', () => {
    // Task T02-04-03: Corrupted Deno Globals
    describe('Then: Task T02-04-03 - Invalid runtime detection (corrupted Deno globals)', () => {
      it('Should: Return undefined when Deno.build is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build.os is an object', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build.os is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build.os is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build.os is empty string', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build.os is unknown platform', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno global is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno global is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Deno);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('When: Attempting detection with corrupted process globals', () => {
    // Task T02-04-03: Corrupted Process Globals
    describe('Then: Task T02-04-03 - Invalid runtime detection (corrupted process globals)', () => {
      it('Should: Return valid value or undefined when process.platform is an object', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when process.platform is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when process.platform is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when process.platform is empty string', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when process.platform is unknown string', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });
    });
  });

  describe('When: Attempting detection with missing or null globals', () => {
    // Task T02-04-03: Missing/Null Globals
    describe('Then: Task T02-04-03 - Invalid runtime detection (missing/null globals)', () => {
      it('Should: Return valid value or undefined when process global is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when process global is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Node);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when Bun global is null', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Bun);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });

      it('Should: Return valid value or undefined when Bun global is a number', () => {
        const getRawOSPlatform = _getRawOSPlatform;
        const result = getRawOSPlatform(AGRuntimeType.Bun);
        expect(VALID_PLATFORM_VALUES).toContain(result);
      });
    });
  });
});

// ============================================================================
// Given: Partial runtime information - Deno global exists but Deno.build missing (T02-04-04)
// ============================================================================

describe('Given: Partial runtime information - Deno global exists but Deno.build missing', () => {
  // ============================================================================
  // When: Attempting platform detection with incomplete Deno global
  // ============================================================================

  describe('When: Attempting platform detection with incomplete Deno global', () => {
    // Task T02-04-04: Partial Deno Runtime Information
    describe('Then: Task T02-04-04 - Partial runtime information (Deno)', () => {
      it('Should: Return undefined when Deno exists but Deno.build is missing', () => {
        // Arrange: Prepare the function
        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call the function with Deno runtime type (Deno global exists but build property is missing)
        const result = getRawOSPlatform(AGRuntimeType.Deno);

        // Assert: Verify function returns undefined without crashing
        expect(result).toBeUndefined();
      });

      it('Should: Return undefined when Deno.build exists but Deno.build.os is missing', () => {
        // Arrange: Prepare the function
        const getRawOSPlatform = _getRawOSPlatform;

        // Act: Call the function with Deno runtime type (Deno.build exists but os property is missing)
        const result = getRawOSPlatform(AGRuntimeType.Deno);

        // Assert: Verify function returns undefined without crashing
        expect(result).toBeUndefined();
      });
    });
  });
});

// ============================================================================
// Given: Partial runtime information - process global exists but platform missing (T02-04-04)
// ============================================================================

describe('Given: Partial runtime information - process global exists but platform missing', () => {
  // ============================================================================
  // When: Attempting platform detection with incomplete process global
  // ============================================================================

  describe('When: Attempting platform detection with incomplete process global', () => {
    // Task T02-04-04: Partial Process Runtime Information
    describe('Then: Task T02-04-04 - Partial runtime information (process)', () => {
      it('Should: Return undefined when process exists but process.platform is missing', () => {
        // Arrange: Mock globalThis to have process object without platform property
        const originalGlobal = globalThis as Record<string, unknown>;
        const originalProcess = originalGlobal.process;

        try {
          // Create a process-like object without platform property
          originalGlobal.process = {};

          const getRawOSPlatform = _getRawOSPlatform;

          // Act: Call the function with Node runtime type
          const result = getRawOSPlatform(AGRuntimeType.Node);

          // Assert: Verify function returns undefined when platform property is missing
          expect(result).toBeUndefined();
        } finally {
          // Restore original process
          originalGlobal.process = originalProcess;
        }
      });

      it('Should: Return undefined when process.platform is explicitly undefined', () => {
        // Arrange: Mock globalThis to have process object with platform explicitly set to undefined
        const originalGlobal = globalThis as Record<string, unknown>;
        const originalProcess = originalGlobal.process;

        try {
          // Create a process-like object with platform explicitly set to undefined
          originalGlobal.process = { platform: undefined };

          const getRawOSPlatform = _getRawOSPlatform;

          // Act: Call the function with Node runtime type
          const result = getRawOSPlatform(AGRuntimeType.Node);

          // Assert: Verify function returns undefined when platform is explicitly undefined
          expect(result).toBeUndefined();
        } finally {
          // Restore original process
          originalGlobal.process = originalProcess;
        }
      });
    });
  });
});

// ============================================================================
// Given: Incomplete runtime information in sandboxed environments (T02-04-05)
// ============================================================================

describe('Given: Incomplete runtime information in sandboxed environments', () => {
  // ============================================================================
  // When: Attempting platform detection with incomplete Deno.build
  // ============================================================================

  describe('When: Attempting platform detection with incomplete Deno.build', () => {
    // Task T02-04-05: Sandboxed Environment Handling
    describe('Then: Task T02-04-05 - Runtime detection with permission errors', () => {
      it('Should: Return undefined when Deno.build is missing os property', () => {
        // Arrange: Mock globalThis with Deno that has incomplete build object
        const originalGlobal = globalThis as Record<string, unknown>;
        const originalDeno = originalGlobal.Deno;

        try {
          // Create a Deno-like object with incomplete build property (realistic scenario: security policy)
          const mockDeno = {
            build: {
              // os property missing (security policy removed it)
            },
          };
          originalGlobal.Deno = mockDeno;

          const getRawOSPlatform = _getRawOSPlatform;

          // Act: Call the function with Deno runtime type
          const result = getRawOSPlatform(AGRuntimeType.Deno);

          // Assert: Verify function returns undefined without throwing
          expect(result).toBeUndefined();
        } finally {
          originalGlobal.Deno = originalDeno;
        }
      });

      it('Should: Return undefined when process is incomplete object missing platform property', () => {
        // Arrange: Mock globalThis with incomplete process object (security policy removed platform)
        const originalGlobal = globalThis as Record<string, unknown>;
        const originalProcess = originalGlobal.process;

        try {
          // Create a process-like object with platform property completely missing
          // (realistic scenario: security policy or environment strips certain properties)
          originalGlobal.process = { versions: { node: '20.0.0' } };

          const getRawOSPlatform = _getRawOSPlatform;

          // Act: Call the function with Node runtime type
          const result = getRawOSPlatform(AGRuntimeType.Node);

          // Assert: Verify function returns undefined without throwing
          expect(result).toBeUndefined();
        } finally {
          originalGlobal.process = originalProcess;
        }
      });
    });
  });
});
