# BudeGlobal - Quick Reference Card

## 🚀 Quick Commands

### Start Development
```bash
# Backend
cd backend/frappe-bench
bench start

# Frontend (Market)
cd packages/market
pnpm dev

# Frontend (Work)
cd packages/work
pnpm dev
```

### Run Migrations
```bash
cd backend/frappe-bench
bench --site bude.local migrate
bench --site bude.local clear-cache
bench restart
```

### Configure SMS (Production)
```bash
# MSG91 (India)
bench --site bude.local set-config msg91_api_key "YOUR_KEY"
bench --site bude.local set-config msg91_sender_id "BUDGLB"
bench --site bude.local set-config msg91_template_id "YOUR_TEMPLATE_ID"

# Twilio (Global)
bench --site bude.local set-config twilio_account_sid "YOUR_SID"
bench --site bude.local set-config twilio_auth_token "YOUR_TOKEN"
bench --site bude.local set-config twilio_phone_number "+1234567890"
```

### Test Features
```bash
# Console
bench --site bude.local console

# Test notification
from bude_core.notifications import send_notification
send_notification(user="test@example.com", subject="Test", message="Hello")

# Test chat
from bude_core.messaging import get_or_create_chat
chat = get_or_create_chat("Item", "ITEM-001")

# Test SMS
from bude_core.auth.otp_sms import send_sms_otp
send_sms_otp("+919876543210", "123456")
```

---

## 📂 Key Files

### Backend
- **Notifications**: `backend/bude_core/bude_core/notifications/notification_handler.py`
- **Messaging**: `backend/bude_core/bude_core/messaging/chat_handler.py`
- **SMS OTP**: `backend/bude_core/bude_core/auth/otp_sms.py`
- **User Profile**: `backend/bude_core/bude_core/profile/user_profile.py`
- **Config**: `backend/frappe-bench/sites/bude.local/site_config.json`

### Frontend
- **Notification Store**: `packages/shared/src/stores/notifications.ts`
- **Messaging Store**: `packages/shared/src/stores/messaging.ts`
- **User Store**: `packages/shared/src/stores/user.ts`
- **API Client**: `packages/shared/src/api/client.ts`
- **Types**: `packages/shared/src/types/index.ts`

### Documentation
- **Setup Guide**: `FRAPPE_INTEGRATION_GUIDE.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Complete Audit**: `claude.md`
- **Implementation**: `IMPLEMENTATION_COMPLETE.md`

---

## 🔧 Common Tasks

### Add New Notification Trigger
```python
# backend/bude_core/bude_core/notifications/notification_handler.py

def notify_custom_event(user: str, data: dict):
    send_notification(
        user=user,
        subject="Custom Event",
        message=f"Event data: {data}",
        notification_type="Alert",
        send_email=True
    )
```

### Create Chat from Frontend
```typescript
import { useMessagingStore } from '@budeglobal/shared';

const messaging = useMessagingStore();

// Open chat
await messaging.openChat('Item', itemId);

// Send message
await messaging.sendMessage('Is this available?');
```

### Subscribe to Realtime
```typescript
import { useNotificationStore } from '@budeglobal/shared';

const notifications = useNotificationStore();

onMounted(() => {
  notifications.initializeRealtime();
});

onUnmounted(() => {
  notifications.cleanup();
});
```

---

## 🐛 Troubleshooting

### Notifications Not Working
```bash
# Check Redis
redis-cli ping

# Check SocketIO
ss -tulpn | grep 9000

# Check error logs
bench --site bude.local logs
```

### SMS Not Sending
```bash
# Check config
bench --site bude.local console
import frappe
print(frappe.conf.get('msg91_api_key'))

# Check error logs
frappe.get_all('Error Log', filters={'error': ('like', '%SMS%')}, limit=5)
```

### Database Issues
```bash
# Check migrations
bench --site bude.local migrate

# Reset database (CAUTION!)
bench --site bude.local reinstall
```

---

## 📱 API Endpoints

### Authentication
- `POST /api/method/bude_core.auth.otp.send_otp`
- `POST /api/method/bude_core.auth.otp.verify_otp`
- `POST /api/method/bude_core.auth.login.login_with_credentials`

### Notifications
- `GET /api/method/bude_core.notifications.notification_handler.get_notifications`
- `POST /api/method/bude_core.notifications.notification_handler.mark_notification_as_read`
- `POST /api/method/bude_core.notifications.notification_handler.mark_all_as_read`

### Messaging
- `POST /api/method/bude_core.messaging.chat_handler.get_or_create_chat`
- `POST /api/method/bude_core.messaging.chat_handler.send_message`
- `GET /api/method/bude_core.messaging.chat_handler.get_messages`
- `GET /api/method/bude_core.messaging.chat_handler.get_chat_list`

### Profile
- `GET /api/method/bude_core.profile.user_profile.get_profile`
- `POST /api/method/bude_core.profile.user_profile.update_profile`
- `POST /api/method/bude_core.profile.user_profile.update_skills`
- `POST /api/method/bude_core.profile.user_profile.update_portfolio`

---

## 🔑 Environment Variables

### Development (.env.development)
```env
VITE_API_URL=http://localhost:8000
VITE_MARKET_URL=http://localhost:3000
VITE_WORK_URL=http://localhost:3001
```

### Production (.env.production)
```env
VITE_API_URL=https://api.budeglobal.com
VITE_MARKET_URL=https://market.budeglobal.com
VITE_WORK_URL=https://work.budeglobal.com
VITE_SENTRY_DSN=your-sentry-dsn
```

---

## 📊 Database Schema

### Key Doctypes
- **User** - Core Frappe user (email, mobile, location)
- **Bude Profile** - Extended profile (city, state, country, pincode, etc.)
- **Bude Credit** - User wallet/credits
- **Notification Log** - Frappe core (notifications)
- **Communication** - Frappe core (messaging)
- **Item** - ERPNext core (marketplace items)
- **Job Opening** - ERPNext core (work platform)

### Relationships
```
User (1) ←→ (1) Bude Profile
User (1) ←→ (1) Bude Credit
User (1) ←→ (*) Notification Log
User (1) ←→ (*) Communication
User (1) ←→ (*) Item (as owner)
User (1) ←→ (*) Job Opening (as owner)
```

---

## 🎨 UI Components

### Shared Components
```vue
<!-- Notifications -->
<NotificationBell />

<!-- Password Strength -->
<PasswordStrengthMeter :password="pwd" @strength-change="handleStrength" />

<!-- Common -->
<Button :loading="isLoading">Submit</Button>
<Input v-model="email" type="email" />
<Modal v-model="showModal">Content</Modal>
<Avatar :src="user.image" size="lg" />
<Badge variant="success">Verified</Badge>
```

---

## 🧪 Testing

### Backend Unit Tests
```bash
bench --site bude.local run-tests bude_core
```

### Frontend Tests
```bash
cd packages/shared
pnpm test

cd ../market
pnpm test
```

### E2E Tests
```bash
cd packages/market
pnpm test:e2e
```

---

## 📦 Build & Deploy

### Build Frontend
```bash
cd packages/shared && pnpm build
cd ../market && pnpm build
cd ../work && pnpm build
```

### Deploy Backend
```bash
cd backend/frappe-bench
bench update --reset
bench migrate
bench restart
```

### Production Build
```bash
# Backend
bench setup production YOUR_USER

# Frontend
NODE_ENV=production pnpm build
```

---

## 🔒 Security

### Rate Limits (Already Configured)
- OTP Send: 5 per 5 minutes
- OTP Verify: 5 per 5 minutes
- Login: 10 per 15 minutes
- Signup: 5 per hour

### Session Config
```json
{
  "session_expiry": "06:00:00",
  "deny_multiple_sessions": false
}
```

---

## 📈 Monitoring

### Check Logs
```bash
# Application logs
bench --site bude.local logs

# Error logs
bench --site bude.local console
frappe.get_all('Error Log', limit=10, order_by='creation desc')

# Access logs
tail -f backend/frappe-bench/logs/web.access.log
```

### Performance
```bash
# Check queries
bench --site bude.local mariadb
EXPLAIN SELECT * FROM `tabItem` WHERE custom_status = 'Published';

# Check Redis
redis-cli info
```

---

## 🆘 Emergency

### Stop All
```bash
bench stop
```

### Restart All
```bash
bench restart
```

### Rollback
```bash
bench --site bude.local restore /path/to/backup.sql.gz
bench restart
```

---

## 📚 Learn More

- **Frappe Docs**: https://frappeframework.com/docs
- **ERPNext Docs**: https://erpnext.com/docs
- **Frappe Forum**: https://discuss.frappe.io
- **Project Docs**: See `claude.md` for comprehensive audit

---

**Version**: 1.0.0
**Last Updated**: 2026-01-18
**Status**: Production Ready 🚀
