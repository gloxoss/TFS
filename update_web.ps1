# =============================================================================
# TFS Update Web Script
# =============================================================================
# Quick update script for web application only (when PocketBase hasn't changed)
# Usage: .\update_web.ps1 [-Version "1.0.1"] [-VpsIp "72.62.27.47"]
# =============================================================================

param(
    [string]$Version = "latest",
    [string]$VpsIp = "72.62.27.47",
    [string]$VpsUser = "root",
    [string]$RemoteDir = "~/tfs-deploy"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TFS Web Application Update" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Build web image
Write-Host "`n[1/3] Building Next.js image..." -ForegroundColor Yellow
docker build -t tfs-next-app:$Version -t tfs-next-app:latest ./web
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build web image" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: Image built" -ForegroundColor Green

# Step 2: Export and upload
Write-Host "`n[2/3] Uploading image to VPS..." -ForegroundColor Yellow
docker save tfs-next-app:$Version | gzip | ssh ${VpsUser}@${VpsIp} "cat > ${RemoteDir}/tfs-next-app-update.tar.gz"
Write-Host "SUCCESS: Image uploaded" -ForegroundColor Green

# Step 3: Deploy on VPS
Write-Host "`n[3/3] Deploying updated container..." -ForegroundColor Yellow
$deployCommands = @(
    "cd ${RemoteDir}",
    "gunzip -c tfs-next-app-update.tar.gz | docker load",
    "rm tfs-next-app-update.tar.gz",
    "docker compose stop web",
    "docker compose rm -f web",
    "VERSION=${Version} docker compose up -d web",
    "docker compose ps"
)
$deployScript = $deployCommands -join " && "
ssh ${VpsUser}@${VpsIp} $deployScript
Write-Host "SUCCESS: Web container updated" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Update Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application: http://${VpsIp}" -ForegroundColor White
