#!/bin/bash

# Setup script for Emittify development
# This script installs dependencies and sets up git hooks

echo "🚀 Setting up Emittify development environment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Install git hooks
echo "🪝 Installing git hooks..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HOOKS_DIR="$SCRIPT_DIR/hooks"
GIT_HOOKS_DIR="$SCRIPT_DIR/../.git/hooks"

if [ ! -d "$GIT_HOOKS_DIR" ]; then
    echo "❌ Error: Not in a git repository or .git/hooks directory not found"
    exit 1
fi

if [ -f "$HOOKS_DIR/pre-commit" ]; then
    cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
    chmod +x "$GIT_HOOKS_DIR/pre-commit"
    echo "✅ Pre-commit hook installed"
else
    echo "❌ Error: pre-commit hook not found in $HOOKS_DIR"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You're ready to start developing."
echo ""
echo "📝 Pre-commit hook is now active and will run:"
echo "   • TypeScript type checking"
echo "   • Prettier code formatting"
echo "   • Full test suite"
echo ""
echo "💡 Useful commands:"
echo "   yarn test          - Run tests"
echo "   yarn test:watch    - Run tests in watch mode"
echo "   yarn test:coverage - Run tests with coverage"
echo "   yarn build         - Build the project"

