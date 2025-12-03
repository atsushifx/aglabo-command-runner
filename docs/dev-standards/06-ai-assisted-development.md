# AI-Assisted Development

Guide for using AI tools in development workflow.

## AI Tools in This Project

### 1. Automated Commit Messages

**Tool**: AI-powered commit message generator

**Usage**:

```bash
# Automatic during commit
git commit

# Manual preview
bash scripts/prepare-commit-msg.sh
```

**Models**:

- OpenAI: `gpt-5` (default), `o1-mini`
- Anthropic: `claude-sonnet-4-5`, `haiku`, `sonnet`, `opus`

**Configuration**:

- Script: `scripts/prepare-commit-msg.sh`
- Agent: `.claude/agents/commit-message-generator.md`

**See**: `docs/projects/commit-message-system.md`

### 2. MCP Servers

**Two servers for enhanced development**:

**serena-mcp** (Semantic code navigation):

- Symbol search and navigation
- Code editing (replace, insert)
- Reference finding
- Project memories

**lsmcp** (LSP-based intelligence):

- Document symbols
- Go to definition
- Type information (hover)
- Diagnostics and errors
- Code formatting

**See**: `docs/projects/mcp-servers.md`

### 3. Claude Code Integration

**Claude Code** provides:

- Context-aware code assistance
- CLAUDE.md-driven instructions
- MCP server integration
- Memory-based knowledge retention

**Key file**: `CLAUDE.md`

## Using AI for Development

### Code Understanding

**Use MCP servers** to understand code:

```typescript
// Get file overview
mcp__plugin_claude - idd - framework_serena - mcp__get_symbols_overview({
  relative_path: 'src/core/command-runner.ts',
});

// Get symbol details
mcp__lsmcp__lsp_get_definitions({
  root: 'C:\\path\\to\\project',
  relativePath: 'src/index.ts',
  line: 10,
  symbolName: 'executeCommand',
});
```

### Code Navigation

**Prefer symbolic tools** over reading entire files:

1. Get overview first
2. Navigate to specific symbols
3. Read only what's needed

**Example workflow**:

```typescript
// 1. Get overview
get_symbols_overview("src/file.ts")

// 2. Find specific function
find_symbol("functionName")

// 3. Get details
lsp_get_definitions(...)
```

### Memory Usage

**serena-mcp memories** retain project knowledge:

```typescript
// Check what's already known
mcp__plugin_claude - idd - framework_serena - mcp__read_memory({
  memory_file_name: 'project_overview',
});
```

**Available memories**:

- `project_overview` - Project structure
- `code_style_conventions` - Coding standards
- `windows_environment` - Platform-specific info
- `suggested_commands` - Common commands
- `task_completion_checklist` - Quality gates

### Commit Message Generation

**Let AI analyze changes**:

```bash
# Stage changes
git add .

# AI analyzes and generates message
git commit
```

**AI considers**:

- Staged changes (git diff --cached)
- Recent commits (git log --oneline -10)
- Project conventions
- File-by-file descriptions

## Best Practices

### 1. Trust the Automation

**推奨される使い方**:

- Let AI generate commit messages
- Use MCP servers for code navigation
- Rely on memory systems

**避けるべき使い方**:

- Manually write commit messages
- Read entire files when symbolic tools available
- Ignore existing project memories

### 2. Provide Context

Help AI understand intent:

- Clear task descriptions
- Specific questions
- Reference relevant files/symbols

### 3. Verify AI Output

Always review AI-generated content:

- Commit messages (edit if needed)
- Code suggestions
- Refactorings

### 4. Use Progressive Disclosure

Don't overload AI with information:

- Start with CLAUDE.md
- Reference detailed docs as needed
- Use memory systems for context

## AI Limitations

### When NOT to Use AI

- Security-critical decisions
- Architecture decisions (get human review)
- Complex business logic (human validation needed)

### Quality Gates Still Apply

AI-generated code must pass:

- Type checking
- Linting
- Testing
- Security scanning

## Template Project Specifics

Since `src/` doesn't exist yet:

- Symbol search returns empty results (expected)
- Focus on configuration and tooling
- Use AI for documentation and setup

After implementation begins:

- MCP servers become more useful
- Symbol navigation works
- Code assistance improves

## Troubleshooting

### MCP Servers Not Working

Check:

- `.mcp.json` configuration
- Server installation
- Memory file locations

### Commit Messages Too Generic

Ensure:

- Changes are staged
- Staged changes are meaningful
- Model is appropriate (try different model)

### Memory Not Current

Update memories manually:

```typescript
mcp__plugin_claude - idd - framework_serena - mcp__write_memory({
  memory_file_name: 'project_overview',
  content: 'Updated content...',
});
```

## Resources

- `CLAUDE.md` - Main AI instructions
- `docs/projects/mcp-servers.md` - MCP server details
- `docs/projects/commit-message-system.md` - Commit message generation
- `.claude/agents/` - AI agent configurations

## See Also

- `docs/dev-standards/02-development-workflow.md` - Development workflow
- `docs/dev-standards/03-commit-message-conventions.md` - Commit conventions
- `docs/projects/plugin-integration.md` - Claude Code plugins
