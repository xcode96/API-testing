# Cyber Security Training Dashboard

This is an interactive dashboard application designed to manage and track cyber security training modules for users. It features a user-facing dashboard for taking quizzes and an admin panel for comprehensive management of users, questions, and application settings.

## Core Features

- **User Dashboard**: An engaging interface for users to view assigned training modules, track their progress with a dynamic circular progress bar, and take quizzes.
- **Admin Panel**: A powerful back-office for administrators to:
  - Manage users (add, view progress, grant retakes).
  - Manage questions and exam structure with nested categories (Exam Folders and Sub-Topics).
  - Bulk import/export entire exam folders from/to structured JSON files.
  - Customize certificates with company branding, logos, and signatures.
- **Automatic GitHub Publishing**: A key feature that automatically syncs all application data (users, quizzes, settings) to a specified GitHub repository in real-time, configured entirely within the app.

---

## How the GitHub Publishing Feature Works

This feature provides a robust, real-time backup and versioning solution for your application's data. The configuration and synchronization process is handled entirely on the client-side (in your browser), meaning your Personal Access Token (PAT) is never sent to or stored on the application's backend server.

The settings are stored alongside your other application data, so you only need to configure it once from any admin device.

### How to Configure GitHub Synchronization

**Step A: Generate a Personal Access Token (PAT) on GitHub**

1.  Go to your GitHub **Settings**.
2.  Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3.  Click **"Generate new token"**.
4.  Give the token a descriptive name (e.g., "Cyber Training App Sync").
5.  Set an **Expiration** date for security.
6.  Under **Scopes**, check the **`repo`** scope. This is essential as it grants permission to access and modify your repository content.
7.  Click **"Generate token"**.
8.  **Important**: Copy the token immediately. You will not be able to see it again.

**Step B: Configure Settings in the Admin Panel**

1.  Log in to the application's `Admin Panel`.
2.  Navigate to the `Settings` tab.
3.  In the **"GitHub Repository Configuration"** section, fill in all four fields:
    -   **Repository Owner**: Your GitHub username (e.g., `johndoe`).
    -   **Repository Name**: The name of the repository you want to sync to (e.g., `my-training-data`).
    -   **File Path in Repo**: The full path, including the filename, where the data will be stored (e.g., `data/production.json`).
    -   **Personal Access Token (PAT)**: Paste the token you generated in Step A.
4.  Your changes are saved automatically. The status indicator will update to show the sync status.

### Synchronization Process

Once configured, the process is fully automatic. Any change made in the admin panel (e.g., adding a user, a user completing a quiz) will trigger a sync to your specified GitHub repository. You can monitor the status in real-time in the Settings panel.
