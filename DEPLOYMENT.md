# TFS Deployment Strategy: "The Black Box"

This guide outlines how to package the TFS application (Next.js + PocketBase) into a self-contained, "executable-like" delivery for your client.

**Goal:** The client receives a deployable package. They **do not** get the source code. You retain full control and ownership.

## 1. Developer Preparation (Your Side)

You will build the Docker images locally and save them as files. This ensures the client gets exactly what you tested.

### Step A: Build the Images

Run these commands from the project root (`PB-Next/`):

```powershell
# 1. Build the Web App (Next.js)
# This uses the 'standalone' build, protecting your source code.
docker build -t tfs-web:latest -f web/Dockerfile ./web

# 2. Build the Database (PocketBase)
# This bakes your migrations and hooks inside, so no source mounting is needed.
docker build -t tfs-pb:latest -f pb_docker/Dockerfile .
```

### Step B: Save Images to Files

Export the built images to portable `.tar` files.

```powershell
# Create a 'dist' folder
mkdir dist

# Save images (this might take a moment)
docker save -o dist/tfs-web.tar tfs-web:latest
docker save -o dist/tfs-pb.tar tfs-pb:latest
```

### Step C: Prepare the Client Package

Create a folder named `TFS_App_v1.0` and include:

1.  `tfs-web.tar` (from `dist/`)
2.  `tfs-pb.tar` (from `dist/`)
3.  `docker-compose.client.yml` (Rename this to `docker-compose.yml`)
4.  `nginx/` folder (Copy your `nginx/` folder with `nginx.conf` inside)
5.  `install.sh` (Create this script, see below)

#### `install.sh` (Client "Exe" Script)

Create a file named `install.sh` (for Linux VPS) in the package:

```bash
#!/bin/bash
echo ">>> Installing TFS Application..."

# 1. Load the images
echo "Loading Database Image..."
docker load -i tfs-pb.tar

echo "Loading Web Image..."
docker load -i tfs-web.tar

# 2. Start the application
echo "Starting Application..."
docker compose up -d

echo ">>> Deployment Complete! Application is running."
```

---

## 2. Client Deployment (Client Side)

The client (or you on their VPS) only needs to do this:

1.  **Upload** the `TFS_App_v1.0` folder to the VPS.
2.  **Run** the installer:

```bash
cd TFS_App_v1.0
sudo chmod +x install.sh
sudo ./install.sh
```

### Updates & Maintenance

When you need to update the app:

1.  Rebuild the specific image locally (e.g., `web` for UI changes).
2.  Send the new `.tar` file to the client.
3.  Client runs:
    ```bash
    docker load -i tfs-web-v2.tar
    docker compose up -d
    ```
