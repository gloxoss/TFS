✅ Deployment kit created! Files in deploy/ folder:

deploy/
├── install.sh          # One-click installer
├── update.sh           # For updates
├── docker-compose.yml  # Production config
├── .env.example        # Environment template
├── nginx/nginx.conf    # SSL reverse proxy
├── README.txt          # Client instructions
└── images/             # For .tar files (empty)
Plus build-release.ps1 in project root for building releases.

Now let's test on VPS! The images are already built there. Run this on VPS:

bash
# Fix the compose file to use live database and correct ports
cd /var/www/next-app/TFS-web
docker compose -f docker-compose.test.yml down 2>/dev/null
# Update compose to mount live PocketBase data
cat > docker-compose.test.yml << 'EOF'
services:
  web:
    image: tfs-web:latest
    container_name: tfs-web-test
    restart: unless-stopped
    ports:
      - "3002:3000"
    environment:
      - NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
    depends_on:
      pocketbase:
        condition: service_healthy
    networks:
      - tfs-test
  pocketbase:
    image: tfs-pb:latest
    container_name: tfs-pb-test
    restart: unless-stopped
    ports:
      - "8092:8090"
    volumes:
      - /opt/pocketbase/pb_data:/pb/pb_data
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8090/api/health"]
      interval: 30s
      timeout: 10s
      start_period: 15s
      retries: 3
    networks:
      - tfs-test
networks:
  tfs-test:
    driver: bridge
EOF
# Start
docker compose -f docker-compose.test.yml up -d
docker ps
Then access:

Web: http://72.62.27.47:3002
PocketBase Admin: http://72.62.27.47:8092/_/
