# Cyber Security Training Dashboard

An interactive dashboard application designed to manage and track cyber security training modules. It features a user-facing dashboard for taking quizzes and a powerful admin panel for comprehensive management of users and question content.

This application is built as a robust, single-source-of-truth system, leveraging a persistent database (Vercel KV) for live data and offering a streamlined content management workflow.

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
- **Centralized Question Export**: A single "Export All Questions" button generates a complete JSON backup of all your exam folders and questions.

---

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Data Persistence**: Vercel KV
- **Deployment**: Vercel

---

## Data Management Workflow

This application uses the Vercel KV database as its **single source of truth**. All changes made in the admin panel are saved automatically and permanently.

### 1. In-App Content Management (Recommended)
You can create, edit, and delete all exam folders, sub-topics, and questions directly within the **Admin Panel** -> **Questions** tab. This is the simplest and recommended way to manage your curriculum.

### 2. Manual Backup & Version Control
For backing up your content or managing it in a version control system like GitHub, a simple manual workflow is provided:
-   **Export All Questions**: In the **Admin Panel -> Questions** tab, click the "Export All Questions" button.
-   This will download a single JSON file containing all your exam folders and questions.
-   You can store this file as a backup or commit it to a Git repository to track changes over time.

---

## Customization

-   **Styling**: The UI is built with Tailwind CSS. You can modify colors, fonts, and layouts by editing the class names in the React components.
-   **Icons**: Module icons are managed in `constants.tsx`. You can add or change the SVG icons in the `ICONS` object.