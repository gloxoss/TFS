# TFS VPS Deployment Guide

## Quick Reference

| Task | Command |
|------|---------|
| Build & Package | `.\deployment\build_package.ps1` |
| Deploy to VPS | `.\deployment\deploy_to_vps.ps1` |
| Update VPS | `.\deployment\update_vps.ps1 -Component web` |

---

## Part 1: Initial Deployment to New VPS

### Step 1: Prepare VPS (One-time setup)

SSH into the VPS and install Docker:

```bash
# Connect to VPS
ssh root@<VPS_IP>

# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh

# Start Docker
systemctl enable docker
systemctl start docker

# Create app directory
mkdir -p /opt/tfs
```

### Step 2: Build Package (Your PC)

```powershell
cd c:\Users\zakio\Documents\Project\PB-Next
.\deployment\build_package.ps1
```

This creates `dist\TFS_App_v1.0\` with all deployment files.

### Step 3: Upload to VPS

```powershell
# Zip the package
Compress-Archive -Path "dist\TFS_App_v1.0\*" -DestinationPath "dist\TFS_App_v1.0.zip" -Force

# Upload to VPS
scp dist\TFS_App_v1.0.zip root@<VPS_IP>:/opt/tfs/
```

### Step 4: Deploy on VPS

```bash
ssh root@<VPS_IP>

cd /opt/tfs
unzip -o TFS_App_v1.0.zip

# Load Docker images
docker load -i tfs-web.tar
docker load -i tfs-pb.tar

# Start the app
docker compose up -d

# Verify
docker ps  # Should show 3 containers: web, pocketbase, nginx
```

---

## Part 2: Making Updates

### Workflow: Code Change → Build → Deploy

```
1. Make changes in your workspace
2. Run: .\deployment\build_package.ps1
3. Run: .\deployment\update_vps.ps1
```

### Update Script (create this file)

Save as `deployment\update_vps.ps1`:

```powershell
param(
    [string]$VpsHost = "root@<VPS_IP>",
    [string]$Component = "all"  # web, pb, or all
)

$distDir = "dist\TFS_App_v1.0"

# Build images
Write-Host "Building..." -ForegroundColor Cyan
.\deployment\build_package.ps1

# Upload and deploy
Write-Host "Uploading to VPS..." -ForegroundColor Cyan

if ($Component -eq "web" -or $Component -eq "all") {
    scp "$distDir\tfs-web.tar" "${VpsHost}:/opt/tfs/"
    ssh $VpsHost "cd /opt/tfs && docker load -i tfs-web.tar && docker compose up -d web"
}

if ($Component -eq "pb" -or $Component -eq "all") {
    scp "$distDir\tfs-pb.tar" "${VpsHost}:/opt/tfs/"
    ssh $VpsHost "cd /opt/tfs && docker load -i tfs-pb.tar && docker compose up -d pocketbase"
}

Write-Host "Update complete!" -ForegroundColor Green
```

Usage:
```powershell
# Update only web
.\deployment\update_vps.ps1 -Component web

# Update everything
.\deployment\update_vps.ps1 -Component all
```

---

## Part 3: Hosting on Any New VPS

### One-liner Setup

After uploading the package to a new VPS:

```bash
cd /opt/tfs && unzip -o TFS_App_v1.0.zip && docker load -i tfs-web.tar && docker load -i tfs-pb.tar && docker compose up -d
```

### Requirements for New VPS
- Docker installed
- Ports 80/443 open
- Minimum 1GB RAM

---

## File Structure on VPS

```
/opt/tfs/
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── pb_data/           # PocketBase data (persisted)
├── tfs-web.tar
└── tfs-pb.tar
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Container not starting | `docker compose logs <service>` |
| Port 80 in use | `sudo lsof -i :80` then kill process |
| DB not persisting | Check `./pb_data` mount in docker-compose.yml |
