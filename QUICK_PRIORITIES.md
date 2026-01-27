# BudeConnect - Quick Priorities

**Generated:** 2026-01-26

---

## 🔴 THIS WEEK (Critical Blockers)

### 1. SMS OTP Integration ✅ Completed
```bash
# File: backend/bude_core/bude_core/auth/otp.py:29-35
# Status: Integrated MSG91 and Twilio
```

### 2. Messaging System ✅ Completed
```bash
# Created: Bude Chat & Bude Message doctypes
# Created: MessagesView.vue in both market and work packages
# Added: Real-time SocketIO integration
```

### 3. Notifications ✅ Completed
```bash
# Created: Bude Notification doctype + notification_handler.py
# Created: NotificationsView.vue in both market and work packages
# Added: NotificationBell, NotificationDropdown components
# Added: /notifications route in both routers
```

### 4. Payment Gateway ❌ Removed
```bash
# Decision: Platform does not handle money. Pure information platform.
```

### 5. Privacy & Terms Pages ✅ Completed
```bash
# Already exist in codebase
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
5. **Reviews & Ratings System** ✅ Completed — ReviewSection integrated into SellerView + FreelancerView
6. **Search Autocomplete** ✅ Completed — SearchBar wired into Market Navbar + HomeView
7. **Sentry Error Tracking** ✅ Completed — Interface implemented in `utils.py`
8. **API Pagination** ✅ Completed — Standardized across Market, Work, Notifications
9. **Fix `success_response()` in remaining backend modules** ✅ Completed

**Total: ~12 days / ~2 weeks** (3 items already done)

---

## 🟢 MONTH 1 (Polish & Optimize)

1. **OTP Input Enhancement** ✅ Completed — `OtpInput.vue` component with separate digit boxes
2. **Resend OTP Timer** ✅ Completed — 60s countdown in both LoginViews
3. **KYC UI Flow** ✅ Completed — Fixed resubmission form for rejected state in both packages
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
- ✅ **NotificationsView** created for both market and work packages with full UI
- ✅ **ReviewSection integrated** into `SellerView.vue` and `FreelancerView.vue`
- ✅ **Privacy & Terms Pages** already exist in codebase
- ✅ **Search Autocomplete** — SearchBar component wired into Market Navbar, HomeView handles `?search=` query
- ✅ **OTP Input Enhancement** — `OtpInput.vue` with 6 separate digit boxes, auto-advance, paste support, auto-submit
- ✅ **Resend OTP Timer** — 60-second countdown with resend button in both market/work LoginViews
- ✅ **KYC UI Polished** — Rejected state now shows inline resubmission form (was broken/missing)
- ✅ **API Standardization** — Removed `success_response()` and `error_response()` wrappers from all 70+ backend uses
- ✅ **Gamification (Energy Points)** — Integrated Frappe's native Energy Points for KYC, Listings, Jobs, and Reviews
- ✅ **Scalability & Caching** — Added `@cache_response` (Redis) and `run_async` (frappe.enqueue) helpers
- ✅ **Performance Metrics API** — New `profile/stats.py` for user performance, rank levels, and leaderboards
- ✅ **Sentry Integration** — Centralized exception logging with support for DSN-based tracking
- ✅ **Automated Setup** — `install.py` now configures Energy Point Rules and indexes on migrate

---

(All critical backend bugs successfully resolved)


---

## 📊 QUICK STATS

- **Backend Completion:** ~95%
- **Frontend Completion:** ~85%
- **Overall Progress:** ~90%
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
