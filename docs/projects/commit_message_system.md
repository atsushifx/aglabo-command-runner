# Commit Message Generation System

This repository uses an automated commit message generation system powered by AI.

## How It Works

### Automatic Generation

The `prepare-commit-msg` Git hook automatically generates commit messages:

```bash
# Hook is triggered by lefthook (configured in lefthook.yml)
scripts/prepare-commit-msg.sh --to-buffer
```

When you run `git commit` without `-m`, the script:

1. Analyzes last 10 commits for project conventions
2. Examines staged changes via `git diff --cached`
3. Generates Conventional Commits format message
4. Populates the commit message buffer

### Manual Generation

Preview the message before committing:

```bash
bash scripts/prepare-commit-msg.sh
```

## Message Format

All messages follow **Conventional Commits** with strict limits:

```text
type(scope): summary                    # Header: MAX 72 characters

- file1.ext:
  Description of changes                # Body: MAX 100 characters per line
- file2.ext:
  Description of changes
```

### Character Limits (enforced by commitlint)

- Header: 72 characters maximum
- Body lines: 100 characters maximum
- Subject: Must start with lowercase

### Commit Types

- `feat` - New feature
- `fix` - Bug fix
- `chore` - Routine task, maintenance
- `docs` - Documentation only
- `test` - Adding or updating tests
- `refactor` - Code change without fixing bugs or adding features
- `perf` - Performance improvement
- `ci` - CI/CD related changes
- `config` - Configuration changes
- `release` - Release-related commits
- `merge` - Merge commits
- `build` - Build system or external dependencies
- `style` - Non-functional code style changes
- `deps` - Dependency updates

### Scope Guidelines

- Configuration files (`configs/`, `*.yaml`, `*.json`): `config`
- Scripts (`scripts/`, `*.sh`, `*.ps1`): `scripts`
- Documentation (`docs/`, `*.md`): `docs`
- Tests (`__tests__/`, `tests/`): `test`

## AI Model Selection

The generator supports multiple AI models via `--model` option:

```bash
# OpenAI models (via codex CLI)
scripts/prepare-commit-msg.sh --model gpt-5
scripts/prepare-commit-msg.sh --model o1-mini

# Anthropic models (via claude CLI)
scripts/prepare-commit-msg.sh --model claude-sonnet-4-5
scripts/prepare-commit-msg.sh --model haiku
scripts/prepare-commit-msg.sh --model sonnet
scripts/prepare-commit-msg.sh --model opus
```

**Default model**: `gpt-5`

## Agent Configuration

The commit message generation logic is defined in:

- Agent file: `.claude/agents/commit-message-generator.md`
- Script implementation: `scripts/prepare-commit-msg.sh`

The agent analyzes:

1. Last 10 commits (`git log --oneline -10`) for project conventions
2. Staged changes (`git diff --cached`) for modifications
3. File-by-file changes with detailed descriptions

## File-by-file Descriptions

Messages describe changes **per file**, not as generic summaries.

**Good Example:**

```text
feat(scripts): add automatic commit message generation

- scripts/prepare-commit-msg.sh:
  Implement Codex CLI integration for commit message generation
- lefthook.yml:
  Add prepare-commit-msg hook configuration
```

**Bad Example:**

```text
feat: add new feature

Added commit message generation functionality
```

## Tips

- Let the system generate messages - don't write manually
- Preview with `bash scripts/prepare-commit-msg.sh` before committing
- Review and edit the generated message if needed
- If changes are too complex, split into multiple commits
- Ensure staged changes represent a logical unit of work
