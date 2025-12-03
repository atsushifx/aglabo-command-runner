# Claude Code Plugin Integration

This repository integrates with the **claude-idd-framework** plugin for enhanced development workflows.

## Plugin Overview

The claude-idd-framework plugin provides:

- Issue-Driven Development (IDD) workflows
- Git branch management from issues
- Pull request generation
- Shared bash libraries for scripting

## Installation

### Plugin Location

The plugin is installed in the **global** plugins directory (user-wide):

```bash
~/.claude/plugins/marketplaces/claude-idd-framework-marketplace/
```

**Important**: This is NOT included in the repository. Each developer must install it separately.

### Plugin Structure

```bash
~/.claude/
└── plugins/
    └── marketplaces/
        └── claude-idd-framework-marketplace/
            ├── .claude/
            │   ├── agents/           # Global agents
            │   └── commands/         # Slash commands
            │       ├── _libs/        # Shared bash libraries
            │       │   ├── filename-utils.lib.sh
            │       │   ├── idd-session.lib.sh
            │       │   ├── prereq-check.lib.sh
            │       │   └── io-utils.lib.sh
            │       └── *.md          # Command definitions
            └── plugin.json           # Plugin metadata
```

## Plugin vs Local Configuration

Understanding the distinction:

| Aspect           | Global Plugin               | Local Config (`.claude/`)   |
| ---------------- | --------------------------- | --------------------------- |
| **Scope**        | All projects for the user   | This repository only        |
| **Installation** | Installed once per user     | Committed to git            |
| **Location**     | `~/.claude/plugins/`        | `.claude/` in repository    |
| **Examples**     | IDD framework libraries     | commit-message-generator.md |
| **Purpose**      | Reusable utilities/commands | Project-specific agents     |
| **Sharing**      | User maintains their own    | Shared via git              |

## Using Plugin Libraries in Scripts

### Referencing Libraries

Bash scripts can source shared libraries from the plugin:

```bash
# Library path
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/claude-idd-framework-marketplace"
FRAMEWORK_LIBS="$PLUGIN_DIR/.claude/commands/_libs"

# Load libraries
source "$FRAMEWORK_LIBS/filename-utils.lib.sh"
source "$FRAMEWORK_LIBS/idd-session.lib.sh"
source "$FRAMEWORK_LIBS/prereq-check.lib.sh"
source "$FRAMEWORK_LIBS/io-utils.lib.sh"
```

### Available Libraries

#### filename-utils.lib.sh

**Purpose**: Filename and slug generation utilities.

**Key Functions**:

- `generate_slug()` - Convert titles to URL-safe slugs

**Example**:

```bash
source "$FRAMEWORK_LIBS/filename-utils.lib.sh"
slug=$(generate_slug "My Feature Title")
# Result: "my-feature-title"
```

#### idd-session.lib.sh

**Purpose**: Session file management for IDD workflows.

**Key Functions**:

- `_load_session()` - Load session data from file
- `_save_session()` - Save session data to file

**Example**:

```bash
source "$FRAMEWORK_LIBS/idd-session.lib.sh"
_load_session "issue" "$session_file"
_save_session "issue" "$session_file" "$data"
```

#### prereq-check.lib.sh

**Purpose**: Prerequisite validation for scripts.

**Key Functions**:

- `validate_git_full()` - Validate Git environment and repository

**Example**:

```bash
source "$FRAMEWORK_LIBS/prereq-check.lib.sh"
validate_git_full || exit 1
```

#### io-utils.lib.sh

**Purpose**: I/O utilities and error handling.

**Key Functions**:

- `error_print()` - Standardized error messages

**Example**:

```bash
source "$FRAMEWORK_LIBS/io-utils.lib.sh"
error_print "Something went wrong"
```

## Available Slash Commands

The plugin provides slash commands accessible in Claude Code:

### Issue Management

- `/claude-idd-framework:\idd\issue:new [title]` - Create new issue
- `/claude-idd-framework:\idd\issue:list` - List issue drafts
- `/claude-idd-framework:\idd\issue:edit` - Edit selected issue
- `/claude-idd-framework:\idd\issue:push [issue-number]` - Push issue to GitHub
- `/claude-idd-framework:\idd\issue:load <issue_number>` - Load GitHub issue

### Git Workflow

- `/claude-idd-framework:\idd\issue:branch [subcommand]` - Branch management from issues
  - `new` - Create new branch from issue
  - `commit` - Commit and update issue

### Commit and PR

- `/claude-idd-framework:idd-commit-message [--lang=ja|en]` - Generate commit message
- `/claude-idd-framework:idd-pr [--output=file]` - Generate pull request

### Development Workflow

- `/claude-idd-framework:sdd <subcommand>` - Spec-Driven Development workflow
  - `init namespace/module` - Initialize SDD project
  - `req` - Create requirements
  - `spec` - Create specifications
  - `tasks` - Generate tasks
  - `coding [task-group]` - Implement tasks
  - `commit` - Commit changes

- `/claude-idd-framework:validate-debug` - 6-stage quality validation workflow

### Helpers

- `/claude-idd-framework:_helpers:README` - Quick reference for helper functions
- `/claude-idd-framework:_helpers:_get-issue-types` - Determine issue/commit types
- `/claude-idd-framework:_helpers:_get-summary` - Validate and format summaries
- `/claude-idd-framework:_helpers:_edit-summary` - Interactive summary editing
- `/claude-idd-framework:_helpers:_select-from-list` - Interactive list selection

## Command Documentation

Full command documentation is available in:

```bash
~/.claude/plugins/marketplaces/claude-idd-framework-marketplace/.claude/commands/
```

Each `.md` file contains the command definition and usage instructions.

## Integration with This Repository

### Current Integration

This repository currently uses the plugin for:

- Shared bash libraries (if referenced in scripts)
- Slash commands (available to developers)

### Potential Integration Points

Scripts in `scripts/` could leverage plugin libraries:

- `prepare-commit-msg.sh` - Could use `filename-utils.lib.sh`
- Custom scripts - Could use `prereq-check.lib.sh` for validation

## Troubleshooting

### Plugin Not Found

**Cause**: Plugin not installed or installed in wrong location.

**Solution**:

1. Check if plugin exists: `ls ~/.claude/plugins/marketplaces/claude-idd-framework-marketplace/`
2. Install plugin if missing

### Library Not Found

**Cause**: Library path incorrect or plugin structure changed.

**Solution**:

1. Verify plugin structure
2. Update `FRAMEWORK_LIBS` path in script
3. Check library file exists

### Slash Commands Not Available

**Cause**: Plugin not loaded by Claude Code.

**Solution**:

1. Restart Claude Code
2. Check plugin configuration
3. Verify `plugin.json` is valid

## Best Practices

1. **Don't commit plugin files**: Plugin is user-specific, not repository-specific
2. **Document library usage**: If scripts use plugin libraries, document it
3. **Handle missing plugin gracefully**: Scripts should fail gracefully if plugin not installed
4. **Version compatibility**: Be aware of plugin version dependencies

## Example: Using Plugin Library

Script example using plugin library:

```bash
#!/bin/bash
# Script that uses plugin library

# Plugin library path
PLUGIN_DIR="$HOME/.claude/plugins/marketplaces/claude-idd-framework-marketplace"
FRAMEWORK_LIBS="$PLUGIN_DIR/.claude/commands/_libs"

# Check if plugin exists
if [[ ! -d "$PLUGIN_DIR" ]]; then
  echo "Error: claude-idd-framework plugin not found"
  echo "Install from: ~/.claude/plugins/marketplaces/claude-idd-framework-marketplace/"
  exit 1
fi

# Load library
source "$FRAMEWORK_LIBS/filename-utils.lib.sh" || {
  echo "Error: Failed to load filename-utils library"
  exit 1
}

# Use library function
title="My Feature Title"
slug=$(generate_slug "$title")
echo "Slug: $slug"
```

## Plugin Updates

The plugin is maintained separately from this repository.

**To update**:

1. Navigate to plugin directory
2. Pull latest changes (if git-based)
3. Or reinstall plugin

**Version checking**: Check `plugin.json` for version information.
