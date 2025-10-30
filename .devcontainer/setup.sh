#!/bin/bash
set -e

echo "🚀 Setting up Tusk Drift Node Demo environment..."

# Verify Node.js version (pre-installed in image)
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Tusk CLI
echo "🔧 Installing Tusk CLI..."
curl -fsSL https://raw.githubusercontent.com/Use-Tusk/tusk-drift-cli/main/install.sh | sh

# Display helpful information
echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Quick Start Guide:"
echo "  1. Run pre-recorded tests:      tusk run"
echo "  2. See Tusk CLI commands:       tusk --help"
echo "  3. Start server in record mode: npm run start:record"
echo "  4. Check out buggy branch:      git checkout buggy-branch"
echo ""
echo "🎉 Ready to explore Tusk Drift!"
