param(
    [Parameter(Mandatory=$false)]
    [string]$VpsHost = "root@72.62.27.47",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("web", "pb", "all")]
    [string]$Component = "all"
)

$ErrorActionPreference = "Stop"
$distDir = "dist\TFS_App_v1.0"

Write-Host "=== TFS VPS Update ===" -ForegroundColor Green
Write-Host "Target: $VpsHost" -ForegroundColor Cyan
Write-Host "Component: $Component" -ForegroundColor Cyan

# Step 1: Build
Write-Host "`nStep 1: Building Docker images..." -ForegroundColor Yellow
.\deployment\build_package.ps1

# Step 2: Upload
Write-Host "`nStep 2: Uploading to VPS..." -ForegroundColor Yellow

if ($Component -eq "web" -or $Component -eq "all") {
    Write-Host "  Uploading tfs-web.tar..." -ForegroundColor Cyan
    scp "$distDir\tfs-web.tar" "${VpsHost}:/opt/tfs/"
}

if ($Component -eq "pb" -or $Component -eq "all") {
    Write-Host "  Uploading tfs-pb.tar..." -ForegroundColor Cyan
    scp "$distDir\tfs-pb.tar" "${VpsHost}:/opt/tfs/"
}

# Step 3: Deploy
Write-Host "`nStep 3: Deploying on VPS..." -ForegroundColor Yellow

if ($Component -eq "web" -or $Component -eq "all") {
    Write-Host "  Restarting web container..." -ForegroundColor Cyan
    ssh $VpsHost "cd /opt/tfs && docker load -i tfs-web.tar && docker compose up -d --force-recreate web"
}

if ($Component -eq "pb" -or $Component -eq "all") {
    Write-Host "  Restarting pocketbase container..." -ForegroundColor Cyan
    ssh $VpsHost "cd /opt/tfs && docker load -i tfs-pb.tar && docker compose up -d --force-recreate pocketbase"
}

Write-Host "`n=== Update Complete! ===" -ForegroundColor Green
Write-Host "View logs: ssh $VpsHost 'docker compose -f /opt/tfs/docker-compose.yml logs -f'" -ForegroundColor Yellow
