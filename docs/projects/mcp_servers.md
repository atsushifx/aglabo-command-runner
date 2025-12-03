# MCP Server Integration

This repository is configured to work with two MCP servers.
They provide enhanced development capabilities for Claude Code.

## Overview

- serena-mcp: Semantic code navigation and symbolic manipulation
- lsmcp: LSP-based code intelligence

Both servers maintain project-specific memories to retain knowledge across sessions.

## serena-mcp (Semantic Code Navigation)

<!-- markdownlint-disable no-duplicate-heading -->>

### Features

- Symbol search: Find classes, functions, methods by name or pattern
- Code editing: Replace symbol bodies, insert before/after symbols
- Reference finding: Find all references to a symbol
- Symbol overview: Get high-level understanding of file structure
- Pattern search: Flexible regex-based code search
- Memory system: Project-specific memory for codebase knowledge

### Usage Examples

```typescript
// Find symbols by name
mcp__plugin_claude - idd - framework_serena - mcp__find_symbol({
  name_path_pattern: 'CommandRunner',
  relative_path: 'src',
});

// Get file overview
mcp__plugin_claude - idd - framework_serena - mcp__get_symbols_overview({
  relative_path: 'src/core/command-runner.ts',
});

// Search for pattern
mcp__plugin_claude - idd - framework_serena - mcp__search_for_pattern({
  substring_pattern: 'function\\s+\\w+',
  relative_path: 'src',
});

// Find references
mcp__plugin_claude - idd - framework_serena - mcp__find_referencing_symbols({
  name_path: 'CommandRunner',
  relative_path: 'src/core/command-runner.ts',
});
```

### Current Status

⚠️ Template Stage: No source code in `src/` yet, so symbol search will return empty results.

**Can be used for**:

- Configuration files in `configs/` and `base/configs/`
- After creating `src/` directory with implementation

### Memories

serena-mcp maintains these project memories:

- `project_overview` - Project structure and tech stack
- `code_style_conventions` - Coding standards and conventions
- `windows_environment` - Windows-specific development info
- `suggested_commands` - Common development commands
- `task_completion_checklist` - Pre-commit quality gates

**Access memories**:

```typescript
// List all memories
mcp__plugin_claude - idd - framework_serena - mcp__list_memories();

// Read a memory
mcp__plugin_claude - idd - framework_serena - mcp__read_memory({
  memory_file_name: 'project_overview',
});

// Write a memory
mcp__plugin_claude - idd - framework_serena - mcp__write_memory({
  memory_file_name: 'new_memory',
  content: 'Memory content here',
});
```

## lsmcp (LSP-based Code Intelligence)

### Features

- Document symbols: Get symbol tree for any TypeScript file
- Go to definition: Navigate to symbol definitions
- Find references: Find all references to a symbol
- Hover information: Get type information and documentation
- Rename symbol: Refactor symbol names across the codebase
- Diagnostics: Get TypeScript errors and warnings
- Code formatting: Format TypeScript files
- Code actions: Get quick fixes and refactorings

### Usage Examples

```typescript
// Get symbols from a file
mcp__lsmcp__lsp_get_document_symbols({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'configs/vitest.config.unit.ts',
});

// Get definition
mcp__lsmcp__lsp_get_definitions({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'configs/tsup.config.esm.ts',
  line: 10,
  symbolName: 'baseConfig',
});

// Get hover information
mcp__lsmcp__lsp_get_hover({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'configs/eslint.config.js',
  line: 10,
  textTarget: 'ignores',
});

// Find references
mcp__lsmcp__lsp_find_references({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'base/configs/vitest.config.base.ts',
  line: 15,
  symbolName: 'baseConfig',
});

// Rename symbol
mcp__lsmcp__lsp_rename_symbol({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'src/utils.ts',
  textTarget: 'oldName',
  newName: 'newName',
});

// Get diagnostics
mcp__lsmcp__lsp_get_diagnostics({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'src/index.ts',
});

// Format document
mcp__lsmcp__lsp_format_document({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  relativePath: 'src/index.ts',
  applyChanges: true,
});
```

### Current Status

✅ Fully Functional: LSP works on all TypeScript/JavaScript files immediately.

**Can be used for**:

- Configuration files (TypeScript, JavaScript)
- After creating `src/` directory with implementation

### Memory

lsmcp maintains:

- `lsmcp_index_info` - Symbol index status and usage guidance

**Access memory**:

```typescript
// List memories
mcp__lsmcp__list_memories({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
});

// Read memory
mcp__lsmcp__read_memory({
  root: 'C:\\Users\\atsushifx\\workspaces\\develop\\aglabo-command-runner',
  memoryName: 'lsmcp_index_info',
});
```

## When to Use Which Server

### Use serena-mcp when

- Searching for symbols by name pattern
- Getting high-level overview of file structure
- Editing symbol bodies (replace, insert)
- Finding all references to a symbol
- Using regex-based pattern search
- Working with project memories

### Use lsmcp when

- Navigating to symbol definitions
- Getting type information (hover)
- Renaming symbols across the codebase
- Getting TypeScript diagnostics/errors
- Formatting code
- Getting code actions (quick fixes)
- Using LSP-specific features

## Best Practices

1. Check memories first: Review serena-mcp memories before asking about project structure or conventions.

2. **Use symbolic tools**: Prefer symbolic tools (serena-mcp, lsmcp) over reading entire files.

3. **LSP for navigation**: Use lsmcp for type-aware navigation and refactoring.

4. **serena-mcp for search**: Use serena-mcp for broad symbol search and overview.

5. **Update memories**: Keep project memories current as the codebase evolves.

## Configuration

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "serena-mcp": {
      "command": "...",
      "args": ["..."]
    },
    "lsmcp": {
      "command": "...",
      "args": ["..."]
    }
  }
}
```

## Troubleshooting

### serena-mcp returns empty results

**Cause**: No source code in `src/` directory yet (template project).

**Solution**: Create `src/` and add TypeScript files, or use on configuration files.

### lsmcp not finding symbols

**Cause**: LSP server not initialized or file not in TypeScript project.

**Solution**: Ensure file is included in `tsconfig.json` and LSP server is running.

### Memories not updating

**Cause**: Memories are manually managed.

**Solution**: Use `write_memory` to update project knowledge.

## Symbol Index

### serena-mcp Symbol Index

Currently empty (no `src/` directory). Will be populated when implementation begins.

### lsmcp Symbol Index

Auto-indexed by LSP server when files are opened. No manual indexing needed.

## Project Root

All MCP server calls use this root path:

```bash
C:\Users\atsushifx\workspaces\develop\aglabo-command-runner
```

Relative paths are resolved from this root.
