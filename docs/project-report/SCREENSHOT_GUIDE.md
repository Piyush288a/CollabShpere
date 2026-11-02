# CollabSphere Project Report — Screenshot Capture Guide

This guide provides clear instructions for capturing authentic application screenshots of **CollabSphere** to replace the placeholder boxes in Section 7 of `CollabSphere_Project_Report.docx`.

---

## 🛠️ General Setup Instructions

1. **Local Application URL**: `http://localhost:3000`
2. **Backend Server URL**: `http://localhost:5000`
3. **Database**: Running MongoDB with the Indian Demo Dataset (100 relationally consistent documents).
4. **Browser**: Chrome or Firefox in standard 1920x1080 resolution (100% zoom).
5. **Capturing**: Capture full browser tab content without operating system taskbars or browser bookmarks bars. Save images in high-quality PNG format.

---

## 📸 Required Screenshots Checklist

### Figure 7.1: Landing Page
- **Route**: `/` (Public)
- **Role / Account**: Unauthenticated (Guest visitor)
- **Data State**: Hero section displaying "Where Campus Ideas Turn into Reality", feature grid, live stats, and Navbar buttons.
- **Hide**: Any browser extension icons.
- **Caption**: `Figure 7.1: Landing Page`

### Figure 7.2: Login Page
- **Route**: `/login`
- **Role / Account**: Unauthenticated
- **Data State**: Clean login form displaying Email and Password fields, "Sign In" button, and link to Register.
- **Hide**: Password auto-fill popups or credentials.
- **Caption**: `Figure 7.2: Login Page`

### Figure 7.3: Student Registration Page
- **Route**: `/register`
- **Role / Account**: Unauthenticated
- **Data State**: Student registration form with Full Name, Email, Password, Skills, Bio, and Social links.
- **Hide**: Sensitive credentials.
- **Caption**: `Figure 7.3: Student Registration Page`

### Figure 7.4: Student Dashboard
- **Route**: `/dashboard`
- **Role / Account**: Student (`aravind.sharma@university.edu`)
- **Data State**: Welcome banner, active projects summary cards, user profile overview, and recent activity.
- **Caption**: `Figure 7.4: Student Dashboard`

### Figure 7.5: Project Discovery & Search Page
- **Route**: `/projects`
- **Role / Account**: Student
- **Data State**: Search bar with query (e.g., "AI", "React"), category and difficulty filters, paginated project cards displaying required skills and member count badges.
- **Caption**: `Figure 7.5: Project Discovery & Search Page`

### Figure 7.6: Project Details View
- **Route**: `/projects/:id`
- **Role / Account**: Student (Non-owner viewer)
- **Data State**: Project title, description, owner details, team size progress bar, required skills tags, and "Apply to Join" button.
- **Caption**: `Figure 7.6: Project Details View`

### Figure 7.7: Create Project Form
- **Route**: `/projects/new`
- **Role / Account**: Student
- **Data State**: Project creation form filled with Title, Category, Required Skills, Team Size, Deadline, and Difficulty fields.
- **Caption**: `Figure 7.7: Create Project Form`

### Figure 7.8: Collaboration Requests Management
- **Route**: `/workspace/:id` (Requests tab)
- **Role / Account**: Project Owner (`aravind.sharma@university.edu`)
- **Data State**: List of pending collaboration requests showing applicant student profiles, message notes, and "Accept" / "Reject" action buttons.
- **Caption**: `Figure 7.8: Collaboration Requests Management`

### Figure 7.9: Team Workspace & Roster View
- **Route**: `/workspace/:id` (Team tab)
- **Role / Account**: Project Team Member
- **Data State**: Project workspace banner, team roster showing project owner and accepted member cards with their skills.
- **Caption**: `Figure 7.9: Team Workspace & Roster View`

### Figure 7.10: Task Management Board
- **Route**: `/workspace/:id` (Tasks tab)
- **Role / Account**: Project Team Member
- **Data State**: Task list filtered by status (`TODO`, `IN_PROGRESS`, `COMPLETED`), task creation form modal, assignee avatars, and status update controls.
- **Caption**: `Figure 7.10: Task Management Board`

### Figure 7.11: Real-Time Project Workspace Chat
- **Route**: `/workspace/:id` (Chat tab)
- **Role / Account**: Project Team Member
- **Data State**: Real-time persistent chat history window displaying message bubbles from different team members and the message composer input bar.
- **Caption**: `Figure 7.11: Real-Time Project Workspace Chat`

### Figure 7.12: Showcase Gallery & Social Feed
- **Route**: `/showcases`
- **Role / Account**: Authenticated Student / Guest
- **Data State**: Public showcase cards grid displaying completed project titles, technology tags, screenshot thumbnails, like counts, and comment counters.
- **Caption**: `Figure 7.12: Showcase Gallery & Social Feed`

### Figure 7.13: Showcase Detail, Likes & Embedded Comments
- **Route**: `/showcases/:id`
- **Role / Account**: Authenticated Student (`priya.patel@university.edu`)
- **Data State**: Full showcase view with project description, external GitHub/demo links, active Like toggle button, and embedded comments thread with comment composer.
- **Caption**: `Figure 7.13: Showcase Detail, Likes & Embedded Comments`

### Figure 7.14: Admin Dashboard & Platform Overview
- **Route**: `/admin` (Overview tab)
- **Role / Account**: Administrator (`admin@university.edu`)
- **Data State**: Admin control panel showing metric cards for Total Users, Active Projects, Showcases, and Content Reports.
- **Caption**: `Figure 7.14: Admin Dashboard & Platform Overview`

### Figure 7.15: User Management & Suspension Modal
- **Route**: `/admin` (Users tab)
- **Role / Account**: Administrator (`admin@university.edu`)
- **Data State**: User management table with search filter, status badges (`active` / `suspended`), and account status action toggles.
- **Caption**: `Figure 7.15: User Management & Suspension Modal`

### Figure 7.16: Project Moderation & Content Reports Management
- **Route**: `/admin` (Projects & Reports tabs)
- **Role / Account**: Administrator (`admin@university.edu`)
- **Data State**: Content reports moderation table showing reported target items, reporter identity, reason notes, and Resolve / Dismiss status action buttons.
- **Caption**: `Figure 7.16: Project Moderation & Content Reports Management`
