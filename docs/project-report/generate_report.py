import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

from report_helpers import (
    set_cell_border, set_table_borders, set_cell_background,
    add_caption_above_table, add_caption_below_figure,
    add_figure_container, add_code_listing,
    add_heading_1, add_heading_2, add_heading_3,
    add_body_paragraph, add_bullet_point
)

def build_document():
    doc = Document()
    
    # 1. Page Setup: A4, 1-inch margins
    section = doc.sections[0]
    section.page_width = Inches(8.27)   # A4 Width
    section.page_height = Inches(11.69) # A4 Height
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    
    # Footer Page Numbering Setup
    section.different_first_page_header_footer = True
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    f_run = f_p.add_run()
    f_run.font.name = 'Times New Roman'
    f_run.font.size = Pt(10)
    
    # Page field XML
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    f_p._p.append(fldSimple)

    diagrams_dir = os.path.join("docs", "project-report", "diagrams")

    print("Building Cover Page...")
    # ---------------------------------------------------------
    # COVER PAGE (Unnumbered)
    # ---------------------------------------------------------
    p_cov_dept = doc.add_paragraph()
    p_cov_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_dept.paragraph_format.space_before = Pt(36)
    p_cov_dept.paragraph_format.space_after = Pt(4)
    r = p_cov_dept.add_run("Department of Computer Engineering\nFaculty of Technology\nDharmsinh Desai University, Nadiad")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    
    p_cov_sem = doc.add_paragraph()
    p_cov_sem.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_sem.paragraph_format.space_before = Pt(48)
    p_cov_sem.paragraph_format.space_after = Pt(4)
    r = p_cov_sem.add_run("[ENTER DEGREE & SEMESTER]\nSubject: [ENTER SUBJECT CODE & NAME]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True

    p_cov_rep = doc.add_paragraph()
    p_cov_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_rep.paragraph_format.space_before = Pt(48)
    p_cov_rep.paragraph_format.space_after = Pt(6)
    r = p_cov_rep.add_run("Project Report\n\nProject Title:")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    
    p_cov_title = doc.add_paragraph()
    p_cov_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_title.paragraph_format.space_before = Pt(6)
    p_cov_title.paragraph_format.space_after = Pt(48)
    r = p_cov_title.add_run("CollabSphere – Student Project Collaboration Platform")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    
    p_cov_by = doc.add_paragraph()
    p_cov_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_by.paragraph_format.space_before = Pt(24)
    p_cov_by.paragraph_format.space_after = Pt(36)
    r = p_cov_by.add_run("By:\n\n[ENTER STUDENT NAME 1]\nRoll No.: [ENTER ROLL NO 1]\nStudent ID: [ENTER STUDENT ID 1]\n\n[ENTER STUDENT NAME 2]\nRoll No.: [ENTER ROLL NO 2]\nStudent ID: [ENTER STUDENT ID 2]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p_cov_guide = doc.add_paragraph()
    p_cov_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cov_guide.paragraph_format.space_before = Pt(24)
    p_cov_guide.paragraph_format.space_after = Pt(0)
    r = p_cov_guide.add_run("Guided by:\n\n[ENTER GUIDE NAME]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    # ---------------------------------------------------------
    # CERTIFICATE PAGE
    # ---------------------------------------------------------
    doc.add_page_break()
    print("Building Certificate Page...")
    
    p_cert_head = doc.add_paragraph()
    p_cert_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_head.paragraph_format.space_before = Pt(24)
    p_cert_head.paragraph_format.space_after = Pt(12)
    r = p_cert_head.add_run("CERTIFICATE")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    p_cert_dept = doc.add_paragraph()
    p_cert_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_dept.paragraph_format.space_before = Pt(0)
    p_cert_dept.paragraph_format.space_after = Pt(24)
    r = p_cert_dept.add_run("Department of Computer Engineering\nFaculty of Technology\nDharmsinh Desai University, Nadiad")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True

    p_cert_body = doc.add_paragraph()
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_body.paragraph_format.space_before = Pt(12)
    p_cert_body.paragraph_format.space_after = Pt(18)
    p_cert_body.paragraph_format.line_spacing = 1.5
    r = p_cert_body.add_run(
        "This is to certify that the project report entitled “CollabSphere – Student Project Collaboration Platform” "
        "is a bonafide record of the work carried out by [ENTER STUDENT NAME 1] (Roll No.: [ENTER ROLL NO 1], Student ID: [ENTER STUDENT ID 1]) "
        "and [ENTER STUDENT NAME 2] (Roll No.: [ENTER ROLL NO 2], Student ID: [ENTER STUDENT ID 2]) in partial fulfilment of the requirements "
        "of the subject [ENTER SUBJECT CODE & NAME] of [ENTER DEGREE & SEMESTER], Department of Computer Engineering, Faculty of Technology, "
        "Dharmsinh Desai University, Nadiad.\n\n"
        "The work was carried out under the guidance of [ENTER GUIDE NAME] during the academic term [ENTER ACADEMIC YEAR]."
    )
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)

    p_cert_sig = doc.add_paragraph()
    p_cert_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_cert_sig.paragraph_format.space_before = Pt(72)
    p_cert_sig.paragraph_format.space_after = Pt(0)
    r = p_cert_sig.add_run("______________________\nGuide\n[ENTER GUIDE NAME]")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)

    # ---------------------------------------------------------
    # TABLE OF CONTENTS PAGE
    # ---------------------------------------------------------
    doc.add_page_break()
    print("Building Table of Contents...")
    
    p_toc_head = doc.add_paragraph()
    p_toc_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_head.paragraph_format.space_before = Pt(12)
    p_toc_head.paragraph_format.space_after = Pt(18)
    r = p_toc_head.add_run("TABLE OF CONTENTS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    toc_items = [
        ("1. Abstract", "1"),
        ("2. Introduction", "2"),
        ("    2.1 Project Overview", "2"),
        ("    2.2 Problem Statement", "2"),
        ("    2.3 Objectives", "2"),
        ("    2.4 Technology / Platform / Tools", "3"),
        ("3. Functional and Non-functional Requirements", "4"),
        ("    3.1 Functional Requirements", "4"),
        ("        R.1: User Management", "4"),
        ("        R.2: Project Discovery and Management", "5"),
        ("        R.3: Collaboration Requests and Team Membership", "6"),
        ("        R.4: Task Management", "7"),
        ("        R.5: Real-Time Messaging", "8"),
        ("        R.6: Showcase & Social Interactions", "8"),
        ("        R.7: Administration & Content Moderation", "9"),
        ("    3.2 Non-functional Requirements", "10"),
        ("        3.2.1 Security", "10"),
        ("        3.2.2 Performance", "10"),
        ("        3.2.3 Usability", "11"),
        ("        3.2.4 Reliability", "11"),
        ("        3.2.5 Maintainability", "11"),
        ("        3.2.6 Scalability", "12"),
        ("4. UML Diagrams and Database Design", "13"),
        ("    4.1 Use Case Diagram", "13"),
        ("    4.2 Class Diagram", "14"),
        ("    4.3 Activity Diagram – Project Collaboration Workflow", "17"),
        ("    4.4 Activity Diagram – Task Management & Showcase Workflow", "18"),
        ("    4.5 Sequence Diagram – Collaboration Request Workflow", "19"),
        ("    4.6 Sequence Diagram – Real-Time Messaging Workflow", "20"),
        ("    4.7 Database Design", "21"),
        ("5. Implementation Detail", "25"),
        ("    5.1 Authentication and User Management", "25"),
        ("    5.2 Project Discovery and Management", "25"),
        ("    5.3 Collaboration Requests and Team Workspace", "26"),
        ("    5.4 Task Management", "26"),
        ("    5.5 Real-Time Messaging", "27"),
        ("    5.6 Showcase and Social Features", "27"),
        ("    5.7 Administration and Content Moderation", "28"),
        ("    5.8 Frontend Architecture", "28"),
        ("    5.9 Backend Architecture", "29"),
        ("    5.10 Backend Organisation", "30"),
        ("    5.11 Database Implementation", "31"),
        ("    5.12 Algorithms and Flowcharts", "31"),
        ("        A. Collaboration Request Processing", "31"),
        ("        B. Task Status Transition", "32"),
        ("        C. Real-Time Message Processing", "33"),
        ("        D. Role-Based Access Control", "34"),
        ("6. Testing", "35"),
        ("    6.1 Testing Approach", "35"),
        ("    6.2 Test Cases", "35"),
        ("7. Screen-shots", "38"),
        ("8. Conclusion", "43"),
        ("9. Limitation and Future Extension", "44"),
        ("    9.1 Current Limitations", "44"),
        ("    9.2 Future Extensions", "44"),
        ("10. Bibliography", "45")
    ]

    for title, pg in toc_items:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.space_before = Pt(1)
        p_toc.paragraph_format.space_after = Pt(2)
        p_toc.paragraph_format.line_spacing = 1.15
        
        dots_count = max(5, 75 - len(title) - len(pg))
        dots = " ." * (dots_count // 2)
        
        run_t = p_toc.add_run(title)
        run_t.font.name = 'Times New Roman'
        run_t.font.size = Pt(11)
        if not title.startswith("    "):
            run_t.font.bold = True
            
        run_d = p_toc.add_run(f" {dots} {pg}")
        run_d.font.name = 'Times New Roman'
        run_d.font.size = Pt(11)

    # ---------------------------------------------------------
    # SECTION 1 — ABSTRACT (Printed Page 1 starts here)
    # ---------------------------------------------------------
    add_heading_1(doc, "1. Abstract", page_break=True)
    print("Building Section 1 — Abstract...")
    
    add_body_paragraph(
        doc,
        "CollabSphere – Student Project Collaboration Platform is a full-stack web application engineered using the MERN stack "
        "(MongoDB, Express.js, React.js, and Node.js) to resolve the fragmentation and inefficiency surrounding student project recruitment, "
        "team workspace management, real-time messaging, completed-project showcases, and administrative moderation in academic environments. "
        "The platform bridges the gap between students seeking skilled collaborators and project owners searching for motivated team members by "
        "providing a centralized, secure web interface."
    )
    add_body_paragraph(
        doc,
        "Registered students can construct comprehensive profiles detailing their technical skillsets and social portfolios, post new project ideas, "
        "and discover active projects using multi-attribute search filtering. A structured collaboration request lifecycle governs team formation: "
        "interested students submit requests that project owners can review and accept or reject. Upon acceptance, the system automatically synchronizes "
        "the student into the project's official member roster while strictly enforcing predefined team capacity constraints."
    )
    add_body_paragraph(
        doc,
        "Inside the private team workspace, members manage project tasks through a controlled task state machine and communicate instantly via a "
        "Socket.IO real-time chat service integrated with persistent REST message history storage. Once a project reaches completion, project owners "
        "can publish a public Showcase featuring technology tags, live demo URLs, and screenshot galleries. The broader student community can engage "
        "with published showcases through idempotent liking and embedded comment threads."
    )
    add_body_paragraph(
        doc,
        "System security and access control are maintained via JSON Web Token (JWT) authentication and role-based authorization for two distinct roles: "
        "Student and Administrator. Administrators monitor platform activity through a dedicated metrics dashboard, enforce content safety by reviewing "
        "user reports, moderate projects with ordered cascade deletion, and manage account statuses. The backend delivers a RESTful API compliant with a "
        "standard JSON response envelope, while the React frontend utilizes Vite and Tailwind CSS for optimal client-side performance."
    )
    
    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(12)
    p_kw.paragraph_format.space_after = Pt(12)
    r_kw_title = p_kw.add_run("Keywords: ")
    r_kw_title.font.name = 'Times New Roman'
    r_kw_title.font.size = Pt(11)
    r_kw_title.font.bold = True
    r_kw_val = p_kw.add_run("Student collaboration, MERN stack, real-time messaging, Socket.IO, role-based access control, REST API, project showcases.")
    r_kw_val.font.name = 'Times New Roman'
    r_kw_val.font.size = Pt(11)

    # ---------------------------------------------------------
    # SECTION 2 — INTRODUCTION
    # ---------------------------------------------------------
    add_heading_1(doc, "2. Introduction", page_break=True)
    print("Building Section 2 — Introduction...")
    
    add_heading_2(doc, "2.1 Project Overview")
    add_body_paragraph(
        doc,
        "CollabSphere is a university collaboration platform built to streamline academic and independent student project workflows. "
        "The system accommodates two primary user roles: Student and Administrator. Students post project ideas, search for open projects by skill, "
        "send collaboration requests, manage project tasks, chat in real-time with team members, and publish showcase portfolios. Administrators "
        "oversee system integrity by reviewing statistics, managing user accounts, deleting inappropriate projects, and processing user reports."
    )
    add_body_paragraph(
        doc,
        "The software architecture follows a decoupled client-server pattern. A modern React.js frontend built with Vite and styled with Tailwind CSS "
        "interacts with a Node.js and Express.js REST API server. Data persistence is managed by MongoDB using Mongoose object modeling, while real-time "
        "workspace chat relies on WebSocket connections managed by Socket.IO."
    )

    add_heading_2(doc, "2.2 Problem Statement")
    add_body_paragraph(
        doc,
        "In university environments, student collaboration often suffers from decentralized communication channels, informal team formation, and a lack of visibility "
        "for completed projects. Without a dedicated collaboration platform, several specific difficulties arise:"
    )
    add_bullet_point(doc, "Students face difficulty finding teammates with specific technical skills across different departments.")
    add_bullet_point(doc, "Project owners lack a structured mechanism to review applicant profiles and manage team capacity.")
    add_bullet_point(doc, "Team task tracking and workspace communication are fragmented across third-party social messaging apps.")
    add_bullet_point(doc, "Completed student projects are rarely documented publicly, leading to duplicated efforts and lost portfolio opportunities.")
    add_bullet_point(doc, "Platform administrators lack centralized oversight to moderate inappropriate content or resolve user misconduct.")

    add_heading_2(doc, "2.3 Objectives")
    add_body_paragraph(doc, "The main objectives of the CollabSphere platform are as follows:")
    add_bullet_point(doc, "To provide a centralized discovery portal where students can search and filter open projects by skill, category, and difficulty.")
    add_bullet_point(doc, "To establish a structured collaboration request workflow with automated team membership synchronization and capacity limits.")
    add_bullet_point(doc, "To equip project teams with a private workspace containing task management boards and real-time Socket.IO chat.")
    add_bullet_point(doc, "To enable students to publish completed projects as public Showcases with social interaction capabilities (likes and comments).")
    add_bullet_point(doc, "To deliver an administrative control panel for reviewing platform statistics, managing user statuses, and moderating content.")
    add_bullet_point(doc, "To enforce robust JWT authentication, bcrypt password hashing, and role-based authorization across all backend routes.")

    add_heading_2(doc, "2.4 Technology / Platform / Tools")
    add_body_paragraph(doc, "Table 2.1 lists the technology stack utilized in the implementation of CollabSphere.")
    
    add_caption_above_table(doc, "Table 2.1: Technologies Used")
    tbl_2_1 = doc.add_table(rows=6, cols=3)
    tbl_2_1.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Layer", "Technology", "Purpose"]
    data = [
        ["Frontend", "React.js, Vite, Tailwind CSS", "Component-based user interface, rapid bundling, and modern styling."],
        ["Backend", "Node.js, Express.js", "Server runtime and RESTful web API framework."],
        ["Database", "MongoDB, Mongoose", "NoSQL document store and object data modeling."],
        ["Real-Time Messaging", "Socket.IO", "WebSocket-based bidirectional real-time workspace communication."],
        ["Security & Auth", "JWT, bcryptjs", "Token-based stateless authentication and password hashing."]
    ]
    for i, h in enumerate(headers):
        cell = tbl_2_1.cell(0, i)
        cell.paragraphs[0].text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
        set_cell_background(cell, "FAF8F5")
    for r_idx, row in enumerate(data):
        for c_idx, val in enumerate(row):
            cell = tbl_2_1.cell(r_idx + 1, c_idx)
            cell.paragraphs[0].text = val
            cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
            cell.paragraphs[0].runs[0].font.size = Pt(11)
    set_table_borders(tbl_2_1)

    # ---------------------------------------------------------
    # SECTION 3 — FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS
    # ---------------------------------------------------------
    add_heading_1(doc, "3. Functional and Non-functional Requirements", page_break=True)
    print("Building Section 3 — Requirements...")
    
    add_heading_2(doc, "3.1 Functional Requirements")
    add_body_paragraph(
        doc,
        "The functional requirements of CollabSphere are organized into seven core modules (R.1 to R.7). "
        "The application enforces role-based permissions for two primary user roles: Student and Administrator. "
        "Table 3.1 details the operations permitted for each role."
    )
    
    add_caption_above_table(doc, "Table 3.1: Role-wise Permitted Operations")
    tbl_3_1 = doc.add_table(rows=13, cols=3)
    tbl_3_1.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_3_1 = ["Operation", "Student", "Administrator"]
    ops_data = [
        ["Public Registration & Login", "Yes", "Yes"],
        ["Profile & Skill Management", "Yes", "Yes"],
        ["Create & Edit Projects", "Yes", "No"],
        ["Search & Filter Projects", "Yes", "Yes"],
        ["Submit Collaboration Request", "Yes", "No"],
        ["Accept/Reject Join Requests", "Yes (Owner only)", "No"],
        ["Create & Manage Tasks", "Yes (Team member)", "No"],
        ["Real-Time Workspace Chat", "Yes (Team member)", "No"],
        ["Publish Project Showcase", "Yes (Owner only)", "No"],
        ["Like & Comment on Showcases", "Yes", "Yes"],
        ["File Content Report", "Yes", "Yes"],
        ["Platform Statistics & Moderation", "No", "Yes"]
    ]
    for i, h in enumerate(headers_3_1):
        cell = tbl_3_1.cell(0, i)
        cell.paragraphs[0].text = h
        cell.paragraphs[0].runs[0].font.bold = True
        cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
        set_cell_background(cell, "FAF8F5")
    for r_idx, row in enumerate(ops_data):
        for c_idx, val in enumerate(row):
            cell = tbl_3_1.cell(r_idx + 1, c_idx)
            cell.paragraphs[0].text = val
            cell.paragraphs[0].runs[0].font.name = 'Times New Roman'
            cell.paragraphs[0].runs[0].font.size = Pt(10.5)
    set_table_borders(tbl_3_1)

    # R.1 to R.7 Modules
    modules = [
        ("R.1: User Management", [
            ("R.1.1: Register User", "Allows new students to create an account by providing name, email, password, and optional profile details. Validates email format and unique constraints.", "Name, Email, Password", "JWT Token, Formatted User Object"),
            ("R.1.2: Login User", "Authenticates registered students and administrators using email and password. Generates a signed JWT upon successful validation.", "Email, Password", "JWT Token, Formatted User Object"),
            ("R.1.3: Manage User Profile", "Allows authenticated users to update profile details (name, bio, skills, portfolio links, avatar). Protects email, password, and role from unauthorized mutation.", "Allowlisted Profile Fields", "Updated Profile Data"),
            ("R.1.4: Role-Based Access Control", "Enforces endpoint authorization based on user role (student vs admin) and resource ownership.", "JWT Header, Target Resource", "Authorized Execution or 401/403 Error")
        ]),
        ("R.2: Project Discovery and Management", [
            ("R.2.1: Create Project", "Enables students to post project proposals specifying title, description, category, required skills, team size, deadline, and difficulty.", "Project Attributes", "Created Project Document"),
            ("R.2.2: Search and Filter Projects", "Provides multi-attribute search across title and description, combined with category, difficulty, status, and skill filters.", "Search Keywords, Filter Parameters", "Paginated Project Results"),
            ("R.2.3: Project Lifecycle Management", "Enforces forward-only status transitions (OPEN -> IN_PROGRESS -> COMPLETED) restricted to the project owner.", "Target Status", "Updated Project Status"),
            ("R.2.4: Project Bookmarking", "Allows students to add or remove projects from their personal bookmarks list using idempotent operations.", "Project ID", "Updated Bookmark State")
        ]),
        ("R.3: Collaboration Requests and Team Workspace", [
            ("R.3.1: Submit Collaboration Request", "Allows students to apply for open projects. Enforces rules: project must be OPEN, sender cannot be owner or member, no duplicate pending request.", "Project ID, Message Note", "Pending Request Document"),
            ("R.3.2: Review & Decide Requests", "Allows project owners to accept or reject pending requests. Accepting checks team capacity and syncs the sender into memberIds.", "Request ID, Decision (ACCEPTED/REJECTED)", "Updated Request & Team Roster"),
            ("R.3.3: View Team Roster", "Displays the complete team roster (owner and accepted members) formatted as public user profiles.", "Project ID", "List of Member Profiles")
        ]),
        ("R.4: Task Management", [
            ("R.4.1: Task CRUD Operations", "Allows team members to create, view, update, and delete workspace tasks assigned to team members.", "Task Fields, Assignee ID", "Task Document"),
            ("R.4.2: Task Status Machine", "Enforces forward-only task transitions (TODO -> IN_PROGRESS -> COMPLETED) restricted to team members.", "Task ID, New Status", "Updated Task Status")
        ]),
        ("R.5: Real-Time Messaging", [
            ("R.5.1: Send & Store Chat Message", "Persists workspace chat messages via REST API while validating team membership.", "Project ID, Message Text", "Saved Message Document"),
            ("R.5.2: Real-Time Socket Broadcast", "Broadcasts new messages via Socket.IO room (project:<id>) to connected team members.", "Socket Event, Room ID", "Real-Time UI Update"),
            ("R.5.3: Chat History Retrieval", "Fetches paginated chat history for a project workspace in newest-first order.", "Project ID, Page Parameters", "Paginated Message List")
        ]),
        ("R.6: Showcase & Social Interactions", [
            ("R.6.1: Publish Showcase", "Allows project owners to publish completed projects as public showcases with tech tags and demo links.", "Showcase Payload", "Published Showcase Document"),
            ("R.6.2: Social Interactions (Likes & Comments)", "Supports idempotent likes and embedded comments on public showcases.", "Showcase ID, Like Toggle / Comment Text", "Updated Likes & Comments")
        ]),
        ("R.7: Administration & Content Moderation", [
            ("R.7.1: View System Statistics", "Provides administrators with platform metrics (users by role/status, projects by status, showcases, reports).", "Admin JWT", "Platform Statistics Object"),
            ("R.7.2: Account Moderation", "Allows admins to suspend or reactivate user accounts. Rejects self-suspension attempts.", "User ID, Target Status", "Updated User Status"),
            ("R.7.3: Project Moderation & Cascade Delete", "Allows admins to delete inappropriate projects with application-level cascade across tasks, messages, requests, and showcases.", "Project ID", "Deletion Confirmation"),
            ("R.7.4: Content Report Management", "Allows admins to review user reports and update their status to RESOLVED or DISMISSED.", "Report ID, Target Status", "Updated Report Status")
        ])
    ]

    for mod_title, reqs in modules:
        add_heading_3(doc, mod_title)
        for req_id, desc, inp, out in reqs:
            p_r = doc.add_paragraph()
            p_r.paragraph_format.space_before = Pt(4)
            p_r.paragraph_format.space_after = Pt(4)
            r = p_r.add_run(f"● {req_id}\n")
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11.5)
            r.font.bold = True
            
            p_d = doc.add_paragraph()
            p_d.paragraph_format.left_indent = Inches(0.2)
            p_d.paragraph_format.space_after = Pt(4)
            p_d.paragraph_format.line_spacing = 1.3
            r_d = p_d.add_run(f"Description: {desc}\nInput: {inp}\nOutput: {out}")
            r_d.font.name = 'Times New Roman'
            r_d.font.size = Pt(11)

    add_heading_2(doc, "3.2 Non-functional Requirements")
    nfr_sections = [
        ("3.2.1 Security", [
            "All protected backend API endpoints verify identity using JSON Web Tokens (JWT) passed in the Authorization header.",
            "User passwords are securely hashed before storage using bcryptjs with a cost factor of 10 salt rounds.",
            "Role-based access control (RBAC) middleware restricts administrative endpoints exclusively to admin accounts.",
            "Sensitive account attributes (password hashes, role escalation) are protected from user profile update payload injection.",
            "Suspended user accounts are immediately rejected at authentication and during active session checks."
        ]),
        ("3.2.2 Performance", [
            "Database queries utilize compound indexing on high-frequency query targets ({projectId, createdAt} and {status, createdAt}).",
            "API endpoints utilize page-based pagination (?page=1&limit=10) to cap maximum data transfer payloads.",
            "Vite frontend bundling achieves production asset chunking under 500 kB for minimal initial loading latency.",
            "Socket.IO real-time event broadcasting operates with minimal latency without redundant database write overhead."
        ]),
        ("3.2.3 Usability", [
            "The client application implements a clean, consistent design system based on predefined color tokens (#FAF8F5, #FF5A36).",
            "Role-specific navigation bars automatically adjust visible actions for Student and Administrator users.",
            "Clear visual badges indicate project lifecycle statuses (OPEN, IN_PROGRESS, COMPLETED) and request states.",
            "Responsive layout design ensures usability across desktop, tablet, and mobile viewport resolutions."
        ]),
        ("3.2.4 Reliability", [
            "Inputs across all REST endpoints are validated against strict schema constraints before persistence.",
            "The backend implements a centralized error handler enforcing a uniform JSON error envelope ({success: false, message}).",
            "State machine transitions (projects, tasks, requests) follow strict forward-only rules to prevent invalid states.",
            "Database startup requires successful connection before accepting incoming web traffic."
        ]),
        ("3.2.5 Maintainability", [
            "The backend follows a clean Model-View-Controller (MVC) architectural separation across models, controllers, and routes.",
            "Shared utility functions (user formatting, project formatting, pagination parsing) eliminate redundant code.",
            "The React frontend utilizes reusable UI components, custom hooks (useAuth, useSocket), and context providers.",
            "Comprehensive Jest unit and integration test suites cover critical business logic and authorization paths."
        ]),
        ("3.2.6 Scalability", [
            "Decoupled REST API and Socket.IO real-time servers allow independent vertical and horizontal scaling.",
            "Mongoose schema design separates independent domain entities into collections linked by ObjectIds.",
            "Embedded subdocuments (Showcase comments) optimize single-document fetch performance for portfolio views."
        ])
    ]

    for nfr_title, points in nfr_sections:
        add_heading_3(doc, nfr_title)
        for pt in points:
            add_bullet_point(doc, pt, symbol="•")

    # ---------------------------------------------------------
    # SECTION 4 — UML DIAGRAMS AND DATABASE DESIGN
    # ---------------------------------------------------------
    add_heading_1(doc, "4. UML Diagrams and Database Design", page_break=True)
    print("Building Section 4 — UML Diagrams...")
    
    add_heading_2(doc, "4.1 Use Case Diagram")
    add_body_paragraph(doc, "The CollabSphere system defines two primary actors: Student User and Administrator. Table 4.1 lists the use cases associated with each actor.")
    
    add_caption_above_table(doc, "Table 4.1: Actors and Use Cases")
    tbl_4_1 = doc.add_table(rows=3, cols=2)
    tbl_4_1.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_4_1.cell(0,0).paragraphs[0].text = "Actor"
    tbl_4_1.cell(0,1).paragraphs[0].text = "Use Cases"
    tbl_4_1.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_4_1.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_4_1.cell(0,0), "FAF8F5")
    set_cell_background(tbl_4_1.cell(0,1), "FAF8F5")
    
    tbl_4_1.cell(1,0).paragraphs[0].text = "Student User"
    tbl_4_1.cell(1,1).paragraphs[0].text = "Register/Login, Manage Profile, Create/Edit Projects, Search & Filter Projects, Bookmark Projects, Submit Collaboration Request, Decide Requests (Owner), Manage Workspace Tasks, Real-Time Chat, Publish Showcase, Like & Comment on Showcases, File Reports."
    tbl_4_1.cell(2,0).paragraphs[0].text = "Administrator"
    tbl_4_1.cell(2,1).paragraphs[0].text = "Login, View Platform Statistics, Manage User Statuses (Suspend/Reactivate), Moderate Projects (Cascade Delete), Review & Resolve Reports."
    set_table_borders(tbl_4_1)

    add_figure_container(doc, "Figure 4.1: Use Case Diagram of CollabSphere", "PlantUML Source: docs/project-report/diagrams/use_case_diagram.puml", os.path.join(diagrams_dir, "use_case_diagram.png"))

    add_heading_2(doc, "4.2 Class Diagram")
    add_body_paragraph(
        doc,
        "The core domain classes of CollabSphere are User, Project, CollaborationRequest, Task, Message, Showcase, Comment, and Report. "
        "User roles (student and admin) are represented via the role attribute on the User class. Table 4.2 describes the main classes, "
        "and Table 4.3 details entity relationships."
    )
    
    add_caption_above_table(doc, "Table 4.2: Main Classes")
    tbl_4_2 = doc.add_table(rows=8, cols=2)
    tbl_4_2.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_4_2.cell(0,0).paragraphs[0].text = "Class"
    tbl_4_2.cell(0,1).paragraphs[0].text = "Description"
    tbl_4_2.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_4_2.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_4_2.cell(0,0), "FAF8F5")
    set_cell_background(tbl_4_2.cell(0,1), "FAF8F5")
    
    class_descriptions = [
        ("User", "Represents registered user accounts, holding identity credentials, skill tags, profile bio, avatar, role, and account status."),
        ("Project", "Represents student project proposals, maintaining owner reference, member list, required skills, status, and bookmarks."),
        ("CollaborationRequest", "Represents join applications submitted by students to open projects, tracking status (PENDING/ACCEPTED/REJECTED)."),
        ("Task", "Represents project workspace tasks assigned to team members, managing status flow (TODO/IN_PROGRESS/COMPLETED)."),
        ("Message", "Stores persistent workspace chat history linked to a project and sender."),
        ("Showcase", "Represents published portfolio showcases for completed projects, maintaining tech tags, likes count, and embedded comments."),
        ("Report", "Represents content or misconduct flags submitted by users for administrative review.")
    ]
    for idx, (cls_name, cls_desc) in enumerate(class_descriptions):
        tbl_4_2.cell(idx+1, 0).paragraphs[0].text = cls_name
        tbl_4_2.cell(idx+1, 1).paragraphs[0].text = cls_desc
    set_table_borders(tbl_4_2)

    add_caption_above_table(doc, "Table 4.3: Relationships Between Classes")
    tbl_4_3 = doc.add_table(rows=9, cols=4)
    tbl_4_3.alignment = WD_TABLE_ALIGNMENT.CENTER
    h43 = ["Class", "Relationship", "Target Class", "Multiplicity"]
    for i, h in enumerate(h43):
        tbl_4_3.cell(0,i).paragraphs[0].text = h
        tbl_4_3.cell(0,i).paragraphs[0].runs[0].font.bold = True
        set_cell_background(tbl_4_3.cell(0,i), "FAF8F5")
        
    rel_data = [
        ["User", "owns", "Project", "1 to Many"],
        ["User", "memberOf", "Project", "Many to Many"],
        ["Project", "receives", "CollaborationRequest", "1 to Many"],
        ["Project", "contains", "Task", "1 to Many"],
        ["Project", "hasHistory", "Message", "1 to Many"],
        ["Project", "publishedAs", "Showcase", "1 to 1 (Unique)"],
        ["Showcase", "embeds", "Comment", "1 to Many"],
        ["User", "files", "Report", "1 to Many"]
    ]
    for r_idx, row in enumerate(rel_data):
        for c_idx, val in enumerate(row):
            tbl_4_3.cell(r_idx+1, c_idx).paragraphs[0].text = val
    set_table_borders(tbl_4_3)

    add_figure_container(doc, "Figure 4.2: Class Diagram of CollabSphere", "PlantUML Source: docs/project-report/diagrams/class_diagram.puml", os.path.join(diagrams_dir, "class_diagram.png"))

    add_heading_2(doc, "4.3 Activity Diagram – Project Collaboration Workflow")
    add_body_paragraph(doc, "Figure 4.3 illustrates the end-to-end activity flow of project discovery, collaboration request submission, owner decision, team membership synchronization, and capacity validation.")
    add_figure_container(doc, "Figure 4.3: Activity Diagram – Project Collaboration Workflow", "PlantUML Source: docs/project-report/diagrams/activity_collaboration.puml", os.path.join(diagrams_dir, "activity_collaboration.png"))

    add_heading_2(doc, "4.4 Activity Diagram – Task Management & Showcase Workflow")
    add_body_paragraph(doc, "Figure 4.4 details the workspace task lifecycle and the subsequent showcase publication workflow executed when a project finishes.")
    add_figure_container(doc, "Figure 4.4: Activity Diagram – Task Management & Showcase Workflow", "PlantUML Source: docs/project-report/diagrams/activity_task_showcase.puml", os.path.join(diagrams_dir, "activity_task_showcase.png"))

    add_heading_2(doc, "4.5 Sequence Diagram – Collaboration Request Workflow")
    add_body_paragraph(doc, "Figure 4.5 maps the sequence of interactions between the Applicant Student, React Frontend, Express API Controller, MongoDB Database, and Project Owner during join request processing.")
    add_figure_container(doc, "Figure 4.5: Sequence Diagram – Collaboration Request Workflow", "PlantUML Source: docs/project-report/diagrams/sequence_collaboration.puml", os.path.join(diagrams_dir, "sequence_collaboration.png"))

    add_heading_2(doc, "4.6 Sequence Diagram – Real-Time Messaging Workflow")
    add_body_paragraph(doc, "Figure 4.6 details the interaction sequence during REST message persistence and instant Socket.IO room event broadcasting to connected team members.")
    add_figure_container(doc, "Figure 4.6: Sequence Diagram – Real-Time Messaging Workflow", "PlantUML Source: docs/project-report/diagrams/sequence_messaging.puml", os.path.join(diagrams_dir, "sequence_messaging.png"))

    add_heading_2(doc, "4.7 Database Design")
    add_body_paragraph(doc, "CollabSphere utilizes MongoDB for document storage. Table 4.4 outlines the seven database collections, while Table 4.5 specifies collection relationships.")
    
    add_caption_above_table(doc, "Table 4.4: Main Collections")
    tbl_4_4 = doc.add_table(rows=8, cols=2)
    tbl_4_4.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_4_4.cell(0,0).paragraphs[0].text = "Collection"
    tbl_4_4.cell(0,1).paragraphs[0].text = "Purpose & Schema Highlights"
    tbl_4_4.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_4_4.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_4_4.cell(0,0), "FAF8F5")
    set_cell_background(tbl_4_4.cell(0,1), "FAF8F5")
    
    coll_data = [
        ["Users", "Stores student and admin user accounts, hashed passwords, profile skill arrays, role, and account status (active/suspended)."],
        ["Projects", "Stores project proposals, maintaining ownerId reference, memberIds array, status enum, team size limit, and bookmarkedBy array."],
        ["CollaborationRequests", "Stores join applications linking projectId and senderId, tracking request status (PENDING/ACCEPTED/REJECTED)."],
        ["Tasks", "Stores project workspace tasks assigned to team members, enforcing forward status transitions."],
        ["Messages", "Stores persistent chat messages linked to projectId and senderId, indexed on {projectId, createdAt}."],
        ["Showcases", "Stores published project portfolios with tech tags, likes array, and embedded comment subdocuments."],
        ["Reports", "Stores user-submitted flags targeting users, projects, showcases, or comments for administrative review."]
    ]
    for idx, (c_name, c_purpose) in enumerate(coll_data):
        tbl_4_4.cell(idx+1, 0).paragraphs[0].text = c_name
        tbl_4_4.cell(idx+1, 1).paragraphs[0].text = c_purpose
    set_table_borders(tbl_4_4)

    add_caption_above_table(doc, "Table 4.5: Database Relationships")
    tbl_4_5 = doc.add_table(rows=8, cols=2)
    tbl_4_5.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_4_5.cell(0,0).paragraphs[0].text = "Relationship"
    tbl_4_5.cell(0,1).paragraphs[0].text = "Description"
    tbl_4_5.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_4_5.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_4_5.cell(0,0), "FAF8F5")
    set_cell_background(tbl_4_5.cell(0,1), "FAF8F5")
    
    db_rel_data = [
        ["Users -> Projects", "One user owns multiple projects (ownerId); multiple users belong to a project (memberIds)."],
        ["Projects -> CollaborationRequests", "A project receives multiple collaboration requests from interested students."],
        ["Projects -> Tasks", "A project workspace contains multiple tasks assigned to current team members."],
        ["Projects -> Messages", "A project workspace stores multiple chat messages."],
        ["Projects -> Showcases", "A completed project publishes exactly one showcase (1:1 relationship enforced via unique index)."],
        ["Showcases -> Comments", "Comments are stored as an embedded subdocument array inside the Showcase document."],
        ["Users -> Reports", "A user can file multiple reports targeting platform content or misconduct."]
    ]
    for idx, (rel_name, rel_desc) in enumerate(db_rel_data):
        tbl_4_5.cell(idx+1, 0).paragraphs[0].text = rel_name
        tbl_4_5.cell(idx+1, 1).paragraphs[0].text = rel_desc
    set_table_borders(tbl_4_5)

    add_figure_container(doc, "Figure 4.7: ER / Database Design Diagram of CollabSphere", "PlantUML Source: docs/project-report/diagrams/er_database_diagram.puml", os.path.join(diagrams_dir, "er_database_diagram.png"))

    # ---------------------------------------------------------
    # SECTION 5 — IMPLEMENTATION DETAIL
    # ---------------------------------------------------------
    add_heading_1(doc, "5. Implementation Detail", page_break=True)
    print("Building Section 5 — Implementation Detail...")
    
    add_heading_2(doc, "5.1 Authentication and User Management")
    add_body_paragraph(
        doc,
        "Authentication is implemented in authController.js and enforced via authMiddleware.js. User registration validates email format "
        "and checks for duplicates before hashing the password using bcryptjs at 10 salt rounds. Upon successful authentication, a signed JWT "
        "token containing the user's ID and role is returned. The middleware verifies this token on protected routes and verifies account status."
    )

    add_heading_2(doc, "5.2 Project Discovery and Management")
    add_body_paragraph(
        doc,
        "Project CRUD operations are implemented in projectController.js. The listProjects handler supports multi-attribute filtering by search "
        "keyword, category, difficulty, status, and required skills, delivering paginated results using parsePagination and buildPagination helpers."
    )

    add_heading_2(doc, "5.3 Collaboration Requests and Team Workspace")
    add_body_paragraph(
        doc,
        "Collaboration request logic resides in requestController.js. Submitting a request enforces validation rules: the target project must be OPEN, "
        "the sender cannot be the project owner or an existing member, and duplicate pending requests are rejected (Error 409). When an owner accepts a request, "
        "the system checks team size capacity before adding the applicant to memberIds via Mongoose $addToSet."
    )

    add_heading_2(doc, "5.4 Task Management")
    add_body_paragraph(
        doc,
        "Task management is handled by taskController.js. All task CRUD actions require project team membership verified by the shared isTeamMember helper. "
        "Tasks enforce forward-only status transitions (TODO -> IN_PROGRESS -> COMPLETED) and ensure task assignees belong to the project team."
    )

    add_heading_2(doc, "5.5 Real-Time Messaging")
    add_body_paragraph(
        doc,
        "Workspace chat is managed by messageController.js and socket/index.js. Messages sent via REST are persisted to MongoDB and immediately "
        "broadcast via Socket.IO to the room project:<id>. Socket connections authenticate via JWT handshake, and room joins re-verify team membership."
    )

    add_heading_2(doc, "5.6 Showcase and Social Features")
    add_body_paragraph(
        doc,
        "Showcase functionality is implemented in showcaseController.js. Publishing requires project ownership and COMPLETED status, enforced via a unique "
        "projectId index. Public showcase feeds support idempotent liking ($addToSet/$pull) and embedded comment creation."
    )

    add_heading_2(doc, "5.7 Administration and Content Moderation")
    add_body_paragraph(
        doc,
        "Administrative operations are located in adminController.js and protected by adminMiddleware.js. Admins can view platform statistics, suspend or "
        "reactivate user accounts, resolve/dismiss content reports, and delete projects using an ordered application-level cascade (Tasks -> Messages -> Requests -> Showcase -> Project)."
    )

    add_heading_2(doc, "5.8 Frontend Architecture")
    add_body_paragraph(
        doc,
        "The frontend is built with React.js, Vite, and Tailwind CSS. Client routing is managed by React Router DOM with ProtectedRoute and AdminRoute guards. "
        "State management relies on AuthContext for authentication and SocketContext for WebSocket connectivity."
    )

    add_heading_2(doc, "5.9 Backend Architecture")
    add_body_paragraph(
        doc,
        "The backend follows a layered REST API architecture implemented with Node.js and Express.js. Data access is handled by Mongoose communicating with MongoDB. "
        "Figure 5.1 depicts the system layers."
    )
    add_figure_container(doc, "Figure 5.1: Layered Architecture of CollabSphere", "Layers: React Frontend -> REST API -> Express.js / Node.js -> Mongoose -> MongoDB")

    add_heading_2(doc, "5.10 Backend Organisation")
    add_body_paragraph(doc, "The backend source code follows an MVC organization, detailed in Table 5.1. Listing 5.1 presents the role authorization middleware implementation.")
    
    add_caption_above_table(doc, "Table 5.1: Backend Organisation")
    tbl_5_1 = doc.add_table(rows=6, cols=2)
    tbl_5_1.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_5_1.cell(0,0).paragraphs[0].text = "Component"
    tbl_5_1.cell(0,1).paragraphs[0].text = "Responsibility & Module Paths"
    tbl_5_1.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_5_1.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_5_1.cell(0,0), "FAF8F5")
    set_cell_background(tbl_5_1.cell(0,1), "FAF8F5")
    
    b_org = [
        ["Models", "Mongoose schemas defining domain data validation (User.js, Project.js, Task.js, Message.js, Showcase.js, Report.js, CollaborationRequest.js)."],
        ["Controllers", "Business logic handlers enforcing domain rules and status state machines (authController, projectController, taskController, etc.)."],
        ["Routes", "Express route definitions mapping API endpoints to controllers (authRoutes, projectRoutes, adminRoutes, etc.)."],
        ["Middleware", "JWT verification (authMiddleware), admin checking (adminMiddleware), and centralized error handling (errorHandler)."],
        ["Socket Handlers", "Socket.IO server initialization, JWT handshake auth, and room join management (socket/index.js)."]
    ]
    for idx, (c_n, c_r) in enumerate(b_org):
        tbl_5_1.cell(idx+1, 0).paragraphs[0].text = c_n
        tbl_5_1.cell(idx+1, 1).paragraphs[0].text = c_r
    set_table_borders(tbl_5_1)

    code_snippet = (
        "// backend/middleware/authMiddleware.js\n"
        "const adminMiddleware = (req, res, next) => {\n"
        "  if (!req.user || req.user.role !== 'admin') {\n"
        "    return res.status(403).json({\n"
        "      success: false,\n"
        "      message: 'Access denied — administrator privileges required'\n"
        "    });\n"
        "  }\n"
        "  next();\n"
        "};"
    )
    add_code_listing(doc, code_snippet, "Listing 5.1: Simplified Role-based Authorization Middleware")

    add_heading_2(doc, "5.11 Database Implementation")
    add_body_paragraph(
        doc,
        "Database collections are implemented using Mongoose schemas with strict type validation, default values, and index definitions. "
        "Unique indexes are defined on Users.email and Showcases.projectId. Compound indexes accelerate paginated query paths."
    )

    add_heading_2(doc, "5.12 Algorithms and Flowcharts")
    
    # Alg A
    add_heading_3(doc, "A. Collaboration Request Processing")
    add_body_paragraph(doc, "Input: Request submission payload (projectId, message).")
    add_body_paragraph(doc, "Process Steps:")
    add_bullet_point(doc, "1. Retrieve target Project document from MongoDB database.", symbol="1.")
    add_bullet_point(doc, "2. Verify Project status is OPEN; otherwise return Error 400.", symbol="2.")
    add_bullet_point(doc, "3. Verify sender is neither project owner nor current member; otherwise return Error 400.", symbol="3.")
    add_bullet_point(doc, "4. Query existing CollaborationRequest documents for pending request; if found return Error 409.", symbol="4.")
    add_bullet_point(doc, "5. Create and save CollaborationRequest document with status PENDING.", symbol="5.")
    add_bullet_point(doc, "6. When owner decides ACCEPTED, verify teamSize capacity limit.", symbol="6.")
    add_bullet_point(doc, "7. Update request status to ACCEPTED and add sender to Project.memberIds via $addToSet.", symbol="7.")
    add_bullet_point(doc, "8. Return HTTP 200 OK with updated request data.", symbol="8.")
    add_figure_container(doc, "Figure 5.2: Flowchart – Collaboration Request Processing", "PlantUML Source: docs/project-report/diagrams/flowchart_collaboration_request.puml", os.path.join(diagrams_dir, "flowchart_collaboration_request.png"))

    # Alg B
    add_heading_3(doc, "B. Task Status Transition")
    add_body_paragraph(doc, "Input: Task update request (taskId, newStatus).")
    add_body_paragraph(doc, "Process Steps:")
    add_bullet_point(doc, "1. Fetch Task document and parent Project document.", symbol="1.")
    add_bullet_point(doc, "2. Verify caller is project owner or member; otherwise return Error 403.", symbol="2.")
    add_bullet_point(doc, "3. Check requested status against forward-only state machine (TODO -> IN_PROGRESS -> COMPLETED).", symbol="3.")
    add_bullet_point(doc, "4. If transition is invalid (backward or skipped), return Error 400.", symbol="4.")
    add_bullet_point(doc, "5. Update Task status in database.", symbol="5.")
    add_bullet_point(doc, "6. Return HTTP 200 OK with updated task data.", symbol="6.")
    add_figure_container(doc, "Figure 5.3: Flowchart – Task Status Transition", "PlantUML Source: docs/project-report/diagrams/flowchart_task_transition.puml", os.path.join(diagrams_dir, "flowchart_task_transition.png"))

    # Alg C
    add_heading_3(doc, "C. Real-Time Message Processing")
    add_body_paragraph(doc, "Input: Incoming REST message payload (projectId, message text).")
    add_body_paragraph(doc, "Process Steps:")
    add_bullet_point(doc, "1. Verify caller JWT token and project team membership.", symbol="1.")
    add_bullet_point(doc, "2. Persist Message document to MongoDB Messages collection.", symbol="2.")
    add_bullet_point(doc, "3. Obtain active Socket.IO server instance via getIo().", symbol="3.")
    add_bullet_point(doc, "4. Emit message:new event to room project:<id>.", symbol="4.")
    add_bullet_point(doc, "5. Connected client sockets in room update chat UI immediately.", symbol="5.")
    add_bullet_point(doc, "6. Return HTTP 201 Created to REST caller.", symbol="6.")
    add_figure_container(doc, "Figure 5.4: Flowchart – Real-Time Message Processing", "PlantUML Source: docs/project-report/diagrams/flowchart_message_broadcast.puml", os.path.join(diagrams_dir, "flowchart_message_broadcast.png"))

    # Alg D
    add_heading_3(doc, "D. Role-Based Access Control")
    add_body_paragraph(doc, "Input: Incoming HTTP request to protected route.")
    add_body_paragraph(doc, "Process Steps:")
    add_bullet_point(doc, "1. Extract Bearer JWT token from Authorization header.", symbol="1.")
    add_bullet_point(doc, "2. Verify JWT signature; if invalid or expired return Error 401.", symbol="2.")
    add_bullet_point(doc, "3. Fetch user account status from database; if suspended return Error 401.", symbol="3.")
    add_bullet_point(doc, "4. Attach user payload {userId, role} to request object.", symbol="4.")
    add_bullet_point(doc, "5. If route requires admin role, verify req.user.role === 'admin'.", symbol="5.")
    add_bullet_point(doc, "6. If authorization fails, return Error 403 Forbidden.", symbol="6.")
    add_bullet_point(doc, "7. Proceed to target controller handler.", symbol="7.")
    add_figure_container(doc, "Figure 5.5: Flowchart – Role-Based Access Control", "PlantUML Source: docs/project-report/diagrams/flowchart_role_access.puml", os.path.join(diagrams_dir, "flowchart_role_access.png"))

    # ---------------------------------------------------------
    # SECTION 6 — TESTING
    # ---------------------------------------------------------
    add_heading_1(doc, "6. Testing", page_break=True)
    print("Building Section 6 — Testing...")
    
    add_heading_2(doc, "6.1 Testing Approach")
    add_body_paragraph(
        doc,
        "Testing was conducted to verify backend API endpoint contracts, business logic constraints, authorization rules, and regression safety. "
        "Automated backend testing was executed using Jest and Supertest against an isolated MongoDB test database (collabsphere_test). "
        "The automated backend test suite comprises 176 passing tests across 12 test suites. Table 6.1 outlines the testing types."
    )
    
    add_caption_above_table(doc, "Table 6.1: Types of Testing")
    tbl_6_1 = doc.add_table(rows=7, cols=2)
    tbl_6_1.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_6_1.cell(0,0).paragraphs[0].text = "Testing Type"
    tbl_6_1.cell(0,1).paragraphs[0].text = "Description & Coverage"
    tbl_6_1.cell(0,0).paragraphs[0].runs[0].font.bold = True
    tbl_6_1.cell(0,1).paragraphs[0].runs[0].font.bold = True
    set_cell_background(tbl_6_1.cell(0,0), "FAF8F5")
    set_cell_background(tbl_6_1.cell(0,1), "FAF8F5")
    
    test_types = [
        ["Backend API Testing", "Verification of REST endpoints using valid/invalid payloads and checking JSON response envelopes."],
        ["Authentication Testing", "Verification of user registration, password hashing, login token generation, and invalid credential handling."],
        ["Authorization Testing", "Verification of JWT header requirements and role-based access restrictions (student vs admin)."],
        ["Workflow State Machine Testing", "Verification of forward-only state transitions for projects, tasks, and collaboration requests."],
        ["Socket.IO Integration Testing", "Verification of WebSocket handshake auth, room join authorization, and message broadcasting."],
        ["Regression Testing", "Re-execution of all 176 Jest tests across 12 suites to confirm existing functionality remains green."]
    ]
    for idx, (t_n, t_d) in enumerate(test_types):
        tbl_6_1.cell(idx+1, 0).paragraphs[0].text = t_n
        tbl_6_1.cell(idx+1, 1).paragraphs[0].text = t_d
    set_table_borders(tbl_6_1)

    add_heading_2(doc, "6.2 Test Cases")
    add_body_paragraph(doc, "Table 6.2 presents representative test scenarios derived directly from the automated Jest test suite execution.")
    
    add_caption_above_table(doc, "Table 6.2: Representative Test Cases")
    tbl_6_2 = doc.add_table(rows=16, cols=4)
    tbl_6_2.alignment = WD_TABLE_ALIGNMENT.CENTER
    h62 = ["Test Case ID", "Test Scenario", "Actual Result", "Status"]
    for i, h in enumerate(h62):
        tbl_6_2.cell(0,i).paragraphs[0].text = h
        tbl_6_2.cell(0,i).paragraphs[0].runs[0].font.bold = True
        set_cell_background(tbl_6_2.cell(0,i), "FAF8F5")
        
    tcases = [
        ["AUTH-01", "Register student user with valid payload", "User registered, HTTP 201, JWT & user returned", "PASS"],
        ["AUTH-02", "Register student user with duplicate email", "HTTP 409 Conflict returned with error message", "PASS"],
        ["AUTH-03", "Login with valid email and password", "HTTP 200 OK, JWT token & user returned", "PASS"],
        ["AUTH-04", "Access protected route without JWT token", "HTTP 401 Unauthorized returned", "PASS"],
        ["PROJ-01", "Create project proposal as authenticated student", "Project created, HTTP 201, status OPEN", "PASS"],
        ["PROJ-02", "Update project status OPEN -> IN_PROGRESS by owner", "Status updated successfully, HTTP 200 OK", "PASS"],
        ["PROJ-03", "Non-owner attempts to update project status", "HTTP 403 Forbidden returned", "PASS"],
        ["REQ-01", "Submit join request to OPEN project", "CollaborationRequest created with status PENDING", "PASS"],
        ["REQ-02", "Submit join request to non-OPEN project", "HTTP 400 Bad Request returned", "PASS"],
        ["REQ-03", "Owner accepts request when capacity available", "Request status ACCEPTED, sender added to memberIds", "PASS"],
        ["TASK-01", "Team member creates task in project workspace", "Task created with status TODO, HTTP 201", "PASS"],
        ["MSG-01", "Team member sends chat message via REST API", "Message saved to DB and broadcast to room", "PASS"],
        ["SHOW-01", "Publish showcase for COMPLETED project", "Showcase document created and published", "PASS"],
        ["ADM-01", "Admin fetches platform statistics", "HTTP 200 OK, statistics metrics returned", "PASS"],
        ["ADM-02", "Admin deletes project with cascade", "Project, tasks, messages, requests & showcase deleted", "PASS"]
    ]
    for r_idx, row in enumerate(tcases):
        for c_idx, val in enumerate(row):
            tbl_6_2.cell(r_idx+1, c_idx).paragraphs[0].text = val
            tbl_6_2.cell(r_idx+1, c_idx).paragraphs[0].runs[0].font.size = Pt(10)
    set_table_borders(tbl_6_2)

    # ---------------------------------------------------------
    # SECTION 7 — SCREEN-SHOTS
    # ---------------------------------------------------------
    add_heading_1(doc, "7. Screen-shots", page_break=True)
    print("Building Section 7 — Screen-shots...")
    
    add_body_paragraph(
        doc,
        "This section presents figure placeholders for the principal user interface screens of CollabSphere. "
        "Each placeholder box below corresponds to an actual application view and is accompanied by screenshot capture instructions "
        "provided in docs/project-report/SCREENSHOT_GUIDE.md."
    )

    screenshots_list = [
        ("Figure 7.1: Landing Page", "Public landing page displaying hero section, core platform features, and navigation controls."),
        ("Figure 7.2: Login Page", "Authentication login page with email/password input fields and error handling feedback."),
        ("Figure 7.3: Student Registration Page", "User registration page collecting full name, email, password, skills, and portfolio links."),
        ("Figure 7.4: Student Dashboard", "Authenticated student dashboard displaying active projects overview, team requests, and quick actions."),
        ("Figure 7.5: Project Discovery & Search Page", "Project search portal featuring multi-attribute filtering by category, difficulty, status, and required skills."),
        ("Figure 7.6: Project Details View", "Detailed project view illustrating project description, owner profile, required skills, team capacity, and join action."),
        ("Figure 7.7: Create Project Form", "Form interface for proposing new projects with required skill selection and team size configuration."),
        ("Figure 7.8: Collaboration Requests Management", "Project owner interface for reviewing applicant profiles and accepting or rejecting join applications."),
        ("Figure 7.9: Team Workspace & Roster View", "Private team workspace displaying team member profiles and project status indicators."),
        ("Figure 7.10: Task Management Board", "Workspace task board displaying task creation modal, assignee selectors, and status update controls."),
        ("Figure 7.11: Real-Time Project Workspace Chat", "Workspace chat window demonstrating persistent chat history and real-time Socket.IO message bubbles."),
        ("Figure 7.12: Showcase Gallery & Social Feed", "Public showcase gallery displaying completed projects, technology tags, and screenshot thumbnails."),
        ("Figure 7.13: Showcase Detail, Likes & Embedded Comments", "Detailed showcase view demonstrating technology breakdown, live links, like counter toggle, and comment thread."),
        ("Figure 7.14: Admin Dashboard & Platform Overview", "Administrative control panel presenting platform metrics for users, projects, showcases, and reports."),
        ("Figure 7.15: User Management & Suspension Modal", "Admin user management interface for filtering accounts and toggling active/suspended statuses."),
        ("Figure 7.16: Project Moderation & Content Reports Management", "Admin moderation view displaying user content reports and project deletion cascade confirmation.")
    ]

    for fig_title, fig_desc in screenshots_list:
        add_figure_container(doc, fig_title, fig_desc)

    # ---------------------------------------------------------
    # SECTION 8 — CONCLUSION
    # ---------------------------------------------------------
    add_heading_1(doc, "8. Conclusion", page_break=True)
    print("Building Section 8 — Conclusion...")
    
    add_body_paragraph(
        doc,
        "The project CollabSphere – Student Project Collaboration Platform was successfully engineered and implemented as a full-stack web application "
        "using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO. The platform successfully addresses the challenges of student project "
        "recruitment, workspace task coordination, real-time communication, completed project showcase publication, and administrative content moderation."
    )
    add_body_paragraph(doc, "The following key functionalities were fully implemented and empirically verified:")
    
    add_bullet_point(doc, "Stateless authentication and role-based access control (RBAC) using JWT tokens and bcryptjs password hashing.")
    add_bullet_point(doc, "Project creation, multi-attribute search filtering, bookmarking, and owner-gated forward status transitions.")
    add_bullet_point(doc, "Structured collaboration request workflow with automated team membership synchronization and team size enforcement.")
    add_bullet_point(doc, "Private team workspace task management enforcing a forward-only task state machine.")
    add_bullet_point(doc, "Real-time workspace chat using Socket.IO project rooms integrated with REST message history storage.")
    add_bullet_point(doc, "Public Showcase feed for completed projects featuring technology tags, idempotent likes, and embedded comments.")
    add_bullet_point(doc, "Administrative moderation dashboard providing platform statistics, user status management, content report resolution, and project cascade deletion.")
    add_bullet_point(doc, "An automated backend test suite comprising 176 passing tests across 12 test suites, ensuring robust application reliability.")

    # ---------------------------------------------------------
    # SECTION 9 — LIMITATION AND FUTURE EXTENSION
    # ---------------------------------------------------------
    add_heading_1(doc, "9. Limitation and Future Extension", page_break=True)
    print("Building Section 9 — Limitations...")
    
    add_heading_2(doc, "9.1 Current Limitations")
    add_body_paragraph(doc, "The following verified scope boundaries and architectural limitations apply to the current implementation of CollabSphere:")
    add_bullet_point(doc, "Native Cloudinary SDK file uploads are deferred; image attributes currently store validated image URL strings.")
    add_bullet_point(doc, "Immediate forced termination of active Socket.IO connections upon administrative user suspension is deferred; suspended users are blocked upon room join attempts.")
    add_bullet_point(doc, "There is no dedicated native mobile application (iOS/Android); access is provided through the responsive React web client.")
    add_bullet_point(doc, "External email and SMS notification gateways are not integrated; notifications are delivered within the web application.")
    add_bullet_point(doc, "Automated AI-assisted skill matching and project recommendation engines are not included in the current build.")

    add_heading_2(doc, "9.2 Future Extensions")
    add_body_paragraph(doc, "The following features represent planned future enhancements for subsequent platform iterations:")
    add_bullet_point(doc, "Development of a cross-platform mobile application using React Native.")
    add_bullet_point(doc, "Integration of Cloudinary SDK for direct drag-and-drop client image uploads.")
    add_bullet_point(doc, "Implementation of active Socket.IO session revocation upon user status changes.")
    add_bullet_point(doc, "Integration of Nodemailer / SendGrid for automated email notifications.")
    add_bullet_point(doc, "Addition of AI-powered student skill recommendation algorithms for project owners.")

    # ---------------------------------------------------------
    # SECTION 10 — BIBLIOGRAPHY
    # ---------------------------------------------------------
    add_heading_1(doc, "10. Bibliography", page_break=True)
    print("Building Section 10 — Bibliography...")
    
    add_body_paragraph(doc, "The following official technical documentation, specifications, and standards were referenced during the development of CollabSphere:")
    
    citations = [
        "[1] React Community, “React Documentation,” 2024. [Online]. Available: https://react.dev/",
        "[2] Vite Core Team, “Vite Frontend Tooling Guide,” 2024. [Online]. Available: https://vite.dev/guide/",
        "[3] Node.js Foundation, “Node.js v20.x API Documentation,” 2024. [Online]. Available: https://nodejs.org/en/docs/",
        "[4] Express.js Authors, “Express.js Web Framework Guide,” 2024. [Online]. Available: https://expressjs.com/",
        "[5] MongoDB Inc., “MongoDB Documentation,” 2024. [Online]. Available: https://www.mongodb.com/docs/",
        "[6] Mongoose Team, “Mongoose v8.x Document ODM Reference,” 2024. [Online]. Available: https://mongoosejs.com/docs/",
        "[7] Socket.IO Authors, “Socket.IO Real-Time Engine Documentation,” 2024. [Online]. Available: https://socket.io/docs/v4/",
        "[8] M. Jones, J. Bradley, and N. Sakimura, “JSON Web Token (JWT),” RFC 7519, Internet Engineering Task Force, May 2015.",
        "[9] Tailwind Labs, “Tailwind CSS Utility-First Framework,” 2024. [Online]. Available: https://tailwindcss.com/docs",
        "[10] Jest Framework Authors, “Jest Testing Framework Guide,” 2024. [Online]. Available: https://jestjs.io/docs/getting-started",
        "[11] npm Package Registry, “bcryptjs - Optimized bcrypt in JavaScript,” 2024. [Online]. Available: https://www.npmjs.com/package/bcryptjs"
    ]
    
    for cite in citations:
        p_c = doc.add_paragraph()
        p_c.paragraph_format.space_before = Pt(2)
        p_c.paragraph_format.space_after = Pt(4)
        p_c.paragraph_format.line_spacing = 1.25
        run = p_c.add_run(cite)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)

    output_path = os.path.join("docs", "project-report", "CollabSphere_Project_Report.docx")
    doc.save(output_path)
    print(f"Report saved successfully to {output_path}")

if __name__ == "__main__":
    build_document()
