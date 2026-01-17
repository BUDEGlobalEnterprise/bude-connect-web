# BudeGlobal Enterprise Marketplace

A dual-marketplace platform connecting goods and talent, built with Vue 3, TypeScript, and Frappe. This mono-repo contains the frontend applications for the BudeGlobal ecosystem.

## 🚀 Projects

This repository is organized as a mono-repo using `pnpm workspaces`:

*   **`packages/market`**: The **Goods Marketplace** (BudeConnect). Buy, sell, and rent items, surplus, or scrap. Features a credit-based unlocking system for seller contacts.
*   **`packages/work`**: The **Talent Platform**. Find verified freelancers, post jobs, and manage proposals. Also uses the credit-based unlocking system.
*   **`packages/shared`**: Shared logic, TypeScript types, API clients (Frappe integration), and Pinia stores (User, Wallet).

## 🛠️ Tech Stack

*   **Framework**: Vue 3 (Composition API)
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: Pinia
*   **Routing**: Vue Router
*   **Package Manager**: pnpm

## 📦 Prerequisites

*   Node.js (v18+)
*   pnpm (`npm install -g pnpm`)
*   A running instance of the **Frappe/ERPNext** backend (BudeGlobal Enterprise)

## 🔧 Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/bude-connect-web.git
    cd bude-connect-web
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Configuration:**
    Copy the example environment file and configure it:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your backend URL (usually `http://localhost:8000` for local dev):
    ```env
    VITE_API_URL=http://localhost:8000
    ```

## 🏃‍♂️ Running the Apps

You can run the apps individually or together.

**Start the Market App (Port 3000):**
```bash
pnpm dev:market
```

**Start the Work App (Port 3001):**
```bash
pnpm dev:work
```

## 🔑 Key Features

### Shared Architecture
*   **Unified Auth**: Shared login state via `useUserStore`. Login in one app applies to the session (handled by backend cookies).
*   **Wallet Integration**: Shared `useWalletStore` for managing credits. Credits purchased can be used to unlock contacts on *both* platforms.
*   **Frappe Client**: A robust `FrappeClient` in `@bude/shared` handles CSRF tokens, session calls, and whitelisted API methods for seamless backend communication.

### Market App
*   **Item Feeds**: Filter by category, listing type (Sell, Rent, Swap).
*   **Seller Tools**: Post ads, manage listings (Active/Sold/Expired).
*   **Unlock Flow**: View limited details -> Spend Credit -> Unlock Phone/Email.

### Work App
*   **Talent Search**: Filter freelancers by skill, rate, and verified status.
*   **Job Board**: Post jobs, accept bids, and manage active contracts.
*   **LMS Integration**: Displays "Verified Expert" badges for users with LMS certifications (backend integration).

## 🤝 Contributing

1.  Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
2.  Commit your changes.
3.  Push to the branch and open a Pull Request.

## 📄 License

Proprietary - BudeGlobal Enterprise.
