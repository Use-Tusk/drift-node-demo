#!/bin/bash
set -e

echo "🚀 Setting up Tusk Drift Node Demo environment..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js version from .nvmrc
echo "📦 Installing Node.js version..."
nvm install
nvm use

# Verify versions
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Tusk CLI
echo "🔧 Installing Tusk CLI..."
curl -fsSL https://raw.githubusercontent.com/Use-Tusk/tusk-drift-cli/main/install.sh | sh

# Fetch branches from origin
echo "🌿 Fetching branches from origin..."
git fetch origin || echo "Note: Could not fetch from origin"

# Display helpful information
echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Quick Start Guide:"
echo "  1. Run pre-recorded tests:     tusk run"
echo "  2. Start server in record mode: npm run start:record"
echo "  3. Start server normally:       npm start"
echo "  4. Check out buggy branch:      git checkout buggy-branch"
echo ""
echo "🔍 Available branches:"
git branch -a | grep -E "(main|buggy-branch)" || echo "  - main (current)"
echo ""
echo "🎉 Ready to explore Tusk Drift!"
