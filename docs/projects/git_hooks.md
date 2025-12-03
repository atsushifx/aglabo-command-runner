# Git Hooks and Security

This repository uses **lefthook** to manage Git hooks with parallel execution for performance.

## Hook Configuration

All hooks are configured in `lefthook.yml`.

### Installation

After cloning the repository:

```bash
lefthook install
# Or via npm/pnpm script:
pnpm prepare
```

## Pre-commit Hooks (Security Scanning)

Both tools run **in parallel** to detect secrets before commits:

### gitleaks

Detects secrets in staged files:

```bash
gitleaks protect --config ./configs/gitleaks.toml --staged
```

**Configuration**: `configs/gitleaks.toml`

Scans for:

- API keys
- AWS credentials
- Private keys
- Database credentials
- Generic secrets (passwords, tokens)

### secretlint

Static analysis for secrets:

```bash
secretlint --secretlintrc ./configs/secretlint.config.yaml \
  --secretlintignore .gitignore --maskSecrets "{staged_files}"
```

**Configuration**: `configs/secretlint.config.yaml`

Provides additional secret detection patterns and rules.

## Prepare-commit-msg Hook

<!-- markdownlint-disable line-length -->

Automatically generates commit messages:

```bash
scripts/prepare-commit-msg.sh --to-buffer
```

Runs after `git commit` but before the editor opens. Analyzes staged changes and generates a Conventional Commits format message.

See `docs/commit_message_system.md` for details.

<!-- maridownlint-enable -->

## Commit-msg Hook

Validates commit messages:

```bash
commitlint --config ./configs/commitlint.config.js --edit
```

**Configuration**: `configs/commitlint.config.js`

Enforces:

- Conventional Commits format
- 72-character header limit
- 100-character body line limit
- Lowercase subject start

## Hook Execution Flow

1. **Stage changes**: `git add <files>`
2. **Start commit**: `git commit`
3. **Pre-commit runs** (parallel):
   - gitleaks scans staged files
   - secretlint analyzes content
   - If either fails, commit is blocked
4. **Prepare-commit-msg runs**:
   - Generates commit message
   - Populates editor buffer
5. **Edit message** (optional)
6. **Save and close editor**
7. **Commit-msg runs**:
   - Validates message format
   - If invalid, commit is blocked
8. **Commit completes** (if all hooks pass)

## Manual Hook Execution

Test hooks without committing:

```bash
# Run pre-commit hooks
lefthook run pre-commit

# Run commit-msg validation
lefthook run commit-msg
```

## Troubleshooting

### Hooks Not Running

Reinstall hooks:

```bash
lefthook install
```

### Secret Detection False Positives

If gitleaks or secretlint report false positives:

1. **Verify** it's actually not a secret
2. **Add exception** to configuration:
   - For gitleaks: Edit `configs/gitleaks.toml` (add to `allowlist`)
   - For secretlint: Edit `configs/secretlint.config.yaml`

### Bypassing Hooks (NOT RECOMMENDED)

Never bypass security hooks:

```bash
# DON'T DO THIS
git commit --no-verify
```

If you must bypass for legitimate reasons, ensure:

- No secrets are present
- Manual review is performed
- The reason is documented

## Hook Performance

Hooks run in parallel where possible:

- Pre-commit: gitleaks and secretlint run simultaneously
- Execution time: Typically < 2 seconds for small changesets

## What Gets Scanned

Pre-commit hooks scan:

- All staged files (`git add`ed files)
- Content of modifications (not entire file history)
- New files being added

They do NOT scan:

- Unstaged changes
- Untracked files (unless added)
- Git history (use `gitleaks detect` for that)

## Security Best Practices

1. **Always run hooks**: Never use `--no-verify`
2. **Review scan results**: Understand why a secret was detected
3. **Rotate exposed secrets**: If a secret was committed, rotate it immediately
4. **Use environment variables**: Never hardcode secrets
5. **Use .env files**: Store local secrets in `.env` (gitignored)
6. **Manual verification**: Run `pnpm lint:secrets` before committing
