# Build Package Script for TFS
# Run this script to generate the deployment package for the client.

$ErrorActionPreference = "Stop"

Write-Host "Starting TFS Build Process..." -ForegroundColor Green

# 1. Create dist directory
$distDir = "dist\TFS_App_v1.0"
if (Test-Path $distDir) {
    Remove-Item $distDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $distDir | Out-Null

# 2. Build Docker Images
Write-Host "Building Web Image (tfs-web)..." -ForegroundColor Cyan
docker build -t tfs-web:latest -f deployment\web\Dockerfile .\web

Write-Host "Building PocketBase Image (tfs-pb)..." -ForegroundColor Cyan
docker build -t tfs-pb:latest -f deployment\pocketbase\Dockerfile .

# 3. Save Images to Tar
Write-Host "Saving Images to .tar files..." -ForegroundColor Cyan
docker save -o "$distDir\tfs-web.tar" tfs-web:latest
docker save -o "$distDir\tfs-pb.tar" tfs-pb:latest

# 4. Copy Configuration Files
Write-Host "Copying configuration files..." -ForegroundColor Cyan
Copy-Item "deployment\docker-compose.yml" -Destination "$distDir\docker-compose.yml"
Copy-Item "deployment\nginx" -Destination "$distDir" -Recurse
Copy-Item "deployment\install.sh" -Destination "$distDir\install.sh"
Copy-Item "deployment\init_ssl.sh" -Destination "$distDir\init_ssl.sh"

Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "Package location: $distDir" -ForegroundColor Yellow
Write-Host "Zip this folder and send it to the client." -ForegroundColor Yellow
