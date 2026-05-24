# Deployment Scenarios & Commands

This guide explains how to use `manage_app.ps1` for different deployment needs. This script is your "Master Control" for the VPS.

### 📍 Prequisites
- **Location:** Run these commands from the project root: `c:\Users\zakio\Documents\Project\PB-Next`
- **Target IP:** Replace `72.62.27.47` with your VPS IP.
- **Domain:** Replace `tfs.zouskym.com` with your domain.

---

## ⚡ 1. Code-Only Update (Fastest)
**Use when:** You changed Next.js code, CSS, or API logic. You did **NOT** change the database.
**What happens:** Rebuilds web container, uploads code, replaces web container. Database stays untouched.

```powershell
.\deployment\manage_app.ps1 -Target "72.62.27.47" -Domain "tfs.zouskym.com" -Https
```

---

## 🔄 2. Full Update (Code + Database)
**Use when:** You added new products, uploaded images, or changed collections locally.
**What happens:** 
1. **Wipes VPS Database** (Safety Warning!) 
2. Uploads your LOCAL database to VPS.
3. Updates code.
4. **Result:** VPS becomes an exact clone of your local setup.

```powershell
.\deployment\manage_app.ps1 -Target "72.62.27.47" -Domain "tfs.zouskym.com" -SyncDB
```

---

## 🔒 3. Enable SSL (HTTPS)
**Use when:** You just pointed a domain to the IP and want the generic lock icon.
**What happens:** Gets official Let's Encrypt certificates and forces HTTPS.

```powershell
.\deployment\manage_app.ps1 -Target "72.62.27.47" -Domain "tfs.zouskym.com" -SetupSSL
```

---

## 🚀 4. New Server Setup (Zero to Hero)
**Use when:** You bought a brand new VPS.
**What happens:** 
1. Generates/Copies SSH keys (Passwordless)
2. Syncs Database
3. Sets up SSL
4. Deploys App

```powershell
.\deployment\manage_app.ps1 -Target "NEW_IP" -Domain "NEW_DOMAIN" -SetupSSH -SyncDB -SetupSSL
```

---

## 🛠️ Troubleshooting

| Issue | Command to Try |
|-------|----------------|
| DB is outdated | Run Scenario #2 (`-SyncDB`) |
| Lock icon missing | Run Scenario #3 (`-SetupSSL`) |
| "Permission denied" | Run with `-SetupSSH` once |
