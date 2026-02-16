#!/bin/bash

# Quick Start Script for realdonaldtrump.ai

echo "🚀 Setting up realdonaldtrump.ai..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your ANTHROPIC_API_KEY"
    echo "   Get your key from: https://console.anthropic.com/"
    echo ""
    read -p "Press Enter when you've added your Anthropic API key..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Please check errors above."
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Make sure you've added ANTHROPIC_API_KEY to .env.local"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo ""
echo "📚 For deployment instructions, see README.md"
echo ""
