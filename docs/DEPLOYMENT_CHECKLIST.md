# BudeGlobal Production Deployment Checklist

## 🚀 Pre-Deployment Tasks

### 1. Backend Setup

#### A. Run Database Migrations
```bash
cd backend/frappe-bench
bench --site bude.local migrate
bench --site bude.local clear-cache
```

#### B. Configure SMS Provider

**Choose ONE provider:**

**Option 1: MSG91 (Recommended for India)**
```bash
bench --site bude.local set-config msg91_api_key "YOUR_API_KEY"
bench --site bude.local set-config msg91_sender_id "BUDGLB"
bench --site bude.local set-config msg91_template_id "YOUR_DLT_TEMPLATE_ID"
bench --site bude.local set-config msg91_route "4"
```

**Option 2: Twilio (Global)**
```bash
bench --site bude.local set-config twilio_account_sid "YOUR_SID"
bench --site bude.local set-config twilio_auth_token "YOUR_TOKEN"
bench --site bude.local set-config twilio_phone_number "+1234567890"
```

#### C. Configure Email (Optional but Recommended)
```bash
bench --site bude.local set-config mail_server "smtp.gmail.com"
bench --site bude.local set-config mail_port 587
bench --site bude.local set-config use_tls 1
bench --site bude.local set-config mail_login "your-email@gmail.com"
bench --site bude.local set-config mail_password "your-app-password"
bench --site bude.local set-config email_sender_name "BudeGlobal"
bench --site bude.local set-config email_sender "noreply@budeglobal.com"
```

#### D. Disable Developer Mode
```bash
bench --site bude.local set-config developer_mode 0
```

#### E. Enable Production Mode
```bash
bench --site bude.local enable-scheduler
bench restart
```

---

### 2. Frontend Build

```bash
# Build shared package
cd packages/shared
pnpm install
pnpm build

# Build market app
cd ../market
pnpm install
pnpm build

# Build work app
cd ../work
pnpm install
pnpm build
```

---

### 3. Environment Variables

Create production `.env` files:

**packages/market/.env.production**:
```env
VITE_API_URL=https://api.budeglobal.com
VITE_MARKET_URL=https://market.budeglobal.com
VITE_WORK_URL=https://work.budeglobal.com
VITE_SENTRY_DSN=your-sentry-dsn (optional)
VITE_APP_VERSION=1.0.0
```

**packages/work/.env.production**:
```env
VITE_API_URL=https://api.budeglobal.com
VITE_MARKET_URL=https://market.budeglobal.com
VITE_WORK_URL=https://work.budeglobal.com
VITE_SENTRY_DSN=your-sentry-dsn (optional)
VITE_APP_VERSION=1.0.0
```

---

### 4. Database Performance

```bash
# Run performance index script
bench --site bude.local console

>>> from bude_core.patches.add_performance_indexes import execute
>>> execute()
>>> exit()
```

---

### 5. Security Checks

#### A. Verify CORS Settings
```bash
bench --site bude.local set-config allow_cors "https://market.budeglobal.com,https://work.budeglobal.com"
```

#### B. Enable Security Headers
Add to `site_config.json`:
```json
{
  "deny_multiple_sessions": true,
  "session_expiry": "06:00:00",
  "session_expiry_mobile": "720:00:00"
}
```

#### C. SSL/HTTPS
Ensure SSL certificates are installed:
```bash
bench setup lets-encrypt bude.local
```

---

### 6. Verify Integrations

#### Test SMS (Production)
```bash
bench --site bude.local console

from bude_core.auth.otp_sms import send_sms_otp
send_sms_otp("+919876543210", "123456")
```

#### Test Email
```bash
bench --site bude.local console

import frappe
frappe.sendmail(
    recipients=['test@example.com'],
    subject='Test Email',
    message='Test from BudeGlobal'
)
```

#### Test Notifications
```bash
bench --site bude.local console

from bude_core.notifications.notification_handler import send_notification
send_notification(
    user="admin@example.com",
    subject="Test Notification",
    message="Testing production notifications",
    notification_type="Alert"
)
```

---

## ✅ Post-Deployment Verification

### 1. Health Checks

#### Backend API
```bash
curl https://api.budeglobal.com/api/method/ping
# Should return: {"message": "pong"}
```

#### WebSocket/Realtime
```bash
# Check realtime connection
curl https://api.budeglobal.com/socket.io/
# Should return WebSocket upgrade response
```

#### Database
```bash
bench --site bude.local mariadb
> SELECT COUNT(*) FROM `tabUser`;
> SELECT COUNT(*) FROM `tabBude Profile`;
> exit
```

---

### 2. Frontend Smoke Tests

Visit each app and verify:

**Market App** (https://market.budeglobal.com)
- [ ] Homepage loads
- [ ] Login works (email + password)
- [ ] OTP login works (receives SMS)
- [ ] Item listings display
- [ ] Search works
- [ ] Notifications bell shows up
- [ ] Can create new listing

**Work App** (https://work.budeglobal.com)
- [ ] Homepage loads
- [ ] Job listings display
- [ ] Freelancer profiles display
- [ ] Can post job
- [ ] Can submit bid

---

### 3. Critical Features Test

#### Authentication
- [ ] Email/password login
- [ ] OTP login (SMS received)
- [ ] Google OAuth login
- [ ] Forgot password flow
- [ ] Session timeout works

#### Notifications
- [ ] Bell icon shows count
- [ ] Notifications appear in dropdown
- [ ] Mark as read works
- [ ] Realtime updates work
- [ ] Browser notifications (if permitted)

#### Messaging
- [ ] Can start chat from item
- [ ] Messages send/receive in realtime
- [ ] Chat list shows unread count
- [ ] Message notifications work

#### Profile
- [ ] Profile update saves to database
- [ ] Location fields work
- [ ] Avatar upload works
- [ ] Skills management works

#### Marketplace
- [ ] Can create listing
- [ ] Can edit listing
- [ ] Contact unlock works
- [ ] Credits deduction works
- [ ] Search works

#### Work
- [ ] Can post job
- [ ] Can submit bid
- [ ] Can accept/reject bid
- [ ] Freelancer search works

---

### 4. Performance Checks

```bash
# Check query performance
bench --site bude.local mariadb
> EXPLAIN SELECT * FROM `tabItem` WHERE custom_status = 'Published' ORDER BY modified DESC LIMIT 20;
# Should show "Using index"

# Check Redis connection
redis-cli ping
# Should return: PONG

# Check SocketIO
ss -tulpn | grep 9000
# Should show socketio process
```

---

### 5. Error Monitoring

#### Enable Sentry (Optional)
```bash
# Frontend already configured via VITE_SENTRY_DSN

# Backend: Add to hooks.py
# (Already handled by Frappe's error logging)
```

#### Check Error Logs
```bash
bench --site bude.local console

import frappe
errors = frappe.get_all('Error Log', limit=10, order_by='creation desc')
for err in errors:
    print(err)
```

---

## 🔒 Security Hardening

### 1. Production Security
```bash
# Disable debug mode
bench --site bude.local set-config developer_mode 0

# Enable rate limiting (already configured)
bench --site bude.local set-config rate_limit_enable true

# Set strong cookie secret
bench --site bude.local set-config cookie_secret "RANDOM_64_CHAR_STRING"
```

### 2. Firewall Rules
```bash
# Only allow necessary ports
# 80 (HTTP) → redirect to 443
# 443 (HTTPS)
# 9000 (SocketIO) - internal only
# 3306 (MySQL) - internal only
# 6379 (Redis) - internal only
```

### 3. Backup Strategy
```bash
# Automated daily backups
bench --site bude.local backup --with-files

# Schedule in cron
0 2 * * * cd /path/to/frappe-bench && bench --site bude.local backup --with-files

# Verify backups work
bench --site bude.local restore /path/to/backup.sql.gz
```

---

## 📊 Monitoring

### 1. Application Monitoring
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Monitor API response times
- [ ] Track SMS delivery rates
- [ ] Monitor email delivery

### 2. Server Monitoring
- [ ] CPU usage
- [ ] Memory usage
- [ ] Disk space
- [ ] Database connections
- [ ] Redis memory

### 3. Business Metrics
- [ ] Daily active users
- [ ] New signups
- [ ] Listings created
- [ ] Messages sent
- [ ] Credits purchased
- [ ] Contact unlocks

---

## 🚨 Rollback Plan

If deployment fails:

```bash
# 1. Restore database backup
bench --site bude.local restore /path/to/previous_backup.sql.gz

# 2. Revert code changes
git revert HEAD
bench restart

# 3. Rebuild frontend with previous version
git checkout previous-tag
cd packages/shared && pnpm build
cd ../market && pnpm build
cd ../work && pnpm build

# 4. Verify rollback
curl https://api.budeglobal.com/api/method/ping
```

---

## 📝 Production Configuration Files

### site_config.json (Example)
```json
{
  "db_host": "localhost",
  "db_port": 3306,
  "db_name": "bude_production",
  "db_password": "***",

  "developer_mode": 0,
  "allow_cors": "https://market.budeglobal.com,https://work.budeglobal.com",

  "msg91_api_key": "***",
  "msg91_sender_id": "BUDGLB",
  "msg91_template_id": "***",

  "mail_server": "smtp.gmail.com",
  "mail_port": 587,
  "use_tls": 1,
  "mail_login": "***",
  "mail_password": "***",

  "session_expiry": "06:00:00",
  "deny_multiple_sessions": false,

  "socketio_port": 9000,
  "redis_cache": "redis://localhost:6379",
  "redis_queue": "redis://localhost:6379",
  "redis_socketio": "redis://localhost:6379"
}
```

---

## ✅ Final Checklist

Before going live:

- [ ] All migrations run successfully
- [ ] SMS provider configured and tested
- [ ] Email configured and tested
- [ ] Database indexes added
- [ ] Frontend builds completed
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Security headers enabled
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] All smoke tests passed
- [ ] Performance tests passed
- [ ] Rollback plan documented
- [ ] Team trained on deployment process

---

## 📞 Support Contacts

- **Frappe Community**: https://discuss.frappe.io
- **MSG91 Support**: https://msg91.com/help
- **Twilio Support**: https://support.twilio.com
- **Sentry Support**: https://sentry.io/support

---

## 🎉 Go Live!

Once all checks pass:

```bash
# Final restart
bench restart

# Monitor logs
bench --site bude.local watch

# Announce launch! 🚀
```

---

**Last Updated**: 2026-01-18
**Deployment Version**: 1.0.0
**Estimated Time**: 2-3 hours
