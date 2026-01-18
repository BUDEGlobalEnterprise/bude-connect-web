# Architecture Cleanup: Remove Duplicates & Align with Frappe Best Practices

**Date**: 2026-01-18
**Priority**: 🔴 Critical - Fix before production

---

## Problem Statement

The codebase currently has **field mismatches** and **missing fields** between:
1. Python code (`user_profile.py`) references fields that don't exist in Bude Profile doctype JSON
2. Risk of modifying core Frappe User doctype (violates best practices)
3. Need to ensure clean separation: **Core User fields vs Extended Profile fields**

---

## Frappe Best Practice: Never Modify Core DocTypes

### ❌ WRONG Approach (Don't Do This)
```python
# Adding custom fields to User doctype via custom_fields
custom_fields = {
    "User": [
        {"fieldname": "custom_city", "fieldtype": "Data"},
        {"fieldname": "custom_state", "fieldtype": "Data"},
        # This breaks during Frappe updates!
    ]
}
```

### ✅ CORRECT Approach (Use Link + Extended DocType)
```python
# Bude Profile DocType
{
    "doctype": "Bude Profile",
    "fields": [
        {"fieldname": "user", "fieldtype": "Link", "options": "User"},  # Link to core
        {"fieldname": "city", "fieldtype": "Data"},  # Extended field
        {"fieldname": "state", "fieldtype": "Data"},  # Extended field
    ]
}
```

---

## Current Field Mapping Analysis

### Fields Available in Core Frappe User DocType
These exist by default, **DO NOT duplicate**:

| Field | Type | Notes |
|-------|------|-------|
| `name` | Data | Email (primary key) |
| `email` | Data | Same as name |
| `full_name` | Data | ✅ Use this |
| `first_name` | Data | Auto-populated from full_name |
| `last_name` | Data | Auto-populated from full_name |
| `mobile_no` | Data | ✅ Use this |
| `phone` | Data | Alternative phone |
| `user_image` | Attach Image | ✅ Use this (avatar) |
| `location` | Data | ✅ Use this (generic location string) |
| `bio` | Text | ✅ Use this |
| `enabled` | Check | Active status |
| `roles` | Table | User roles |

**Source**: Frappe Core User DocType (don't modify)

---

### Fields in Bude Profile JSON (Extended Fields)
**File**: `backend/bude_core/bude_core/bude_core/doctype/bude_profile/bude_profile.json`

**Current Extended Fields** (97 fields) - These are CORRECT:
- ✅ `user` (Link to User) - Primary link
- ✅ `slug` - URL-friendly identifier
- ✅ `cover_image` - Banner (not avatar, avatar is User.user_image)
- ✅ `headline` - Professional headline
- ✅ `bio` - Extended bio (can duplicate User.bio or use User.bio)
- ✅ `description` - Short description
- ✅ `primary_role` - Job role
- ✅ `business_name` - Business name
- ✅ `gst_number` - GST number
- ✅ `hourly_rate` - Freelancer rate
- ✅ `availability` - Availability status
- ✅ `skills` - Child table
- ✅ `portfolio_projects` - Child table
- ... (91 more fields)

**Missing Fields** (referenced in Python but not in JSON):
- ❌ `city` - NOT in JSON
- ❌ `state` - NOT in JSON
- ❌ `country` - NOT in JSON
- ❌ `pincode` - NOT in JSON
- ❌ `portfolio_links` - NOT in JSON (JSON has `portfolio_projects` instead)

---

### Fields Referenced in Python Code
**File**: `backend/bude_core/bude_core/profile/user_profile.py`

**Lines 90-102** - `update_profile()` function:
```python
if city is not None:
    profile.city = sanitize_string(city, max_length=100)  # ❌ Field doesn't exist

if state is not None:
    profile.state = sanitize_string(state, max_length=100)  # ❌ Field doesn't exist

if country is not None:
    profile.country = sanitize_string(country, max_length=100)  # ❌ Field doesn't exist

if pincode is not None:
    if pincode:
        validate_pincode(pincode)
    profile.pincode = pincode  # ❌ Field doesn't exist
```

**Lines 216-231** - `update_portfolio()` function:
```python
if hasattr(profile, "portfolio_links"):  # ❌ Field doesn't exist
    profile.set("portfolio_links", [])

profile.append("portfolio_links", {  # ❌ Should be "portfolio_projects"
    "title": title,
    "url": url
})
```

**Lines 369-372** - `get_profile_data()` function:
```python
"city": profile.city,  # ❌ Field doesn't exist
"state": profile.state,  # ❌ Field doesn't exist
"country": profile.country or "India",  # ❌ Field doesn't exist
"pincode": profile.pincode,  # ❌ Field doesn't exist
```

---

## Solution: Add Missing Fields to Bude Profile JSON

### Option 1: Use User.location for City/State (Recommended)
**Rationale**: User.location already exists in core User doctype. Use it for basic location, add extended fields only if needed.

```json
// In Bude Profile JSON, add ONLY extended location fields:
{
  "fieldname": "section_location_extended",
  "fieldtype": "Section Break",
  "label": "Location Details",
  "description": "Basic location (city/state) stored in User.location. Extended fields below."
},
{
  "fieldname": "country",
  "fieldtype": "Data",
  "label": "Country",
  "default": "India"
},
{
  "fieldname": "pincode",
  "fieldtype": "Data",
  "label": "PIN Code",
  "length": 10
},
{
  "fieldname": "formatted_address",
  "fieldtype": "Small Text",
  "label": "Formatted Address",
  "description": "Full address for display"
}
```

**Python Code Changes**:
```python
@frappe.whitelist()
def update_profile(
    full_name: str = None,
    location: str = None,  # Changed from city/state
    country: str = None,
    pincode: str = None,
    # ... other fields
):
    # Update User.location (built-in field)
    if location:
        user.location = sanitize_string(location, max_length=200)

    user.save(ignore_permissions=True)

    # Update Bude Profile (extended fields only)
    profile = get_or_create_profile(frappe.session.user)

    if country is not None:
        profile.country = sanitize_string(country, max_length=100)

    if pincode is not None:
        if pincode:
            validate_pincode(pincode)
        profile.pincode = pincode

    profile.save(ignore_permissions=True)
```

---

### Option 2: Store Structured Location in Bude Profile (More Control)
If you need separate city/state fields for filtering/searching:

```json
// Add to Bude Profile JSON after line 217:
{
  "fieldname": "city",
  "fieldtype": "Data",
  "label": "City",
  "length": 100,
  "in_list_view": 1,
  "in_standard_filter": 1
},
{
  "fieldname": "state",
  "fieldtype": "Link",
  "label": "State",
  "options": "Indian State",  // Use Frappe's built-in State master
  "in_list_view": 1,
  "in_standard_filter": 1
},
{
  "fieldname": "country",
  "fieldtype": "Link",
  "label": "Country",
  "options": "Country",  // Use Frappe's built-in Country master
  "default": "India"
},
{
  "fieldname": "pincode",
  "fieldtype": "Data",
  "label": "PIN Code",
  "length": 10
},
```

**Also update User.location as computed field**:
```python
# When updating profile, sync to User.location
if city or state or country:
    location_parts = []
    if city:
        location_parts.append(city)
    if state:
        location_parts.append(state)
    if country and country != "India":
        location_parts.append(country)

    user.location = ", ".join(location_parts)
    user.save(ignore_permissions=True)
```

---

### Fix Portfolio Field Name
**Current Code** references `portfolio_links` but JSON has `portfolio_projects`.

**Option A**: Rename in JSON to match code (Breaking change if data exists)
```json
// Change this:
"portfolio_projects" → "portfolio_links"
```

**Option B**: Update Python code to match JSON (Recommended)
```python
# In user_profile.py, line 216-231
@frappe.whitelist()
def update_portfolio(portfolio_projects: list):  # Renamed parameter
    """Update portfolio projects"""
    try:
        if isinstance(portfolio_projects, str):
            portfolio_projects = json.loads(portfolio_projects)

        profile = get_or_create_profile(frappe.session.user)

        # Clear existing portfolio
        if hasattr(profile, "portfolio_projects"):  # Updated field name
            profile.set("portfolio_projects", [])

        # Add new projects
        for project in portfolio_projects[:10]:
            title = sanitize_string(project.get("title", ""), max_length=100)
            url = project.get("url", "")
            description = sanitize_string(project.get("description", ""), max_length=500)

            if url:
                validate_url(url, "Project URL")

            if title and url and hasattr(profile, "portfolio_projects"):
                profile.append("portfolio_projects", {  # Updated field name
                    "title": title,
                    "url": url,
                    "description": description
                })

        profile.save(ignore_permissions=True)

        return success_response({
            "portfolio": get_user_portfolio(frappe.session.user)
        })
```

**Update helper function**:
```python
def get_user_portfolio(user_id: str) -> list:
    """Get user portfolio projects"""
    if doctype_exists("Bude Profile"):
        profiles = frappe.get_all("Bude Profile", filters={"user": user_id}, limit=1)
        if profiles:
            return frappe.get_all(
                "Bude Profile Project",  # Updated child table name
                filters={"parent": profiles[0].name},
                fields=["title", "url", "description"]
            )
    return []
```

---

## Recommended Architecture

### User Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DATA                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────────────────────┐
                              │                                 │
                              ▼                                 ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│         CORE USER DOCTYPE             │   │       BUDE PROFILE DOCTYPE            │
│  (Never modify Frappe core!)          │   │     (Extended fields only)            │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ • name (email)                        │   │ • user (Link to User) - PRIMARY      │
│ • full_name ✅                        │   │ • slug (URL-friendly)                │
│ • first_name ✅                       │   │ • profile_type                       │
│ • last_name ✅                        │   │ • cover_image (banner)               │
│ • mobile_no ✅                        │   │ • headline                           │
│ • user_image (avatar) ✅              │   │ • tagline                            │
│ • location (generic) ✅               │   │ • bio (extended)                     │
│ • bio (short) ✅                      │   │ • description                        │
│ • enabled                             │   │ • primary_role                       │
│ • roles                               │   │ • seniority_level                    │
│                                       │   │ • experience_years                   │
│ DO NOT ADD CUSTOM FIELDS HERE!        │   │ • city (structured)                  │
│                                       │   │ • state (structured)                 │
└──────────────────────────────────────┘   │ • country                            │
                                            │ • pincode                            │
                                            │ • business_name                      │
                                            │ • gst_number                         │
                                            │ • pan_number                         │
                                            │ • hourly_rate                        │
                                            │ • availability                       │
                                            │ • skills (child table)               │
                                            │ • portfolio_projects (child table)   │
                                            │ • work_experience (child table)      │
                                            │ • education (child table)            │
                                            │ • certifications (child table)       │
                                            │ • ... (91+ extended fields)          │
                                            └──────────────────────────────────────┘
```

### API Response Structure

```json
{
  "user": {
    "name": "user@example.com",
    "email": "user@example.com",
    "full_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "mobile_no": "+919876543210",
    "user_image": "/files/avatar.jpg",
    "location": "Bangalore, Karnataka"
  },
  "profile": {
    "user": "user@example.com",
    "slug": "john-doe",
    "headline": "Full Stack Developer",
    "bio": "...",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "pincode": "560001",
    "hourly_rate": 2500,
    "availability": "available",
    "onboarding_complete": true
  },
  "skills": [
    {"skill_name": "Python", "level": "expert"},
    {"skill_name": "Vue.js", "level": "advanced"}
  ],
  "portfolio": [
    {"title": "Project 1", "url": "https://..."}
  ]
}
```

---

## Implementation Steps

### Step 1: Add Missing Fields to Bude Profile JSON
**File**: `backend/bude_core/bude_core/bude_core/doctype/bude_profile/bude_profile.json`

**Insert after line 217** (after `section_location_extended`):

```json
{
  "fieldname": "city",
  "fieldtype": "Data",
  "label": "City",
  "length": 100,
  "in_list_view": 1,
  "in_standard_filter": 1
},
{
  "fieldname": "state",
  "fieldtype": "Data",
  "label": "State/Province",
  "length": 100,
  "in_list_view": 1,
  "in_standard_filter": 1
},
{
  "fieldname": "country",
  "fieldtype": "Data",
  "label": "Country",
  "length": 100,
  "default": "India"
},
{
  "fieldname": "pincode",
  "fieldtype": "Data",
  "label": "PIN/ZIP Code",
  "length": 10
},
```

**Update field_order** (line 8):
```json
"field_order": [
  // ... existing fields ...
  "timezone",
  "remote_only",
  "column_break_location_ext",
  "city",              // ADD THIS
  "state",             // ADD THIS
  "country",           // ADD THIS
  "pincode",           // ADD THIS
  "onsite_locations",
  "working_hours",
  // ... rest of fields ...
]
```

---

### Step 2: Update Python Code
**File**: `backend/bude_core/bude_core/profile/user_profile.py`

**Change function signature** (line 53-66):
```python
@frappe.whitelist()
def update_profile(
    full_name: str = None,
    location: str = None,  # NEW: For User.location
    headline: str = None,
    bio: str = None,
    city: str = None,      # NEW: For Bude Profile.city
    state: str = None,     # NEW: For Bude Profile.state
    country: str = None,   # Now maps to Bude Profile.country
    pincode: str = None,   # Now maps to Bude Profile.pincode
    role: str = None,
    business_name: str = None,
    gst_number: str = None,
    hourly_rate: float = None,
    availability: str = None,
):
```

**Update implementation** (line 69-128):
```python
try:
    user = frappe.get_doc("User", frappe.session.user)

    # Update User doc (core fields only)
    if full_name:
        full_name = sanitize_string(full_name, max_length=100)
        user.full_name = full_name
        parts = full_name.split(" ", 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ""

    # Update User.location (built-in field)
    if location is not None:
        user.location = sanitize_string(location, max_length=200)
    elif city or state or country:
        # Auto-compute location from structured fields
        location_parts = []
        if city:
            location_parts.append(city)
        if state:
            location_parts.append(state)
        if country and country != "India":
            location_parts.append(country)
        user.location = ", ".join(location_parts)

    user.save(ignore_permissions=True)

    # Update/Create Bude Profile (extended fields only)
    profile = get_or_create_profile(frappe.session.user)

    if headline is not None:
        profile.headline = sanitize_string(headline, max_length=200)

    if bio is not None:
        profile.bio = sanitize_html(bio)[:2000]

    # Structured location fields (NEW - now exists in JSON)
    if city is not None:
        profile.city = sanitize_string(city, max_length=100)

    if state is not None:
        profile.state = sanitize_string(state, max_length=100)

    if country is not None:
        profile.country = sanitize_string(country, max_length=100)

    if pincode is not None:
        if pincode:
            validate_pincode(pincode)
        profile.pincode = pincode

    # ... rest of the function unchanged ...
```

---

### Step 3: Fix Portfolio Field Name
**File**: `backend/bude_core/bude_core/profile/user_profile.py`

**Update function** (line 203-243):
```python
@frappe.whitelist()
def update_portfolio(portfolio_projects: list):  # Renamed parameter
    """Update portfolio projects"""
    try:
        if isinstance(portfolio_projects, str):
            portfolio_projects = json.loads(portfolio_projects)

        if not isinstance(portfolio_projects, list):
            return error_response("Portfolio must be a list", "INVALID_FORMAT")

        profile = get_or_create_profile(frappe.session.user)

        # Clear existing portfolio
        if hasattr(profile, "portfolio_projects"):  # Updated
            profile.set("portfolio_projects", [])

        # Add new projects
        for project in portfolio_projects[:10]:
            title = sanitize_string(project.get("title", ""), max_length=100)
            url = project.get("url", "")
            description = project.get("description", "")

            if url:
                validate_url(url, "Portfolio URL")

            if title and url and hasattr(profile, "portfolio_projects"):  # Updated
                profile.append("portfolio_projects", {  # Updated
                    "title": title,
                    "url": url,
                    "description": description
                })

        profile.save(ignore_permissions=True)

        log_activity("portfolio_updated", "User", frappe.session.user)

        return success_response({
            "portfolio": get_user_portfolio(frappe.session.user)
        })

    except Exception as e:
        log_error("update_portfolio", e)
        return error_response("Failed to update portfolio")
```

**Update helper** (line 406-416):
```python
def get_user_portfolio(user_id: str) -> list:
    """Get user portfolio projects"""
    if doctype_exists("Bude Profile"):
        profiles = frappe.get_all("Bude Profile", filters={"user": user_id}, limit=1)
        if profiles:
            return frappe.get_all(
                "Bude Profile Project",  # Updated child table name
                filters={"parent": profiles[0].name},
                fields=["title", "url", "description"]
            )
    return []
```

---

### Step 4: Run Frappe Migrate
After updating JSON file:

```bash
cd backend/frappe-bench
bench --site bude.local migrate
bench --site bude.local clear-cache
```

This will:
1. Add new fields to Bude Profile table
2. Update field order
3. Clear cached schema

---

### Step 5: Update Frontend API Calls
**File**: `packages/shared/src/api/auth.ts`

**Update updateProfile function**:
```typescript
export async function updateProfile(data: {
  fullName?: string;
  location?: string;     // NEW: For User.location
  headline?: string;
  bio?: string;
  city?: string;         // NEW: For structured location
  state?: string;        // NEW
  country?: string;
  pincode?: string;
  role?: string;
  businessName?: string;
  gstNumber?: string;
  hourlyRate?: number;
  availability?: string;
}) {
  return client.call('bude_core.profile.user_profile.update_profile', data);
}
```

**Update OnboardingWizard.vue**:
```vue
<!-- packages/shared/src/components/OnboardingWizard.vue -->
<script setup>
// Step 4: Location
async function submitLocation() {
  await updateProfile({
    city: formData.city,
    state: formData.state,
    country: formData.country || 'India',
    pincode: formData.pincode,
  });
}
</script>
```

---

### Step 6: Verify No Custom Fields on Core Doctypes

**Check hooks.py** to ensure no custom fields defined:
```python
# File: backend/bude_core/bude_core/hooks.py

# ✅ GOOD - No custom_fields defined
custom_fields = {}

# ❌ BAD - Would look like this if wrong:
# custom_fields = {
#     "User": [
#         {"fieldname": "custom_city", ...}
#     ]
# }
```

Currently your `hooks.py` is clean - **no custom fields defined**. ✅

---

## Testing Checklist

After implementing changes:

### Backend Tests
- [ ] Run `bench migrate` successfully
- [ ] Create new user via OTP
- [ ] Update profile with city/state/pincode
- [ ] Verify data saved to Bude Profile table
- [ ] Verify User.location auto-computed
- [ ] Add portfolio projects
- [ ] Get profile data via API
- [ ] Get public profile

### Frontend Tests
- [ ] Complete onboarding wizard
- [ ] Edit profile (all fields)
- [ ] View profile (own)
- [ ] View profile (public/other user)
- [ ] Verify no console errors
- [ ] Verify location displayed correctly

### Database Tests
```sql
-- Check Bude Profile has new fields
DESC `tabBude Profile`;

-- Should show:
-- city varchar(140)
-- state varchar(140)
-- country varchar(140)
-- pincode varchar(140)

-- Check no custom fields on User
DESC `tabUser`;

-- Should NOT show custom_city, custom_state, etc.
```

---

## Migration Plan for Existing Data

If you already have data in cache or wrong structure:

### Script to Migrate Cache Data to Database
```python
# Run in Frappe console: bench console

import frappe
import json

def migrate_cached_profiles_to_db():
    """Migrate profile data from cache to Bude Profile doctype"""

    users = frappe.get_all("User", filters={"enabled": 1})

    for user_rec in users:
        user_id = user_rec.name

        # Check if cache data exists
        cache_key = f"profile:{user_id}"
        cache_data = frappe.cache().get_value(cache_key)

        if not cache_data:
            continue

        try:
            data = json.loads(cache_data)

            # Get or create Bude Profile
            profiles = frappe.get_all("Bude Profile", filters={"user": user_id}, limit=1)

            if profiles:
                profile = frappe.get_doc("Bude Profile", profiles[0].name)
            else:
                profile = frappe.get_doc({
                    "doctype": "Bude Profile",
                    "user": user_id
                })

            # Migrate fields
            if data.get("headline"):
                profile.headline = data["headline"]

            if data.get("bio"):
                profile.bio = data["bio"]

            if data.get("city"):
                profile.city = data["city"]

            if data.get("state"):
                profile.state = data["state"]

            if data.get("country"):
                profile.country = data["country"]

            if data.get("pincode"):
                profile.pincode = data["pincode"]

            if data.get("role"):
                profile.role = data["role"]

            if data.get("business_name"):
                profile.business_name = data["business_name"]

            if data.get("hourly_rate"):
                profile.hourly_rate = data["hourly_rate"]

            if data.get("availability"):
                profile.availability = data["availability"]

            if data.get("onboarding_complete"):
                profile.onboarding_complete = data["onboarding_complete"]

            if data.get("onboarding_step"):
                profile.onboarding_step = data["onboarding_step"]

            profile.save(ignore_permissions=True)

            print(f"✅ Migrated profile for {user_id}")

        except Exception as e:
            print(f"❌ Error migrating {user_id}: {str(e)}")
            continue

# Run migration
migrate_cached_profiles_to_db()
frappe.db.commit()
```

---

## Summary of Changes

### JSON Changes (Bude Profile DocType)
1. ✅ Add `city` field (Data, 100 chars)
2. ✅ Add `state` field (Data, 100 chars)
3. ✅ Add `country` field (Data, 100 chars, default "India")
4. ✅ Add `pincode` field (Data, 10 chars)
5. ✅ Keep `portfolio_projects` (already correct)

### Python Changes (user_profile.py)
1. ✅ Add `location` parameter for User.location
2. ✅ Keep city/state/country/pincode for Bude Profile
3. ✅ Auto-compute User.location from structured fields
4. ✅ Rename `portfolio_links` → `portfolio_projects`
5. ✅ Update child table name reference

### Frontend Changes
1. ✅ Update `updateProfile` API call signature
2. ✅ Update OnboardingWizard location step
3. ✅ Update ProfileView to show correct fields

### Database Changes
1. ✅ Run `bench migrate` to add new fields
2. ✅ No changes to core User table

---

## Benefits of This Approach

✅ **No Core Modifications** - User doctype remains untouched
✅ **Update-Safe** - Frappe updates won't break custom fields
✅ **Type-Safe** - Python and JSON schemas match
✅ **Flexible** - Easy to add more extended fields
✅ **Performant** - Single JOIN to get full profile
✅ **Maintainable** - Clear separation of concerns

---

## Next Steps

1. **Add missing fields to Bude Profile JSON** (5 minutes)
2. **Update Python code** (15 minutes)
3. **Run bench migrate** (2 minutes)
4. **Test backend APIs** (10 minutes)
5. **Update frontend** (15 minutes)
6. **Test end-to-end** (10 minutes)
7. **Migrate existing cache data** (if applicable)

**Total Time**: ~1 hour

---

**Document Version**: 1.0
**Last Updated**: 2026-01-18
