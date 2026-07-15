#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Список защищённых паттернов
PROTECTED_PATTERNS=(".env" ".env.local" "package-lock.json")
  
for PATTERN in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$PATTERN"* ]]; then
    echo "Blocked: $FILE_PATH it is protected file." >&2
    echo "Add env variable manulay in terminal." >&2
    exit 2
  fi
done

exit 0