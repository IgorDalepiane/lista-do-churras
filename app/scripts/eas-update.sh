#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:?Usage: bun eas:update \"<message>\"}"

echo "==> Updating production..."
eas update --channel production --message "$MESSAGE"

echo ""
echo "==> Updating preview..."
eas update --channel preview --message "$MESSAGE"

echo ""
echo "Both updates completed."
