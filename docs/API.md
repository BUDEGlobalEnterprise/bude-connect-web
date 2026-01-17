# API Reference & Shared Logic

The `packages/shared` directory contains the core business logic and API integration layer used by both the Market and Work applications. This ensures consistency in how we handle authentication, data types, and wallet operations.

## 📡 Frappe Client

We use a custom `FrappeClient` wrapper around `fetch` to handle specific Frappe framework requirements:

*   **CSRF Protection**: Automatically fetches and attaches the `X-Frappe-CSRF-Token` header.
*   **Session Management**: Uses `credentials: 'include'` to persist backend session cookies.
*   **Error Handling**: Throws typed `ApiError` objects containing Frappe's error messages.

### Usage Example

```typescript
import { frappe } from '@bude/shared/api';

// Call a whitelisted python method
const result = await frappe.call('dotted.path.to.method', { arg1: 'value' });

// Get a document
const doc = await frappe.getDoc('Item', 'ITEM-001');
```

## 🔐 Authentication Module (`api/auth.ts`)

Handles the mobile OTP login flow supported by the custom backend app `bude_core`.

*   `sendOtp(mobile)`: Triggers OTP generation.
*   `verifyOtp(otp)`: Validates OTP and sets the session cookie.
*   `getCurrentUser()`: Fetches the logged-in user's profile and roles.

## 💰 Wallet Module (`api/wallet.ts`)

Manages the credit system used for unlocking contacts.

*   `getBalance()`: Returns current credit balance.
*   `unlockContact(doctype, docname)`: Idempotent call. Deducts 1 credit if not already unlocked. Returns contact details.
*   **Caching**: The `useWalletStore` automatically caches unlocked contacts in `localStorage` to prevent unnecessary API calls and redundant deductions (though the backend also prevents double-spending).

## 🛍️ Market API (`api/market.ts`)

*   `getFeed(filters)`: Retrives items based on category, type, or search.
*   `createDraftItem(data)`: Creates a draft `Market Item`.
*   `publishItem(data)`: Submits the item for approval/publishing.

## 👷 Work API (`api/work.ts`)

*   `searchTalent(filters)`: Finds `Supplier` documents (Freelancers) filtering by skills/rate.
*   `getOpenJobs(filters)`: Lists open `Job Opening` documents.
*   `submitProposal(data)`: Creates a `Job Bid` linked to a `Job Opening`.

## 🔄 Type Definitions

All API responses are typed in `src/types/index.ts`. Always update this file when the backend DocTypes change.

### Core Types
*   **`User`**: Standard Frappe User + custom fields.
*   **`MarketItem`**: Represents goods for sale/rent.
*   **`Freelancer`**: Mapped from the `Supplier` DocType with `is_freelancer=1`.
*   **`JobOpening`**: Represents a project/gig.
