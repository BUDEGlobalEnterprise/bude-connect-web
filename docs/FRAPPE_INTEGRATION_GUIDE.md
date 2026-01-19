# Frappe Core Features Integration Guide

This guide explains how BudeGlobal leverages **Frappe/ERPNext core features** instead of building custom solutions from scratch.

## ✅ Implemented Features Using Frappe Core

### 1. Notifications System (Notification Log)

**Frappe Feature**: `frappe.desk.doctype.notification_log`

**What We Use**:
- Frappe's built-in Notification Log doctype
- Realtime event system (`frappe.publish_realtime`)
- Email Queue for email notifications

**Backend**:
```python
from bude_core.notifications.notification_handler import send_notification

# Send notification
send_notification(
    user="user@example.com",
    subject="New Message",
    message="You have a new message from John",
    notification_type="Alert",
    document_type="Item",
    document_name="ITEM-001",
    send_email=True
)
```

**Frontend**:
```typescript
import { useNotificationStore } from '@budeglobal/shared';

const notificationStore = useNotificationStore();

// Fetch notifications
await notificationStore.fetchNotifications();

// Mark as read
await notificationStore.markAsRead(notificationId);

// Subscribe to realtime
notificationStore.initializeRealtime();
```

**Usage in Components**:
```vue
<NotificationBell />
```

---

### 2. Messaging System (Communication)

**Frappe Feature**: `frappe.core.doctype.communication`

**What We Use**:
- Communication doctype for chat threads
- Comment type for messages
- Realtime events for instant delivery
- Built-in read receipts and status tracking

**Backend**:
```python
from bude_core.messaging.chat_handler import get_or_create_chat, send_message

# Create or get chat
chat = get_or_create_chat("Item", "ITEM-001")

# Send message
send_message(chat['chat_id'], "Is this still available?")
```

**Frontend**:
```typescript
import { useMessagingStore } from '@budeglobal/shared';

const messagingStore = useMessagingStore();

// Open chat for an item
await messagingStore.openChat('Item', 'ITEM-001');

// Send message
await messagingStore.sendMessage('Hello!');

// Subscribe to realtime messages
messagingStore.initializeRealtime();
```

---

### 3. SMS OTP Integration

**Frappe Feature**: `frappe.core.doctype.sms_settings`

**Supported Providers**:
1. **Frappe SMS Settings** (supports multiple gateways)
2. **MSG91** (recommended for India)
3. **Twilio** (global)
4. **AWS SNS**

**Configuration** (`site_config.json`):

```json
{
  "developer_mode": 0,

  "msg91_api_key": "YOUR_MSG91_KEY",
  "msg91_sender_id": "BUDGLB",
  "msg91_template_id": "YOUR_DLT_TEMPLATE_ID",
  "msg91_route": "4",

  "twilio_account_sid": "YOUR_TWILIO_SID",
  "twilio_auth_token": "YOUR_TWILIO_TOKEN",
  "twilio_phone_number": "+1234567890"
}
```

**Automatic Fallback**:
1. Try Frappe SMS Settings first
2. Fall back to MSG91
3. Fall back to Twilio
4. If all fail, log error

**Dev Mode**: Automatically logs OTP to console instead of sending SMS.

---

### 4. Email Notifications

**Frappe Feature**: `frappe.sendmail` and Email Queue

**Usage**:
```python
frappe.sendmail(
    recipients=['user@example.com'],
    subject='Order Confirmation',
    message='<p>Your order has been confirmed!</p>',
    delayed=True,  # Use Email Queue
    reference_doctype='Item',
    reference_name='ITEM-001'
)
```

**Email Queue Benefits**:
- Asynchronous sending (doesn't block requests)
- Automatic retry on failure
- Built-in email templates
- Email tracking and logging

---

### 5. File Uploads

**Frappe Feature**: `frappe.core.doctype.file`

**Usage**:
```python
file_doc = frappe.get_doc({
    'doctype': 'File',
    'file_name': 'avatar.jpg',
    'attached_to_doctype': 'User',
    'attached_to_name': user_email,
    'content': file_content
})
file_doc.save()
```

**Benefits**:
- Automatic file storage management
- S3/cloud storage support
- Thumbnail generation
- Duplicate detection

---

### 6. Scheduled Tasks

**Frappe Feature**: `scheduler_events` in hooks.py

**Usage**:
```python
# In hooks.py
scheduler_events = {
    "daily": [
        "bude_core.tasks.cleanup_expired_otps"
    ],
    "hourly": [
        "bude_core.tasks.check_pending_transactions"
    ]
}
```

---

### 7. Rate Limiting

**Frappe Feature**: Built-in rate limiting via Redis cache

**Already Implemented**:
```python
from bude_core.utils import check_rate_limit

if not check_rate_limit(f"otp:phone:{mobile}", max_requests=5, window_seconds=300):
    return error_response("Too many requests", "RATE_LIMITED")
```

---

### 8. Session Management

**Frappe Feature**: Built-in session handling with Redis

**Benefits**:
- Automatic session expiry
- CSRF protection
- Multi-device support
- Session hijacking prevention

---

### 9. User Roles & Permissions

**Frappe Feature**: Role-based access control

**Usage**:
```python
# Check permission
if frappe.has_permission("Item", "write", doc=item_doc):
    # Allow editing

# Add role to user
user.add_roles("Market Seller", "Service Provider")

# Check role
if user.has_role("Market Seller"):
    # Allow listing items
```

---

### 10. Database Migrations

**Frappe Feature**: `bench migrate`

**Usage**:
```bash
# Add migration to patches.txt
cd backend/bude_core
echo "bude_core.patches.add_performance_indexes" >> patches.txt

# Run migration
cd ../frappe-bench
bench --site bude.local migrate
```

---

## 🚀 Setup Instructions

### 1. Configure SMS Provider

**Option A: MSG91 (Recommended for India)**

1. Sign up at https://msg91.com
2. Get API key and DLT-approved template
3. Add to `site_config.json`:

```json
{
  "msg91_api_key": "YOUR_API_KEY",
  "msg91_sender_id": "BUDGLB",
  "msg91_template_id": "YOUR_TEMPLATE_ID"
}
```

**Option B: Twilio (Global)**

1. Sign up at https://twilio.com
2. Get Account SID and Auth Token
3. Add to `site_config.json`:

```json
{
  "twilio_account_sid": "YOUR_SID",
  "twilio_auth_token": "YOUR_TOKEN",
  "twilio_phone_number": "+1234567890"
}
```

**Option C: Frappe SMS Settings**

1. Go to: `Settings > SMS Settings`
2. Configure your gateway (Exotel, TextLocal, etc.)
3. Test SMS sending

---

### 2. Enable Realtime (SocketIO)

Already enabled in Frappe by default. Verify:

```bash
bench config socketio-port 9000
bench restart
```

Frontend connection is automatic via Frappe's JS:

```html
<!-- Already included in Frappe -->
<script src="/assets/frappe/js/frappe-web.min.js"></script>
```

---

### 3. Configure Email

Add to `site_config.json`:

```json
{
  "mail_server": "smtp.gmail.com",
  "mail_port": 587,
  "use_tls": 1,
  "mail_login": "your-email@gmail.com",
  "mail_password": "your-app-password",
  "email_sender_name": "BudeGlobal",
  "email_sender": "noreply@budeglobal.com"
}
```

**Gmail Setup**:
1. Enable 2FA
2. Create App Password
3. Use App Password in config

---

### 4. Run Migrations

```bash
cd backend/frappe-bench
bench --site bude.local migrate
bench --site bude.local clear-cache
bench restart
```

---

## 📝 How to Use in Your Code

### Sending Notifications

```python
from bude_core.notifications.notification_handler import (
    notify_new_message,
    notify_bid_status,
    notify_item_sold,
    notify_kyc_status,
    notify_credit_purchase
)

# When item is sold
notify_item_sold(
    item="ITEM-001",
    seller="seller@example.com",
    buyer="buyer@example.com"
)

# When bid status changes
notify_bid_status(
    job_opening="JOB-001",
    freelancer="freelancer@example.com",
    status="Accepted"
)
```

### Creating Chat Threads

```python
from bude_core.messaging.chat_handler import get_or_create_chat

# Buyer clicks "Contact Seller" on item
chat = get_or_create_chat("Item", "ITEM-001")

# Frontend opens chat UI
```

### Frontend Realtime Setup

```typescript
// In main app setup (App.vue or main.ts)
import { useNotificationStore } from '@budeglobal/shared';
import { useMessagingStore } from '@budeglobal/shared';

const notificationStore = useNotificationStore();
const messagingStore = useMessagingStore();

onMounted(() => {
  // Initialize realtime connections
  notificationStore.initializeRealtime();
  messagingStore.initializeRealtime();

  // Fetch initial data
  notificationStore.fetchNotifications();
  messagingStore.fetchChats();
});

onUnmounted(() => {
  notificationStore.cleanup();
  messagingStore.cleanup();
});
```

---

## 🎯 Next Steps

1. **Run migrations** to apply changes
2. **Configure SMS provider** (MSG91/Twilio)
3. **Test notifications** in dev mode
4. **Test messaging** between users
5. **Enable realtime** connections
6. **Configure email** (optional)

---

## 🔍 Troubleshooting

### Notifications not showing?

1. Check Frappe's realtime connection:
```bash
bench console
>>> frappe.realtime.emit('test', 'Hello')
```

2. Check browser console for WebSocket errors

3. Verify Redis is running:
```bash
redis-cli ping
```

### SMS not sending?

1. Check site_config.json has correct credentials
2. Verify provider account is active
3. Check Error Log in Frappe:
   - Go to: `Settings > Error Log`
   - Filter by "SMS Error"

### Messages not delivering?

1. Verify Communication doctype exists:
```bash
bench console
>>> frappe.db.exists("DocType", "Communication")
```

2. Check realtime connection (same as notifications)

---

## 📚 Additional Resources

- [Frappe Documentation](https://frappeframework.com/docs)
- [Frappe Realtime](https://frappeframework.com/docs/user/en/guides/integration/using_frappe_realtime)
- [Frappe Email](https://frappeframework.com/docs/user/en/api/email)
- [Frappe File Attachments](https://frappeframework.com/docs/user/en/api/document#attachments)

---

## 🎉 Benefits of Using Frappe Core

1. **Battle-tested**: Used by thousands of ERPNext installations
2. **Scalable**: Handles millions of users
3. **Maintained**: Regular updates and security patches
4. **Feature-rich**: Email queue, file storage, permissions, etc.
5. **Realtime**: Built-in WebSocket support
6. **Mobile-ready**: Works with Frappe mobile app
7. **Self-hosted**: No vendor lock-in
8. **Open source**: Free to use and modify

---

**Last Updated**: 2026-01-18
**Frappe Version**: 15.x
**ERPNext Version**: 15.x
