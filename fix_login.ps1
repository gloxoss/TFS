
# Params
$VPS_IP = "72.62.27.47"
$VPS_USER = "root"
$REMOTE_DIR = "~/tfs-docker-deploy"

Write-Host "Fixing PocketBase Permissions and Credentials..." -ForegroundColor Yellow

# Commands to run on VPS
$commands = @(
    "cd ${REMOTE_DIR}",
    # 1. Fix Permissions (allow container to write to db)
    "chmod -R 777 pb_data",
    
    # 2. Restart to apply any pending file locks
    "docker compose restart pocketbase",
    "sleep 5",
    
    # 3. Force Create Admin User again (just in case)
    "docker exec tfs-pocketbase-new /usr/local/bin/pocketbase superuser upsert admin@tfs.com 1234567890"
)

$remoteScript = $commands -join "; "
ssh ${VPS_USER}@${VPS_IP} $remoteScript

Write-Host "Done!" -ForegroundColor Green
Write-Host "Try logging in now:"
Write-Host "Email: admin@tfs.com"
Write-Host "Pass:  1234567890"
