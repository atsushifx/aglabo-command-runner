// src: src/_internal/types/__tests__/unit/shared-barrel-index.spec.ts
// @(#) : Barrel export structure verification for shared/types/index.ts
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as barrelExports from '#shared/types';
import { describe, expect, it } from 'vitest';

/**
 * T01-12-02: shared/types barrel export structure verification
 * Tests all exports from the barrel file grouped by source
 */
describe('shared/types/index.ts barrel exports', () => {
  /**
   * Given: barrel file updated with groupings by source file
   * When: checking structure
   * Then: all exports are present and accessible
   */
  describe('Given: barrel file with exports grouped by source file', () => {
    describe('When: checking structure', () => {
      it('Then: runtime.types.ts exports AGRuntimeType, AGPlatformType', () => {
        expect(barrelExports.AGRuntimeType).toBeDefined();
        expect(barrelExports.AGPlatformType).toBeDefined();
        // Note: AGRuntimeResult and AGPlatformResult are type-only exports
        // verified at compile time via TypeScript type checking
      });

      it('Then: runtime.types.ts exports AGCommandErrorType', () => {
        expect(barrelExports).toHaveProperty('AGCommandErrorType');
      });

      it('Then: command result types exports AGTCommandErrorType (type-only exports AGTCommandError, AGTCommandSuccess, AGTCommandResult verified at compile time)', () => {
        expect(barrelExports).toHaveProperty('AGTCommandErrorType');
        // Note: AGTCommandError, AGTCommandSuccess, AGTCommandResult are type-only exports
        // verified at compile time via TypeScript type checking
      });

      it('Then: OS to Shell mapping exports AGTOSType, AGTShellType, AG_OS_TO_SHELL_MAP', () => {
        expect(barrelExports).toHaveProperty('AGTOSType');
        expect(barrelExports).toHaveProperty('AGTShellType');
        expect(barrelExports).toHaveProperty('AG_OS_TO_SHELL_MAP');
      });
    });
  });
});
