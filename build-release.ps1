# =============================================================================
# TFS Build & Package Script (Developer Use Only) - PowerShell Version
# =============================================================================
# Run this on your Windows development machine to create
# a deployable package for clients.
#
# Usage: .\build-release.ps1 [-Version "1.0.0"]
# =============================================================================

param(
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"
$OutputDir = ".\deploy"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TFS Build Script - Developer          ║" -ForegroundColor Cyan
Write-Host "║  Version: $Version                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Build Web Image
Write-Host "▶ Building Web Application..." -ForegroundColor Yellow
docker build -t tfs-web:$Version -f web/Dockerfile ./web
docker tag tfs-web:$Version tfs-web:latest
Write-Host "  ✓ tfs-web:$Version built" -ForegroundColor Green

# 2. Build PocketBase Image
Write-Host ""
Write-Host "▶ Building PocketBase..." -ForegroundColor Yellow
docker build -t tfs-pb:$Version -f pb_docker/Dockerfile .
docker tag tfs-pb:$Version tfs-pb:latest
Write-Host "  ✓ tfs-pb:$Version built" -ForegroundColor Green

# 3. Export Images
Write-Host ""
Write-Host "▶ Exporting images to tar files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$OutputDir\images" | Out-Null
docker save -o "$OutputDir\images\tfs-web.tar" tfs-web:latest
docker save -o "$OutputDir\images\tfs-pb.tar" tfs-pb:latest
Write-Host "  ✓ Images exported" -ForegroundColor Green

# 4. Show sizes
Write-Host ""
Write-Host "▶ Package Contents:" -ForegroundColor Yellow
Get-ChildItem "$OutputDir\images" | Format-Table Name, @{N='Size (MB)';E={[math]::Round($_.Length/1MB, 2)}}

# 5. Create distributable archive
$ArchiveName = "TFS_v$Version.zip"
Write-Host "▶ Creating distributable archive..." -ForegroundColor Yellow
if (Test-Path $ArchiveName) { Remove-Item $ArchiveName }
Compress-Archive -Path "$OutputDir\*" -DestinationPath $ArchiveName -Force
Write-Host "  ✓ Created $ArchiveName" -ForegroundColor Green

# Show final size
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Build Complete!                     ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════╣" -ForegroundColor Green
$archive = Get-Item $ArchiveName
Write-Host "║  $($archive.Name): $([math]::Round($archive.Length/1MB, 2)) MB" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy to a new VPS:"
Write-Host "  scp $ArchiveName user@vps:~/"
Write-Host "  ssh user@vps 'unzip $ArchiveName -d deploy && cd deploy && chmod +x install.sh && ./install.sh'"
