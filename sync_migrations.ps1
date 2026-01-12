# =============================================================================
# TFS Sync Migrations Script
# =============================================================================
# Syncs migration files to VPS and runs them (for adding new equipment, etc.)
# Usage: .\sync_migrations.ps1 [-VpsIp "72.62.27.47"]
# =============================================================================

param(
    [string]$VpsIp = "72.62.27.47",
    [string]$VpsUser = "root",
    [string]$RemoteDir = "~/tfs-deploy"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TFS Migration Sync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Upload migrations
Write-Host "`n[1/2] Uploading migration files..." -ForegroundColor Yellow
scp -r ".\pb_migrations\*" "${VpsUser}@${VpsIp}:${RemoteDir}/pb_migrations/"
Write-Host "SUCCESS: Migrations uploaded" -ForegroundColor Green

# Step 2: Run migrations
Write-Host "`n[2/2] Running migrations..." -ForegroundColor Yellow
$migrateCommands = @(
    "cd ${RemoteDir}",
    "docker compose exec -T pocketbase /pb/pocketbase migrate"
)
$migrateScript = $migrateCommands -join " && "
ssh ${VpsUser}@${VpsIp} $migrateScript
Write-Host "SUCCESS: Migrations applied" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Migration Sync Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
