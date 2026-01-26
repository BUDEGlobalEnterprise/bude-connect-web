# BudeConnect - Quick Priorities

**Generated:** 2026-01-26

---

## 🔴 THIS WEEK (Critical Blockers)

### 1. SMS OTP Integration (3 days)
```bash
# File: backend/bude_core/bude_core/auth/otp.py:29-35
# Status: Hardcoded "123456"
# Action: Integrate MSG91 or Twilio
```

### 2. Messaging System (7 days)
```bash
# Create: Bude Chat & Bude Message doctypes
# Create: packages/market/src/views/MessagesView.vue
# Add: Real-time SocketIO integration
```

### 3. Notifications (5 days)
```bash
# Create: Bude Notification doctype
# Create: packages/shared/src/components/NotificationBell.vue
# Add: Real-time push notifications
```

### 4. Payment Gateway (4 days)
```bash
# Test: Razorpay integration
# Create: packages/shared/src/views/PurchaseCreditsView.vue
# Add: Payment success/failure pages
```

### 5. Privacy & Terms Pages (3 days)
```bash
# Create: packages/shared/src/views/PrivacyPolicyView.vue
# Create: packages/shared/src/views/TermsOfServiceView.vue
# Add: Footer links
```

### 6. Database Indexing (1 day)
```sql
-- Add indexes to hooks.py
CREATE INDEX idx_user_mobile ON `tabUser` (mobile_no);
CREATE INDEX idx_item_status_category ON `tabItem` (custom_status, item_group, modified DESC);
```

### 7. Production CORS (1 hour)
```json
// site_config.json
{
  "cors_allowed_origins": [
    "https://market.budeglobal.com",
    "https://work.budeglobal.com"
  ]
}
```

**Total: ~23 days / ~3-4 weeks**

---

## 🟡 NEXT WEEK (High Priority)

1. **Email Verification Flow** (2 days)
2. **Password Strength Indicator** (1 day)
3. **Forgot Password UI** (1 day)
4. **Session Timeout Handling** (1 day)
5. **Reviews & Ratings System** (4 days)
6. **Search Autocomplete** (2 days)
7. **Sentry Error Tracking** (1 day)
8. **API Pagination** (2 days)

**Total: ~14 days / ~2 weeks**

---

## 🟢 MONTH 1 (Polish & Optimize)

1. **OTP Input Enhancement** (1 day)
2. **Resend OTP Timer** (1 day)
3. **KYC UI Flow** (2 days)
4. **Image Optimization** (3 days)
5. **Design System Refactor** (5 days)
6. **Component Polish** (4 days)

**Total: ~16 days / ~2-3 weeks**

---

## ✅ RECENTLY COMPLETED

- ✅ Profile data moved to database (was in cache)
- ✅ Fixed field name bugs (proficiency → level, url → live_url)
- ✅ Removed orphan Bude Profile Portfolio doctype
- ✅ Enhanced export script with comprehensive data
- ✅ Fixed API response format for frappe.call()
- ✅ Fixed career_preferences field access
- ✅ Profile form now loads existing data correctly

---

## 🐛 KNOWN BUGS TO FIX

1. **Wallet API Response** (High)
   ```javascript
   // Error: result.data.forEach is not a function
   // File: packages/shared/src/stores/wallet.ts:131
   // Fix: Check response format from backend
   ```

---

## 📊 QUICK STATS

- **Backend Completion:** ~70%
- **Frontend Completion:** ~60%
- **Overall Progress:** ~65%
- **Target Launch:** 8-10 weeks
- **Minimum Launch:** 5-6 weeks (with critical only)

---

## 🎯 CRITICAL PATH TO LAUNCH

```
Week 1-2: SMS + Messaging + Notifications
Week 3: Payment + Privacy/Terms + DB Indexes
Week 4: Email Verification + Session Handling + Reviews
Week 5: Search + Error Tracking + Bug Fixes
Week 6: Testing + Security Audit + Soft Launch
```

---

## 📞 CONTACT / ESCALATION

If blocked on:
- **SMS Integration:** Choose provider first (MSG91 recommended)
- **Payment Gateway:** Test Razorpay sandbox thoroughly
- **Legal Pages:** Consider consulting lawyer for compliance
- **Deployment:** Set up staging environment first

---

**For full details, see:** [PENDING_WORK.md](./PENDING_WORK.md)
