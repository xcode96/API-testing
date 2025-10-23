# Cyber Security Training Dashboard

This is an interactive dashboard application designed to manage and track cyber security training modules for users. It features a user-facing dashboard for taking quizzes and an admin panel for comprehensive management of users, questions, and application settings.

## Core Features

- **User Dashboard**: An engaging interface for users to view assigned training modules, track their progress with a dynamic circular progress bar, and take quizzes.
- **Admin Panel**: A powerful back-office for administrators to:
  - Manage users (add, view progress, grant retakes).
  - Manage questions and exam structure with nested categories (Exam Folders and Sub-Topics).
  - Bulk import/export entire exam folders from/to structured JSON files.
  - Customize certificates with company branding, logos, and signatures.
- **Automatic GitHub Publishing**: A key feature that allows administrators to sync all application data (users, quizzes, settings) directly to a personal GitHub repository in real-time.

---

## How the GitHub Publishing Feature Works

This feature provides a robust, real-time backup and versioning solution for your application's data by publishing it directly to a GitHub repository of your choice.

### 1. Configuration (Client-Side)

The entire configuration is managed within the admin panel and stored securely in your browser's local storage. **Your credentials are never sent to or stored on the application's backend server.**

- **Navigate**: Go to `Admin Panel` > `Settings`.
- **Configure**: Click on `Configure GitHub Settings` to open the modal.
  - **Repository Owner**: Your GitHub username (e.g., `johndoe`).
  - **Repository Name**: The name of the repository you want to sync to (e.g., `my-training-data`).
  - **File Path in Repo**: The full path, including the filename, where the data will be stored (e.g., `data/production.json`).
  - **Personal Access Token (PAT)**: A secure token that grants the application permission to write to your repository.

### 2. How to Generate a Personal Access Token (PAT)

1.  Go to your GitHub **Settings**.
2.  Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3.  Click **"Generate new token"**.
4.  Give the token a descriptive name (e.g., "Cyber Training App Sync").
5.  Set an **Expiration** date for security.
6.  Under **Scopes**, check the **`repo`** scope. This is essential as it grants permission to access and modify your repository content.
7.  Click **"Generate token"**.
8.  **Important**: Copy the token immediately and store it somewhere safe. You will not be able to see it again.
9.  Paste this token into the "Personal Access Token (PAT)" field in the application's settings modal.

### 3. Automatic Synchronization

Once configured, the process is fully automatic.

- **Trigger**: Any change made in the admin panel—such as adding a user, creating a new question, or updating certificate settings—triggers the sync process.
- **Process**: The application waits for one second after your last change (a process called "debouncing") and then initiates a sync.
- **Action**: It reads your settings from local storage, formats the entire application state into a JSON file, and uses the GitHub REST API to push the file to your specified repository path.
- **Feedback**: The "Question Management" page displays a status indicator confirming that "Automatic Sync is Active", so you always know your changes are being published.

### Security Considerations

- The Personal Access Token (PAT) is stored in your **browser's local storage**. This means it is tied to your specific browser on your specific computer.
- While this is a secure method for a client-side feature (as it's not exposed on a public server), be aware of the security implications of storing a token with `repo` scope on a shared or public computer.
- For maximum security, always use a computer you trust and consider setting a short expiration date on your PAT.
