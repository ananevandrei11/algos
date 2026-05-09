#!/bin/bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "Usage: create-algo.sh <algorithmName>"
  exit 1
fi

DIR="src/$NAME"

if [ -d "$DIR" ]; then
  echo "Error: folder '$DIR' already exists"
  exit 1
fi

mkdir -p "$DIR"

cat > "$DIR/index.ts" << EOF
import './$NAME'
EOF

cat > "$DIR/$NAME.ts" << EOF
export function $NAME() {

}
EOF

cat > "$DIR/$NAME.test.ts" << EOF
import { $NAME } from './$NAME';

describe('$NAME', () => {
  it('', () => {

  });
});
EOF

echo "Created $DIR/"
echo "  index.ts"
echo "  $NAME.ts"
echo "  $NAME.test.ts"
