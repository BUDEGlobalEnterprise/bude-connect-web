# BudeConnect Production Deployment Guide

This document outlines the steps to deploy the BudeConnect platform (Dual-Frontend + Frappe Core) to a production environment.

## 🏗️ Architecture Overview
- **Backend/API**: Frappe Framework (Python/Redis/MariaDB)
- **Frontends**: 3 separate Vite/Vue applications (Market, Work, Admin).
- **Monorepo**: Managed via `pnpm` workspaces.

## 🚀 Deployment Steps

### 1. Backend (Frappe Bench)
Assuming you have a Frappe Bench environment set up:
```bash
# Clone the repository into your custom_apps folder
cd bench/apps
git clone <repo_url> bude_core

# Install the app to your site
cd ..
bench setup requirements
bench install-app bude_core
bench migrate
```

### 2. Frontend (Build & Sync)
Vite frontends should be built and served via Frappe's static asset handler or Nginx.
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# The frontends are located in:
# packages/market/dist -> https://market.budeglobal.in
# packages/work/dist -> https://work.budeglobal.in
# packages/admin/dist -> https://admin.budeglobal.in
```

### 3. Production Configuration
Update your site's `site_config.json` with the following security and CORS settings:
```json
{
  "allow_cors": "*",
  "cors_allowed_origins": [
    "https://market.budeglobal.in",
    "https://work.budeglobal.in",
    "https://admin.budeglobal.in"
  ],
  "cors_allow_credentials": true,
  "sentry_dsn": "YOUR_BACKEND_SENTRY_DSN",
  "encryption_key": "YOUR_SECURE_KEY"
}
```

### 4. Automated Backups
Frappe handles backups for DB and files. Ensure they are enabled:
```bash
bench set-config -g backup_path /path/to/backups
bench setup backups --daily
```

### 5. SSL & Security (Nginx)
Configure Nginx to serve the `dist` folders and proxy `/api` requests to Frappe (Bench default port 8000).

## 🛡️ Security Posture
- **CSP**: The platform implements strict Content-Security-Policy headers via `bude_core.middleware`.
- **HSTS**: Enabled automatically for HTTPS connections.
- **MIME Sniffing**: Disabled via `X-Content-Type-Options: nosniff`.

## 📈 Monitoring
- Check Sentry Dashboard for real-time frontend and backend errors.
- Monitor Redis memory usage for cache hit/miss rates.
