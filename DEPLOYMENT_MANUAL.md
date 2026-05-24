# TFS Deployment Manual

## 1. Deploying to a NEW VPS
**Goal:** Set up the application on a fresh server.

1.  **Configure Environment:**
    Open `deployment/docker-compose.yml` and update the environment variables (URLs, Keys, standard production values).

2.  **Build Package:**
    ```powershell
    .\deployment\build_package.ps1
    ```

3.  **Run Deployment Script:**
    Replace `<IP>` with the new server's IP.
    ```powershell
    .\deployment\deploy_to_vps.ps1 -VpsHost "root@<IP>"
    ```

---

## 2. Updating Code (Features/Bug Fixes)
**Goal:** Push changes from your local VS Code to the existing VPS.

1.  **Make Code Changes** in your workspace.

2.  **Push Update:**
    Use `update_vps.ps1` to build and push. You can push just the web app (faster) or everything.

    **Web-only update (CSS, Pages, Components):**
    ```powershell
    .\deployment\update_vps.ps1 -VpsHost "root@72.62.27.47" -Component web
    ```

    **Full update (Database changes + Web):**
    ```powershell
    .\deployment\update_vps.ps1 -VpsHost "root@72.62.27.47" -Component all
    ```

---

## 3. Changing Environment Variables
**Goal:** Update API keys, URLs, or other secrets on the live server.

1.  **Edit local file:**
    Modify `deployment/docker-compose.yml`.

2.  **Repackage & Deploy:**
    Since env vars are in `docker-compose.yml`, you just need to update the file on the server.
    ```powershell
    # This rebuilds package (with new compose file) and pushes everything
    .\deployment\update_vps.ps1 -VpsHost "root@72.62.27.47" -Component all
    ```

---

## 4. Local Testing
**Goal:** Verify everything works on your PC before pushing.

1.  **Build:**
    ```powershell
    .\deployment\build_package.ps1
    ```

2.  **Run:**
    ```powershell
    cd dist\TFS_App_v1.0
    docker compose down -v  # Clear old test data
    docker load -i tfs-pb.tar
    docker load -i tfs-web.tar
    docker compose up -d
    ```

3.  **Access:**
    - Web: http://localhost
    - Admin: http://localhost/_/

---

## Troubleshooting connection
- **SSH Permission Denied?**
  1. Login via your VPS provider's web console.
  2. Reset root password OR add your PC's SSH key (`~/.ssh/id_rsa.pub`) to `~/.ssh/authorized_keys` on the VPS.

---

## 5. Replacing the Database (Importing Backup)
**Goal:** Use a new database backup (e.g., `v2.zip`) as the main data source for Local and Docker.

1.  **Extract Backup:**
    Extract your zip file (e.g., `v2.zip`) so you have the `pb_data` files (`data.db`, `auxiliary.db`, etc.).

2.  **Update Deployment Seed Data:**
    Copy the extracted files into `deployment/seed_data/`.
    *(This ensures the Docker build picks up the new data)*

3.  **Update Local Project:**
    Replace your local `pb_data` folder with the new files.
    *(This ensures your local `pocketbase serve` uses the new data)*

4.  **Rebuild Package:**
    ```powershell
    .\deployment\build_package.ps1
    ```
    The new `tfs-pb.tar` will now contain your updated database.

5.  **Deploy:**
    Push the new package to the VPS using `update_vps.ps1`.

### PowerShell Snippet (Copy-Paste to do it all)
```powershell
# Adjust filename here
$BackupFile = "v2.zip"

# Extract
Expand-Archive -Path $BackupFile -DestinationPath "deployment/temp_extract" -Force

# Setup Docker Seed Data
if (Test-Path "deployment/seed_data") { Remove-Item "deployment/seed_data" -Recurse -Force }
New-Item -ItemType Directory -Force -Path "deployment/seed_data" | Out-Null
Move-Item "deployment/temp_extract/*" "deployment/seed_data/" -Force

# Setup Local DB
if (Test-Path "pb_data") { Move-Item pb_data "pb_data_bak_$(Get-Date -Format 'yyyyMMdd_HHmm')" -Force }
Copy-Item "deployment/seed_data" -Destination "pb_data" -Recurse

# Cleanup
Remove-Item "deployment/temp_extract" -Recurse -Force
Write-Host "Database replaced locally and for Docker!" -ForegroundColor Green
```
