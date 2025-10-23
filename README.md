# Cyber Security Training Dashboard

This is an interactive dashboard application designed to manage and track cyber security training modules for users. It features a user-facing dashboard for taking quizzes and an admin panel for comprehensive management of users, questions, and application settings.

## Core Features

- **User Dashboard**: An engaging interface for users to view assigned training modules, track their progress with a dynamic circular progress bar, and take quizzes.
- **Admin Panel**: A powerful back-office for administrators to:
  - Manage users (add, view progress, grant retakes).
  - Manage questions and exam structure with nested categories (Exam Folders and Sub-Topics).
  - Bulk import/export entire exam folders from/to structured JSON files.
  - Customize certificates with company branding, logos, and signatures.
- **Automatic GitHub Publishing**: A key feature that automatically syncs all application data (users, quizzes, settings) to a specified GitHub repository in real-time.

---

## How the GitHub Publishing Feature Works

This feature provides a robust, real-time backup and versioning solution for your application's data. It uses a secure, **server-side** Vercel Edge Function to publish the data, ensuring your Personal Access Token (PAT) is never exposed on the client-side.

The configuration is a two-part process:

1.  **Repository Details**: You specify *which* repository to save to in the application's admin panel.
2.  **Access Token**: You provide the *permission* to save to that repository by configuring a secure environment variable in your Vercel project settings.

### Part 1: Configure Repository Details in the Admin Panel

1.  Navigate to `Admin Panel` > `Settings`.
2.  In the **"GitHub Repository Configuration"** section, fill in the following fields:
    -   **Repository Owner**: Your GitHub username (e.g., `johndoe`).
    -   **Repository Name**: The name of the repository you want to sync to (e.g., `my-training-data`).
    -   **File Path in Repo**: The full path, including the filename, where the data will be stored (e.g., `data/production.json`).
3.  Your changes are saved automatically.

### Part 2: Configure the Secure Access Token on Vercel

The application's server needs a Personal Access Token (PAT) to get permission to write to your repository. This **must** be configured on Vercel for security.

**Step A: Generate a Personal Access Token (PAT) on GitHub**

1.  Go to your GitHub **Settings**.
2.  Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3.  Click **"Generate new token"**.
4.  Give the token a descriptive name (e.g., "Cyber Training App Sync").
5.  Set an **Expiration** date for security.
6.  Under **Scopes**, check the **`repo`** scope. This is essential as it grants permission to access and modify your repository content.
7.  Click **"Generate token"**.
8.  **Important**: Copy the token immediately. You will not be able to see it again.

**Step B: Add the Token as an Environment Variable on Vercel**

1.  Go to your project's dashboard on [Vercel](https://vercel.com).
2.  Navigate to the **Settings** tab, then click on **Environment Variables**.
3.  Add a new variable with the following details:
    -   **Key**: `GITHUB_PAT`
    -   **Value**: Paste your Personal Access Token you just copied.
    -   Ensure all environments (Production, Preview, Development) are checked.
4.  Save the variable.
5.  Go to the **Deployments** tab and **re-deploy** your latest production build. This is a crucial step to apply the new environment variable.

### Synchronization Process

Once configured, the process is fully automatic. Any change made in the admin panel will trigger a sync to your specified GitHub repository.
