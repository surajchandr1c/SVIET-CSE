# Next.js Codebase Audit Report

## 1. Executive Summary & Project Architecture

This audit report documents the current architecture, code quality, dependency usage, security posture, and performance metrics of the **SVIET CSE Department** web application.

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: React 19.2.3
- **Styling**: Tailwind CSS v4.1.18 with PostCSS
- **Database**: MongoDB 7.1.0 via Mongoose 9.2.1
- **Authentication**: JWT (`jsonwebtoken`) with HTTP-only cookies and Bearer header fallback
- **Proxy/Middleware**: `proxy.ts` matching `/admin/*`, `/student/*`, `/techxplore/*`, and `/student-list/*`
- **Animations & Icons**: Framer Motion 12.34.0, Lucide React 0.564.0
- **TypeScript**: TypeScript 5.x (`compilerOptions.strict: true`, bundler module resolution)

---

## 2. Directory Layout & Architectural Boundaries

```
├── app/
│   ├── (main)/              # Public college portal (home, about, faculty, batches, semesters, gallery, etc.)
│   │   ├── layout.tsx       # Main layout (Navbar, Footer, BackToTop, CollegePreviewLink)
│   │   ├── page.tsx         # Department homepage
│   │   ├── HomeHeroClient.tsx # Interactive Hero carousel & spotlight cards
│   │   ├── batches/         # Student portfolio & batch filtering
│   │   └── semester/        # Semester portals (3rd, 4th, 5th, 6th) with study resources & timetables
│   ├── admin/               # Admin panel
│   │   ├── login/           # Admin authentication
│   │   └── (dashboard)/     # Admin shell (achievements, faculty, gallery, notice, semester, students, techxplore)
│   ├── student/             # Student portal
│   │   ├── dashboard/       # Student portfolio editor & profile manager
│   │   └── change-password/ # Password reset workflow
│   ├── api/                 # 34 Serverless route handlers for RESTful CRUD & auth
│   ├── layout.tsx           # Global HTML root layout with Vercel Analytics & ScrollReveal
│   └── globals.css          # Design tokens, theme variables, animations, and global rules
├── components/
│   ├── admin/               # Admin sidebar, pagination, form fields, student account management
│   ├── main/                # Navbar, Footer, BackToTop, CollegePreviewLink, CSEIntroOverlay
│   └── shared/              # SmartImage, Skeleton loaders, PasswordInput, ScrollReveal
├── server/
│   ├── auth/                # Server-only JWT signing & verification (adminJwt, studentJwt)
│   ├── db/                  # MongoDB cached connection with DNS SRV fallback & Mongoose models
│   └── services/            # Student data access service with static JSON fallback
├── models/                  # Compatibility facades re-exporting server/db/models
├── lib/
│   ├── shared/              # Pure domain helpers (imageUrl, driveUrl, formatDate, batchConfig, ordering)
│   ├── client/hooks/        # Client-side hooks (useApiArray, useApiArrayWithLoading)
│   └── compatibility/       # Root re-export facades for backward-compatible imports
├── config/                  # Semester configurations and key definitions
├── data/                    # JSON seed data for students and timetable schedules
└── public/                  # Public assets (photos, documents, syllabi, timetables)
```

---

## 3. Route & Page Inventory

### 3.1 Public Portal Routes (`app/(main)`)
1. `/` — Department landing page with hero spotlight, department statistics, and features
2. `/about` — About the department, vision, mission, and college overview
3. `/achievements` — Department accomplishments and awards (canonical alias)
4. `/Achivement` — Department accomplishments and awards (legacy route compatibility)
5. `/batches` — Batch-wise student portfolios with interactive search and filtering
6. `/batches/[slug]` — Individual student public portfolio page
7. `/contact` — Student contact & query submission form (sends email via nodemailer)
8. `/faculty` — Faculty profiles, order-based hierarchy, contact info, and specializations
9. `/forgot-password` — Password recovery guidance and contact form
10. `/gallery` — College event photo gallery overview
11. `/gallery/[event]` — Specific event photo album view
12. `/login` — Unified student and admin login page
13. `/notice` — Department notice board with Google Drive PDF viewers
14. `/semester` — Semester overview portal
15. `/semester/3rdSem/[assignment|notes|ppt|Previous|syllabus|timetable]` — 3rd Semester resources
16. `/semester/4thSem/[assignment|notes|ppt|Previous|studentsList|syllabus|timetable]` — 4th Semester resources
17. `/semester/5thSem/[assignment|notes|ppt|Previous|syllabus|timetable]` — 5th Semester resources
18. `/semester/6thSem/[assignment|notes|ppt|Previous|studentsList|syllabus|timetable]` — 6th Semester resources
19. `/student-list` — Semester student list (protected by proxy: requires student or admin token)
20. `/techxplore` — TechXplore student innovation showcase (protected by proxy)
21. `/update` — Placeholder page for in-development modules

### 3.2 Student Portal Routes (`app/student`)
1. `/student/dashboard` — Authenticated student profile, skills, projects, and portfolio editor
2. `/student/change-password` — Mandatory and self-service password update

### 3.3 Admin Portal Routes (`app/admin`)
1. `/admin/login` — Administrator credential login
2. `/admin/dashboard` — Admin overview dashboard
3. `/admin/achivement` — Manage department achievement cards
4. `/admin/faculty/add` — Add/edit/order department faculty profiles with Cloudinary upload
5. `/admin/gallery` — Manage gallery albums and event photos
6. `/admin/notice` — Manage notice board announcements
7. `/admin/semester` — Manage semester course materials and syllabus links
8. `/admin/4th` & `/admin/6th` — Quick links for 4th and 6th semester resources
9. `/admin/student-list` — Manage student roster, credentials, and batch configurations
10. `/admin/student-profile` — Admin inspection of individual student portfolios
11. `/admin/studentportfolio` — Pin/unpin student portfolio highlights
12. `/admin/techxplore` — Manage TechXplore student showcase profiles with Cloudinary upload

### 3.4 API Route Handlers (`app/api`)
- **Authentication**:
  - `/api/session` — Session status for Navbar (signedIn, studentSignedIn, adminSignedIn)
  - `/api/admin/login`, `/api/admin/logout`, `/api/admin/reset-password`
  - `/api/student/login`, `/api/student/logout`, `/api/student/session`, `/api/student/me`, `/api/student/change-password`
- **Data & Resources**:
  - `/api/faculty`, `/api/faculty/[id]`, `/api/faculty/image`
  - `/api/techxplore`, `/api/techxplore/[id]`, `/api/techxplore/image`
  - `/api/notices`, `/api/notices/[id]`
  - `/api/gallery`, `/api/gallery/[id]`
  - `/api/achivement`, `/api/achivement/[id]`
  - `/api/study-resources`, `/api/study-resources/[id]`
  - `/api/question-papers`, `/api/question-papers/[id]`
  - `/api/syllabus`, `/api/syllabus/[id]`
  - `/api/students`, `/api/students/[id]`
  - `/api/batches`
  - `/api/contact`
  - `/api/images/drive/[id]`
  - `/api/admin/batches`, `/api/admin/students`, `/api/admin/students/[id]`, `/api/admin/studentportfolio`, `/api/admin/studentportfolio/pins`, `/api/admin/studentportfolio/[admissionNo]`

---

## 4. Shared Component Inventory

| Component | Path | Purpose | Server / Client |
|---|---|---|---|
| `Navbar` | `components/main/Navbar.tsx` | Site navigation, session-aware buttons, mobile drawer | Client |
| `Footer` | `components/main/Footer.tsx` | Department footer, contact links, address | Server |
| `SmartImage` | `components/shared/SmartImage.tsx` | Robust image rendering with multi-candidate Drive fallback | Client |
| `Skeleton` | `components/shared/Skeleton.tsx` | Accessible shimmer loading states for tables, cards, notices | Server |
| `PasswordInput` | `components/shared/PasswordInput.tsx` | Accessible password field with show/hide toggle | Client |
| `BackToTop` | `components/main/BackToTop.tsx` | Floating smooth scroll-to-top button | Client |
| `CollegePreviewLink` | `components/main/CollegePreviewLink.tsx` | Floating preview link to parent institution | Client |
| `AdminPageIntroCard` | `components/admin/AdminPageIntroCard.tsx` | Standardized header card for all admin pages | Server |
| `AdminPagination` | `components/admin/AdminPagination.tsx` | Standard pagination controls for admin tables | Client |
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Collapsible sidebar with navigation and theme switcher | Client |
| `AdminTextField` | `components/admin/AdminTextField.tsx` | Themed text field with label wrapper | Client |
| `StudentAccountsAdminClient` | `components/admin/StudentAccountsAdminClient.tsx` | Comprehensive student account CRUD table with search & edit | Client |

---

## 5. Dependency & Import Overview

### Active & Verified Dependencies
- `next` (16.1.6): Core web framework
- `react` / `react-dom` (19.2.3): React library
- `mongoose` (9.2.1) & `mongodb` (7.1.0): Database ODM & driver
- `jsonwebtoken` (9.0.3): Server-side token signing and verification
- `bcryptjs` (3.0.3): Secure password hashing
- `framer-motion` (12.34.0): UI layout transitions and spotlight animations
- `lucide-react` (0.564.0): UI icons
- `nodemailer` (8.0.1): Email dispatch for contact queries
- `@vercel/analytics` (2.0.1): Web analytics tracking in root layout

### Unused Dependency Candidates
- `resend` (6.9.2): Installed in `package.json`, but contact emails are handled via `nodemailer` with Gmail transport. No imports found in the entire repository.
- `jwt-decode` (4.0.0): Installed in `package.json`, but all JWT verification is handled securely on the server via `jsonwebtoken`. No imports found in source files.

---

## 6. Duplication & Code Smells Identified

1. **Redundant CSS Import**:
   - `app/layout.tsx` imports `./globals.css`.
   - `app/(main)/layout.tsx` also imports `../globals.css`.
   - Importing global CSS twice causes duplicate evaluation for all main pages.

2. **Duplicate Google Drive File ID Extraction**:
   - `lib/shared/imageUrl.ts` defines `extractGoogleDriveFileId`.
   - `lib/shared/driveUrl.ts` also defines `extractGoogleDriveFileId` with identical regex and additional URL query parsing.

3. **Duplicate Millisecond Timestamp Converter**:
   - `lib/shared/ordering/facultyOrder.ts` defines `toMillis`.
   - `lib/shared/ordering/techxploreOrder.ts` defines an identical `toMillis` function.

4. **Synchronous State Setting in Effects (Cascading Renders)**:
   - `app/(main)/batches/BatchesTabs.tsx`: Calls `setActiveTab` inside `useEffect` on `searchParams` changes instead of deriving `activeTab` directly from `searchParams`.
   - `components/shared/SmartImage.tsx`: Calls `setIndex(0)` inside `useEffect` on `src` change instead of resetting state during render or keying.

5. **Unescaped HTML Entities**:
   - `app/(main)/HomeHeroClient.tsx`: Line 279 contains unescaped single quotes (`trends' capabilities`, `bachelor's degree`), causing ESLint `react/no-unescaped-entities` errors.

6. **Unused Code & Variables**:
   - `app/(main)/semester/4thSem/timetable/page.tsx`: Unused type `DaySchedule` and unused functions `formatHall`, `formatTime`.
   - `app/student/dashboard/StudentDashboardClient.tsx`: Unused import `slugifyProfileName`.

---

## 7. Performance & Optimization Opportunities

1. **URL-Derived State**: Deriving active tab directly from `searchParams` in `BatchesTabs.tsx` prevents unnecessary double-renders and layout shifts.
2. **SmartImage State Reset**: Tracking previous source in state during render avoids extra effect executions.
3. **Database Lookups**: Using `Map` in `BatchesPage` and `BatchConfig` ensures O(1) key lookups instead of O(N) array traversals during sorting and deduplication.
4. **CSS Consolidation**: Removing duplicate `globals.css` import in `(main)/layout.tsx` reduces redundant stylesheet parsing.

---

## 8. Security & Reliability Audit

- **Authentication Storage**: JWT tokens (`admin_token`, `student_token`) are stored in HTTP-only cookies, protecting against XSS token theft.
- **Route Protection**: `proxy.ts` guards all administrative and student routes, redirecting unauthenticated traffic to `/login` or `/admin/login` and clearing expired cookies.
- **CSRF & Injection**: MongoDB queries use Mongoose schemas with typed fields and parameterized object filters, avoiding injection vectors.
- **Email Security**: `nodemailer` in `contact/route.ts` safely validates presence of `EMAIL_USER` and `EMAIL_PASS` before attempting transport, without throwing unhandled exceptions.

---

## 9. Baseline Verification Results

- **Git Working Tree**: Clean on `main` branch.
- **TypeScript Check (`tsc --noEmit`)**: **0 errors** (PASSED).
- **Turbopack Build (`next build`)**: **72/72 pages compiled successfully** (PASSED).
- **ESLint Check (`npm run lint`)**: **4 errors, 5 warnings** (All documented above; to be resolved safely in Phase 10).
