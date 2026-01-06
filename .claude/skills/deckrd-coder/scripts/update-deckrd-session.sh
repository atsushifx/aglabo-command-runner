#!/bin/bash
#
# update-deckrd-session.sh
# Purpose: Update deckrd-coder session configuration file
# Usage: ./scripts/update-deckrd-session.sh <KEY> <VALUE>
#
# Environment Variables:
#   CLAUDE_PLUGIN_ROOT   - Claude plugin root directory (set by plugin)
#                         Used to locate the project root, not for session file path
#
# Examples:
#   ./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_ACTIVE_SESSION T01-09
#   ./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_SESSION_STATUS Paused
#   ./.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh DECKRD_TASK_FILE docs/.deckrd/.../tasks.md
#
# Plugin Usage (with CLAUDE_PLUGIN_ROOT):
#   bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/deckrd-coder/scripts/update-deckrd-session.sh" KEY VALUE
#

set -euo pipefail

# Session file path is fixed relative to project root
SESSION_FILE="docs/.deckrd/coder.session"

KEY="${1:?Error: KEY parameter is required}"
VALUE="${2:?Error: VALUE parameter is required}"

# Validate session file exists
if [[ ! -f "$SESSION_FILE" ]]; then
  echo "Error: Session file not found: $SESSION_FILE"
  exit 1
fi

# Update or append key-value pair
if grep -q "^${KEY}=" "$SESSION_FILE"; then
  # Update existing key
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/^${KEY}=.*/${KEY}=${VALUE}/" "$SESSION_FILE"
  else
    # Linux
    sed -i "s/^${KEY}=.*/${KEY}=${VALUE}/" "$SESSION_FILE"
  fi
  echo "✓ Updated $KEY=$VALUE in $SESSION_FILE"
else
  # Append new key-value pair
  echo "${KEY}=${VALUE}" >> "$SESSION_FILE"
  echo "✓ Added $KEY=$VALUE to $SESSION_FILE"
fi

# Validate result
if grep -q "^${KEY}=${VALUE}$" "$SESSION_FILE"; then
  exit 0
else
  echo "Error: Failed to update session file"
  exit 1
fi
