#!/bin/bash

# Script to install git hooks

echo "📦 Installing git hooks..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HOOKS_DIR="$SCRIPT_DIR/hooks"
GIT_HOOKS_DIR="$SCRIPT_DIR/../.git/hooks"

# Check if we're in a git repository
if [ ! -d "$GIT_HOOKS_DIR" ]; then
    echo "❌ Error: Not in a git repository or .git/hooks directory not found"
    exit 1
fi

# Install pre-commit hook
if [ -f "$HOOKS_DIR/pre-commit" ]; then
    cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
    chmod +x "$GIT_HOOKS_DIR/pre-commit"
    echo "✅ Pre-commit hook installed successfully"
else
    echo "❌ Error: pre-commit hook not found in $HOOKS_DIR"
    exit 1
fi

echo "🎉 Git hooks installation complete!"

