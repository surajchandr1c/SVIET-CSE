# Feature and Route Preservation Inventory

## 1. Route Inventory & Verification Matrix

This matrix accounts for every page, layout, dynamic route segment, and API endpoint in the repository to ensure zero regression.

### 1.1 Public Routes (`app/(main)`)

| Route | File Path | Type | Auth Required | Data Sources / Dependencies | Expected User Interactions |
|---|---|---|---|---|---|
| `/` | `app/(main)/page.tsx` | Server / Client | None | `HomeHeroClient.tsx`, static assets | Hero cards switch on click, CTA buttons navigate to semesters/batches |
| `/about` | `app/(main)/about/page.tsx` | Server | None | Static content & images | Read department vision, mission, infrastructure |
| `/achievements` | `app/(main)/achievements/page.tsx` | Client | None | `apiRoutes.achivement()`, `useApiArrayWithLoading` | Displays card grid, links to Google Drive certificates |
| `/Achivement` | `app/(main)/Achivement/page.tsx` | Client | None | `apiRoutes.achivement()` | Legacy alias for `/achievements`; displays identical UI |
| `/batches` | `app/(main)/batches/page.tsx` | Server / Client | None | `getAllBatchProfiles`, `getBatchConfigs`, `getPinnedBatchAdmissionNos` | Tab switching (year, course split: CSE/AI-ML), live search input |
| `/batches/[slug]` | `app/(main)/batches/[slug]/page.tsx` | Server | None | MongoDB `BatchProfile` via slug | Public student portfolio with skills, projects, certificates, social links |
| `/contact` | `app/(main)/contact/page.tsx` | Client | None | `POST /api/contact` | Submits student name, admission no, email, message; handles toast/status |
| `/faculty` | `app/(main)/faculty/page.tsx` | Server | None | MongoDB `Faculty` sorted by position/createdAt | Faculty profile cards, email/phone links, image fallback |
| `/forgot-password` | `app/(main)/forgot-password/page.tsx` | Client | None | `POST /api/contact` | Instructions for password recovery with contact form |
| `/gallery` | `app/(main)/gallery/page.tsx` | Client | None | `apiRoutes.gallery()` | Event album cards with thumbnail preview |
| `/gallery/[event]` | `app/(main)/gallery/[event]/page.tsx` | Server | None | MongoDB `GalleryAlbum` | Photo grid for specific college event with lightbox/viewer |
| `/login` | `app/(main)/login/page.tsx` | Client | None (Public Login) | `POST /api/student/login`, `POST /api/admin/login` | Unified login with tab/toggle, redirect to student or admin dashboard |
| `/notice` | `app/(main)/notice/page.tsx` | Client | None | `apiRoutes.notices()` | Notices list with date badge and direct link to Drive PDF |
| `/semester` | `app/(main)/semester/page.tsx` | Server | None | `SEMESTERS` config | Cards for 3rd, 4th, 5th, 6th semesters |
| `/semester/3rdSem/assignment` | `app/(main)/semester/3rdSem/assignment/page.tsx` | Client | None | `GET /api/study-resources?semester=3rd&category=assignment` | Displays downloadable assignment links |
| `/semester/3rdSem/notes` | `app/(main)/semester/3rdSem/notes/page.tsx` | Client | None | `GET /api/study-resources?semester=3rd&category=notes` | Displays lecture notes links |
| `/semester/3rdSem/ppt` | `app/(main)/semester/3rdSem/ppt/page.tsx` | Client | None | `GET /api/study-resources?semester=3rd&category=ppt` | Displays presentation slide links |
| `/semester/3rdSem/Previous` | `app/(main)/semester/3rdSem/Previous/page.tsx` | Client | None | `GET /api/question-papers?semester=3rd` | Displays previous year examination papers |
| `/semester/3rdSem/syllabus` | `app/(main)/semester/3rdSem/syllabus/page.tsx` | Client | None | `GET /api/syllabus?semester=3rd` | Displays syllabus PDF links |
| `/semester/3rdSem/timetable` | `app/(main)/semester/3rdSem/timetable/page.tsx` | Client | None | Static config | Section tabs (A, B, C, AI/ML) |
| `/semester/4thSem/assignment` | `app/(main)/semester/4thSem/assignment/page.tsx` | Client | None | `GET /api/study-resources?semester=4th&category=assignment` | Displays 4th sem assignments |
| `/semester/4thSem/notes` | `app/(main)/semester/4thSem/notes/page.tsx` | Client | None | `GET /api/study-resources?semester=4th&category=notes` | Displays 4th sem notes |
| `/semester/4thSem/ppt` | `app/(main)/semester/4thSem/ppt/page.tsx` | Client | None | `GET /api/study-resources?semester=4th&category=ppt` | Displays 4th sem PPTs |
| `/semester/4thSem/Previous` | `app/(main)/semester/4thSem/Previous/page.tsx` | Client | None | `GET /api/question-papers?semester=4th` | Displays 4th sem question papers |
| `/semester/4thSem/studentsList`| `app/(main)/semester/4thSem/studentsList/page.tsx`| Client | None | `GET /api/students?semester=4th` | List of enrolled 4th sem students |
| `/semester/4thSem/syllabus` | `app/(main)/semester/4thSem/syllabus/page.tsx` | Client | None | `GET /api/syllabus?semester=4th` | 4th sem syllabus documents |
| `/semester/4thSem/timetable`| `app/(main)/semester/4thSem/timetable/page.tsx`| Client | None | Section timetable definitions | Comprehensive university timetable grid per section |
| `/semester/5thSem/...` | `app/(main)/semester/5thSem/*` | Client | None | Corresponding API routes | 5th sem assignments, notes, PPTs, papers, syllabus, timetable |
| `/semester/6thSem/...` | `app/(main)/semester/6thSem/*` | Client | None | Corresponding API routes | 6th sem assignments, notes, PPTs, papers, students list, syllabus, timetable |
| `/student-list` | `app/(main)/student-list/page.tsx` | Client | Student or Admin | `proxy.ts`, `GET /api/students` | Batch & course tabbed student roster |
| `/techxplore` | `app/(main)/techxplore/page.tsx` | Client | Student or Admin | `proxy.ts`, `GET /api/techxplore` | Showcase of student projects & technical innovations |
| `/update` | `app/(main)/update/page.tsx` | Server | None | Static placeholder UI | Friendly maintenance notice |

---

### 1.2 Student Portal Routes (`app/student`)

| Route | File Path | Auth Guard | Capabilities |
|---|---|---|---|
| `/student/dashboard` | `app/student/dashboard/page.tsx` | `student_token` via `proxy.ts` & Server check | View & edit student profile (bio, image upload to Cloudinary, skills, projects, certificates, social handles) |
| `/student/change-password` | `app/student/change-password/page.tsx` | `student_token` via `proxy.ts` | Change account password with confirmation field |

---

### 1.3 Admin Portal Routes (`app/admin`)

| Route | File Path | Auth Guard | Capabilities |
|---|---|---|---|
| `/admin/login` | `app/admin/login/page.tsx` | None (Admin Auth Form) | Authenticates admin credentials, sets `admin_token` cookie |
| `/admin/dashboard` | `app/admin/(dashboard)/dashboard/page.tsx` | `admin_token` via `proxy.ts` | Overview dashboard with metric cards and quick links |
| `/admin/achivement` | `app/admin/(dashboard)/achivement/page.tsx` | `admin_token` | Add, edit, delete achievement cards |
| `/admin/faculty/add` | `app/admin/(dashboard)/faculty/add/page.tsx` | `admin_token` | Add, edit, order faculty profiles with Cloudinary upload |
| `/admin/gallery` | `app/admin/(dashboard)/gallery/page.tsx` | `admin_token` | Create albums, upload event photos, manage galleries |
| `/admin/notice` | `app/admin/(dashboard)/notice/page.tsx` | `admin_token` | Post, edit, remove department notices with Drive link preview |
| `/admin/semester` | `app/admin/(dashboard)/semester/page.tsx` | `admin_token` | Upload/manage study resources across all semesters |
| `/admin/student-list` | `app/admin/(dashboard)/student-list/page.tsx` | `admin_token` | Manage student accounts, reset passwords, add batches |
| `/admin/student-profile`| `app/admin/(dashboard)/student-profile/page.tsx` | `admin_token` | View student detailed portfolio |
| `/admin/studentportfolio`| `app/admin/(dashboard)/studentportfolio/page.tsx`| `admin_token` | Pin up to 5 featured student portfolios |
| `/admin/techxplore` | `app/admin/(dashboard)/techxplore/page.tsx` | `admin_token` | Add, edit, order TechXplore students with Cloudinary upload |

---

### 1.4 API Endpoints (`app/api`)

| Method | Endpoint | Protection | Responsibility |
|---|---|---|---|
| `GET` | `/api/session` | Public | Returns current auth state (`signedIn`, `studentSignedIn`, `adminSignedIn`) |
| `POST` | `/api/admin/login` | Public | Validates admin password against environment/hash, returns JWT cookie |
| `POST` | `/api/admin/logout` | Public | Clears `admin_token` cookie |
| `POST` | `/api/admin/reset-password` | Admin | Resets password for a specific student admission number |
| `GET`, `POST` | `/api/admin/batches` | Admin | Fetches and creates batch configurations |
| `GET`, `POST` | `/api/admin/students` | Admin | Fetches paginated student accounts, adds new student |
| `PUT`, `DELETE`| `/api/admin/students/[id]` | Admin | Updates or removes student account |
| `GET`, `POST` | `/api/admin/studentportfolio/pins` | Admin | Manages pinned student portfolio highlights |
| `POST` | `/api/student/login` | Public | Authenticates student admission number and password |
| `POST` | `/api/student/logout` | Public | Clears `student_token` cookie |
| `GET` | `/api/student/me` | Student | Returns current student profile data |
| `PUT` | `/api/student/profile` | Student | Updates student portfolio details in MongoDB |
| `POST` | `/api/student/profile/image` | Student | Uploads student photo to Cloudinary |
| `POST` | `/api/student/change-password` | Student | Updates student password |
| `GET`, `POST` | `/api/faculty` | Public (GET) / Admin (POST) | Lists and creates faculty profiles |
| `PUT`, `DELETE`| `/api/faculty/[id]` | Admin | Updates or removes faculty profile |
| `POST` | `/api/faculty/image` | Admin | Uploads faculty image to Cloudinary |
| `GET`, `POST` | `/api/techxplore` | Public (GET) / Admin (POST) | Lists and creates TechXplore showcase entries |
| `PUT`, `DELETE`| `/api/techxplore/[id]` | Admin | Updates or removes TechXplore student |
| `POST` | `/api/techxplore/image` | Admin | Uploads TechXplore student image to Cloudinary |
| `GET`, `POST` | `/api/notices` | Public (GET) / Admin (POST) | Lists and posts notices |
| `PUT`, `DELETE`| `/api/notices/[id]` | Admin | Updates or deletes notices |
| `GET`, `POST` | `/api/gallery` | Public (GET) / Admin (POST) | Lists and creates gallery albums |
| `GET`, `PUT`, `DELETE` | `/api/gallery/[id]` | Public (GET) / Admin (PUT, DELETE) | Manages specific gallery album |
| `GET`, `POST` | `/api/achivement` | Public (GET) / Admin (POST) | Lists and creates achievement cards |
| `PUT`, `DELETE`| `/api/achivement/[id]` | Admin | Updates or removes achievement card |
| `GET`, `POST` | `/api/study-resources` | Public (GET) / Admin (POST) | Study resources by semester & category |
| `PUT`, `DELETE`| `/api/study-resources/[id]` | Admin | Updates or removes study resource |
| `GET`, `POST` | `/api/question-papers` | Public (GET) / Admin (POST) | Previous question papers by semester |
| `PUT`, `DELETE`| `/api/question-papers/[id]` | Admin | Updates or removes question paper |
| `GET`, `POST` | `/api/syllabus` | Public (GET) / Admin (POST) | Syllabus entries by semester |
| `PUT`, `DELETE`| `/api/syllabus/[id]` | Admin | Updates or removes syllabus entry |
| `GET` | `/api/images/drive/[id]` | Public | Proxies Google Drive image requests with caching |
| `POST` | `/api/contact` | Public | Sends message to department email via Nodemailer |

---

## 2. Preservation Verification Protocol

1. **Route Integrity**: Verify `next build` continues to output all 72 dynamic and static route paths.
2. **Contract Consistency**: Do not alter request body schemas, cookie names (`admin_token`, `student_token`), or query parameter conventions.
3. **UI / Styling Non-Regression**: Preserve existing colors, font families, layout structures, and responsive breakpoints.
4. **Auth Boundaries**: Keep `proxy.ts` and server-side authentication helpers completely intact.
