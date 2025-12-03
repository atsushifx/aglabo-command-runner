# Development Workflow

Standard development workflow for contributing to this project.

## Workflow Overview

1. Create feature branch
2. Make changes following standards
3. Run quality checks
4. Commit with auto-generated message
5. Push and create pull request

## Branch Strategy

### Branch Types

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation changes
- `chore/*` - Maintenance tasks

### Branch Naming

```bash
# Feature
feature/add-logging-support

# Fix
fix/resolve-memory-leak

# Docs
docs/update-readme

# Chore
chore/update-dependencies
```

## Development Cycle

### 1. Create Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

**For template project**:

- Edit configuration files in `configs/` or `base/configs/`
- Update documentation in `docs/`
- Modify scripts in `scripts/`
- Update tooling configuration

**For implementation**:

- Create `src/` directory structure
- Write TypeScript code
- Write tests in `src/__tests__/`

### 3. Quality Assurance

**Pre-commit checklist** (automated via Git hooks):

```bash
# Format
pnpm format:dprint

# Lint
pnpm lint:filenames
pnpm lint:text
pnpm lint:markdown

# Spell check
pnpm check:spells

# Security (CRITICAL)
pnpm lint:secrets
```

**For implementation code**:

```bash
# Type check
pnpm check:types

# Tests
pnpm test:unit
pnpm test

# Build
pnpm build
```

### 4. Commit Changes

**IMPORTANT**: Do NOT write commit messages manually.

```bash
# Stage changes
git add .

# Commit (message auto-generated)
git commit
```

**What happens**:

1. Pre-commit hooks run (gitleaks, secretlint)
2. Prepare-commit-msg generates message using AI
3. Commit-msg validates format
4. Commit completes if all pass

**Manual preview**:

```bash
bash scripts/prepare-commit-msg.sh
```

### 5. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to GitHub repository
2. Click "New pull request"
3. Select your branch
4. Fill in PR description (use commit message as reference)
5. Submit PR

## Commit Message Format

Messages follow **Conventional Commits** format (auto-generated):

```text
type(scope): summary (max 72 chars)

- file1.ext:
  Description (max 100 chars per line)
- file2.ext:
  Description
```

**Types**:

- Primary: `feat`, `fix`, `docs`, `chore`
- Primary (continued): `test`, `refactor`
- Additional: `perf`, `ci`, `config`, `merge`
- Additional (continued): `build`, `style`, `deps`

See `docs/dev-standards/03-commit-message-conventions.md` for details.

## Quality Gates

All commits must pass:

1. Format check (dprint)
2. File naming (ls-lint)
3. Text quality (textlint, markdownlint)
4. Spelling (cspell)
5. Security (gitleaks, secretlint) - CRITICAL
6. Type safety (TypeScript, if src/ exists)
7. Tests (Vitest, if tests exist)
8. Commit format (commitlint)

## Troubleshooting

### Hooks Fail

If pre-commit hooks fail:

- Review error messages
- Fix issues
- Re-stage and commit

### Secret Detected

If gitleaks or secretlint detects a secret:

1. **Remove the secret** immediately
2. Use environment variables instead
3. If already committed, rotate the secret

### Commit Message Invalid

If commitlint rejects message:

- Let the auto-generator create it
- Follow character limits (72/100)
- Use lowercase subject

## Best Practices

1. **Small commits**: One logical change per commit
2. **Auto-generated messages**: Always use the automated system
3. **Security first**: Never commit secrets
4. **Quality checks**: Run before committing
5. **Frequent commits**: Commit often, push regularly

## AI-Assisted Development

This project supports AI-assisted development:

- MCP servers (serena-mcp, lsmcp) for code navigation
- Claude Code integration
- Automated commit message generation

See `docs/dev-standards/06-ai-assisted-development.md` for details.
