# Development Tools

Tools are **not bundled** with the repository. Install using automated scripts or manually.

## Automated Installation (Windows)

### Install All Development Tools

```powershell
.\scripts\install-dev-tools.ps1
```

Installs:

- **lefthook** - Git hook manager
- **dprint** - Code formatter
- **gitleaks** - Secret detection
- **dotenvx** - Environment variable manager
- **commitlint** - Commit message linting
- **@commitlint/cli** - Commitlint CLI
- **@commitlint/config-conventional** - Conventional Commits config
- **secretlint** - Secret static analysis
- **cspell** - Spell checker

### Install Documentation Tools

```powershell
.\scripts\install-doc-tools.ps1
```

Installs:

- **textlint** - Text linting
- **textlint-rule-preset-ja-technical-writing** - Japanese technical writing rules
- **markdownlint-cli2** - Markdown linting
- **cspell** - Spell checker

### Script Structure

PowerShell scripts are organized with shared libraries:

```bash
scripts/
├── install-dev-tools.ps1       # Main dev tools installer
├── install-doc-tools.ps1       # Doc tools installer
├── prepare-commit-msg.sh       # Bash: commit message generator
├── common/                     # Shared initialization
│   ├── init.ps1
│   └── CommonFunctions.ps1
└── libs/                       # Reusable libraries
    ├── AgDevMode.ps1           # Development mode utilities
    └── AgInstaller.ps1         # Package installation utilities
```

## Manual Installation

### Package Managers

- Scoop: Windows binary tools
- WinGet: Windows applications
- pnpm: Node.js global packages

### Tool Installation Table

| Tool         | Purpose                      | Installation                        |
| ------------ | ---------------------------- | ----------------------------------- |
| lefthook     | Git hook manager             | `scoop install lefthook`            |
| delta        | Visual Git diff viewer       | `scoop install delta`               |
| dprint       | Code formatter               | `scoop install dprint`              |
| gitleaks     | Secret detection             | `scoop install gitleaks`            |
| dotenvx      | Environment variable manager | `winget install dotenvx.dotenvx`    |
| commitlint   | Commit message linting       | `pnpm install -g @commitlint/cli`   |
| secretlint   | Secret static analysis       | `pnpm install -g secretlint`        |
| cspell       | Spell checker                | `pnpm install -g cspell`            |
| textlint     | Text linting                 | `pnpm install -g textlint`          |
| markdownlint | Markdown linting             | `pnpm install -g markdownlint-cli2` |
| ls-lint      | File naming linter           | `pnpm install -g @ls-lint/ls-lint`  |

## Tool Purposes

### Security Tools

**gitleaks** - Detects secrets in code:

- API keys, passwords, tokens
- AWS credentials, private keys
- Database connection strings
- Configuration: `configs/gitleaks.toml`

**secretlint** - Static secret analysis:

- Additional detection patterns
- Custom rules support
- Configuration: `configs/secretlint.config.yaml`

### Quality Tools

**commitlint** - Commit message validation:

- Enforces Conventional Commits
- Character limits (72/100)
- Configuration: `configs/commitlint.config.js`

**ESLint** - JavaScript/TypeScript linting:

- Flat config (ESLint 9.x)
- TypeScript-aware rules
- Configurations: `configs/eslint.config.js`, `configs/eslint.config.typed.js`

**textlint** - Text quality checking:

- Japanese/English technical writing rules
- Custom dictionaries
- Configuration: `configs/textlintrc.yaml`

**markdownlint** - Markdown formatting:

- Consistent Markdown style
- Configuration: `configs/.markdownlint.yaml`

**cspell** - Spell checking:

- Code and documentation
- Custom dictionary support
- Configuration: `.vscode/cspell.json`

**ls-lint** - File naming conventions:

- Enforces naming patterns
- Configuration: `configs/ls-lint.yaml`

### Formatting Tools

**dprint** - Code formatter:

- TypeScript, JavaScript, JSON, Markdown
- 120-character line width
- 2-space indentation, LF line endings
- Configuration: `dprint.jsonc`

### Build and Test Tools

**tsup** - TypeScript bundler:

- Fast ESM/CJS builds
- Configuration: `configs/tsup.config.esm.ts`

**Vitest** - Testing framework:

- Unit, functional, integration, e2e configs
- Configurations: `configs/vitest.config.*.ts`

### Utility Tools

**lefthook** - Git hook manager:

- Parallel hook execution
- Fast, Go-based
- Configuration: `lefthook.yml`

**delta** - Git diff viewer:

- Syntax highlighting
- Side-by-side diffs
- Automatic integration with git

**dotenvx** - Environment variable manager:

- Encrypted .env files
- Cross-platform
- Secure secret management

## Tool Verification

Check installed versions:

```bash
# Core tools
node --version
pnpm --version
git --version

# TypeScript
pnpm tsc --version

# Git tools
lefthook version
gitleaks version
delta --version

# Linters
pnpm exec commitlint --version
pnpm exec eslint --version
pnpm exec textlint --version
pnpm exec markdownlint-cli2 --version

# Formatters
dprint --version

# Others
cspell --version
dotenvx --version
```

## Available npm/pnpm Scripts

From `package.json`:

<!-- markdownlint-disable line-length -->

```json
{
  "prepare": "lefthook install",
  "clean": "pnpm rimraf dist",
  "format:dprint": "dprint fmt",
  "check:dprint": "dprint check",
  "check:types": "pnpm -r run check:types",
  "check:spells": "cspell --config .vscode/cspell.json --cache --cache-location .cache/cspell/cSpellCache",
  "lint:filenames": "pnpm exec ls-lint --config ./configs/ls-lint.yaml",
  "lint:text": "textlint --config ./configs/textlintrc.yaml --cache --cache-location .cache/textlint-cache/textlintCache",
  "lint:markdown": "markdownlint-cli2 --config ./configs/.markdownlint.yaml",
  "lint:secrets": "secretlint --secretlintrc ./configs/secretlint.config.yaml --secretlintignore .gitignore --maskSecrets **/*"
}
```

<!-- markdownlint-enable -->

## Platform-Specific Notes

### Windows

- Uses **PowerShell** for `.ps1` scripts
- Uses **Git Bash** for `.sh` scripts
- Line endings: LF enforced (not CRLF)
- Path separators: Forward slashes in code

### WSL Support

This project can be developed in WSL:

```bash
cd /mnt/c/Users/atsushifx/workspaces/develop/aglabo-command-runner
```

Ensure line endings remain LF when switching between Windows and WSL.

## Troubleshooting

### PowerShell Execution Policy

If scripts fail to run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Missing Tools

Reinstall using scripts or manually install missing tools.

### Cache Issues

Clear tool caches:

```bash
# PowerShell
Remove-Item -Recurse -Force .cache

# Git Bash
rm -rf .cache
```
