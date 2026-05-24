#!/bin/sh
set -e

# Define paths
DATA_DIR="/pb/pb_data"
SEED_DIR="/pb/seed_data"

# Check if data directory is empty (or only contains lost+found)
if [ -z "$(ls -A $DATA_DIR 2>/dev/null)" ] || [ "$(ls -A $DATA_DIR)" = "lost+found" ]; then
    echo "⚡ Initializing PocketBase data..."
    
    if [ -d "$SEED_DIR" ]; then
        echo "📦 Found seed data! Copying from $SEED_DIR..."
        cp -r $SEED_DIR/* $DATA_DIR/
        echo "✅ Data seeded successfully!"
    else
        echo "⚠️ No seed data found at $SEED_DIR. Starting fresh."
    fi
else
    echo "♻️ Existing data found in $DATA_DIR. Skipping seed."
fi

# Execute the main command (start pocketbase)
echo "🚀 Starting PocketBase..."
exec "$@"
