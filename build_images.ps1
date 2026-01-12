# =============================================================================
# TFS Build Images Script
# =============================================================================
# Builds Docker images locally for secure deployment (no source on VPS)
# Usage: .\build_images.ps1 [-Version "1.0.0"]
# =============================================================================

param(
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TFS Docker Image Builder" -ForegroundColor Cyan
Write-Host "  Version: $Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Build Next.js Web App
Write-Host "`n[1/4] Building Next.js application..." -ForegroundColor Yellow
docker build -t tfs-next-app:$Version -t tfs-next-app:latest ./web
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build web image" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: tfs-next-app:$Version built" -ForegroundColor Green

# Build PocketBase
Write-Host "`n[2/4] Building PocketBase image..." -ForegroundColor Yellow
docker build -t tfs-pocketbase:$Version -t tfs-pocketbase:latest ./pb_docker
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build pocketbase image" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS: tfs-pocketbase:$Version built" -ForegroundColor Green

# Export images to tar files
Write-Host "`n[3/4] Exporting images to tar.gz..." -ForegroundColor Yellow
$ExportDir = ".\docker_exports"
if (-not (Test-Path $ExportDir)) {
    New-Item -ItemType Directory -Path $ExportDir | Out-Null
}

docker save tfs-next-app:$Version | gzip > "$ExportDir\tfs-next-app-$Version.tar.gz"
docker save tfs-pocketbase:$Version | gzip > "$ExportDir\tfs-pocketbase-$Version.tar.gz"
Write-Host "SUCCESS: Images exported to $ExportDir\" -ForegroundColor Green

# Create deployment bundle
Write-Host "`n[4/4] Creating deployment bundle..." -ForegroundColor Yellow
$BundleDir = ".\deploy_bundle"
if (Test-Path $BundleDir) {
    Remove-Item -Recurse -Force $BundleDir
}
New-Item -ItemType Directory -Path $BundleDir | Out-Null

# Copy required files
Copy-Item "$ExportDir\tfs-next-app-$Version.tar.gz" "$BundleDir\"
Copy-Item "$ExportDir\tfs-pocketbase-$Version.tar.gz" "$BundleDir\"
Copy-Item ".\docker-compose.prod.yml" "$BundleDir\docker-compose.yml"
Copy-Item ".\prod.env" "$BundleDir\.env"
Copy-Item -Recurse ".\nginx" "$BundleDir\nginx"
Copy-Item -Recurse ".\pb_migrations" "$BundleDir\pb_migrations"

# Create empty ssl directory for certificates
New-Item -ItemType Directory -Path "$BundleDir\nginx\ssl" -Force | Out-Null
New-Item -ItemType Directory -Path "$BundleDir\nginx\logs" -Force | Out-Null

Write-Host "SUCCESS: Deployment bundle created at $BundleDir\" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next steps:"
Write-Host "  1. Run: .\deploy_images.ps1"
Write-Host "  2. Or manually upload $BundleDir to VPS"
Write-Host ""
