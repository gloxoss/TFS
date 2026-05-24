---
name: tfs-deployment
description: Expert guide for deploying, managing, and controlling the TFS Next.js + PocketBase application on the Hostinger VPS (tfs.ma). Covers deployment scripts, SSL, Docker networking, and database syncing.
allowed-tools: Read, Glob, Grep, Bash
---

# TFS Deployment & Management Guide

This skill provides the definitive operating procedures for managing the `tfs.ma` application on the Hostinger VPS (`76.13.38.218`).

## 1. Architecture Overview

The production environment runs on a Docker Compose stack:
- **`web`**: Next.js (App Router) running on port `3000` internally.
- **`pocketbase`**: PocketBase backend running on port `8090` internally. Database is stored in a volume mapped to `./pb_data`.
- **`nginx`**: Reverse proxy handling HTTP/HTTPS. Routes `/api/chat` to `web`, `/api/` to `pocketbase`, and everything else to `web`.
- **`certbot`**: Ephemeral container used for SSL certificate generation and renewal.

**Host IP:** `76.13.38.218`
**Domains:** `tfs.ma`, `www.tfs.ma`

## 2. Unassisted Deployment (`deploy_to_vps.ps1`)

The primary tool for deploying the project from the local Windows environment to the VPS is the `deployment/deploy_to_vps.ps1` PowerShell script.

### Basic Deployment
Run the script to build local images, upload them via SSH, and restart the containers on the VPS:
```powershell
.\deployment\deploy_to_vps.ps1
```

### Advanced Deployment Flags
The script supports flags for granular control over what gets deployed:

- **`-SkipBuild`**: Skips the local Docker (`docker buildx`) image building process. Useful if you only want to restart containers or sync the database without code changes.
- **`-SyncDB`**: (Legacy/Deprecating Feature) Syncs database migrations. Usually unnecessary now that automatic migrations are disabled and `-SyncData` is preferred for forcing DB states.
- **`-SyncData`**: Stops PocketBase on the VPS, uploads the local `./web/pb_data/` directory (including `data.db`, `auxiliary.db`, and `storage/`) to the VPS, overwriting production data, and restarts PocketBase. **WARNING: THIS OVERWRITES PRODUCTION DATA WITH LOCAL DATA.**

**Example:** Deploy without building images, but forcefully sync the local database state to production:
```powershell
.\deployment\deploy_to_vps.ps1 -SkipBuild -SyncData
```

## 3. Server Management & Troubleshooting

When issues occur in production, log into the server via SSH to inspect the Docker stack.

### Connecting to the Server
```bash
ssh root@76.13.38.218
cd /opt/tfs
```

### Checking Container Health
1. **View running containers:**
   ```bash
   docker ps
   ```
2. **View generic stack logs:**
   ```bash
   docker compose logs -f --tail 50
   ```
3. **View specific service logs (e.g., PocketBase errors, Next...js runtime errors):**
   ```bash
   docker logs -f tfs-web-1
   docker logs -f tfs-pocketbase-1
   docker logs -f tfs-nginx-1
   ```

### Restarting the Stack
If a service is stuck (e.g., 502 Bad Gateway), a restart usually resolves networking glitches or IP cache staleness:
```bash
docker compose restart
# Or specific services:
docker restart tfs-nginx-1
```

## 4. Understanding & Fixing SSL / Nginx Routing

The stack relies on Nginx to route traffic and Certbot to provide Let's Encrypt SSL certificates.

### The Nginx Configurations
The VPS holds two separate Nginx configs:
1. `deployment/nginx/default.conf`: Basic HTTP configuration. Used initially to verify ownership of the domain for Certbot.
2. `deployment/nginx/ssl.conf`: Full HTTPS configuration mapping ports, upgrading WebSockets, handling `client_max_body_size`, and routing traffic.

### How SSL Initialization Works (`init_ssl.sh`)
During initial setup, or if certificates are lost, `deployment/init_ssl.sh` is executed on the server.
1. It spins up Nginx with the HTTP-only `default.conf`.
2. It runs `certbot` to fetch the SSL certificate mapping `tfs.ma` against the HTTP endpoint `/.well-known/acme-challenge/`.
3. If successful, it **copies `ssl.conf` over `default.conf`** (`cat nginx/ssl.conf > nginx/default.conf`).
4. It reloads Nginx (`docker exec tfs-nginx-1 nginx -s reload`).

### Fixing "ERR_CONNECTION_TIMED_OUT"
If the website stops responding (not even a 502, just a complete timeout), it almost certainly means Nginx is running the HTTP-only `default.conf` and explicitly dropping port 443 requests. 
**To fix:**
Log in to the VPS and manually restore the SSL config:
```bash
cd /opt/tfs/
cat nginx/ssl.conf > nginx/default.conf
docker exec tfs-nginx-1 nginx -s reload
```

## 5. PocketBase Data & Migrations Guidelines

- **Migrations are Disabled in Docker:** To prevent production data from being inadvertently overwritten by local schema changes, `--automigrate=0` is set in the VPS Dockerfile.
- **Data Persistence:** Production PocketBase data lives entirely in `/opt/tfs/pb_data` (mapped to `/pb/pb_data` inside the container).
- **Updating Schema:** If you need to make schema changes, you can either:
  1. Go to the Admin UI in production (`https://tfs.ma/_/`) and apply the changes manually.
  2. Write a Node.js/JavaScript script connecting to the production database via the JS SDK to seed records.
  3. (As a last resort for total overrides) Use the `-SyncData` deployment flag to replace production exactly with your local `pb_data`.
