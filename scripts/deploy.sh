#!/bin/bash

# Deployment script for PB-Next
# This script pulls the latest changes, installs dependencies, builds the project, and restarts PM2.

# Navigate to the project root (assuming the script is in scripts/ or root)
# If script is in scripts/, uncomment the next line
# cd "$(dirname "$0")/.."

echo "🚀 Starting deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# 2. Install dependencies (Web)
echo "📦 Installing dependencies..."
cd web
npm install

# 3. Build project
echo "🏗️ Building the project..."
npm run build

# 4. Restart/Reload PM2 process
# Replace 'pb-next' with your actual PM2 process name
echo "🔄 Restarting PM2 process..."
pm2 reload pb-next || pm2 start npm --name "pb-next" -- start

echo "✨ Deployment complete!"
