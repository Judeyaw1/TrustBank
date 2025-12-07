# Trust Bank Project

A modern, full-stack online banking simulation application built with React, Node.js, and PostgreSQL.

## 🚀 Features

*   **Secure Authentication:** User registration and login system with persistent sessions.
*   **Real-Time Dashboard:** View account balances and recent activity that updates instantly.
*   **Fund Transfers:** Move money between Checking and Savings accounts with transactional integrity.
*   **Zelle® Integration:** Simulate sending money to friends and family with recipient management.
*   **Bill Pay:** Manage payees and pay bills directly from your accounts.
*   **Mobile Check Deposit:** Simulate depositing checks with immediate fund availability.
*   **Account Management:** Open new accounts and manage debit/credit cards.
*   **User Settings:** Update profile information, change passwords, and manage trusted devices.
*   **Transaction History:** Detailed record of all financial activities stored in a Postgres database.

## 🛠️ Tech Stack

**Frontend:**
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React

**Backend:**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL (hosted on Neon)
*   **Client:** `pg` (node-postgres)

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Installation & Setup

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Ensure you have a `.env` file in the root directory with your database connection string:
    ```env
  
    ```

4.  **Database Setup:**
    Initialize the database tables (Users, Accounts, Transactions).
    ```bash
    node scripts/db-setup.js
    ```

5.  **Start the Application:**
    You need to run both the backend server and the frontend client.

    **Terminal 1 (Backend):**
    ```bash
    node server/index.js
    ```
    *The server runs on http://localhost:port

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    *The app runs on http://localhost:port

## 📖 Usage Guide

1.  **Register:** Open the app and create a new account. You will automatically receive **$500.00** in your Checking and Savings accounts to start testing.
2.  **Login:** Sign in with your email and password.
3.  **Dashboard:** View your accounts. Try moving money:
    *   Go to **Transfer** to move funds between your accounts.
    *   Go to **Send / Request** to send money to an external contact.
4.  **Settings:** Click your profile avatar to access Settings. Here you can edit your profile or change your password.

## 📂 Project Structure

*   `src/components/`: React UI components (Dashboard, Transfers, Login, etc.)
*   `src/lib/`: Utility functions and mock auth context.
*   `server/`: Express backend API and database logic.
*   `scripts/`: Database setup and utility scripts.
*   `styles/`: Global CSS and Tailwind configuration.

## ⚠️ Note
This is a simulation project for educational/demonstration purposes. It does not connect to real banking networks or handle actual money.

