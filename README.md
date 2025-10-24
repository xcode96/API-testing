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

This application uses a database for live data storage. The `training-data.json` file included in the source code is only used to populate the database the very first time the application is run. After that, the application reads from and writes to the database.

To manage your training data using a file (e.g., a JSON file in a GitHub repository), please follow this workflow:

1.  **Use `data.json`**: The `data.json` file in this project is your primary template. Edit this file to add or modify users, questions, and exam folders.
2.  **Host Your File**: Upload your modified `data.json` file to a service where it's accessible via a direct URL (like GitHub).
3.  **Get the "Raw" URL**: If using GitHub, navigate to your file and click the **"Raw"** button to get a direct link. The URL will start with `raw.githubusercontent.com`.
4.  **Sync the Application**:
    - Go to the **Admin Panel** -> **Settings** -> **Data Management**.
    - Paste your raw URL into the **"External Data Source Sync"** field.
    - Click **"Sync Now"**. The application will fetch the data from your URL, permanently save it to the database, and update the live application.
5.  **Backup Your Data**: You can also use the **"Export All Data"** button on the same settings page to download the current live state of the application into a `data.json` file at any time.