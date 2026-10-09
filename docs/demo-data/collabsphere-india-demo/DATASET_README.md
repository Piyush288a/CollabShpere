# CollabSphere — Indian Student Demo Dataset

This package contains a realistic, relationally consistent MongoDB Extended JSON dataset designed for evaluating and presenting CollabSphere features. It features Indian student personas, campus collaboration projects across multiple domains (Agritech, Healthcare, Education, Civic Tech, Sustainability, Fintech, AI/ML, Developer Tools), and verified public open-source reference repositories.

---

## 1. Document Summary

| Collection | Filename | Document Count |
| :--- | :--- | :---: |
| Users | `users.json` | 15 |
| Projects | `projects.json` | 20 |
| Collaboration Requests | `collaborationrequests.json` | 15 |
| Tasks | `tasks.json` | 20 |
| Messages | `messages.json` | 20 |
| Showcases | `showcases.json` | 5 |
| Reports | `reports.json` | 5 |
| **Total** | | **100** |

---

## 2. Database Name & MongoDB Compass Import Instructions

- **Target Database Name**: `collabsphere` (Default from application configuration).
- **Import Format**: MongoDB Extended JSON (JSON - Select "JSON" in MongoDB Compass import modal).

### Recommended Import Order
To maintain logical dependency order during manual inspection:
1. `users.json` → Imports into `users` collection
2. `projects.json` → Imports into `projects` collection
3. `collaborationrequests.json` → Imports into `collaborationrequests` collection
4. `tasks.json` → Imports into `tasks` collection
5. `messages.json` → Imports into `messages` collection
6. `showcases.json` → Imports into `showcases` collection
7. `reports.json` → Imports into `reports` collection

---

## 3. Demo Login Credentials

All 15 demo student and admin accounts in `users.json` use the pre-hashed bcrypt password `$2a$10$YPs5HIMt..t.piEGNAwhwuNoLtOkcKZ6.qncrZcjs8Chx7pZvBOaC`.

- **Shared Demo Password**: `securepassword123`

### Key Test Personas

| Role | Name | Email | City | Use Case / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Aarav Sharma | `admin@university.edu` | New Delhi | Full platform moderation & admin panel access |
| **Project Owner** | Priya Patel | `priya.patel@university.edu` | Ahmedabad | Owner of *KisanVani*, *UPI-Khata*, *VidyaVishwa* |
| **Project Owner** | Rohan Iyer | `rohan.iyer@university.edu` | Bengaluru | Owner of *SwasthyaConnect*, *BhashaTranslate*, *CropShield* |
| **Project Owner** | Ananya Deshmukh | `ananya.d@university.edu` | Pune | Owner of *ShikshaSetu*, *DrishtiAccessibility*, *CampusPool* |
| **Project Owner** | Vikram Reddy | `vikram.reddy@university.edu` | Hyderabad | Owner of *NagarSeva*, *DevStack-CLI*, *PaySathi* |
| **Project Owner** | Kavya Nair | `kavya.nair@university.edu` | Kochi | Owner of *UrjaDrishti*, *JalSuraksha*, *AaharShare* |
| **Team Member** | Aditya Banerjee | `aditya.b@university.edu` | Kolkata | Accepted member on *KisanVani* |
| **Team Member** | Sneha Kulkarni | `sneha.k@university.edu` | Mumbai | Accepted member on *SwasthyaConnect* and *UPI-Khata* |
| **Applicant** | Meera Joshi | `meera.joshi@university.edu` | Indore | Pending applicant on *VidyaVishwa* |
| **Suspended User** | Saurabh Agarwal | `saurabh.a@university.edu` | Kanpur | Suspended account for admin moderation verification |

---

## 4. Open-Source Reference Repositories & Attribution

The dataset explicitly distinguishes fictional student projects from public open-source reference projects.

### Verified Public Open-Source Reference Repositories
- **Hoppscotch** (`https://github.com/hoppscotch/hoppscotch`) — Open-source API development ecosystem created by Liyas Thomas (India). Used as public open-source reference in *UrjaDrishti*. (License: MIT)
- **Appsmith** (`https://github.com/appsmithorg/appsmith`) — Low-code internal tool builder created in India. Used as public open-source reference in *SwasthyaConnect*. (License: Apache 2.0)
- **FOSS United** (`https://github.com/fossunited/fossunited`) — India FOSS community platform. Used as public open-source reference in *ShikshaSetu*. (License: AGPL-3.0)
- **Chatwoot** (`https://github.com/chatwoot/chatwoot`) — Customer engagement platform built in India. Used as public open-source reference in *NagarSeva*. (License: MIT)
- **Frappe Framework** (`https://github.com/frappe/frappe`) — Open-source full-stack web framework created by Rushabh Mehta / Frappe Technologies (Mumbai, India). Used as public open-source reference in *KisanVani*. (License: GNU GPL v3)

*Note: Fictional student personas are presented as project leaders collaborating on campus implementations. Original project maintainers retain full authorship and copyright of the public repositories.*

---

## 5. Schema & Implementation Notes

1. **Embedded Comments**: Comments in `showcases.json` are subdocuments embedded inside each Showcase document, conforming to `showcaseSchema` (there is no separate `comments` collection).
2. **Acceptance Synchronization**: All collaboration requests with status `ACCEPTED` correspond to user ObjectIds present in the target project's `memberIds` array.
3. **Showcase Constraints**: Showcases exist only for projects with status `COMPLETED` (`KisanVani`, `SwasthyaConnect`, `ShikshaSetu`, `NagarSeva`, `UrjaDrishti`).
4. **Password Hashing**: Pre-hashed bcrypt hashes allow authenticating without executing runtime seeds.
