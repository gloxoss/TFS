#!/bin/bash
# =============================================================================
# TFS Build & Package Script (Developer Use Only)
# =============================================================================
# Run this on your development machine or build server to create
# a deployable package for clients.
# =============================================================================

set -e

VERSION="${1:-latest}"
OUTPUT_DIR="./deploy"

echo "╔════════════════════════════════════════╗"
echo "║  TFS Build Script - Developer          ║"
echo "║  Version: $VERSION                         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Build Web Image
echo -e "${YELLOW}▶ Building Web Application...${NC}"
docker build -t tfs-web:$VERSION -f web/Dockerfile ./web
docker tag tfs-web:$VERSION tfs-web:latest
echo -e "${GREEN}  ✓ tfs-web:$VERSION built${NC}"

# 2. Build PocketBase Image
echo ""
echo -e "${YELLOW}▶ Building PocketBase...${NC}"
docker build -t tfs-pb:$VERSION -f pb_docker/Dockerfile .
docker tag tfs-pb:$VERSION tfs-pb:latest
echo -e "${GREEN}  ✓ tfs-pb:$VERSION built${NC}"

# 3. Export Images
echo ""
echo -e "${YELLOW}▶ Exporting images to tar files...${NC}"
mkdir -p $OUTPUT_DIR/images
docker save -o $OUTPUT_DIR/images/tfs-web.tar tfs-web:latest
docker save -o $OUTPUT_DIR/images/tfs-pb.tar tfs-pb:latest
echo -e "${GREEN}  ✓ Images exported${NC}"

# 4. Show sizes
echo ""
echo -e "${YELLOW}▶ Package Contents:${NC}"
ls -lh $OUTPUT_DIR/images/
echo ""

# 5. Create distributable archive
ARCHIVE_NAME="TFS_v${VERSION}.tar.gz"
echo -e "${YELLOW}▶ Creating distributable archive...${NC}"
tar -czvf $ARCHIVE_NAME -C $OUTPUT_DIR .
echo -e "${GREEN}  ✓ Created $ARCHIVE_NAME${NC}"

# Show final size
echo ""
echo "╔════════════════════════════════════════╗"
echo -e "║  ${GREEN}✅ Build Complete!${NC}                     ║"
echo "╠════════════════════════════════════════╣"
ls -lh $ARCHIVE_NAME
echo "╚════════════════════════════════════════╝"
echo ""
echo "To deploy to a new VPS:"
echo "  scp $ARCHIVE_NAME user@vps:~/"
echo "  ssh user@vps 'tar -xzvf $ARCHIVE_NAME && cd deploy && chmod +x install.sh && ./install.sh'"
