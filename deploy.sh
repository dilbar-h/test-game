#!/bin/bash

# Simple deployment script for GitHub Pages
echo "🚀 Deploying to GitHub Pages..."

# Build the project (if needed)
echo "📦 Building project..."
# Add any build steps here if needed in the future

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Update site for GitHub Pages"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://dilbar-h.github.io/test-game/"
echo "⏱️  It may take a few minutes for changes to appear." 