# BudeConnect - Quick Priorities

**Generated:** 2026-01-26

---

## 🔴 THIS WEEK (Critical Blockers)

### 1. SMS OTP Integration ✅ Completed
```bash
# File: backend/bude_core/bude_core/auth/otp.py:29-35
# Status: Integrated MSG91 and Twilio
```

### 2. Messaging System (7 days)
```bash
# Create: Bude Chat & Bude Message doctypes
# Create: packages/market/src/views/MessagesView.vue
# Add: Real-time SocketIO integration
```

### 3. Notifications ✅ Completed
```bash
# Created: Bude Notification doctype
# Added: notification_handler.py logic
```

### 4. Payment Gateway ❌ Removed
```bash
# Decision: Platform does not handle money. Pure information platform.
```

### 5. Privacy & Terms Pages (3 days)
```bash
# Create: packages/shared/src/views/PrivacyPolicyView.vue
# Create: packages/shared/src/views/TermsOfServiceView.vue
# Add: Footer links
```

### 6. Database Indexing ✅ Completed
```sql
# Added to install.py: idx_user_mobile, idx_item_status_category
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
2. ~~**Password Strength Indicator**~~ ✅ Already exists
3. ~~**Forgot Password UI**~~ ✅ Already exists
4. ~~**Session Timeout Handling**~~ ✅ Already exists
5. **Reviews & Ratings System** ✅ Integrated Profile Stats (4 days)
6. **Search Autocomplete** (2 days)
7. **Sentry Error Tracking** (1 day)
8. **API Pagination** (2 days)
9. **Fix `success_response()` in remaining backend modules** ✅ Completed (1 day)

**Total: ~12 days / ~2 weeks** (3 items already done)

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
- ✅ **Wallet API bug fixed** — removed `success_response()` wrappers from all 9 wallet endpoints
- ✅ **Shopify Product Taxonomy integrated** — frontend-only, no backend calls
  - `taxonomy.ts` serves static JSON via Vite `import.meta.glob`
  - `useTaxonomy.ts` composable manages multi-level state
  - `CascadingCategoryPicker.vue` — search, browse, breadcrumb navigation
  - `CategoryNav.vue` uses taxonomy verticals (dynamic icons)
  - `HomeView.vue` loads verticals from taxonomy API
  - `PostAdView.vue` uses CascadingCategoryPicker with taxonomy ID/path
- ✅ **Backend taxonomy service removed** — taxonomy is frontend-only (no Python/Frappe)
- ✅ **Session timeout handling** already implemented in `client.ts` (401/403 detection)
- ✅ **Password strength indicator** already exists (`PasswordStrengthMeter.vue`, used in `ResetPasswordView.vue`)
- ✅ **Forgot password UI** already exists (`ForgotPasswordView.vue` + `ResetPasswordView.vue`)

---

## 🐛 KNOWN BUGS TO FIX

1. **`success_response()` double-nesting in other backend modules** (Medium)
   ```
   Affected: work.py (15 uses), user_profile.py (8 uses), signup.py (7 uses),
   otp.py (2 uses), kyc.py (5 uses), session.py (3 uses), preferences.py (5 uses),
   boost.py (1 use), categories.py (1 use)
   Same pattern as wallet.py — return data directly instead of success_response()
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
