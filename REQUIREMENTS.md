# Project Requirements Document: Trust Bank Application

## 1. Project Overview
The **Trust Bank Application** is a full-stack banking simulation platform designed to provide a realistic online banking experience. It allows users to manage accounts, perform transactions, and view their financial history in real-time. The application mimics core banking functionalities such as transfers, bill payments, check deposits, and account management, backed by a persistent database.

## 2. User Roles
-   **Retail User:** The primary user of the application who can access their own accounts, perform transactions, and manage their profile.

## 3. Functional Requirements

### 3.1 Authentication & Onboarding
-   **Registration:** Users must be able to create a new account by providing personal details (Name, Email, Phone, SSN, Account Number).
-   **Login:** Users must be able to log in securely using their Email and Password.
    -   Includes a loading indicator for visual feedback.
-   **Logout:** Users must be able to securely sign out of the application.
-   **Forgot Credentials:** (UI Only) Flows for recovering User ID and resetting Password.
-   **Onboarding:** New users receive a welcome modal guiding them through the initial setup.

### 3.2 Dashboard & Account Overview
-   **Account Summary:** Display a summary of all user accounts (Checking, Savings, Credit) with current balances.
-   **Recent Transactions:** Show a list of the most recent transactions across all accounts.
-   **Real-Time Updates:** Account balances and transaction history must update immediately after any financial operation.

### 3.3 Transactions
-   **Internal Transfers:** Users can transfer funds between their own Trust Bank accounts (e.g., Savings to Checking).
    -   Validation: Ensure sufficient funds before processing.
-   **Send Money (Zelle®):** Users can send money to external recipients using Email or Mobile Number.
    -   Recipient Management: Add, save, and select recent recipients.
-   **Bill Pay:** Users can pay bills to saved payees.
    -   Payee Management: Add and delete payees.
-   **Mobile Check Deposit:** Simulation of depositing a check by entering an amount (image upload UI included).
    -   Funds are immediately credited to the selected account.

### 3.4 Account Management
-   **Open Account:** Users can apply for new accounts (Checking, Savings, Credit Card).
    -   Includes a simulated approval process (10-minute wait time).
-   **Card Management:** View details of linked debit/credit cards.
    -   Lock/Unlock cards.
    -   Add new cards (persisted locally).

### 3.5 Settings & Security
-   **Profile Management:** Users can view and edit their personal information (Name, Phone).
-   **Security Settings:**
    -   **Change Password:** Users can update their login password (requires verification of current password).
    -   **Trusted Devices:** View and manage a list of devices authorized to access the account.
-   **Notifications:** Users receive in-app alerts for activities like logins, payments, and account openings.

## 4. Non-Functional Requirements

### 4.1 Performance
-   **Latency:** Critical transactions (transfers, payments) should be processed and reflected on the UI within 2 seconds.
-   **State Management:** The application state must remain consistent across page reloads.

### 4.2 Persistence & Data Integrity
-   **Database:** All critical user data (Users, Accounts, Transactions) must be stored in a relational database (PostgreSQL).
-   **Transactional Integrity:** Financial operations (transfers) must use database transactions to ensure money is not lost or created (ACID compliance).

### 4.3 User Interface (UI/UX)
-   **Responsiveness:** The application must be fully responsive and usable on both desktop and mobile devices.
-   **Design System:** Follow a consistent color scheme (Trust Bank Purple) and styling guide.
-   **Feedback:** Provide clear success/error messages for all user actions.

### 4.4 Security (Simulation)
-   **Session Management:** Users must be logged out automatically upon closing the session/browser (no persistent auto-login on restart).
-   **Data Protection:** Sensitive fields like passwords should be handled securely (mock encryption for this demo).

## 5. Technical Stack
-   **Frontend:** React, TypeScript, Vite, Tailwind CSS.
-   **Backend:** Node.js, Express.js.
-   **Database:** PostgreSQL (Neon Cloud).
-   **Icons:** Lucide React.

