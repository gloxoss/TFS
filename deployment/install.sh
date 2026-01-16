#!/bin/bash

# TFS Installation Script
# Run this script on the VPS to install/update the application.

set -e

echo ">>> Installing TFS Application..."

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# 2. Load Images
if [ -f "tfs-pb.tar" ]; then
    echo "📦 Loading Database Image..."
    docker load -i tfs-pb.tar
else
    echo "⚠️ tfs-pb.tar not found, skipping..."
fi

if [ -f "tfs-web.tar" ]; then
    echo "📦 Loading Web Image..."
    docker load -i tfs-web.tar
else
    echo "⚠️ tfs-web.tar not found, skipping..."
fi

# 3. Start Application
echo "🚀 Starting Application..."
docker compose up -d

echo ">>> Deployment Complete! Application is running."
echo "    Web: http://localhost:3000 (or via Nginx on port 80/443)"
echo "    PB:  http://localhost:8090"
