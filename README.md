# Cyber Security Training Dashboard

This is an interactive dashboard application designed to manage and track cyber security training modules for users. It features a user-facing dashboard for taking quizzes and an admin panel for comprehensive management of users, questions, and application settings.

## Core Features

- **User Dashboard**: An engaging interface for users to view assigned training modules, track their progress with a dynamic circular progress bar, and take quizzes.
- **Admin Panel**: A powerful back-office for administrators to:
  - Manage users (add, view progress, grant retakes).
  - Manage questions and exam structure with nested categories (Exam Folders and Sub-Topics).
  - Bulk import/export entire exam folders from/to structured JSON files.
  - Customize certificates with company branding, logos, and signatures.
- **Data Management**: Easily export all application data (users, quizzes, settings) into a single JSON file for backup or migration.

## Data Management Workflow

This application uses a database for live data storage. The `data.json` file included in the source code is a template and is only used to populate the database the very first time the application is run. After that, the application reads from and writes to the database.

To manage your training data using a file from a GitHub repository, please follow this recommended workflow:

### Recommended: GitHub Synchronization

1.  **Use `data.json`**: The `data.json` file in this project is your primary template. Edit this file to add or modify users, questions, and exam folders.
2.  **Host on GitHub**: Upload your modified `data.json` file to a public or private GitHub repository.
3.  **Create a Personal Access Token (PAT)**: For security, create a [fine-grained Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) that has **read-only** access to the specific repository where your `data.json` file is stored.
4.  **Configure and Sync**:
    - Go to the **Admin Panel** -> **Settings** -> **Data Management**.
    - Fill in the fields in the **"GitHub Synchronization"** section:
        - **GitHub Owner**: Your GitHub username or organization name.
        - **Repository Name**: The name of the repository.
        - **Path to file**: The path to your file within the repository (e.g., `data.json` or `config/data.json`).
        - **Personal Access Token**: Paste the PAT you created.
    - Click **"Sync from GitHub"**. The application will securely fetch the data from your repository, permanently save it to the database, and update the live application state.

### Manual Backup and Restore

- **Backup**: Use the **"Export All Data"** button on the settings page to download the current live state of the application into a `data.json` file at any time.
- **Restore**: Use the **"Import from data.json"** button to upload a file and completely overwrite the application's data. **Warning:** This is a destructive action.
