╔════════════════════════════════════════════════════════════════╗
║                    TFS Application v1.0.0                       ║
║                  TV Film Solutions Platform                     ║
╚════════════════════════════════════════════════════════════════╝

QUICK START
───────────
1. Upload this folder to your VPS
2. Edit .env file with your settings (copy from .env.example)
3. Run: chmod +x install.sh && ./install.sh

CONTENTS
────────
├── install.sh          - One-click installer
├── update.sh           - For future updates
├── docker-compose.yml  - Service configuration
├── .env.example        - Environment template
├── nginx/              - Reverse proxy config
└── images/
    ├── tfs-web.tar     - Web application
    └── tfs-pb.tar      - Database

REQUIREMENTS
────────────
- Ubuntu 22.04+ or Debian 12+
- 2GB RAM minimum
- Docker (installed automatically if missing)

PORTS USED
──────────
- 3000: Web Application
- 8090: PocketBase Database/API

SUPPORT
───────
For updates or issues, contact your developer.
This is a proprietary application - do not redistribute.

© 2026 TV Film Solutions. All rights reserved.
