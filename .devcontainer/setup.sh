#!/bin/bash
set -e

echo "🚀 Setting up Tusk Drift Node Demo environment..."

# Install Node.js version using nvm
echo "📦 Installing Node.js version..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Tusk CLI
echo "🔧 Installing Tusk CLI..."
curl -fsSL https://raw.githubusercontent.com/Use-Tusk/tusk-drift-cli/main/install.sh | sh

# Fetch the buggy-branch
echo "🌿 Fetching buggy-branch..."
git fetch origin buggy-branch:buggy-branch || echo "Note: buggy-branch may already exist or couldn't be fetched"

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

