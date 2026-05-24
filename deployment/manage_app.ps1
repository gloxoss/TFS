param(
    [Parameter(Mandatory=$true)]
    [string]$Target,

    [string]$Domain, # Optional: if not set, uses $Target

    [switch]$SyncDB,
    [switch]$NoLocalCopy, # If set with SyncDB, uses existing seed_data without overwriting from pb_data
    [switch]$SetupSSH,
    [switch]$SetupSSL,
    [switch]$RenewSSL, # Only renew SSL certificate without full deploy
    [switch]$Https # Force HTTPS in env vars
)

$ErrorActionPreference = "Stop"

# Determine Protocol
$Protocol = if ($Https -or $SetupSSL) { "https" } else { "http" }

# Use Domain if provided, otherwise Target
$AppUrl = if ($Domain) { "${Protocol}://${Domain}" } else { "http://$Target" }
$HostName = if ($Domain) { $Domain } else { "localhost" }

# === 1. SSH Setup (Optional) ===
if ($SetupSSH) {
    Write-Host "`n[SSH] Setting up SSH for new host $Target..." -ForegroundColor Cyan
    .\deployment\setup_ssh.ps1 -VpsHost "root@$Target"
}

# === 2. Sync Database (Optional) ===
if ($SyncDB) {
    Write-Host "`n[DB] Syncing local database..." -ForegroundColor Cyan
    
    # Check if PocketBase is running
    $pbProcess = Get-Process pocketbase -ErrorAction SilentlyContinue
    if ($pbProcess) {
        Write-Warning "PocketBase is seemingly running (PID: $($pbProcess.Id))."
        Write-Warning "Please STOP it manually to ensure data integrity during copy."
        Read-Host "Press Enter once PocketBase is stopped..."
    }

    # Copy data only if not skipped (allows manual seed preparation)
    if (-not $NoLocalCopy) {
        $seedPath = "deployment\seed_data"
        Remove-Item $seedPath -Recurse -Force -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Path $seedPath -Force | Out-Null
        Copy-Item "pb_data\*" -Destination $seedPath -Recurse -Force
        Write-Host "[OK] Local database synced to deployment package." -ForegroundColor Green
    } else {
        Write-Host "[SKIP] Using existing deployment\seed_data (NoLocalCopy)" -ForegroundColor Yellow
    }
}

# === 3. Update POCKETBASE_URL in docker-compose ===
# We ensure the target URL is set correctly in the config before building
$composeFile = "deployment\docker-compose.yml"
$content = Get-Content $composeFile
# Regex fix: Don't add "      - " prefix if we match just the variable name part
$newContent = $content -replace "NEXT_PUBLIC_POCKETBASE_URL=.*", "NEXT_PUBLIC_POCKETBASE_URL=$AppUrl"
$newContent = $newContent -replace "NEXT_PUBLIC_SITE_URL=.*", "NEXT_PUBLIC_SITE_URL=$AppUrl"
$newContent | Set-Content $composeFile

# Also update Nginx config to the domain/host
$nginxFile = "deployment\nginx\default.conf"
if (Test-Path $nginxFile) {
    $nContent = Get-Content $nginxFile
    $nNewContent = $nContent -replace "server_name .*", "    server_name $HostName;"
    $nNewContent | Set-Content $nginxFile
}

Write-Host "[CFG] Configured App URL: $AppUrl" -ForegroundColor Green

# === Quick SSL Renewal Only (skip build/deploy) ===
if ($RenewSSL -and -not $SetupSSL) {
    Write-Host "`n[SSL] Renewing SSL certificate for $HostName and www.$HostName..." -ForegroundColor Cyan
    
    # Update ssl.conf with correct domain
    $sslConf = Get-Content "deployment\nginx\ssl.conf" -Raw
    $sslConf = $sslConf -replace "www\.[a-zA-Z0-9.-]+", "www.$HostName"
    $sslConf = $sslConf -replace "(?<!www\.)[a-zA-Z0-9-]+\.ma", $HostName
    $sslConf | Set-Content "deployment\nginx\ssl.conf"
    
    # Update init_ssl.sh with correct domain
    $initSsl = Get-Content "deployment\init_ssl.sh" -Raw
    $initSsl = $initSsl -replace 'DOMAIN=".*"', "DOMAIN=`"$HostName`""
    $initSsl | Set-Content "deployment\init_ssl.sh"
    
    # Upload and run
    scp "deployment\nginx\ssl.conf" "root@${Target}:/opt/tfs/nginx/"
    scp "deployment\init_ssl.sh" "root@${Target}:/opt/tfs/"
    ssh "root@$Target" "cd /opt/tfs && chmod +x init_ssl.sh && sed -i 's/\r$//' init_ssl.sh && bash init_ssl.sh"
    
    Write-Host "`n[DONE] SSL renewed for $AppUrl" -ForegroundColor Green
    exit 0
}

# === 4. Build Package ===
Write-Host "`n[BUILD] Building application package..." -ForegroundColor Cyan
.\deployment\build_package.ps1

# Removed premature SSL config swap to ensure clean initial deployment

# === 5. Deploy to VPS ===
Write-Host "`n[DEPLOY] Deploying to $Target..." -ForegroundColor Cyan
.\deployment\deploy_to_vps.ps1 -VpsHost "root@$Target" -WipeDB:([bool]$SyncDB) -SkipBuild

# === 6. SSL Setup (Optional) ===
if ($SetupSSL) {
    Write-Host "`n[SSL] Configuring HTTPS for $HostName and www.$HostName..." -ForegroundColor Cyan
    
    # Update ssl.conf with correct domain
    $sslConf = Get-Content "deployment\nginx\ssl.conf" -Raw
    $sslConf = $sslConf -replace "www\.[a-zA-Z0-9.-]+", "www.$HostName"
    $sslConf = $sslConf -replace "(?<!www\.)[a-zA-Z0-9-]+\.ma", $HostName
    $sslConf | Set-Content "deployment\nginx\ssl.conf"
    
    # Update init_ssl.sh with correct domain
    $initSsl = Get-Content "deployment\init_ssl.sh" -Raw
    $initSsl = $initSsl -replace 'DOMAIN=".*"', "DOMAIN=`"$HostName`""
    $initSsl | Set-Content "deployment\init_ssl.sh"
    
    # Upload SSL config and script
    $distDir = "dist\TFS_App_v1.0"
    if (-not (Test-Path $distDir)) {
        New-Item -ItemType Directory -Path "$distDir\nginx" -Force | Out-Null
    }
    Copy-Item "deployment\nginx\ssl.conf" "$distDir\nginx\ssl.conf" -Force
    Copy-Item "deployment\init_ssl.sh" "$distDir\init_ssl.sh" -Force

    # SCP files to VPS
    scp "$distDir\nginx\ssl.conf" "root@${Target}:/opt/tfs/nginx/"
    scp "$distDir\init_ssl.sh" "root@${Target}:/opt/tfs/"

    # Run init_ssl.sh
    ssh "root@$Target" "cd /opt/tfs && chmod +x init_ssl.sh && sed -i 's/\r$//' init_ssl.sh && bash init_ssl.sh"
}

Write-Host "`n[DONE] App is live at $AppUrl" -ForegroundColor Green
