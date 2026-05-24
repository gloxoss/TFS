param(
    [string]$VpsHost = "root@72.62.27.47"
)

$ErrorActionPreference = "Stop"
$KeyPath = "$env:USERPROFILE\.ssh\id_ed25519"
$PubKeyPath = "$KeyPath.pub"

# 1. Generate Key if missing
if (-not (Test-Path $KeyPath)) {
    Write-Host "Generating new SSH key..." -ForegroundColor Yellow
    
    # Use cmd /c to bypass PowerShell's empty argument parsing issues
    cmd /c "ssh-keygen -t ed25519 -f ""$KeyPath"" -N """""
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ssh-keygen failed!"
    }
} else {
    Write-Host "SSH key already exists." -ForegroundColor Green
}

# 2. Read Public Key
if (-not (Test-Path $PubKeyPath)) {
    Write-Error "Public key file not found at $PubKeyPath"
}
$PubKey = Get-Content $PubKeyPath

# 3. Copy to VPS (Requires password ONE last time)
Write-Host "Copying key to VPS (Enter password one last time)..." -ForegroundColor Yellow
$RemoteCommand = "mkdir -p ~/.ssh && echo '$PubKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"

ssh $VpsHost $RemoteCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Success! Passwordless login enabled." -ForegroundColor Green
    Write-Host "Try it: ssh $VpsHost" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Failed to copy key." -ForegroundColor Red
}
