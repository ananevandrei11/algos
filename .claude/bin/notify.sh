#!/bin/bash
INPUT=$(cat)
MESSAGE=$(echo "$INPUT" | jq -r '.message // empty' 2>/dev/null)

if [ -n "$MESSAGE" ]; then
  TITLE="Claude Code"
  BODY="$MESSAGE"
else
  TITLE="Claude Code"
  BODY="Done — waiting for your input"
fi

ESCAPED=$(printf '%s' "$BODY" | sed 's/\\/\\\\/g; s/"/\\"/g')
osascript -e "display notification \"$ESCAPED\" with title \"$TITLE\" sound name \"Ping\""
