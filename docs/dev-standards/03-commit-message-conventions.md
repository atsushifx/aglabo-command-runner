# Commit Message Conventions

Commit message standards following Conventional Commits specification.

## Format

```markdown
type(scope): summary

- file1.ext:
  Description of changes
- file2.ext:
  Description of changes
```

## Character Limits

**Enforced by commitlint**:

- Header (`type(scope): summary`): 72 characters maximum
- Body lines: 100 characters maximum
- Subject: Must start with lowercase

## Commit Types

### Primary Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation only
- **chore** - Routine task, maintenance
- **test** - Adding or updating tests
- **refactor** - Code change without fixing bugs or adding features

### Additional Types

- **perf** - Performance improvement
- **ci** - CI/CD related changes
- **config** - Configuration changes
- **release** - Release-related commits
- **merge** - Merge commits
- **build** - Build system or external dependencies
- **style** - Non-functional code style changes
- **deps** - Dependency updates

## Scope Guidelines

- **config** - Configuration files (`configs/`, `*.yaml`, `*.json`)
- **scripts** - Scripts (`scripts/`, `*.sh`, `*.ps1`)
- **docs** - Documentation (`docs/`, `*.md`)
- **test** - Test files (`__tests__/`, `*.spec.ts`, `*.test.ts`)

## Examples

### Good Examples

**Feature addition**:

```markdown
feat(scripts): add automatic commit message generation

- scripts/prepare-commit-msg.sh:
  Implement AI integration for commit message generation
- lefthook.yml:
  Add prepare-commit-msg hook configuration
```

**Bug fix**:

```markdown
fix(config): correct gitleaks secret detection pattern

- configs/gitleaks.toml:
  Update regex pattern for API key detection
```

**Documentation**:

```markdown
docs: update development workflow guide

- docs/dev-standards/02-development-workflow.md:
  Add troubleshooting section for common issues
```

### Bad Examples

**Too generic**:

```markdown
feat: add new feature

Added some functionality
```

**Too long header**:

```markdown
feat(scripts): add automatic commit message generation system with AI integration and validation (90 chars)
```

**Uppercase subject**:

```markdown
feat(scripts): Add commit message generator
```

**No file details**:

```markdown
fix: fix bug

Fixed the issue
```

## Automated Generation

**CRITICAL**: Commit messages are automatically generated.

```bash
# Automatic (during commit)
git commit

# Manual preview
bash scripts/prepare-commit-msg.sh
```

**What the system does**:

1. Analyzes last 10 commits for project conventions
2. Examines staged changes via `git diff --cached`
3. Generates Conventional Commits format message
4. Validates against commitlint rules

**AI models supported**:

- OpenAI: `gpt-5` (default), `o1-mini`
- Anthropic: `claude-sonnet-4-5`, `haiku`, `sonnet`, `opus`

## Validation

Commit messages are validated by **commitlint** (commit-msg hook).

**Rules**:

- Type must be valid (feat, fix, docs, etc.)
- Header max 72 characters
- Body lines max 100 characters
- Subject must start with lowercase
- No period at end of subject

**Configuration**: `configs/commitlint.config.js`

## Breaking Changes

For breaking changes, add `!` after type/scope:

```markdown
feat(api)!: change authentication method

BREAKING CHANGE: OAuth replaced with JWT tokens

- src/auth/oauth.ts:
  Remove OAuth authentication
- src/auth/jwt.ts:
  Add JWT token-based authentication
```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [commitlint](https://commitlint.js.org/)

## See Also

- `docs/projects/commit-message-system.md` - Detailed implementation
- `docs/projects/git-hooks.md` - Git hooks configuration
