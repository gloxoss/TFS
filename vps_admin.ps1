# =============================================================================
# TFS VPS Access Script
# =============================================================================
# Provides temporary PocketBase admin access for maintenance
# Usage: .\vps_admin.ps1 [-Action "start"|"stop"|"logs"|"shell"]
# =============================================================================

param(
    [ValidateSet("start", "stop", "logs", "shell", "status")]
    [string]$Action = "status",
    [string]$VpsIp = "72.62.27.47",
    [string]$VpsUser = "root",
    [string]$RemoteDir = "~/tfs-deploy"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TFS VPS Admin Access" -ForegroundColor Cyan
Write-Host "  Action: $Action" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

switch ($Action) {
    "start" {
        Write-Host "`nStarting PocketBase admin tunnel..." -ForegroundColor Yellow
        Write-Host "PocketBase Admin will be available at: http://localhost:8091/_/" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop the tunnel." -ForegroundColor Yellow
        Write-Host ""
        # Create SSH tunnel to PocketBase
        ssh -L 8091:localhost:8090 ${VpsUser}@${VpsIp} "docker compose -f ${RemoteDir}/docker-compose.yml exec pocketbase tail -f /dev/null"
    }
    "stop" {
        Write-Host "`nNo persistent tunnel to stop (Ctrl+C should have closed it)" -ForegroundColor Yellow
    }
    "logs" {
        Write-Host "`nFetching container logs..." -ForegroundColor Yellow
        ssh ${VpsUser}@${VpsIp} "cd ${RemoteDir} && docker compose logs --tail=100"
    }
    "shell" {
        Write-Host "`nOpening shell to VPS..." -ForegroundColor Yellow
        ssh ${VpsUser}@${VpsIp}
    }
    "status" {
        Write-Host "`nContainer status:" -ForegroundColor Yellow
        ssh ${VpsUser}@${VpsIp} "cd ${RemoteDir} && docker compose ps"
    }
}

Write-Host ""
