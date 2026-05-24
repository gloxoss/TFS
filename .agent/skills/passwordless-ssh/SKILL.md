---
name: passwordless-ssh
description: "Automates the setup of passwordless SSH connections (SSH key generation and deployment) to any new VPS or remote server. Works on Windows via PowerShell."
triggers:
  - ssh connection
  - passwordless ssh
  - trust my pc
  - ssh key setup
  - vps connection
  - automate ssh
---

# Passwordless SSH Setup Skill

This skill automates the process of setting up secure, passwordless SSH connections from the user's local Windows machine to any remote Linux VPS.

## Context & Purpose
When deploying or managing servers, typing passwords repeatedly is inefficient and less secure than using SSH keys. This skill verifies the user's local SSH environment, generates a modern Ed25519 key if necessary, and securely pushes it to the target server's `authorized_keys` file.

## Required Information
Before executing this skill, the agent MUST know the target server details:
- **Username**: (e.g., `root`, `ubuntu`, `admin`)
- **Server IP / Hostname**: (e.g., `76.13.38.218`, `example.com`)

*If the user doesn't provide these, ask for them before proceeding.*

---

## Execution Steps (PowerShell)

Execute these steps sequentially. 

### Step 1: Check for Existing SSH Keys
Run this command to check if the user already has an SSH key.

```powershell
if (Test-Path "$env:USERPROFILE\.ssh\id_ed25519.pub") { 
    Write-Output "ED25519_KEY_EXISTS" 
} elseif (Test-Path "$env:USERPROFILE\.ssh\id_rsa.pub") { 
    Write-Output "RSA_KEY_EXISTS" 
} else { 
    Write-Output "NO_KEY_FOUND" 
}
```

### Step 2: Generate Key (If NO_KEY_FOUND)
If the previous step returned `NO_KEY_FOUND`, execute this to generate a new key implicitly. Do NOT set a passphrase (the `""` handles this) so automation scripts can run uninterrupted.

```powershell
ssh-keygen -t ed25519 -C "auto-generated-key@local-pc" -f "$env:USERPROFILE\.ssh\id_ed25519" -N '""'
```

### Step 3: Push Public Key to the VPS
Use the target `username@host`. Pick the correct local file based on Step 1 (`id_ed25519.pub` or `id_rsa.pub`).

> **Note to Agent:** This command will require the user to type their remote SSH password **one last time** to authorize the transfer. You must tell the user: *"A prompt may appear asking for your server password. Please type it in to authorize the key transfer."*

```powershell
# Replace [USER]@[HOST] with the actual target
type "$env:USERPROFILE\.ssh\id_ed25519.pub" | ssh [USER]@[HOST] "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```

*Note: The `ssh-copy-id` tool is not natively available on Windows PowerShell, which is why we use the `type ... | ssh ...` pipeline.*

### Step 4: Verify the Connection
Finally, test the connection to ensure the key was accepted and no password is required. Use `BatchMode=yes` to force it to fail if a password is still requested.

```powershell
ssh -o BatchMode=yes -o ConnectTimeout=5 [USER]@[HOST] "echo 'SSH_KEY_AUTH_WORKS'"
```

If it prints `SSH_KEY_AUTH_WORKS`, the setup is successful!

## Best Practices
- Always prefer `ed25519` over `rsa` for new keys (faster, more secure).
- Never expose the private key (`id_ed25519`). Only transfer the `.pub` file.
- If the user uses a non-standard SSH port, add `-p [PORT]` to the `ssh` commands.
