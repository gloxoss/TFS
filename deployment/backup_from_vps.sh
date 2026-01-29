#!/bin/bash
# backup_from_vps.sh
# Backup PocketBase data from VPS to local machine

# ======= CONFIGURE THESE =======
VPS_USER="root"           # Your VPS username
VPS_HOST="your-vps-ip"    # Your VPS IP or hostname
VPS_PATH="/path/to/deployment/pb_data"  # Path to pb_data on VPS
LOCAL_PATH="./pb_data_backup"           # Local destination
# ===============================

echo "Creating local backup directory..."
mkdir -p "$LOCAL_PATH"

echo "Downloading pb_data from VPS..."
scp -r "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/*" "$LOCAL_PATH/"

echo "Backup complete! Files saved to: $LOCAL_PATH"
echo ""
echo "To use this backup locally:"
echo "1. Stop your local PocketBase"
echo "2. Replace pb_data contents with backup"
echo "3. Restart PocketBase"
