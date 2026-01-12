#!/bin/bash
set -e

echo "╔════════════════════════════════════════╗"
echo "║  TFS Application Updater               ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Stop current containers
echo -e "${YELLOW}▶ Stopping current services...${NC}"
docker compose down
echo -e "${GREEN}  ✓ Services stopped${NC}"

# 2. Load new images
echo ""
echo -e "${YELLOW}▶ Loading updated images...${NC}"

if [ -f images/tfs-web.tar ]; then
    docker load -i images/tfs-web.tar
    echo -e "${GREEN}  ✓ Web image updated${NC}"
fi

if [ -f images/tfs-pb.tar ]; then
    docker load -i images/tfs-pb.tar
    echo -e "${GREEN}  ✓ Database image updated${NC}"
fi

# 3. Start with new images
echo ""
echo -e "${YELLOW}▶ Starting updated services...${NC}"
docker compose up -d

# Wait for health
sleep 10

# 4. Show status
echo ""
docker compose ps
echo ""
echo -e "${GREEN}✅ Update Complete!${NC}"
echo ""
echo "Your data has been preserved. If you encounter issues:"
echo "  - View logs: docker compose logs -f"
echo "  - Rollback:  Contact support for previous version"
