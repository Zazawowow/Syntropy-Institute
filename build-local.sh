#!/bin/bash

# Local build script for L484 PWA
echo "🚀 Building L484 PWA locally..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build succeeded
if [ -d "dist" ]; then
    echo "✅ Build successful! Files in dist/:"
    ls -la dist/
    
    echo ""
    echo "🐳 To build Docker image:"
    echo "docker build -f Dockerfile.prebuilt -t l484-app ."
    echo ""
    echo "🚀 To run locally:"
    echo "docker run -p 8080:80 l484-app"
    echo ""
    echo "📝 To update Portainer:"
    echo "1. Build locally: npm run build"
    echo "2. Copy dist/ contents to your server"
    echo "3. Use Dockerfile.prebuilt for simple deployment"
else
    echo "❌ Build failed!"
    exit 1
fi