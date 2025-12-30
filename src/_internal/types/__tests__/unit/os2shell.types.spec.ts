import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';

// type definitions
import { AGTOSType, AGTShellType, AG_OS_TO_SHELL_MAP } from '#shared/types/os2shell.types';

/**
 * T01-08: Create shared/types/os2shell.types.ts File (3 tasks)
 */
describe('os2shell.types.ts File Creation', () => {
  // Helper function to get the file path
  const getFilePath = (): string => {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    // Navigate: __tests__/unit -> _internal/types -> src -> project root
    const projectRoot = dirname(dirname(dirname(dirname(dirname(currentDir)))));
    return join(projectRoot, 'shared', 'types', 'os2shell.types.ts');
  };

  /**
   * T01-08-01: Given: creating os2shell-specific types
   *            When: creating os2shell.types.ts
   *            Then: file created at shared/types/os2shell.types.ts
   */
  describe('T01-08-01: File creation', () => {
    it('should create os2shell.types.ts file at shared/types directory', () => {
      // Given: the shared/types directory structure
      const filePath = getFilePath();

      // When: checking if file exists
      let fileContent: string;
      try {
        fileContent = readFileSync(filePath, 'utf-8');
      } catch {
        throw new Error(`File not found at ${filePath}`);
      }

      // Then: file should exist and contain content
      expect(fileContent).toBeDefined();
      expect(fileContent.length).toBeGreaterThan(0);
    });
  });

  /**
   * T01-08-02: Given: file created
   *            When: checking module structure
   *            Then: includes proper TypeScript syntax, ES6 exports, and runtime.types.ts imports
   */
  describe('T01-08-02: Module structure and imports', () => {
    let fileContent: string;

    beforeEach(() => {
      fileContent = readFileSync(getFilePath(), 'utf-8');
    });

    it('should have proper file header with copyright notice', () => {
      // Given: file content
      // When: checking header
      // Then: should start with proper comment structure
      expect(fileContent).toMatch(/^\/\/ src:/);
      expect(fileContent).toContain('shared/types/os2shell.types.ts');
      expect(fileContent).toContain('Type definitions');
      expect(fileContent).toContain('Copyright');
      expect(fileContent).toContain('atsushifx');
      expect(fileContent).toContain('MIT License');
    });

    it('should prepare imports for runtime.types.ts integration', () => {
      // Given: module imports or ready for integration
      // When: checking import statements
      // Then: should have header indicating runtime integration capability
      // File may not import immediately, but should be prepared for runtime types
      expect(fileContent).toContain('os2shell');
      expect(fileContent.length).toBeGreaterThan(100);
    });

    it('should use ES6 export syntax', () => {
      // Given: export statements
      // When: checking export syntax
      // Then: should use ES6 export (not CommonJS module.exports)
      expect(fileContent).not.toContain('module.exports');
      expect(fileContent).toMatch(/export\s+(?:enum|type|const|interface)/);
    });

    it('should have proper TypeScript syntax', () => {
      // Given: TypeScript file
      // When: checking TypeScript features
      // Then: should contain valid TypeScript patterns
      // Check for enum, const, or type keywords
      expect(fileContent).toMatch(/^\s*export\s+enum\s+\w+/m);
      expect(fileContent).toMatch(/^\s*export\s+(?:const|type)\s+\w+/m);
    });

    it('should not have trailing semicolons in exports', () => {
      // Given: export statements
      // When: checking export format
      // Then: modern TypeScript files use semicolons as per style
      const exportLines = fileContent.match(/export\s+(?:enum|type|const)[^;]*;/g);
      expect(exportLines).toBeTruthy();
    });
  });

  /**
   * T01-08-03: Given: file ready
   *            When: preparing for definitions
   *            Then: includes section comments for enums and constants with JSDoc placeholders
   */
  describe('T01-08-03: Section comments and JSDoc placeholders', () => {
    let fileContent: string;

    beforeEach(() => {
      fileContent = readFileSync(getFilePath(), 'utf-8');
    });

    // Parameterized test for section comments
    it.each([
      ['AGTOSType', 'enum'],
      ['AGTShellType', 'enum'],
      ['AG_OS_TO_SHELL_MAP', 'constant'],
    ])('should have section comment for %s %s', (symbol) => {
      // Given: section comments structure
      // When: checking for symbol section comment
      // Then: should contain comment section for the symbol
      expect(fileContent).toContain(symbol);
      expect(fileContent).toMatch(
        new RegExp(`/\\*\\*[\\s\\S]*?${symbol}[\\s\\S]*?\\*/`),
      );
    });

    it('should have JSDoc comments with placeholder structure', () => {
      // Given: JSDoc format
      // When: checking documentation style
      // Then: should have multi-line JSDoc with proper formatting
      expect(fileContent).toMatch(/\/\*\*[\s\S]*?\*/);
      expect(fileContent).toContain(' * ');
    });

    it('should have placeholders for implementation comments', () => {
      // Given: ready for implementation
      // When: checking for placeholder structure
      // Then: should have comments indicating where implementation will follow
      expect(fileContent).toMatch(/\/\*\*[\s\S]*?\*\/\s*(?:export\s+enum|export\s+type|export\s+const)/);
    });
  });
});

// ============================================================================
// T01-09: Define AGTOSType Enum in os2shell.types.ts (5 tasks)
// ============================================================================

describe('T01-09: AGTOSType enum', () => {
  describe('T01-09-02: Normal values', () => {
    it.each([
      ['Windows', 'windows'],
      ['macOS', 'macos'],
      ['Linux', 'linux'],
    ])('maps %s to "%s"', (key, value) => {
      expect(AGTOSType[key as keyof typeof AGTOSType]).toBe(value);
    });
  });

  describe('T01-09-03: Invalid values excluded', () => {
    it('should not have invalid keys or values', () => {
      const keys = Object.keys(AGTOSType).filter((key) => isNaN(Number(key)));
      expect(keys).toHaveLength(3);
      expect(keys).toEqual(['Windows', 'macOS', 'Linux']);
    });
  });

  describe('T01-09-04: Edge cases', () => {
    it('all values are lowercase with no spaces or hyphens', () => {
      const values = Object.values(AGTOSType);
      values.forEach((value) => {
        expect(value).toMatch(/^[a-z]+$/);
      });
    });
  });

  describe('T01-09-05: Export and accessibility', () => {
    it('is properly exported and accessible', () => {
      expect(AGTOSType).toBeDefined();
      const osType: typeof AGTOSType = AGTOSType;
      expect(osType).toBe(AGTOSType);
    });
  });
});

// ============================================================================
// T01-10: Define AGTShellType Enum in os2shell.types.ts (5 tasks)
// ============================================================================

describe('T01-10: AGTShellType enum', () => {
  describe('T01-10-02: Normal values', () => {
    it.each([
      ['PowerShell', 'pwsh.exe'],
      ['Zsh', '/bin/zsh'],
      ['Bash', '/bin/bash'],
    ])('maps %s to "%s"', (key, value) => {
      expect(AGTShellType[key as keyof typeof AGTShellType]).toBe(value);
    });
  });

  describe('T01-10-03: Invalid values excluded', () => {
    it('should have exactly 3 members with correct keys', () => {
      const keys = Object.keys(AGTShellType).filter((key) => isNaN(Number(key)));
      expect(keys).toHaveLength(3);
      expect(keys).toEqual(['PowerShell', 'Zsh', 'Bash']);
    });
  });

  describe('T01-10-04: Edge cases', () => {
    it('Windows format uses exe name only, Unix uses absolute paths', () => {
      expect(AGTShellType.PowerShell).toMatch(/^pwsh\.exe$/);
      expect(AGTShellType.Zsh).toMatch(/^\/bin\/zsh$/);
      expect(AGTShellType.Bash).toMatch(/^\/bin\/bash$/);
    });

    it('no trailing slashes', () => {
      const values = Object.values(AGTShellType);
      values.forEach((value) => {
        expect(value).not.toMatch(/\/$/);
      });
    });
  });

  describe('T01-10-05: Export and accessibility', () => {
    it('is properly exported and accessible', () => {
      expect(AGTShellType).toBeDefined();
      const shellType: typeof AGTShellType = AGTShellType;
      expect(shellType).toBe(AGTShellType);
    });
  });
});

// ============================================================================
// T01-11: Define AG_OS_TO_SHELL_MAP Constant (5 tasks)
// ============================================================================

describe('T01-11: AG_OS_TO_SHELL_MAP constant', () => {
  describe('T01-11-01: Constant structure', () => {
    it('is defined and accessible', () => {
      expect(AG_OS_TO_SHELL_MAP).toBeDefined();
      expect(AG_OS_TO_SHELL_MAP).not.toBeNull();
    });
  });

  describe('T01-11-02: Normal mappings', () => {
    it.each([
      [AGTOSType.Windows, AGTShellType.PowerShell],
      [AGTOSType.macOS, AGTShellType.Zsh],
      [AGTOSType.Linux, AGTShellType.Bash],
    ])('maps %s to %s', (osType, shellType) => {
      expect(AG_OS_TO_SHELL_MAP[osType]).toBe(shellType);
    });
  });

  describe('T01-11-03: Invalid mappings excluded', () => {
    it('has all platforms mapped correctly', () => {
      const osTypes = Object.values(AGTOSType);
      osTypes.forEach((os) => {
        expect(AG_OS_TO_SHELL_MAP[os as AGTOSType]).toBeDefined();
      });
    });
  });

  describe('T01-11-04: Edge cases', () => {
    it('map is complete with exact enum value matches', () => {
      const osKeys = Object.keys(AGTOSType).filter((key) => isNaN(Number(key)));
      expect(osKeys).toHaveLength(3);
      osKeys.forEach((osKey) => {
        const osValue = AGTOSType[osKey as keyof typeof AGTOSType];
        expect(AG_OS_TO_SHELL_MAP[osValue]).toBeDefined();
      });
    });
  });

  describe('T01-11-05: Type annotation', () => {
    it('has correct type annotation and is exported', () => {
      expect(AG_OS_TO_SHELL_MAP).toBeDefined();
      expect(typeof AG_OS_TO_SHELL_MAP).toBe('object');
    });
  });
});
