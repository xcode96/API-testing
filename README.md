# Cyber Security Training Dashboard

An interactive dashboard application designed to manage and track cyber security training modules. It features a user-facing dashboard for taking quizzes and a powerful admin panel for comprehensive management of users, questions, settings, and data synchronization.

This application is built as a robust, single-source-of-truth system, leveraging a persistent database (Vercel KV) for live data and offering flexible data management workflows, including seamless synchronization with a GitHub repository.

---

## Core Features

### User Experience
- **Interactive Dashboard**: An engaging and visually appealing interface for users to view assigned training modules.
- **Dynamic Progress Tracking**: A circular progress bar and clear statistics provide users with immediate feedback on their completion status.
- **Organized Learning**: Modules are grouped into collapsible categories and sub-topics for a structured learning path.
- **Responsive Design**: A mobile-first approach ensures a seamless experience on any device.

### Administrator Panel
- **Comprehensive User Management**: Add new users, view detailed progress reports, and grant retakes for failed assessments.
- **Advanced Content Management**:
    - Create and manage "Exam Folders" (top-level categories).
    - Add "Sub-Topics" (individual quizzes) within each folder.
    - Create, edit, and delete questions with ease.

### Data & Integration
- **Persistent Data Storage**: Uses Vercel KV as a fast and reliable database, ensuring all data is saved permanently.
- **GitHub Synchronization (GitOps)**: Manage your training content in a `data.json` file within a GitHub repository. A single click in the admin panel syncs all changes, treating Git as your content management system.
- **Robust Backup & Restore**:
    - **Full System Backup**: Export all application data (users, quizzes, settings) into a single JSON file.
    - **Full System Restore**: Import a `data.json` file to completely overwrite the application's live data—perfect for migration or restoring from a backup.
- **Modular Content Management**: Import and export individual Exam Folders as JSON files, allowing for modular and shareable training content.

---

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Data Persistence**: Vercel KV
- **Deployment**: Vercel

---

## Data Management Workflow

This application uses the Vercel KV database as its **single source of truth**. The `data.json` file in the repository is a template used for two specific purposes: **initialization** and **full data overwrite**.

### Recommended Workflow: GitHub Synchronization

This "GitOps" approach is the most powerful and recommended way to manage your training content. It allows you to use version control (Git) to track changes to your curriculum.

1.  **Host `data.json` on GitHub**: Place your `data.json` file in a public or private GitHub repository. You can use the one in this project as a starting template.
2.  **Create a Personal Access Token (PAT)**: For security, create a [fine-grained Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) that has **read-only** access *only* to the specific repository where your `data.json` file is stored.
3.  **Configure and Sync**:
    - Navigate to the **Admin Panel** -> **Settings**.
    - Under **GitHub Synchronization**, fill in your repository details:
        - **GitHub Owner**: Your GitHub username or organization.
        - **Repository Name**: The name of the repository.
        - **Path to file**: The path to your file (e.g., `data.json` or `config/data.json`).
        - **Personal Access Token**: Paste your read-only PAT.
    - Click **"Test Connection"** to verify that the application can access the file.
    - Click **"Sync from GitHub"**. This fetches the data from your repository, overwrites the current database content, and makes the changes live instantly.

### Manual Workflows: Using the Admin Panel

#### 1. In-App Content Management
You can create, edit, and delete all exam folders, sub-topics, and questions directly within the **Admin Panel** -> **Questions** tab without ever touching a JSON file. All changes are saved automatically and permanently to the database.

#### 2. Backup and Restore
-   **Backup (Export)**:
    - Go to **Settings** -> **Export All Application Data**.
    - Click **"Export All Data"** to download a single `data.json` file containing a complete snapshot of the live database.
-   **Restore (Import)**:
    - Go to **Settings** -> **Import All Application Data**.
    - Click **"Import from data.json"** and select your backup file.
    - **Warning**: This is a destructive action that will completely overwrite all existing data in the application.

#### 3. Modular Content Import/Export
For greater flexibility, you can manage content at the "Exam Folder" level.
-   **Export Folder**: In the **Questions** tab, click the "Export Folder" button next to any exam folder to download its structure and questions as a JSON file.
-   **Import Folder**: Click the "Import Folder" button to upload a folder JSON file. This will add the new sub-topics and questions to the selected folder without overwriting other data.

---

## Customization

-   **Styling**: The UI is built with Tailwind CSS. You can modify colors, fonts, and layouts by editing the class names in the React components.
-   **Icons**: Module icons are managed in `constants.tsx`. You can add or change the SVG icons in the `ICONS` object.
