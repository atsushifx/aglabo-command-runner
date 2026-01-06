#!/bin/bash
#
# init-deckrd-session.sh
# Purpose: Initialize deckrd-coder session from tasks.md file
# Usage: ./scripts/init-deckrd-session.sh <file-path|namespace/module> [--force]
#
# Environment Variables:
#   CLAUDE_PLUGIN_ROOT - Claude plugin root directory (set by plugin)
#
# Examples:
#   # Direct file path
#   ./init-deckrd-session.sh docs/.deckrd/command-runner/os2shell/tasks/tasks.md
#
#   # Namespace/module pattern
#   ./init-deckrd-session.sh command-runner/os2shell
#
#   # Force overwrite
#   ./init-deckrd-session.sh command-runner/os2shell --force
#

set -euo pipefail

SESSION_FILE="docs/.deckrd/coder.session"
FORCE_OVERWRITE=false

# ============================================================================
# Step 1: Parse parameters
# ============================================================================

PATH_PARAM="${1:?Error: Path parameter is required (file-path or namespace/module)}"
if [[ "${2:-}" == "--force" ]]; then
  FORCE_OVERWRITE=true
fi

# ============================================================================
# Step 2: Resolve path - auto-detect file-path vs namespace/module
# ============================================================================

if [[ "$PATH_PARAM" == *.md ]]; then
  # Direct file path
  TASKS_FILE="$PATH_PARAM"
else
  # Namespace/module pattern → resolve to docs/.deckrd/<namespace>/<module>/tasks/tasks.md
  TASKS_FILE="docs/.deckrd/${PATH_PARAM}/tasks/tasks.md"
fi

# ============================================================================
# Step 3: Validate tasks file exists
# ============================================================================

if [[ ! -f "$TASKS_FILE" ]]; then
  echo "Error: Task file not found: $TASKS_FILE"
  exit 1
fi

# ============================================================================
# Step 4: Overwrite protection
# ============================================================================

if [[ -f "$SESSION_FILE" && "$FORCE_OVERWRITE" == "false" ]]; then
  echo "Error: Session file already exists: $SESSION_FILE"
  echo "  Use --force to overwrite"
  exit 1
fi

# ============================================================================
# Step 5: Extract YAML frontmatter from tasks.md
# ============================================================================

# Use awk to extract content between first and second '---'
# Expected format:
#   ---
#   title: "Tasks: os2shell Module Implementation"
#   based_on: "implementation.md v1.1"
#   status: "Active"
#   task_count: 568
#   ---

FRONTMATTER=$(awk '/^---$/{p++; next} p==1' "$TASKS_FILE")

# Parse individual fields
# Handle both quoted and unquoted values: "value" → value
TITLE=$(echo "$FRONTMATTER" | grep '^title:' | head -n1 | sed 's/^title: *"\?\([^"]*\)"\?$/\1/' || true)
BASED_ON=$(echo "$FRONTMATTER" | grep '^based_on:' | head -n1 | sed 's/^based_on: *"\?\([^"]*\)"\?$/\1/' || true)
STATUS=$(echo "$FRONTMATTER" | grep '^status:' | head -n1 | sed 's/^status: *"\?\([^"]*\)"\?$/\1/' || true)
TASK_COUNT=$(echo "$FRONTMATTER" | grep '^task_count:' | head -n1 | sed 's/^task_count: *"\?\([^"]*\)"\?$/\1/' || true)

# ============================================================================
# Validate required fields
# ============================================================================

if [[ -z "$TITLE" ]]; then
  echo "Error: Missing required field 'title' in tasks.md frontmatter"
  exit 1
fi
if [[ -z "$BASED_ON" ]]; then
  echo "Error: Missing required field 'based_on' in tasks.md frontmatter"
  exit 1
fi
if [[ -z "$STATUS" ]]; then
  echo "Error: Missing required field 'status' in tasks.md frontmatter"
  exit 1
fi
if [[ -z "$TASK_COUNT" ]]; then
  echo "Error: Missing required field 'task_count' in tasks.md frontmatter"
  exit 1
fi

# ============================================================================
# Step 6-7: Generate session file (with empty DECKRD_ACTIVE_SESSION)
# ============================================================================

cat > "$SESSION_FILE" <<EOF
# Deckrd Coder Session Configuration
# Generated from: $TASKS_FILE

DECKRD_SESSION_TITLE=$TITLE
DECKRD_SESSION_BASED_ON=$BASED_ON
DECKRD_SESSION_STATUS=$STATUS
DECKRD_TASK_COUNT=$TASK_COUNT

# Task Source File
DECKRD_TASK_FILE=$TASKS_FILE

# Active Session: Set manually or use /deckrd-coder coding <TASK_ID>
DECKRD_ACTIVE_SESSION=
EOF

# ============================================================================
# Step 8: Report success
# ============================================================================

echo "✓ Session initialized: $SESSION_FILE"
echo ""
echo "Session Information:"
echo "  Title: $TITLE"
echo "  Based on: $BASED_ON"
echo "  Status: $STATUS"
echo "  Task File: $TASKS_FILE"
echo "  Total Tasks: $TASK_COUNT"
echo ""
echo "Next steps:"
echo "  /deckrd-coder coding <TASK_ID>"
echo "  # Example: /deckrd-coder coding T01-08"

exit 0
