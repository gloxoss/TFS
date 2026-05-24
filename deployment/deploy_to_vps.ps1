param(
    [Parameter(Mandatory=$true)]
    [string]$VpsHost,
    
    [Parameter(Mandatory=$false)]
    [string]$RemotePath = "/opt/tfs",

    [switch]$WipeDB,
    [switch]$SkipBuild,
    [switch]$SyncDB,
    [switch]$SyncData
)

$ErrorActionPreference = "Stop"
$distDir = "dist\TFS_App_v1.0"

Write-Host "=== TFS Initial VPS Deployment ===" -ForegroundColor Green
Write-Host "Target: $VpsHost" -ForegroundColor Cyan
Write-Host "Remote Path: $RemotePath" -ForegroundColor Cyan

# Step 1: Build package
if (-not $SkipBuild) {
    Write-Host "`nStep 1: Building deployment package..." -ForegroundColor Yellow
    .\deployment\build_package.ps1
} else {
    Write-Host "`nStep 1: Build skipped (using existing package)..." -ForegroundColor Gray
}

# Step 2: Setup VPS
Write-Host "`nStep 2: Setting up VPS..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $VpsHost "mkdir -p $RemotePath"

# Step 3: Upload all files
Write-Host "`nStep 3: Uploading files to VPS..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=accept-new "$distDir\tfs-web.tar" "${VpsHost}:${RemotePath}/"
scp -o StrictHostKeyChecking=accept-new "$distDir\tfs-pb.tar" "${VpsHost}:${RemotePath}/"
scp -o StrictHostKeyChecking=accept-new "$distDir\docker-compose.yml" "${VpsHost}:${RemotePath}/"
scp -o StrictHostKeyChecking=accept-new "$distDir\install.sh" "${VpsHost}:${RemotePath}/"
scp -o StrictHostKeyChecking=accept-new "$distDir\init_ssl.sh" "${VpsHost}:${RemotePath}/"
scp -o StrictHostKeyChecking=accept-new -r "$distDir\nginx" "${VpsHost}:${RemotePath}/"

# Step 3.5: Auto-Backup Database (Safety First)
Write-Host "`nStep 3.5: Checking and Backing up Database..." -ForegroundColor Yellow
$backupCmd = 'mkdir -p {0}/backups; if [ -d {0}/pb_data ]; then TIMESTAMP=$(date +%Y%m%d_%H%M%S); echo ''Backing up pb_data to backups/pb_data_$TIMESTAMP...''; cp -r {0}/pb_data {0}/backups/pb_data_$TIMESTAMP; ls -dt {0}/backups/pb_data_* | tail -n +6 | xargs rm -rf 2>/dev/null || true; else echo ''No existing pb_data to backup.''; fi' -f $RemotePath
ssh -o StrictHostKeyChecking=accept-new $VpsHost $backupCmd

# Step 4: Deploy
Write-Host "`nStep 4: Deploying on VPS..." -ForegroundColor Yellow

# Optional: Wipe Database if requested (to force re-seeding)
if ($WipeDB) {
    Write-Host "⚠️  Wiping remote database to apply new seed data..." -ForegroundColor Red
    # Stop containers first to safely delete
    ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && docker compose down ; rm -rf $RemotePath/pb_data/*"
}

# Use single-line command to avoid CRLF injection from Windows
# We also run sed on install.sh to remove any potential Windows line endings from the uploaded file
ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && sed -i 's/\r$//' install.sh && bash install.sh"

# Step 5: SSL Setup (Auto)
Write-Host "`nStep 5: Initializing/Updating SSL..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && sed -i 's/\r$//' init_ssl.sh && bash init_ssl.sh"

# Step 6: Sync Database (Optional - runs migrations)
if ($SyncDB) {
    Write-Host "`nStep 6: Syncing Database (running migrations)..." -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && docker exec tfs-pocketbase-1 /pb/pocketbase migrate up"
    Write-Host "✅ Database migrations applied!" -ForegroundColor Green
}

# Step 7: Sync Local Data (Optional - uploads local pb_data to production)
if ($SyncData) {
    Write-Host "`nStep 7: Syncing LOCAL database to production..." -ForegroundColor Yellow
    Write-Host "⚠️  This will REPLACE the remote database with your local data!" -ForegroundColor Red
    
    # Stop PocketBase to safely copy data
    ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && docker compose stop pocketbase"
    
    # Upload local pb_data (from ROOT pb_data folder - where pocketbase.exe runs)
    Write-Host "Uploading local database files..." -ForegroundColor Cyan
    scp -o StrictHostKeyChecking=accept-new ".\pb_data\data.db" "${VpsHost}:${RemotePath}/pb_data/"
    scp -o StrictHostKeyChecking=accept-new ".\pb_data\auxiliary.db" "${VpsHost}:${RemotePath}/pb_data/"
    scp -o StrictHostKeyChecking=accept-new -r ".\pb_data\storage" "${VpsHost}:${RemotePath}/pb_data/"
    
    # Restart PocketBase
    ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && docker compose start pocketbase"
    Write-Host "✅ Local database synced to production!" -ForegroundColor Green
}

# Step 8: Restart Nginx to clear IP cache
Write-Host "`nStep 8: Restarting Nginx to clear IP cache..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $VpsHost "cd $RemotePath && docker compose restart nginx"

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Your app is now running at https://$($VpsHost.Split('@')[1])" -ForegroundColor Yellow
