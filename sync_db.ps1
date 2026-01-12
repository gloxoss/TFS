
# Params
$VPS_IP = "72.62.27.47"
$VPS_USER = "root"
$REMOTE_DIR = "~/tfs-docker-deploy"

Write-Host "Syncing Local Database to VPS..." -ForegroundColor Yellow

# 1. Zip Local Data (Excluding backups to save space)
Write-Host "Zipping local pb_data..."
Compress-Archive -Path pb_data -DestinationPath pb_data_sync.zip -Force

# 2. Upload
Write-Host "Uploading to VPS..."
scp pb_data_sync.zip ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/

# 3. Swap Data on VPS
Write-Host "Swapping Database on VPS..."
$commands = @(
    "cd ${REMOTE_DIR}",
    "docker compose stop pocketbase",
    
    # Backup old one just in case
    "mv pb_data pb_data_bak_$(Get-Date -Format 'yyyyMMddHHmmss')",
    
    # Install new one
    "unzip -o pb_data_sync.zip",
    "rm pb_data_sync.zip",
    
    # Fix Permissions CRITICAL
    "chmod -R 777 pb_data",
    
    "docker compose start pocketbase"
)

$remoteScript = $commands -join "; "
ssh ${VPS_USER}@${VPS_IP} $remoteScript

Write-Host "Done! The VPS now has your EXACT local database." -ForegroundColor Green
Write-Host "Login with your LOCAL credentials."
