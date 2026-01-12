#!/bin/bash
set -e

VERSION="1.0.0"
echo "╔════════════════════════════════════════╗"
echo "║  TFS Application Installer v$VERSION      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Docker
echo -e "${YELLOW}▶ Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}  Installing Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
    echo -e "${GREEN}  ✓ Docker installed${NC}"
else
    echo -e "${GREEN}  ✓ Docker already installed ($(docker --version | cut -d' ' -f3 | tr -d ','))${NC}"
fi

# 2. Load Images
echo ""
echo -e "${YELLOW}▶ Loading Application Images...${NC}"

if [ -f images/tfs-web.tar ]; then
    echo "  Loading Web Application..."
    docker load -i images/tfs-web.tar
    echo -e "${GREEN}  ✓ Web image loaded${NC}"
else
    echo -e "${RED}  ✗ images/tfs-web.tar not found!${NC}"
    exit 1
fi

if [ -f images/tfs-pb.tar ]; then
    echo "  Loading Database..."
    docker load -i images/tfs-pb.tar
    echo -e "${GREEN}  ✓ Database image loaded${NC}"
else
    echo -e "${RED}  ✗ images/tfs-pb.tar not found!${NC}"
    exit 1
fi

# 3. Setup environment
echo ""
echo -e "${YELLOW}▶ Checking Environment...${NC}"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}  ⚠️  Created .env from template${NC}"
        echo -e "${YELLOW}  ⚠️  Please edit .env with your settings, then run: docker compose up -d${NC}"
        exit 0
    else
        echo -e "${RED}  ✗ No .env.example found!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}  ✓ .env file exists${NC}"
fi

# 4. Create data directory
echo ""
echo -e "${YELLOW}▶ Setting up data directory...${NC}"
mkdir -p data
echo -e "${GREEN}  ✓ Data directory ready${NC}"

# 5. Start services
echo ""
echo -e "${YELLOW}▶ Starting TFS Application...${NC}"
docker compose up -d

# Wait for health check
echo "  Waiting for services to be healthy..."
sleep 10

# 6. Show status
echo ""
docker compose ps
echo ""

# Get IP
IP=$(hostname -I | awk '{print $1}')

echo "╔════════════════════════════════════════╗"
echo -e "║  ${GREEN}✅ Installation Complete!${NC}              ║"
echo "╠════════════════════════════════════════╣"
echo "║  Web App:   http://$IP:3000       ║"
echo "║  PB Admin:  http://$IP:8090/_/    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "To view logs:    docker compose logs -f"
echo "To stop:         docker compose down"
echo "To update:       ./update.sh"
