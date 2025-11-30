# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles

**Project:** @aglabo/command-runner - Type-safe shell command execution library for Node.js
**Status:** Early development - infrastructure complete, core implementation pending

### Collaboration Rules

1. **Configuration inheritance is sacred** - Always extend from `base/configs/`, never duplicate
2. **Empty src/ is intentional** - Focus on infrastructure setup before implementation
3. **Test-type separation** - Unit/functional/integration/e2e have separate configs and caches
4. **Commit messages are AI-generated** - Never use `git commit -m`, let hooks handle it
5. **File headers required** - All source files need copyright headers (see Code Style)

### Protected Areas

- **DO NOT** modify `base/configs/*` without understanding inheritance chain
- **DO NOT** bypass Git hooks with `--no-verify`
- **DO NOT** commit to main branch directly (use feature branches)

## Technical Context

### Architecture Pattern: Configuration-Driven Design

```
base/configs/          → Shared base configurations
  ├── tsconfig.base.json
  ├── eslint.config.base.js
  ├── vitest.config.base.ts
  └── tsup.config.base.ts

configs/               → Project overrides (import from base/)
  ├── eslint.config.js           // extends base
  ├── vitest.config.unit.ts      // merges with base
  ├── vitest.config.functional.ts
  ├── vitest.config.integration.ts
  ├── vitest.config.e2e.ts
  └── tsup.config.esm.ts
```

**Key pattern:**
```javascript
import baseConfig from '../base/configs/xxx.config.base.js';
export default [...baseConfig, /* overrides */];
```

### Test Organization Strategy

- **Unit** (`src/**/__tests__/**/*.spec.ts`) - Sequential execution, excludes functional/
- **Functional** (`src/**/__tests__/functional/**/*`) - Feature-level tests
- **Integration** (`tests/**/*`) - External systems
- **E2E** - End-to-end workflows

Each has own cache: `.cache/vitest-cache/{type}/`

### Build Outputs

- `dist/` - TypeScript compiler output
- `lib/` - CommonJS (base config default)
- `module/` - ESM (project override)

### Tech Stack

- **Language:** TypeScript 5.9+ (ES2022, strict mode)
- **Runtime:** Node.js ≥20
- **Package Manager:** pnpm ≥10
- **Build:** tsup (bundler)
- **Test:** Vitest 4.x
- **Format:** dprint (120 chars, 2 spaces, single quotes, LF)
- **Lint:** ESLint 9.x flat config

## Development Workflow

### Essential Commands

```bash
# Setup
pnpm install && pnpm prepare

# Quality
pnpm format:dprint           # Format all code
pnpm check:types             # TypeScript check
pnpm lint:filenames          # Validate file names
pnpm lint:secrets            # CRITICAL: Check before commit

# Test (when code exists)
pnpm exec vitest --config ./configs/vitest.config.unit.ts
pnpm exec vitest --config ./configs/vitest.config.functional.ts

# Build (when ready)
pnpm clean
pnpm exec tsup --config ./configs/tsup.config.esm.ts
```

### Git Workflow: AI-Powered Commits

**Automatic** (recommended):
```bash
git add <files>
git commit              # Hook auto-generates message
```

**Manual preview**:
```bash
bash scripts/prepare-commit-msg.sh
bash scripts/prepare-commit-msg.sh --model claude-sonnet-4-5
```

**Format enforced by commitlint:**
```
type(scope): summary                    # MAX 72 chars, lowercase

- file1.ext:
  Description per file                  # MAX 100 chars/line
- file2.ext:
  Another description
```

Types: `feat|fix|chore|docs|test|refactor|perf|ci|config|build|deps`
Scopes: `config|scripts|docs|test`

**Git hooks (lefthook):**
- Pre-commit: gitleaks + secretlint (parallel)
- Prepare-commit-msg: AI message generation
- Commit-msg: commitlint validation

## Code Style

### TypeScript Patterns

**ESM __dirname:**
```typescript
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
```

**File headers (required):**
```typescript
// src: <relative-path>
// @(#) : <description>
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
```

### Path Handling (Windows)

Always use forward slashes or `path.join()`:
```typescript
✅ const p = path.join(__dirname, 'configs', 'file.js');
✅ const p = './configs/file.js';
❌ const p = '.\\configs\\file.js';
```

## Task Completion Checklist

Before marking task complete:

1. ✅ `pnpm format:dprint`
2. ✅ `pnpm check:types`
3. ✅ `pnpm lint:filenames && pnpm lint:secrets`
4. ✅ Run appropriate vitest config
5. ✅ Build succeeds (when applicable)
6. ✅ Commit via hook (not `-m`)

## Documentation

### Memory Files (serena-mcp, lsmcp)

- `project_overview.md` - Detailed project info
- `code_style_conventions.md` - Full style guide
- `suggested_commands.md` - Complete command reference
- `task_completion_checklist.md` - Detailed QA process
- `windows_environment.md` - Windows-specific info
- `lsmcp_index_info.md` - LSP symbol index status

### When Adding Source Code

Once `src/` has TypeScript files:
1. Create symbol index: `mcp__lsmcp__index_files({ pattern: "src/**/*.ts", root: "..." })`
2. Verify: `mcp__lsmcp__get_index_stats({ root: "..." })`
3. Update `lsmcp_index_info` memory

### Plugin Integration

Global plugin (optional): `~/.claude/plugins/marketplaces/claude-idd-framework-marketplace/`
- Slash commands: `/claude-idd-framework:idd-commit-message`, `/claude-idd-framework:idd-pr`
- Libraries: filename-utils, idd-session, prereq-check, io-utils

## Starting a Task

1. **Read existing patterns** - Check `base/configs/` before creating configs
2. **Understand test types** - Unit vs functional vs integration placement
3. **Check memories** - Review serena/lsmcp memories for context
4. **Plan build outputs** - Know if code goes to dist/, lib/, or module/
5. **Never skip hooks** - Let git hooks handle validation and messages

## Anti-Patterns to Avoid

❌ Creating new configs instead of extending base configs
❌ Writing commit messages manually with `-m`
❌ Putting tests in wrong directories (check test type)
❌ Using `\` backslashes in paths
❌ Skipping file headers in source files
❌ Committing without running `lint:secrets`
❌ Over-engineering (this is a library, keep it focused)
