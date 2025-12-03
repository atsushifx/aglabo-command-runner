# Quality Assurance

Quality standards and automated checks for this project.

## Quality Philosophy

**Automate everything** - Use tools, not manual reviews, for consistent quality.

## Automated Quality Gates

All commits must pass these automated checks:

### 1. Code Formatting

**Tool**: dprint

```bash
pnpm format:dprint  # Format
pnpm check:dprint   # Check only
```

**Configuration**: `dprint.jsonc`

**Standards**:

- Line width: 120 characters
- Indentation: 2 spaces
- Line endings: LF (Unix-style)
- Single quotes preferred

### 2. File Naming

**Tool**: ls-lint

```bash
pnpm lint:filenames
```

**Configuration**: `configs/ls-lint.yaml`

**Enforces**:

- Consistent naming patterns
- No uppercase in file names (except specific cases)
- Proper extensions

### 3. Text Quality

**Tools**: textlint, markdownlint

```bash
pnpm lint:text      # textlint
pnpm lint:markdown  # markdownlint
```

**Configurations**:

- `configs/textlintrc.yaml`
- `configs/.markdownlint.yaml`
- `configs/.textlint/` - Dictionaries and allowlists

**Checks**:

- Technical writing quality
- Markdown formatting
- Consistent terminology

### 4. Spell Checking

**Tool**: cspell

```bash
pnpm check:spells
```

**Configuration**: `.vscode/cspell.json`

**Custom dictionary**: `.vscode/cspell/dicts/project.dic`

### 5. Security Scanning

**Tools**: gitleaks, secretlint

```bash
pnpm lint:secrets  # Manual check
# Automated via pre-commit hook
```

**Configurations**:

- `configs/gitleaks.toml`
- `configs/secretlint.config.yaml`

**Detects**:

- API keys, passwords, tokens
- AWS credentials, private keys
- Database credentials
- Generic secrets

**CRITICAL**: Never commit secrets. Hooks will block commits containing secrets.

### 6. Type Safety

**Tool**: TypeScript compiler

```bash
pnpm check:types
```

**Configuration**: `tsconfig.json`

**Standards**:

- Strict mode enabled
- No implicit any
- Force consistent casing

**Note**: Only applicable after `src/` directory is created.

### 7. Linting

**Tool**: ESLint

```bash
pnpm lint  # If configured
```

**Configurations**:

- `configs/eslint.config.js` - Standard rules
- `configs/eslint.config.typed.js` - TypeScript-aware rules

**Note**: Only applicable to TypeScript/JavaScript files.

### 8. Testing

**Tool**: Vitest

```bash
pnpm test:unit        # Unit tests
pnpm test:functional  # Functional tests
pnpm test             # All tests
```

**Configurations**:

- `configs/vitest.config.unit.ts`
- `configs/vitest.config.functional.ts`
- `configs/vitest.config.integration.ts`
- `configs/vitest.config.e2e.ts`

**Note**: Only applicable after tests are written.

## Git Hooks

Quality gates are enforced via Git hooks (managed by lefthook).

### Pre-commit

**Runs automatically before commit**:

- gitleaks (secret detection)
- secretlint (secret analysis)

**Execution**: Parallel for performance

### Prepare-commit-msg

**Runs after commit command**:

- Generates Conventional Commits format message

### Commit-msg

**Runs before finalizing commit**:

- Validates commit message format with commitlint

**Configuration**: `lefthook.yml`

## Quality Checklist

Before committing, run:

```bash
# 1. Format
pnpm format:dprint

# 2. Lint
pnpm lint:filenames
pnpm lint:text
pnpm lint:markdown

# 3. Spell check
pnpm check:spells

# 4. Security (CRITICAL)
pnpm lint:secrets

# 5. Type check (if src/ exists)
pnpm check:types

# 6. Tests (if tests exist)
pnpm test
```

## Handling Failures

### Formatting Failures

```bash
# Auto-fix
pnpm format:dprint
```

### Linting Failures

Fix manually based on error messages. Some linters support auto-fix.

### Spelling Failures

Add legitimate words to custom dictionary:

- Edit `.vscode/cspell/dicts/project.dic`

### Secret Detection

**NEVER commit secrets**:

1. Remove secret from code
2. Use environment variables
3. If already committed, rotate the secret immediately

### Type Errors

Fix TypeScript errors manually:

- Add type annotations
- Fix type mismatches
- Resolve import errors

### Test Failures

Fix broken tests or update tests if requirements changed.

## Continuous Integration

**Future**: GitHub Actions workflow for automated checks on PRs.

**Configuration**: `.github/workflows/ci-scan-all.yml`

## Quality Metrics

Track quality through:

- Clean commit history (Conventional Commits)
- No security vulnerabilities (zero secrets committed)
- High test coverage (when implementation exists)
- Clean linting (zero warnings)

## Tools Configuration

All tools are configured to work together:

- Shared `base/configs/` for inheritance
- Project-specific `configs/` for overrides
- Consistent style across all tools

## Best Practices

1. **Run quality checks before committing**
2. **Never bypass Git hooks** (no `--no-verify`)
3. **Fix issues immediately**, don't accumulate technical debt
4. **Use automated tools**, not manual reviews
5. **Keep configurations in sync** across tools

## See Also

- `docs/dev-standards/05-coding-conventions.md` - Coding standards
- `docs/projects/development-tools.md` - Tool installation and usage
- `docs/projects/git-hooks.md` - Git hooks details
