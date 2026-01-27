# BudeConnect - Production Readiness Checklist 🚀

Follow these steps to ensure a safe and successful production deployment.

## 1. Site Configuration (`site_config.json`)
Ensure your `site_config.json` contains the following critical settings:

```json
{
  "allow_cors": "*",
  "cors_allowed_origins": [
    "https://market.budeglobal.com",
    "https://work.budeglobal.com"
  ],
  "cors_allow_credentials": true,
  "cors_max_age": 86400,
  "sentry_dsn": "YOUR_SENTRY_DSN_HERE",
  "developer_mode": 0
}
```

## 2. Infrastructure Setup
- [ ] **SSL Certificates**: Ensure both `market` and `work` domains have valid SSL (Let's Encrypt recommended).
- [ ] **Redis**: Verify Redis is running and accessible (required for `@cache_response`).
- [ ] **Scheduler**: Enable the Frappe scheduler: `bench --site [sitename] enable-scheduler`.
- [ ] **Workers**: Ensure at least one default worker is running for `run_async` tasks.

## 3. Security Audit
- [ ] **CORS**: Verify no `*` origins are used in production unless strictly necessary.
- [ ] **CSP Headers**: Review `middleware.py` if custom external scripts (like Google Analytics) are added.
- [ ] **Encryption Keys**: Ensure `encryption_key` is set in `site_config.json`.

## 4. Asset Optimization
- [ ] **Pillow**: Ensure `Pillow` is installed on the production server.
- [ ] **Background Jobs**: Verify that image optimization jobs are being processed in the `default` queue.

## 5. Monitoring
- [ ] **Sentry**: Verify that logs are appearing in your Sentry dashboard.
- [ ] **Error Logs**: Monitor Frappe `Error Log` doctype periodically after launch.

---

**Next Steps**: Perform a soft launch with internal users to verify SMS delivery and real-time notifications.
