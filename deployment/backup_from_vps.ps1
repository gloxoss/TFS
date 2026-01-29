# backup_from_vps.ps1
# Backup PocketBase data from VPS to local machine (Windows)

# ======= CONFIGURE THESE =======
$VPS_USER = "root"                    # Your VPS username
$VPS_HOST = "72.62.27.47"             # Your VPS IP address  
$VPS_PATH = "/opt/pocketbase/pb_data" # Found on VPS
$LOCAL_PATH = ".\pb_data_backup"      # Local destination
# ===============================

Write-Host "Creating local backup directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $LOCAL_PATH | Out-Null

Write-Host "Downloading pb_data from VPS..." -ForegroundColor Cyan
Write-Host "Command: scp -r ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/* $LOCAL_PATH/" -ForegroundColor Yellow

# Run SCP command
scp -r "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/*" "$LOCAL_PATH/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBackup complete! Files saved to: $LOCAL_PATH" -ForegroundColor Green
    Write-Host "`nTo use this backup locally:" -ForegroundColor Cyan
    Write-Host "1. Stop your local PocketBase (Ctrl+C in terminal)" -ForegroundColor White
    Write-Host "2. Copy backup contents to: .\pb_data\" -ForegroundColor White
    Write-Host "3. Restart PocketBase: .\pocketbase.exe serve" -ForegroundColor White
} else {
    Write-Host "`nBackup failed! Check your VPS credentials and path." -ForegroundColor Red
}
