# =============================================================================
# PB-Next Database Restore Script
# =============================================================================
# Restores a previous backup of the database
# =============================================================================

param(
    [string]$BackupName,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackupsDir = Join-Path $ProjectRoot "backups"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PB-Next Database Restore Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PocketBase is running
$pbProcess = Get-Process -Name "pocketbase" -ErrorAction SilentlyContinue
if ($pbProcess) {
    Write-Host "[WARNING] PocketBase is currently running!" -ForegroundColor Yellow
    Write-Host "   Please stop it first, then run this script again." -ForegroundColor Yellow
    exit 1
}

# List available backups
Write-Host "Available backups:" -ForegroundColor Cyan
$backups = Get-ChildItem -Path $BackupsDir -Directory -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
if ($null -eq $backups -or $backups.Count -eq 0) {
    Write-Host "[ERROR] No backups found in: $BackupsDir" -ForegroundColor Red
    exit 1
}

$i = 1
foreach ($backup in $backups) {
    $size = 0
    $dbFile = Join-Path $backup.FullName "data.db"
    if (Test-Path $dbFile) {
        $size = [math]::Round((Get-Item $dbFile).Length / 1MB, 2)
    }
    Write-Host "  $i. $($backup.Name) ($size MB)" -ForegroundColor White
    $i++
}

Write-Host ""

if (-not $BackupName) {
    if ($Force) {
        # If Force flag, use the latest backup
        $BackupName = $backups[0].Name
        Write-Host "Using latest backup: $BackupName" -ForegroundColor Yellow
    } else {
        $selection = Read-Host "Enter backup number to restore (or folder name)"
        
        if ($selection -match '^\d+$') {
            $idx = [int]$selection - 1
            if ($idx -ge 0 -and $idx -lt $backups.Count) {
                $BackupName = $backups[$idx].Name
            }
        } else {
            $BackupName = $selection
        }
    }
}

$BackupPath = Join-Path $BackupsDir $BackupName
if (-not (Test-Path $BackupPath)) {
    Write-Host "[ERROR] Backup not found: $BackupPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Restoring from: $BackupName" -ForegroundColor Yellow

# Remove current pb_data
$CurrentData = Join-Path $ProjectRoot "pb_data"
if (Test-Path $CurrentData) {
    Remove-Item $CurrentData -Recurse -Force
    Write-Host "[OK] Removed current pb_data" -ForegroundColor Green
}

# Copy backup to pb_data
Copy-Item -Path $BackupPath -Destination $CurrentData -Recurse
Write-Host "[OK] Restored backup to pb_data" -ForegroundColor Green

# Also restore migrations from pb_migrations_old if they exist
$OldMigrationsDir = Join-Path $ProjectRoot "pb_migrations_old"
$MigrationsDir = Join-Path $ProjectRoot "pb_migrations"

if (Test-Path $OldMigrationsDir) {
    $oldFiles = Get-ChildItem -Path $OldMigrationsDir -File
    if ($oldFiles.Count -gt 0) {
        Write-Host ""
        $restoreMigrations = "y"
        if (-not $Force) {
            $restoreMigrations = Read-Host "Also restore $($oldFiles.Count) migrations from pb_migrations_old? (y/N)"
        }
        
        if ($restoreMigrations -eq "y" -or $restoreMigrations -eq "Y") {
            foreach ($file in $oldFiles) {
                $destPath = Join-Path $MigrationsDir $file.Name
                if (-not (Test-Path $destPath)) {
                    Copy-Item -Path $file.FullName -Destination $destPath
                }
            }
            Write-Host "[OK] Restored $($oldFiles.Count) migrations" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  [DONE] Restore Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Run: ./pocketbase serve" -ForegroundColor Cyan
Write-Host ""
