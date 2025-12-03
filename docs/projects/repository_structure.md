# Repository Structure

Complete directory structure for this template project.

## Directory Tree

```bash
.
├── .claude/              # Local Claude Code configuration (repository-specific)
│   ├── agents/           # AI agent configurations
│   │   └── commit-message-generator.md
│   └── commands/         # Custom Claude Code commands (if any)
├── .github/              # GitHub-specific files
│   ├── workflows/        # GitHub Actions workflows
│   │   └── ci-scan-all.yml
│   ├── rulesets/         # Repository rulesets
│   │   └── template-ruleset-protect-default.json
│   ├── dependabot.yml    # Dependency updates configuration
│   └── SECURITY.md       # Security policy
├── .lsmcp/               # lsmcp MCP server data
│   └── memories/         # Project memories
├── .serena/              # serena-mcp MCP server data
│   └── memories/         # Project memories
├── .vscode/              # VSCode configuration
│   ├── cspell.json       # Spell checker config
│   └── cspell/           # Custom dictionaries
│       └── dicts/
│           └── project.dic
├── base/                 # Shared base configurations
│   └── configs/          # Base configs for inheritance
│       ├── tsconfig.base.json
│       ├── eslint.config.base.js
│       ├── eslint.config.rules.typed.js
│       ├── eslint.config.typed.base.js
│       ├── vitest.config.base.ts
│       └── tsup.config.base.ts
├── configs/              # Tool configurations
│   ├── .markdownlint.yaml
│   ├── .textlint/        # textlint dictionaries
│   │   ├── allowlist.yml
│   │   └── dict/
│   │       ├── prh.yml
│   │       └── prh-my-settings.yml
│   ├── commitlint.config.js
│   ├── eslint.config.js
│   ├── eslint.config.typed.js
│   ├── gitleaks.toml
│   ├── ls-lint.yaml
│   ├── secretlint.config.yaml
│   ├── textlintrc.yaml
│   ├── tsconfig.base.json
│   ├── tsup.config.esm.ts
│   ├── vitest.config.unit.ts
│   ├── vitest.config.functional.ts
│   ├── vitest.config.integration.ts
│   └── vitest.config.e2e.ts
├── docs/                 # Documentation
│   ├── commit_message_system.md
│   ├── development_tools.md
│   ├── git_hooks.md
│   ├── mcp_servers.md
│   ├── plugin_integration.md
│   ├── repository_structure.md (this file)
│   └── using_template.md
├── scripts/              # Development scripts
│   ├── common/           # Shared PowerShell functions
│   │   ├── init.ps1
│   │   └── CommonFunctions.ps1
│   ├── libs/             # PowerShell libraries
│   │   ├── AgDevMode.ps1
│   │   └── AgInstaller.ps1
│   ├── install-dev-tools.ps1
│   ├── install-doc-tools.ps1
│   └── prepare-commit-msg.sh
├── shared/               # Shared code/configs
│   └── constants/        # Shared constants (empty)
├── src/                  # Source code (NOT YET CREATED)
│   ├── index.ts          # Main entry point (to be created)
│   ├── core/             # Core functionality (to be created)
│   └── __tests__/        # Test files (to be created)
│       ├── unit/
│       ├── functional/
│       ├── integration/
│       └── e2e/
├── temp/                 # Temporary files (gitignored)
├── .cache/               # Build caches (gitignored)
│   ├── tsbuild-cache/
│   ├── vitest-cache/
│   ├── cspell/
│   └── textlint-cache/
├── dist/                 # Build output (gitignored, not created yet)
├── module/               # ESM module output (gitignored, not created yet)
├── .editorconfig         # Editor configuration
├── .gitignore            # Git ignore patterns
├── .mcp.json             # MCP server configuration
├── CLAUDE.md             # Claude Code instructions
├── CONTRIBUTING.ja.md    # Japanese contribution guidelines
├── CONTRIBUTING.md       # Contribution guidelines
├── dprint.jsonc          # Code formatter configuration
├── lefthook.yml          # Git hooks configuration
├── LICENSE               # MIT License (English)
├── LICENSE.ja            # MIT License (Japanese)
├── package.json          # Node.js package configuration
├── pnpm-lock.yaml        # pnpm lockfile
├── README.ja.md          # Japanese README
├── README.md             # README
└── tsconfig.json         # Root TypeScript configuration
```

## Directory Purposes

### .claude/

**Purpose**: Local Claude Code configuration for this repository.

**Contents**:

- `agents/` - AI agent configurations (commit-message-generator.md)
- `commands/` - Custom slash commands (if any)

**Version Control**: Committed to git, shared with all users.

### .github/

**Purpose**: GitHub-specific files for CI/CD, security, and repository management.

**Contents**:

- `workflows/ci-scan-all.yml` - GitHub Actions workflow for security scanning
- `rulesets/` - Repository protection rules
- `dependabot.yml` - Automated dependency updates
- `SECURITY.md` - Security policy and vulnerability reporting

### .lsmcp/ and .serena/

**Purpose**: MCP server data directories.

**Contents**: Project-specific memories maintained by MCP servers.

**Version Control**: Gitignored (local data).

### .vscode/

**Purpose**: VSCode editor configuration.

**Contents**:

- `cspell.json` - Spell checker configuration
- `cspell/dicts/project.dic` - Custom dictionary

### base/

**Purpose**: Shared base configurations for inheritance.

**Contents**: Base configuration files extended by project-specific configs:

- TypeScript, ESLint, Vitest, tsup base configs

**Pattern**: `base/configs/*.base.*` → `configs/*.*`

### configs/

**Purpose**: Project-specific tool configurations.

**Contents**: All configuration files for development tools:

- Linters (ESLint, textlint, markdownlint, ls-lint)
- Security (gitleaks, secretlint)
- Build (tsup, TypeScript)
- Tests (Vitest - unit, functional, integration, e2e)
- Commit (commitlint)

### docs/

**Purpose**: Detailed documentation.

**Contents**: Comprehensive guides referenced from CLAUDE.md:

- Commit message system
- Git hooks
- Development tools
- MCP servers
- Plugin integration
- Repository structure
- Template usage

### scripts/

**Purpose**: Development automation scripts.

**Contents**:

- **PowerShell scripts** (.ps1) - Windows tool installers
- **Bash scripts** (.sh) - Git hook scripts
- **common/** - Shared PowerShell functions
- **libs/** - PowerShell libraries

### shared/

**Purpose**: Shared code and configurations across workspace packages.

**Contents**: `constants/` directory (currently empty).

### src/

**Purpose**: Source code (TypeScript implementation).

**Status**: **NOT YET CREATED** (template project).

**Structure** (to be created):

```bash
src/
├── index.ts              # Main entry point
├── core/                 # Core functionality
│   └── *.ts
├── utils/                # Utility functions
│   └── *.ts
└── __tests__/            # Tests
    ├── unit/             # Unit tests (*.spec.ts)
    ├── functional/       # Functional tests (*.test.ts)
    ├── integration/      # Integration tests
    └── e2e/              # End-to-end tests
```

### temp/

**Purpose**: Temporary files during development.

**Status**: Gitignored.

### .cache/

**Purpose**: Build and tool caches.

**Contents**:

- `tsbuild-cache/` - TypeScript incremental build
- `vitest-cache/` - Vitest test results
- `cspell/` - Spell checker cache
- `textlint-cache/` - Textlint cache

**Status**: Gitignored.

### dist/ and module/

**Purpose**: Build output directories.

**Contents**:

- `dist/` - Compiled JavaScript
- `module/` - ESM module output

**Status**: Gitignored, not created until first build.

## Configuration Files

### Root Configuration

- `.editorconfig` - Editor settings (UTF-8, LF, 2-space indent)
- `.gitignore` - Git ignore patterns
- `.mcp.json` - MCP server configuration
- `dprint.jsonc` - Code formatter (120-char lines, LF endings)
- `lefthook.yml` - Git hooks (pre-commit, prepare-commit-msg, commit-msg)
- `package.json` - Node.js package config
- `tsconfig.json` - Root TypeScript config (extends base)

### Documentation

- `CLAUDE.md` - Claude Code instructions (this is the key file)
- `README.md` / `README.ja.md` - Project README
- `CONTRIBUTING.md` / `CONTRIBUTING.ja.md` - Contribution guidelines
- `LICENSE` / `LICENSE.ja` - MIT License

## File Naming Conventions

Enforced by ls-lint (`configs/ls-lint.yaml`):

- Config files use `*.config.js` or `*.config.ts` extensions
- Test files use `*.spec.ts` or `*.test.ts` extensions
- TypeScript files use `*.ts` or `*.tsx` extensions
- JavaScript files use `*.js`, `*.cjs`, or `*.mjs` extensions

## Configuration Inheritance Pattern

```bash
base/configs/*.base.*
    ↓ extends
configs/*.*
    ↓ extends
<root config>
```

**Example**:

```bash
base/configs/tsconfig.base.json
    ↓ extends
configs/tsconfig.base.json
    ↓ extends
tsconfig.json
```

## Gitignored Directories

These directories are not committed to git:

- `node_modules/` - Dependencies
- `dist/` - Build output
- `module/` - ESM output
- `.cache/` - Tool caches
- `temp/` - Temporary files
- `.lsmcp/` - lsmcp data
- `.serena/` - serena-mcp data

## Important Files for Claude Code

When working with this repository, pay special attention to:

1. **CLAUDE.md** - Main instructions
2. **docs/*.md** - Detailed documentation
3. **configs/** - Tool configurations
4. **lefthook.yml** - Git hooks
5. **package.json** - Available scripts
6. **.mcp.json** - MCP server config
