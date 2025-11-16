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
- **Modular Content Management**: Import and export individual Exam Folders as JSON files, allowing for modular and shareable training content.

---

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Data Persistence**: Vercel KV
- **Deployment**: Vercel

---

## Data Management Workflow

This application uses the Vercel KV database as its **single source of truth**. All changes made in the admin panel are saved automatically and permanently.

### 1. In-App Content Management (Recommended)
You can create, edit, and delete all exam folders, sub-topics, and questions directly within the **Admin Panel** -> **Questions** tab without ever touching a JSON file. This is the simplest way to manage your curriculum.

### 2. Modular Content Import/Export
For greater flexibility, such as moving content between different instances of this application or building it offline, you can manage content at the "Exam Folder" level.
-   **Export Folder**: In the **Questions** tab, click the "Export Folder" button next to any exam folder to download its structure and questions as a JSON file.
-   **Import Folder**: Click the "Import Folder" button to upload a folder JSON file. This will add the new sub-topics and questions to the selected folder without overwriting other data.

---

## Customization

-   **Styling**: The UI is built with Tailwind CSS. You can modify colors, fonts, and layouts by editing the class names in the React components.
-   **Icons**: Module icons are managed in `constants.tsx`. You can add or change the SVG icons in the `ICONS` object.