# Deployment Params
$VPS_IP = "72.62.27.47"
$VPS_USER = "root"
$REMOTE_DIR = "~/tfs-docker-deploy"

Write-Host "Starting Deployment to Port 3002..." -ForegroundColor Green

# 1. Zip PB Data (migrations and data)
Write-Host "Zipping PocketBase Data..."
Compress-Archive -Path pb_migrations -DestinationPath pb_build_bundle.zip -Force

# 2. Bundle Web App (Excluding node_modules & .next)
Write-Host "Bundling Web App (using tar)..."
tar -czf web_bundle.tar.gz --exclude node_modules --exclude .next --exclude .git web

# 3. Bundle PocketBase Docker Context
Write-Host "Bundling PocketBase Docker Context..."
tar -czf pb_docker.tar.gz pb_docker

# 4. Create Remote Directory
Write-Host "Creating remote directory..."
ssh ${VPS_USER}@${VPS_IP} "mkdir -p ${REMOTE_DIR}"

# 5. Upload Bundles
Write-Host "Copying bundles to VPS..."
scp prod.env ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/.env
scp docker-compose.yml ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/
scp web_bundle.tar.gz ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/
scp pb_docker.tar.gz ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/
scp pb_build_bundle.zip ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/

# 6. Execute Remote Build & Deploy
Write-Host "Building and Starting Containers on VPS..."
$commands = @(
    "cd ${REMOTE_DIR}",
    "tar -xzf web_bundle.tar.gz",
    "tar -xzf pb_docker.tar.gz",
    "unzip -o pb_build_bundle.zip",
    "rm web_bundle.tar.gz pb_build_bundle.zip pb_docker.tar.gz",
    "docker compose down",
    "docker compose up -d --build",
    "docker compose ps"
)
$remoteScript = $commands -join "; "
ssh ${VPS_USER}@${VPS_IP} $remoteScript

Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "App: http://${VPS_IP}:3002"
Write-Host "DB Admin: http://${VPS_IP}:8091/_/"
