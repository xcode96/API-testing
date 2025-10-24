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

1.  **Exporting Data (Backup)**:
    - Go to the **Admin Panel** -> **Settings** -> **Data Management**.
    - Click the **"Export All Data"** button.
    - This will download a file named `data.json` containing all current users, quizzes, and settings. You can store this file as a backup or commit it to your own repository.

2.  **Importing Data (Restore/Sync)**:
    - Host your `data.json` file online (e.g., in a public GitHub repository).
    - Get the "Raw" URL for the file.
    - In the **Admin Panel** -> **Settings** -> **Data Management**, paste this URL into the **"External Data Source Sync"** field.
    - Click **"Sync Now"**. The application will fetch the data from your URL, permanently save it to the database, and update the live application.
