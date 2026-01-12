# TFS Deployment Guide: Step-by-Step

> Complete guide to build, package, and deploy TFS to any VPS

---

## Overview: The Big Picture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        YOUR WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. DEVELOP        2. BUILD           3. PACKAGE        4. DEPLOY  │
│  ─────────        ─────────          ─────────        ─────────    │
│  Edit code   →   Docker images  →   .tar files   →   Client VPS   │
│  (Your PC)       (Your PC/VPS)      (Portable)       (Their server)│
│                                                                     │
│  You keep         Compiled          Like .exe         They run it  │
│  source code      binaries          files             not edit it  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### On YOUR Machine (Developer)
- ✅ Docker Desktop installed and running
- ✅ Project code in `C:\Users\zakio\Documents\Project\PB-Next`
- ✅ SSH access to target VPS

### On Target VPS
- ✅ Ubuntu 22.04+ or Debian 12+
- ✅ 2GB+ RAM
- ✅ Docker (will be installed by script if missing)

---

## STEP 1: Build the Docker Images

> **When to do this:** Every time you make code changes you want to deploy

### Option A: Build on Your PC (Windows)

Open PowerShell in your project folder:

```powershell
cd C:\Users\zakio\Documents\Project\PB-Next

# Start Docker Desktop first! (if not running)

# Build the Web App (Next.js)
docker build -t tfs-web:latest -f web/Dockerfile ./web

# Build PocketBase
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
```

**What happens:**
- Next.js code gets compiled → No source code in image
- PocketBase binary + your hooks/migrations → Baked in

### Option B: Build on VPS (if Docker Desktop has issues)

```bash
ssh root@YOUR_VPS_IP
cd /var/www/next-app/TFS-web
git pull origin release/v1
docker build -t tfs-web:latest -f web/Dockerfile ./web
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
```

---

## STEP 2: Export Images to Files

> **What this does:** Converts Docker images to portable .tar files

### On Your PC:

```powershell
# Create images folder
mkdir -p deploy\images

# Export images (this takes a minute)
docker save -o deploy\images\tfs-web.tar tfs-web:latest
docker save -o deploy\images\tfs-pb.tar tfs-pb:latest

# Check the sizes
dir deploy\images
```

**Expected output:**
```
tfs-web.tar    ~200-400 MB
tfs-pb.tar     ~30-50 MB
```

### Or on VPS:

```bash
mkdir -p /root/deploy/images
docker save -o /root/deploy/images/tfs-web.tar tfs-web:latest
docker save -o /root/deploy/images/tfs-pb.tar tfs-pb:latest
```

---

## STEP 3: Create the Deployment Package

> **What you're building:** A folder the client can use to install the app

Your `deploy/` folder should contain:

```
deploy/
├── install.sh              ← Client runs this
├── update.sh               ← For future updates
├── docker-compose.yml      ← Service configuration
├── .env.example            ← Settings template
├── README.txt              ← Instructions
├── nginx/
│   └── nginx.conf          ← Reverse proxy (optional)
└── images/
    ├── tfs-web.tar         ← Web app (compiled)
    └── tfs-pb.tar          ← Database (compiled)
```

**These files are already created** in your project. Just add the .tar files!

---

## STEP 4: Upload to VPS

### Method A: Upload the whole folder

```powershell
# From your PC, upload the deploy folder
scp -r deploy root@YOUR_VPS_IP:/root/
```

### Method B: Upload just the images (if deploy folder already on VPS)

```powershell
scp deploy\images\*.tar root@YOUR_VPS_IP:/root/deploy/images/
```

---

## STEP 5: Run the Installer on VPS

### SSH into the VPS:

```bash
ssh root@YOUR_VPS_IP
```

### First-time installation:

```bash
cd /root/deploy

# Make scripts executable
chmod +x install.sh update.sh

# Edit environment settings
cp .env.example .env
nano .env  # Set your domain, ports, etc.

# Run the installer!
./install.sh
```

**What install.sh does automatically:**
1. ✅ Checks if Docker is installed (installs if missing)
2. ✅ Loads the .tar images into Docker
3. ✅ Starts the containers
4. ✅ Shows you the URLs

### For updates (after first install):

```bash
cd /root/deploy
./update.sh
```

---

## STEP 6: Verify It Works

### Check containers are running:

```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE            STATUS          PORTS
abc123...      tfs-web:latest   Up 2 minutes    0.0.0.0:3000->3000/tcp
def456...      tfs-pb:latest    Up 2 minutes    0.0.0.0:8090->8090/tcp
```

### Access in browser:

| Service | URL |
|---------|-----|
| Web App | `http://YOUR_VPS_IP:3000` |
| PocketBase Admin | `http://YOUR_VPS_IP:8090/_/` |

### Check logs if issues:

```bash
docker logs tfs-web
docker logs tfs-pocketbase
```

---

## Quick Reference: Common Commands

### On VPS:

```bash
# View running containers
docker ps

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Restart everything
docker compose restart

# Full restart (stop + start)
docker compose down && docker compose up -d
```

---

## Workflow Summary

### 🔧 When You Make Code Changes:

```
1. Edit code on your PC
2. Build images:     docker build -t tfs-web:latest ...
3. Export:           docker save -o deploy/images/tfs-web.tar ...
4. Upload to VPS:    scp deploy/images/*.tar root@VPS:~/deploy/images/
5. On VPS:           ./update.sh
```

### 🆕 When Deploying to NEW Client:

```
1. Build images (if not already)
2. Upload whole deploy folder:  scp -r deploy root@VPS:~/
3. SSH to VPS
4. Configure .env
5. Run ./install.sh
6. Done!
```

---

## Troubleshooting

### "Container keeps restarting"
```bash
docker logs tfs-pocketbase  # Check what's wrong
```

### "Port already in use"
```bash
# Check what's using the port
lsof -i :3000
# Edit .env to use different ports
```

### "Permission denied"
```bash
chmod +x install.sh update.sh
```

### "Image not found"
```bash
# Make sure you ran docker save first
docker images  # Check if images exist locally
docker load -i images/tfs-web.tar  # Reload if needed
```

---

## Security Reminder

| ✅ Client GETS | ❌ Client CANNOT ACCESS |
|----------------|------------------------|
| Compiled app | Your source code |
| Their own data | Git history |
| Config options | Internal logic |
| Start/stop ability | Modification ability |

**Your source code stays safe on YOUR machine!**

---

## 📋 Deployment Scenarios

### Scenario 1: Fresh Deployment to NEW VPS

> **When:** Setting up app on a brand new server (your VPS or client's)

```bash
# 1. On YOUR PC - Build and export
cd C:\Users\zakio\Documents\Project\PB-Next
docker build -t tfs-web:latest -f web/Dockerfile ./web
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
docker save -o deploy\images\tfs-web.tar tfs-web:latest
docker save -o deploy\images\tfs-pb.tar tfs-pb:latest

# 2. Upload entire deploy folder
scp -r deploy root@NEW_VPS_IP:/root/

# 3. SSH and install
ssh root@NEW_VPS_IP
cd /root/deploy
chmod +x install.sh update.sh
cp .env.example .env
nano .env  # Configure domain, ports
./install.sh
```

---

### Scenario 2: UI/Frontend Changes Only

> **When:** You changed React components, styles, pages (no database changes)

```bash
# 1. On YOUR PC - Rebuild ONLY web image
docker build -t tfs-web:latest -f web/Dockerfile ./web
docker save -o deploy\images\tfs-web.tar tfs-web:latest

# 2. Upload only the web image
scp deploy\images\tfs-web.tar root@VPS_IP:/root/deploy/images/

# 3. On VPS - Update
ssh root@VPS_IP
cd /root/deploy
./update.sh
```

---

### Scenario 3: Backend/API Changes (PocketBase Hooks)

> **When:** You modified `pb_hooks/` JavaScript files

```bash
# 1. On YOUR PC - Rebuild ONLY PocketBase image  
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
docker save -o deploy\images\tfs-pb.tar tfs-pb:latest

# 2. Upload only the PocketBase image
scp deploy\images\tfs-pb.tar root@VPS_IP:/root/deploy/images/

# 3. On VPS - Update
ssh root@VPS_IP
cd /root/deploy
./update.sh
```

---

### Scenario 4: Database Schema Changes (Migrations)

> **When:** You added new collections, fields, or modified `pb_migrations/`

```bash
# 1. On YOUR PC - Rebuild PocketBase image (migrations baked in)
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
docker save -o deploy\images\tfs-pb.tar tfs-pb:latest

# 2. Upload
scp deploy\images\tfs-pb.tar root@VPS_IP:/root/deploy/images/

# 3. On VPS - Backup first, then update
ssh root@VPS_IP
cd /root/deploy

# BACKUP FIRST!
docker exec tfs-pocketbase tar -czvf /tmp/pb_backup.tar.gz /pb/pb_data
docker cp tfs-pocketbase:/tmp/pb_backup.tar.gz ./backups/pb_backup_$(date +%Y%m%d).tar.gz

# Then update
./update.sh
```

---

### Scenario 5: Full Update (Frontend + Backend + Migrations)

> **When:** Major release with changes everywhere

```bash
# 1. On YOUR PC - Rebuild BOTH images
docker build -t tfs-web:latest -f web/Dockerfile ./web
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
docker save -o deploy\images\tfs-web.tar tfs-web:latest
docker save -o deploy\images\tfs-pb.tar tfs-pb:latest

# 2. Upload both
scp deploy\images\*.tar root@VPS_IP:/root/deploy/images/

# 3. On VPS - Backup and update
ssh root@VPS_IP
cd /root/deploy
mkdir -p backups
docker exec tfs-pocketbase tar -czvf /tmp/backup.tar.gz /pb/pb_data
docker cp tfs-pocketbase:/tmp/backup.tar.gz ./backups/
./update.sh
```

---

### Scenario 6: Deploying to Client's VPS (First Time)

> **When:** Delivering the app to a paying client

```bash
# 1. On YOUR PC - Build release package
.\build-release.ps1 -Version "1.0.0"
# This creates: TFS_v1.0.0.zip

# 2. Send to client or upload yourself
scp TFS_v1.0.0.zip root@CLIENT_VPS:/root/

# 3. On CLIENT VPS - Install
ssh root@CLIENT_VPS
cd /root
unzip TFS_v1.0.0.zip -d tfs-app
cd tfs-app
chmod +x install.sh update.sh
cp .env.example .env
nano .env  # Configure their domain
./install.sh

# 4. Setup their domain (optional)
# Point their DNS A record to VPS IP
# Configure nginx for SSL
```

---

### Scenario 7: Sending Update to Existing Client

> **When:** Client already has the app, you're sending a fix/feature

```bash
# 1. On YOUR PC - Build only what changed
docker build -t tfs-web:latest -f web/Dockerfile ./web  # if UI changed
docker save -o tfs-web-v1.1.tar tfs-web:latest

# 2. Send the file
# Option A: Direct upload (if you have SSH access)
scp tfs-web-v1.1.tar root@CLIENT_VPS:/root/tfs-app/images/tfs-web.tar

# Option B: Send via email/cloud (client uploads themselves)
# Upload to Google Drive, send link to client

# 3. Client runs (or you via SSH):
cd /root/tfs-app
./update.sh
```

---

### Scenario 8: Migrating to Different VPS

> **When:** Moving the app from one server to another

```bash
# 1. On OLD VPS - Backup everything
ssh root@OLD_VPS
cd /root/deploy
docker exec tfs-pocketbase tar -czvf /tmp/pb_data.tar.gz /pb/pb_data
docker cp tfs-pocketbase:/tmp/pb_data.tar.gz ./
# Download to your PC
exit
scp root@OLD_VPS:/root/deploy/pb_data.tar.gz ./

# 2. On NEW VPS - Fresh install
scp -r deploy root@NEW_VPS:/root/
scp pb_data.tar.gz root@NEW_VPS:/root/deploy/
ssh root@NEW_VPS
cd /root/deploy
./install.sh

# 3. Restore data
docker compose down
docker volume rm deploy_pb_data  # Remove empty volume
docker compose up -d pocketbase  # Start fresh PB
docker cp pb_data.tar.gz tfs-pocketbase:/tmp/
docker exec tfs-pocketbase tar -xzvf /tmp/pb_data.tar.gz -C /
docker compose restart
```

---

### Scenario 9: Rolling Back to Previous Version

> **When:** New update broke something, need to go back

```bash
# On VPS - If you kept old .tar files
ssh root@VPS_IP
cd /root/deploy

# Restore old images
docker load -i images/tfs-web-v1.0.tar  # Previous version
docker tag tfs-web:v1.0 tfs-web:latest

# Restart
docker compose down
docker compose up -d
```

**Pro tip:** Always keep the last 2-3 versions of .tar files!

---

### Scenario 10: Database Backup & Restore

> **When:** Regular backup or before risky changes

#### Backup:
```bash
ssh root@VPS_IP
cd /root/deploy
mkdir -p backups

# Create backup
docker exec tfs-pocketbase tar -czvf /tmp/backup.tar.gz /pb/pb_data
docker cp tfs-pocketbase:/tmp/backup.tar.gz ./backups/pb_$(date +%Y%m%d_%H%M).tar.gz

# Download to your PC (optional)
exit
scp root@VPS_IP:/root/deploy/backups/*.tar.gz ./local_backups/
```

#### Restore:
```bash
ssh root@VPS_IP
cd /root/deploy

# Stop containers
docker compose down

# Restore
docker run --rm -v deploy_pb_data:/pb/pb_data -v $(pwd)/backups:/backups alpine \
  sh -c "rm -rf /pb/pb_data/* && tar -xzvf /backups/pb_20260112.tar.gz -C /"

# Restart
docker compose up -d
```

---

### Scenario 11: Environment Config Changes Only

> **When:** Changing domain, ports, API keys (no code changes)

```bash
ssh root@VPS_IP
cd /root/deploy

# Edit environment
nano .env

# Restart to apply
docker compose down
docker compose up -d
```

---

### Scenario 12: Adding SSL/HTTPS

> **When:** Setting up production domain with SSL certificate

```bash
ssh root@VPS_IP

# Install certbot
apt update && apt install -y certbot

# Get certificate
certbot certonly --standalone -d yourdomain.com

# Copy certs to nginx folder
mkdir -p /root/deploy/nginx/ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /root/deploy/nginx/ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /root/deploy/nginx/ssl/

# Add nginx container to docker-compose.yml (see deploy/docker-compose.yml)
# Then restart
docker compose down
docker compose up -d
```

---

## 📁 File Summary

| File | Purpose | When to Edit |
|------|---------|--------------|
| `deploy/install.sh` | First-time setup | Never (auto-generated) |
| `deploy/update.sh` | Apply updates | Never |
| `deploy/.env` | Configuration | Set domain, ports |
| `deploy/docker-compose.yml` | Service config | Add nginx, change ports |
| `deploy/images/*.tar` | App binaries | Replace when you build new versions |
| `build-release.ps1` | Build script | Never |
| `DEPLOYMENT_GUIDE.md` | This guide | Reference only |

