# =============================================================================
# PB-Next Database Reset Script
# =============================================================================
# This script will:
# 1. Stop PocketBase if running
# 2. Backup current pb_data folder
# 3. Move seeding migrations to pb_migrations_old
# 4. Delete the database file (fresh start)
# =============================================================================

param(
    [switch]$SkipBackup,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PB-Next Database Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------------------------------
# Step 0: Confirm with user
# -----------------------------------------------------------------------------
if (-not $Force) {
    Write-Host "[WARNING] This will:" -ForegroundColor Yellow
    Write-Host "   - Backup your current database" -ForegroundColor Yellow
    Write-Host "   - Move seeding migrations to pb_migrations_old" -ForegroundColor Yellow
    Write-Host "   - DELETE your current database" -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Are you sure you want to continue? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "[ABORTED]" -ForegroundColor Red
        exit 0
    }
}

# -----------------------------------------------------------------------------
# Step 1: Check if PocketBase is running and warn user
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[Step 1] Checking PocketBase status..." -ForegroundColor Cyan

$pbProcess = Get-Process -Name "pocketbase" -ErrorAction SilentlyContinue
if ($pbProcess) {
    Write-Host "[WARNING] PocketBase is currently running!" -ForegroundColor Yellow
    Write-Host "   Please stop it first (Ctrl+C in the terminal)" -ForegroundColor Yellow
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
Write-Host "[OK] PocketBase is not running" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Step 2: Backup pb_data folder
# -----------------------------------------------------------------------------
if (-not $SkipBackup) {
    Write-Host ""
    Write-Host "[Step 2] Creating backup..." -ForegroundColor Cyan
    
    $BackupDir = Join-Path $ProjectRoot "backups"
    $BackupPath = Join-Path $BackupDir "pb_data_backup_$Timestamp"
    
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir | Out-Null
    }
    
    $SourceData = Join-Path $ProjectRoot "pb_data"
    if (Test-Path $SourceData) {
        Copy-Item -Path $SourceData -Destination $BackupPath -Recurse
        Write-Host "[OK] Backed up to: $BackupPath" -ForegroundColor Green
        
        $DbFile = Join-Path $SourceData "data.db"
        if (Test-Path $DbFile) {
            $DbSize = (Get-Item $DbFile).Length / 1MB
            Write-Host "   Database size: $([math]::Round($DbSize, 2)) MB" -ForegroundColor Gray
        }
    } else {
        Write-Host "[INFO] No pb_data folder found (fresh install?)" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "[Step 2] Skipping backup (SkipBackup flag set)" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# Step 3: Remove ALL migrations except schema (clean slate)
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[Step 3] Cleaning migrations (keeping only schema)..." -ForegroundColor Cyan

$MigrationsDir = Join-Path $ProjectRoot "pb_migrations"
$OldMigrationsDir = Join-Path $ProjectRoot "pb_migrations_old"

if (-not (Test-Path $OldMigrationsDir)) {
    New-Item -ItemType Directory -Path $OldMigrationsDir | Out-Null
    Write-Host "   Created: pb_migrations_old/" -ForegroundColor Gray
}

# Keep ONLY the schema migration - remove everything else
$KeepFiles = @("1800000000_complete_schema.js")
$RemovedCount = 0

Get-ChildItem -Path $MigrationsDir -Filter "*.js" -File | ForEach-Object {
    if ($KeepFiles -notcontains $_.Name) {
        # Move to old if not exists there, otherwise just delete
        $destPath = Join-Path $OldMigrationsDir $_.Name
        if (-not (Test-Path $destPath)) {
            Move-Item -Path $_.FullName -Destination $destPath
        } else {
            Remove-Item $_.FullName -Force
        }
        Write-Host "   Removed: $($_.Name)" -ForegroundColor Gray
        $RemovedCount++
    }
}

Write-Host "[OK] Removed $RemovedCount migrations (keeping only schema)" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Step 4: Delete database
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[Step 4] Removing database..." -ForegroundColor Cyan

$DbFile = Join-Path $ProjectRoot "pb_data\data.db"
$DbWal = Join-Path $ProjectRoot "pb_data\data.db-wal"
$DbShm = Join-Path $ProjectRoot "pb_data\data.db-shm"

if (Test-Path $DbFile) {
    Remove-Item $DbFile -Force
    Write-Host "   Deleted: data.db" -ForegroundColor Gray
}
if (Test-Path $DbWal) {
    Remove-Item $DbWal -Force
    Write-Host "   Deleted: data.db-wal" -ForegroundColor Gray
}
if (Test-Path $DbShm) {
    Remove-Item $DbShm -Force
    Write-Host "   Deleted: data.db-shm" -ForegroundColor Gray
}

# Also clear storage folder
$StorageDir = Join-Path $ProjectRoot "pb_data\storage"
if (Test-Path $StorageDir) {
    Remove-Item $StorageDir -Recurse -Force
    Write-Host "   Deleted: storage/" -ForegroundColor Gray
}

Write-Host "[OK] Database removed" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Done!
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  [DONE] Reset Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: ./pocketbase serve" -ForegroundColor White
Write-Host "     (This will run schema migration and create fresh DB)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Create admin account at: http://127.0.0.1:8090/_/" -ForegroundColor White
Write-Host ""
Write-Host "  3. Run individual seed migrations as needed:" -ForegroundColor White
Write-Host "     Copy files from pb_migrations_old/ back to pb_migrations/" -ForegroundColor Gray
Write-Host "     then restart PocketBase" -ForegroundColor Gray
Write-Host ""
Write-Host "Backup location: backups\pb_data_backup_$Timestamp" -ForegroundColor Yellow
Write-Host ""
