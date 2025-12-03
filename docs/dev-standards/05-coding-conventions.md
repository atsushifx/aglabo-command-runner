# Coding Conventions

Code style standards for this project.

## General Principles

1. **Use tools, not rules**: Automated formatters and linters enforce style
2. **Consistency over personal preference**: Follow project standards
3. **Readability first**: Code is read more often than written

## File Organization

### File Headers

All files include copyright headers:

```typescript
// src: <relative-path>
// @(#) : <description>
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
```

### File Structure

```typescript
// 1. File header
// 2. Imports (external, then internal)
// 3. Type definitions
// 4. Constants
// 5. Main code
// 6. Exports
```

## TypeScript Standards

### Compiler Settings

- Target: ES2022
- Module: ES2022
- Strict mode: Enabled
- No implicit any: Enforced

**Configuration**: `tsconfig.json`, `base/configs/tsconfig.base.json`

### Type Annotations

**Always annotate**:

- Function parameters
- Function return types
- Exported variables

```typescript
// Good
function processData(input: string): ProcessedData {
  // ...
}

// Bad
function processData(input) {
  // ...
}
```

### Naming Conventions

- Classes: PascalCase (`CommandRunner`)
- Functions: camelCase (`processCommand`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Interfaces: PascalCase, no "I" prefix (`Logger`, not `ILogger`)
- Type aliases: PascalCase (`LogLevel`)
- Private members: camelCase with `_` prefix (`_internalState`)

### Imports

```typescript
// External packages first
import chalk from 'chalk';
import { describe, expect, it } from 'vitest';

// Internal imports second
import { CommandRunner } from './core/command-runner.js';
import type { LoggerOptions } from './types.js';
```

**Use explicit extensions**: `.js` for TypeScript imports (ESM compatibility)

## Formatting

### Tool: dprint

**Configuration**: `dprint.jsonc`

**Key settings**:

- Line width: 120 characters
- Indentation: 2 spaces
- Quote style: Single quotes
- Trailing commas: Multi-line only
- Line endings: LF (Unix-style)

### Examples

```typescript
// Good (120 char width, single quotes, proper indentation)
const config: LoggerConfig = {
  level: 'info',
  format: 'json',
  output: 'stdout',
};

// Good (trailing comma on multi-line)
const levels = [
  'debug',
  'info',
  'warn',
  'error',
];

// Good (single quotes)
const message = 'Processing command';
```

## Documentation

### JSDoc Comments

Public APIs require JSDoc:

```typescript
/**
 * Executes a shell command and returns the output.
 *
 * @param command - The command to execute
 * @param options - Execution options
 * @returns Promise with command output
 * @throws {CommandError} If command execution fails
 */
export async function executeCommand(
  command: string,
  options?: ExecuteOptions,
): Promise<CommandOutput> {
  // ...
}
```

### Inline Comments

Use sparingly, only for complex logic:

```typescript
// Calculate retry delay using exponential backoff
const delay = baseDelay * Math.pow(2, attempt);
```

## Testing

### Test File Naming

- Unit tests: `*.spec.ts`
- Functional tests: `*.test.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

### Test Structure

```typescript
import { describe, expect, it } from 'vitest';
import { CommandRunner } from './command-runner.js';

describe('CommandRunner', () => {
  describe('execute', () => {
    it('should execute simple commands', () => {
      const runner = new CommandRunner();
      const result = runner.execute('echo hello');
      expect(result.stdout).toBe('hello\n');
    });

    it('should handle command failures', () => {
      const runner = new CommandRunner();
      expect(() => runner.execute('invalid-command')).toThrow();
    });
  });
});
```

## Error Handling

### Custom Errors

```typescript
export class CommandError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly command: string,
  ) {
    super(message);
    this.name = 'CommandError';
  }
}
```

### Error Messages

- Be specific and actionable
- Include context (what failed, why, how to fix)

```typescript
// Good
throw new CommandError(
  `Command failed: ${command}. Exit code: ${code}. Stderr: ${stderr}`,
  code,
  command,
);

// Bad
throw new Error('Command failed');
```

## Async/Await

Prefer async/await over promises:

```typescript
// Good
async function fetchData(): Promise<Data> {
  const response = await fetch(url);
  return response.json();
}

// Avoid
function fetchData(): Promise<Data> {
  return fetch(url).then((response) => response.json());
}
```

## Configuration Inheritance

Use base configurations:

```typescript
// configs/vitest.config.unit.ts
import { mergeConfig } from 'vitest/config';
import baseConfig from '../base/configs/vitest.config.base.ts';

export default mergeConfig(baseConfig, {
  test: {
    name: 'unit',
    include: ['src/**/__tests__/unit/**/*.spec.ts'],
  },
});
```

## File Naming

**Enforced by ls-lint**:

- Source files: `kebab-case.ts`
- Test files: `kebab-case.spec.ts`, `kebab-case.test.ts`
- Config files: `name.config.ts`, `name.config.js`
- Types: `kebab-case.d.ts`

## Line Endings

**Always LF (Unix-style)**, never CRLF.

**Configuration**:

- `.editorconfig`: `end_of_line = lf`
- `dprint.jsonc`: `"newLineKind": "lf"`
- `tsconfig.json`: `"newLine": "LF"`

## Character Encoding

**Always UTF-8**.

**Configuration**: `.editorconfig`: `charset = utf-8`

## Best Practices

1. **Let tools enforce style**: Use dprint, ESLint, not manual reviews
2. **Write self-documenting code**: Clear names over comments
3. **Keep functions small**: Single responsibility
4. **Avoid premature optimization**: Clarity first, optimize if needed
5. **Use TypeScript features**: Leverage type system
6. **Test public APIs**: All exported functions/classes

## Anti-Patterns

**避けるべきパターン**:

- Use `any` type (use `unknown` if truly unknown)
- Ignore TypeScript errors
- Commit commented-out code
- Use `var` (use `const` or `let`)
- Disable linting rules without reason
- Write overly complex one-liners

## See Also

- `docs/dev-standards/04-quality-assurance.md` - Quality standards
- `docs/projects/development-tools.md` - Tool configuration
- `.editorconfig` - Editor settings
- `dprint.jsonc` - Formatter configuration
- `tsconfig.json` - TypeScript configuration
