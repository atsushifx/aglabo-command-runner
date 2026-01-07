import type { AGTCommandResult } from '#shared/types/command-result.types';
import { AGTCommandErrorType } from '#shared/types/command-result.types';
import { describe, expect, it } from 'vitest';

/**
 * T01-07: Define AGTCommandResult Union Type (3 tasks)
 */
describe('AGTCommandResult Union Type', () => {
  /**
   * T01-07-01: Given: command-result.types.ts complete
   *            When: creating AGTCommandResult union
   *            Then: union type created as AGTCommandSuccess | AGTCommandError
   */
  describe('T01-07-01: Union type creation', () => {
    it('should create AGTCommandResult as union of AGTCommandSuccess | AGTCommandError', () => {
      // Given: Success result type
      const successResult: AGTCommandResult = {
        success: true,
        result: { data: 'test' },
      };

      // When: checking the type is AGTCommandSuccess
      // Then: should accept success=true with result field
      expect(successResult.success).toBe(true);
      expect(successResult).toHaveProperty('result');
    });

    it('should create AGTCommandResult union accepting error type', () => {
      // Given: Error result type
      const errorResult: AGTCommandResult = {
        success: false,
        type: AGTCommandErrorType.RuntimeErrors,
        message: 'Command failed',
      };

      // When: checking the type is AGTCommandError
      // Then: should accept success=false with type and message fields
      expect(errorResult).toHaveProperty('type');
      expect(errorResult).toHaveProperty('message');
    });
  });

  /**
   * T01-07-02: Given: union type defined
   *            When: checking discriminator
   *            Then: 'success' field enables proper type narrowing
   */
  describe('T01-07-02: Type narrowing with discriminator', () => {
    it('should enable type narrowing using success field', () => {
      // Given: AGTCommandResult union
      const result: AGTCommandResult = {
        success: true,
        result: { output: 'success' },
      };

      // When: checking success field
      // Then: TypeScript should narrow to AGTCommandSuccess
      // - should have 'result' property
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('result');
      expect(result.result).toEqual({ output: 'success' });
    });

    it('should narrow to AGTCommandError when success is false', () => {
      // Given: Error result
      const result: AGTCommandResult = {
        success: false,
        type: AGTCommandErrorType.ValidationErrors,
        message: 'Invalid input',
      };

      // When: checking success field is false
      if (!result.success) {
        // Then: TypeScript should narrow to AGTCommandError
        // - should have 'type' and 'message' properties
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('message');
        expect(result.message).toBe('Invalid input');
      }
    });
  });

  /**
   * T01-07-03: Given: union defined
   *            When: checking structure
   *            Then: union is properly exported and accessible as AGTCommandResult
   */
  describe('T01-07-03: Union export and accessibility', () => {
    it('should export AGTCommandResult type for use in other modules', () => {
      // Given: AGTCommandResult is imported
      // When: creating an instance of AGTCommandResult
      const successCase: AGTCommandResult = {
        success: true,
        result: null,
      };

      const errorCase: AGTCommandResult = {
        success: false,
        type: AGTCommandErrorType.TypeErrors,
        message: 'Type error occurred',
      };

      // Then: both cases should be valid AGTCommandResult instances
      expect(successCase).toBeDefined();
      expect(errorCase).toBeDefined();
    });

    it('should allow accessing union members through discriminator', () => {
      // Given: Various AGTCommandResult values
      const results: AGTCommandResult[] = [
        { success: true, result: 'data' },
        { success: false, type: AGTCommandErrorType.RuntimeErrors, message: 'error' },
      ];

      // When: iterating through results
      // Then: should handle both success and error cases
      results.forEach((result) => {
        if (result.success) {
          expect(result).toHaveProperty('result');
        } else {
          expect(result).toHaveProperty('message');
        }
      });
    });
  });
});
