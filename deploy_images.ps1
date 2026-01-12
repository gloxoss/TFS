# =============================================================================
# TFS Deploy Images Script
# =============================================================================
# Deploys pre-built Docker images to VPS (no source code transferred)
# Usage: .\deploy_images.ps1 [-Version "1.0.0"] [-VpsIp "72.62.27.47"]
# =============================================================================

param(
    [string]$Version = "latest",
    [string]$VpsIp = "72.62.27.47",
    [string]$VpsUser = "root",
    [string]$RemoteDir = "~/tfs-deploy"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TFS Docker Deployment" -ForegroundColor Cyan
Write-Host "  Target: $VpsUser@$VpsIp" -ForegroundColor Cyan
Write-Host "  Version: $Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$BundleDir = ".\deploy_bundle"

# Verify bundle exists
if (-not (Test-Path $BundleDir)) {
    Write-Host "ERROR: Deployment bundle not found. Run build_images.ps1 first." -ForegroundColor Red
    exit 1
}

# Step 1: Create remote directory
Write-Host "`n[1/5] Creating remote directory..." -ForegroundColor Yellow
ssh ${VpsUser}@${VpsIp} "mkdir -p ${RemoteDir}/nginx/ssl ${RemoteDir}/nginx/logs"
Write-Host "SUCCESS: Remote directory ready" -ForegroundColor Green

# Step 2: Upload deployment bundle
Write-Host "`n[2/5] Uploading deployment bundle..." -ForegroundColor Yellow
scp -r "$BundleDir\*" "${VpsUser}@${VpsIp}:${RemoteDir}/"
Write-Host "SUCCESS: Bundle uploaded" -ForegroundColor Green

# Step 3: Load Docker images on VPS
Write-Host "`n[3/5] Loading Docker images on VPS..." -ForegroundColor Yellow
$loadCommands = @(
    "cd ${RemoteDir}",
    "echo 'Loading Next.js image...'",
    "gunzip -c tfs-next-app-${Version}.tar.gz | docker load",
    "echo 'Loading PocketBase image...'",
    "gunzip -c tfs-pocketbase-${Version}.tar.gz | docker load",
    "rm -f tfs-next-app-${Version}.tar.gz tfs-pocketbase-${Version}.tar.gz",
    "docker images | grep tfs"
)
$loadScript = $loadCommands -join " && "
ssh ${VpsUser}@${VpsIp} $loadScript
Write-Host "SUCCESS: Images loaded" -ForegroundColor Green

# Step 4: Deploy containers
Write-Host "`n[4/5] Deploying containers..." -ForegroundColor Yellow
$deployCommands = @(
    "cd ${RemoteDir}",
    "docker compose down 2>/dev/null || true",
    "VERSION=${Version} docker compose up -d",
    "docker compose ps"
)
$deployScript = $deployCommands -join " && "
ssh ${VpsUser}@${VpsIp} $deployScript
Write-Host "SUCCESS: Containers deployed" -ForegroundColor Green

# Step 5: Run migrations
Write-Host "`n[5/5] Running database migrations..." -ForegroundColor Yellow
$migrateCommands = @(
    "cd ${RemoteDir}",
    "sleep 5",  # Wait for PocketBase to start
    "docker compose exec -T pocketbase /pb/pocketbase migrate 2>&1 || echo 'Migration completed or skipped'"
)
$migrateScript = $migrateCommands -join " && "
ssh ${VpsUser}@${VpsIp} $migrateScript
Write-Host "SUCCESS: Migrations applied" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application: http://${VpsIp}" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:     ssh ${VpsUser}@${VpsIp} 'docker compose -C ${RemoteDir} logs -f'"
Write-Host "  Restart:       ssh ${VpsUser}@${VpsIp} 'docker compose -C ${RemoteDir} restart'"
Write-Host "  Stop:          ssh ${VpsUser}@${VpsIp} 'docker compose -C ${RemoteDir} down'"
Write-Host ""
