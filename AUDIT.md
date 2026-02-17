# CampusShare — Implementation Audit & Technical Report

> **Team Butter Barbies | Yugastra Hackathon — Ramaiah University**
> Date: 17 Feb 2026
> Members: PradeepArjunSam (Frontend), hemantsaini404 (Backend)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Phase-by-Phase Implementation](#3-phase-by-phase-implementation)
4. [Issues Encountered & Solutions](#4-issues-encountered--solutions)
5. [Current Feature Status](#5-current-feature-status)
6. [Database Schema & Security](#6-database-schema--security)
7. [Future Advancements](#7-future-advancements)
8. [Lessons Learned](#8-lessons-learned)

---

## 1. Project Overview

**CampusShare** is a peer-to-peer academic resource sharing platform built for college students. It solves a real problem — students struggle to find quality notes, past papers, and assignments. Most platforms are one-directional (download only). CampusShare introduces a **contribution incentive loop** where sharing is rewarded with points, creating a self-sustaining knowledge ecosystem.

### Core Value Proposition
> "Most platforms are one-directional. We built a contribution incentive loop where giving is rewarded."

### Key User Flows
1. **Contributor Flow**: Register → Upload notes/papers → Earn +10 points → Resource visible to all
2. **Seeker Flow**: Browse → Filter by subject/semester → Download → Uploader earns +2 points
3. **Rating Flow**: Rate a resource (1-5 stars) → Uploader earns +1 point → Quality surfaces
4. **Leaderboard**: Top contributors get recognized → Drives more contributions

---

## 2. Architecture & Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with functional components + hooks |
| **Vite 7** | Build tool — fast HMR, optimized bundling |
| **React Router v7** | Client-side routing (BrowserRouter) |
| **TailwindCSS v4** | Utility CSS via Vite plugin (zero-config) |
| **Lucide React** | Icon library (tree-shakeable) |
| **React Hot Toast** | Toast notifications |

### Backend (Serverless)
| Technology | Purpose |
|-----------|---------|
| **Supabase** | Backend-as-a-Service (Auth, DB, Storage, RLS) |
| **PostgreSQL** | Database (hosted by Supabase) |
| **Prisma** | Schema definition & migrations |
| **Row Level Security** | Data access control at DB level |
| **SQL Triggers** | Automated points system |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting (auto-deploys from GitHub) |
| **Supabase Cloud** | Backend hosting (always on) |
| **GitHub** | Source code + version control |

### Architecture Diagram
```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│         React SPA (Vite + TailwindCSS)       │
└──────────────┬──────────────────┬────────────┘
               │                  │
               ▼                  ▼
┌──────────────────┐   ┌──────────────────────┐
│  Supabase Auth   │   │  Supabase Storage    │
│  (Email/Password)│   │  (resource_files)    │
└──────┬───────────┘   └──────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│           Supabase PostgreSQL                 │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐    │
│  │ profiles │ │ resources │ │ ratings  │    │
│  └──────────┘ └───────────┘ └──────────┘    │
│  ┌───────────┐                               │
│  │ downloads │   + RLS Policies              │
│  └───────────┘   + SQL Triggers (points)     │
└──────────────────────────────────────────────┘
```

---

## 3. Phase-by-Phase Implementation

### Phase 0 — Setup (1 hour)
**What we did:**
- Scaffolded React + Vite project with `npx create-vite@latest`
- Installed TailwindCSS v4 via `@tailwindcss/vite` plugin
- Set up Supabase project and obtained API keys
- Configured `.env` files for both frontend and backend
- Established folder structure (`pages/`, `components/`, `context/`, `lib/`)
- Set up Prisma with Supabase PostgreSQL connection

**Files created:** `supabaseClient.js`, `AuthContext.jsx`, `App.jsx`, `main.jsx`, `index.css`

---

### Phase 1 — Authentication + Database Schema (2 hours)

**Backend (Hemant):**
- Defined Prisma schema with 4 models: `User`, `Resource`, `Download`, `Rating`
- Created migration SQL with RLS policies for all tables
- Added `handle_new_user()` trigger — auto-creates profile on Supabase Auth signup
- Added `handle_user_delete()` trigger — cascading cleanup
- Created storage bucket `resource_files` with public read access

**Frontend (Pradeep):**
- Built `AuthContext.jsx` — global auth state via `onAuthStateChange` listener
- Built `Login.jsx` — email/password sign-in with glassmorphism card UI
- Built `Register.jsx` — full registration with name, email, password, department, year
- Built `Navbar.jsx` — responsive nav with conditional auth links + mobile hamburger menu
- Built `Home.jsx` — hero section with gradient text, feature cards, stats section

**Design System (index.css):**
- Custom CSS variables for colors, gradients, shadows, border-radius
- Glassmorphism utility class (`.glass`)
- Gradient text utility (`.gradient-text`)
- Form styling (`.input-field`, `.form-label`)
- Button styling (`.btn-primary`)
- Custom scrollbar
- Inter font from Google Fonts

---

### Phase 2 — Core Features: Upload, Browse, Download, Rating (3 hours)

**Upload Page (`Upload.jsx`):**
- Multi-field form: title, description, subject (dropdown), semester, type, year, tags
- File picker with drag zone UI, file preview with size display
- Uploads file to Supabase Storage bucket `resource_files`
- Inserts resource record into `resources` table
- Upload progress bar (simulated stages: 10% → 30% → 60% → 80% → 100%)
- File size validation (25MB limit)

**Browse Page (`Browse.jsx`):**
- Filter bar: Subject dropdown, Semester dropdown, Type dropdown
- Sort: Newest / Most Downloaded
- Live search by title (debounced)
- Resource grid with `ResourceCard` components
- Loading spinner + empty state handling

**ResourceCard Component (`ResourceCard.jsx`):**
- Glassmorphism card with hover elevation
- Displays: title, subject, semester, type badge, download count, uploader name
- Click navigates to resource detail page

**Resource Detail Page (`ResourceDetail.jsx`):**
- Full resource info: title, description, type badge, metadata
- Star rating component (1-5 stars with hover preview)
- One rating per user per resource (upsert logic)
- Average rating calculation after each new rating
- Download button with tracking (inserts into `downloads` table)
- Download count increment via RPC function (bypasses RLS)
- Embedded PDF preview via `<iframe>` for PDF files
- Sidebar with stats: downloads, rating, file size, date
- Uploader card with name, department, points badge

---

### Phase 3 — Community Features: Profile, Leaderboard, Gamification (2 hours)

**Profile Page (`Profile.jsx`):**
- User info header: avatar, name, department, year, join date
- Stats cards: Total Points (gold highlight), Upload count, Download count
- Two tabs: "My Uploads" and "Download History"
- Uploads tab: grid of user's uploaded resources
- Downloads tab: grid of resources user has downloaded (deduplicated)
- Responsive layout with mobile breakpoint

**Leaderboard Page (`Leaderboard.jsx`):**
- Fetches top 20 users sorted by points descending
- Gold/Silver/Bronze styling for ranks 1/2/3
- Table columns: Rank, Student Name, Department, Points, Uploads count
- Crown icon for top 3 positions
- Empty state if no users have points

**StarRating Component (`StarRating.jsx`):**
- Reusable 1-5 star input/display component
- Supports read-only mode for display, interactive mode for input
- Hover preview (stars light up on hover)
- Configurable size

**Points System (SQL Triggers — `TRIGGERS.sql`):**
- `award_points()` function: single function handles all point awards
- Trigger on `resources` INSERT: +10 points to uploader
- Trigger on `downloads` INSERT: +2 points to resource uploader
- Trigger on `ratings` INSERT: +1 point to resource uploader
- `increment_downloads()` RPC: secure download count increment (SECURITY DEFINER)

---

## 4. Issues Encountered & Solutions

### Issue 1: Backend Merge Deleted Frontend Files
**Problem:** Hemant's `feat/be-auth-v2` merge accidentally deleted 8 critical frontend files including `supabaseClient.js`, `AuthContext.jsx`, `index.css`, `LightPillar.jsx`, `ResourceCard.jsx`, `package.json`, and `index.html`.

**Root Cause:** When pushing backend changes, the branch didn't have the frontend files, so merging it overwrote the main branch.

**Solution:** Used `git checkout <commit>~1 -- <file>` to restore all deleted files from the commit before the deletion. Created missing directories (`lib/`, `context/`) and reinstalled `node_modules`.

**Lesson:** Always work on feature branches and review PRs carefully. Never force-push to main.

---

### Issue 2: "Bucket Not Found" on Upload
**Problem:** When uploading a resource, Supabase threw "bucket not found" error.

**Root Cause:** The frontend code referenced `.from('resources')` as the storage bucket name, but Hemant's migration SQL created the bucket as `resource_files`.

**Solution:** Changed all `supabase.storage.from('resources')` calls to `supabase.storage.from('resource_files')` in `Upload.jsx`.

**Lesson:** Always verify naming consistency between frontend code and backend schema/configuration.

---

### Issue 3: "Permission Denied for Schema Public"
**Problem:** After fixing the bucket name, uploading still failed with "permission denied for schema public" when inserting into the `resources` table.

**Root Cause:** Prisma migrations create tables as the `postgres` superuser, but Supabase's `anon` and `authenticated` roles don't automatically get access to those tables.

**Solution:** Ran the following GRANT statements in Supabase SQL Editor:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
```

**Lesson:** When using Prisma with Supabase, always run GRANT statements after migrations. Supabase's RLS policies control access, but the roles first need schema-level permissions.

---

### Issue 4: Missing `avg_rating` Column
**Problem:** The `resources` table in the migration SQL didn't include the `avg_rating` column, even though the Prisma schema defined it and the frontend code referenced it.

**Root Cause:** The migration SQL was hand-written (not auto-generated by Prisma) and the `avg_rating` column was accidentally omitted.

**Solution:** Added the column via SQL Editor:
```sql
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS avg_rating FLOAT DEFAULT 0;
```

**Lesson:** Use `npx prisma migrate dev` to auto-generate migration SQL rather than hand-writing it.

---

### Issue 5: Download History Not Updating
**Problem:** The Profile page's "Download History" tab always showed empty, even after downloading resources.

**Root Cause:** Multiple contributing factors:
1. The `downloads` INSERT in `ResourceDetail.jsx` didn't check for errors, so failures were silent.
2. The RLS policy on `downloads` only allowed `SELECT` where `auth.uid() = user_id`, but the joined `resources` query might fail if permissions weren't set.
3. The missing `avg_rating` column caused the joined resource query to fail.

**Solution:**
1. Added error logging: `const { error: dlError } = await supabase.from('downloads').insert(...)` with `console.error` on failure.
2. Ran the GRANT statements (Issue 3) to fix permissions.
3. Added the `avg_rating` column (Issue 4) to fix the joined query.

**Lesson:** Always destructure and check Supabase responses for errors. Silent failures are the worst kind of bugs.

---

### Issue 6: Email Verification Redirecting to Localhost
**Problem:** After registering, the email verification link redirected to `http://localhost:3000`, which doesn't work for other users or production.

**Root Cause:** Supabase Auth default Site URL was set to localhost.

**Solution:** For hackathon purposes, disabled email confirmation entirely in Supabase Dashboard (Authentication → Providers → Email → Turn off "Confirm email"). For production, the Site URL should be set to the deployed URL.

**Lesson:** Always configure Supabase Auth redirect URLs before going to production.

---

### Issue 7: Download Count RLS Restriction
**Problem:** When User A downloads User B's resource, the `download_count` update on the `resources` table fails because the RLS policy says "Users can update own resources" (`auth.uid() = uploader_id`).

**Root Cause:** Only the resource uploader can update their own resources, but the download count needs to be incremented by anyone.

**Solution:** Created an RPC function `increment_downloads(row_id UUID)` with `SECURITY DEFINER` that bypasses RLS:
```sql
CREATE OR REPLACE FUNCTION public.increment_downloads(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.resources SET download_count = download_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
Frontend calls `supabase.rpc('increment_downloads', { row_id: resource.id })` with a fallback to direct update.

**Lesson:** Use `SECURITY DEFINER` functions for operations that need to bypass RLS safely.

---

### Issue 8: WebGL Background (LightPillar) Too Heavy
**Problem:** The WebGL-based LightPillar background animation caused performance issues, especially on lower-end devices and during the hackathon demo.

**Root Cause:** The component used Three.js with a full WebGL canvas, custom shaders, and continuous requestAnimationFrame loop — overkill for a background effect.

**Solution:** Replaced the entire WebGL component with a simple CSS gradient:
```css
background: linear-gradient(145deg, #050510 0%, #0f0a2a 50%, #1a0e35 100%);
background-attachment: fixed;
```
Deleted `LightPillar.jsx` (400+ lines) and `LightPillar.css`. Removed `three` and `ogl` dependencies.

**Lesson:** For hackathons, prioritize performance over visual flourish. A well-chosen CSS gradient can look almost as good as WebGL with zero performance cost.

---

### Issue 9: Git Merge Conflicts During Integration
**Problem:** Multiple merge conflicts when pulling Hemant's backend changes into the main branch, especially in `App.jsx`, `Navbar.jsx`, and config files.

**Root Cause:** Both team members were editing the same files (e.g., both added imports to `App.jsx`). Hemant's branch was based on an older commit.

**Solution:** Used `git pull --rebase` to apply local changes on top of remote. For complex conflicts, used `git stash` → `git pull` → `git stash pop` → manual resolution.

**Lesson:** Sync frequently (every 1-2 hours). Use feature branches. Review diffs before merging.

---

## 5. Current Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Complete | Email + password, name, department, year |
| User Login | ✅ Complete | Email + password with session persistence |
| Resource Upload | ✅ Complete | File → Supabase Storage + DB record |
| Resource Browse | ✅ Complete | Filters: subject, semester, type, sort, search |
| Resource Detail | ✅ Complete | Full info, PDF preview, download, rating |
| Star Rating | ✅ Complete | 1-5 stars, one per user per resource, avg calc |
| Download Tracking | ✅ Complete | Records in DB, count increment via RPC |
| Profile Page | ✅ Complete | Stats + "My Uploads" / "Download History" tabs |
| Leaderboard | ✅ Complete | Top 20 by points, gold/silver/bronze |
| Points System | ✅ Complete | +10 upload, +2 download, +1 rating (SQL triggers) |
| Responsive Design | ✅ Complete | Mobile + tablet + desktop breakpoints |
| Deployment | ✅ Complete | Vercel (frontend) + Supabase (backend) |

---

## 6. Database Schema & Security

### Tables
```
profiles:     id (PK, UUID), email, name, department, year, points, created_at
resources:    id (PK, UUID), title, description, type, subject, semester, year,
              file_url, file_name, file_size, download_count, avg_rating, tags[],
              uploader_id (FK→profiles), created_at
downloads:    id (PK, UUID), user_id (FK→profiles), resource_id (FK→resources),
              downloaded_at
ratings:      id (PK, UUID), score, review, user_id (FK→profiles),
              resource_id (FK→resources), created_at
              UNIQUE(user_id, resource_id)
```

### Row Level Security Policies
| Table | Operation | Policy |
|-------|-----------|--------|
| profiles | SELECT | Public (everyone can view) |
| profiles | UPDATE | Own profile only (`auth.uid() = id`) |
| resources | SELECT | Public (everyone can view) |
| resources | INSERT | Authenticated + own ID (`auth.uid() = uploader_id`) |
| resources | UPDATE | Own resources only (`auth.uid() = uploader_id`) |
| ratings | SELECT | Public |
| ratings | INSERT | Authenticated + own ID (`auth.uid() = user_id`) |
| downloads | SELECT | Own downloads only (`auth.uid() = user_id`) |
| downloads | INSERT | Authenticated + own ID (`auth.uid() = user_id`) |

### Triggers
| Trigger | Event | Action |
|---------|-------|--------|
| `on_auth_user_created` | INSERT on `auth.users` | Creates profile row |
| `on_auth_user_deleted` | DELETE on `auth.users` | Deletes profile row |
| `on_resource_upload` | INSERT on `resources` | +10 points to uploader |
| `on_resource_download` | INSERT on `downloads` | +2 points to resource uploader |
| `on_resource_rating` | INSERT on `ratings` | +1 point to resource uploader |

---

## 7. Future Advancements

### Short-Term (Next Sprint)
1. **Search Improvements**: Full-text search using PostgreSQL `tsvector` on title, description, and tags for faster, more relevant results.
2. **Bookmark/Save**: Let users bookmark resources for later without downloading.
3. **Comments Section**: Add discussion threads on each resource for Q&A.
4. **User Avatars**: Profile picture upload with Supabase Storage.
5. **Email Notifications**: Notify uploaders when their resource is downloaded or rated.
6. **Dark/Light Mode Toggle**: Already have CSS variables set up, just need the toggle.

### Medium-Term (Feature Expansion)
7. **AI-Powered Recommendations**: Use collaborative filtering — "Students who downloaded X also downloaded Y."
8. **Study Groups**: Create virtual study groups organized by subject/semester.
9. **Resource Requests**: Students can post requests for specific notes/papers; others can fulfill them for bonus points.
10. **Version Control for Notes**: Allow updating resources with new versions while keeping history.
11. **OCR + Summarization**: Auto-extract text from uploaded PDFs using Tesseract.js and generate AI summaries using an LLM API.
12. **Plagiarism Check**: Compare uploaded content against existing resources to prevent duplicates.

### Long-Term (Platform Vision)
13. **Multi-Campus Federation**: Allow other colleges to join the platform, each with their own namespace.
14. **Faculty Integration**: Professors can verify and endorse high-quality resources.
15. **Mobile App**: React Native or Flutter app for on-the-go access.
16. **Offline Access**: PWA with service workers for downloading and viewing resources offline.
17. **Analytics Dashboard**: Show upload trends, popular subjects, semester-wise activity.
18. **Reward Redemption**: Points can be redeemed for campus perks (canteen coupons, library extensions, etc.).
19. **API for Third-Party Integration**: RESTful API for other campus apps to embed resource search.

### Technical Debt to Address
20. **Proper Error Boundaries**: Add React Error Boundaries for graceful failure handling.
21. **Loading Skeletons**: Replace spinners with skeleton UI for perceived performance.
22. **Image Optimization**: Compress uploaded images/thumbnails.
23. **Rate Limiting**: Prevent abuse (spam uploads, fake ratings).
24. **Automated Testing**: Add unit tests (Vitest) and E2E tests (Playwright).
25. **CI/CD Pipeline**: GitHub Actions for automated testing + deployment.
26. **Remove Unused Dependencies**: `three`, `ogl` still in `package.json` but no longer used after removing LightPillar.

---

## 8. Lessons Learned

### 1. Keep It Simple for Hackathons
We initially added a heavy WebGL background that looked stunning but caused performance issues. Replacing it with a 2-line CSS gradient was 99% as good visually and infinitely faster. **Ship fast, polish later.**

### 2. Supabase + Prisma Requires Extra Setup
Using Prisma for schema definition with Supabase requires manual GRANT statements after migrations. This isn't well-documented. We lost 30+ minutes debugging "permission denied" errors.

### 3. RLS Is Powerful but Tricky
Row Level Security is amazing for security, but it can silently block operations. Always use `SECURITY DEFINER` functions for cross-user operations (like updating download counts on someone else's resource).

### 4. Check Error Responses
The biggest time sink was silent failures — Supabase returns `{ data: null, error: {...} }` but if you don't check `error`, the operation appears to succeed. **Always destructure and check.**

### 5. Git Discipline Matters Even in Hackathons
We lost time recovering files that were accidentally deleted during a merge. Feature branches + frequent syncs would have prevented this entirely.

### 6. Naming Consistency Is Critical
The "bucket not found" bug was caused by `resources` vs `resource_files` naming mismatch between frontend code and backend configuration. Establish naming conventions early and document them.

---

## Appendix: File Structure

```
butter-barbies/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive nav with auth-aware links
│   │   │   ├── ResourceCard.jsx     # Glassmorphism resource card
│   │   │   └── StarRating.jsx       # Reusable star rating component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state provider
│   │   ├── lib/
│   │   │   └── supabaseClient.js    # Supabase browser client
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero + features
│   │   │   ├── Login.jsx            # Sign in page
│   │   │   ├── Register.jsx         # Sign up page
│   │   │   ├── Browse.jsx           # Resource catalog with filters
│   │   │   ├── Upload.jsx           # Upload form + file picker
│   │   │   ├── ResourceDetail.jsx   # Full resource view + rating + download
│   │   │   ├── Profile.jsx          # User profile + upload/download history
│   │   │   └── Leaderboard.jsx      # Top contributors ranking
│   │   ├── App.jsx                  # Router + layout
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles + design tokens
│   ├── vercel.json                  # Vercel SPA config
│   ├── vite.config.js               # Vite configuration
│   └── package.json                 # Dependencies + scripts
│
├── server/                          # Backend (Prisma + Supabase Admin)
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema definition
│   │   └── migrations/              # SQL migration files
│   └── src/
│       ├── supabaseAdmin.js         # Server-side Supabase client
│       ├── utils/points.js          # Points utility functions
│       └── routes/                  # API route handlers
│
├── TRIGGERS.sql                     # Points automation triggers
├── AUDIT.md                         # This document
├── IMPLEMENTATION_PLAN.md           # Original implementation plan
├── README.md                        # Project overview
└── campus-platform-strategy.html    # Initial strategy document
```

---

*Built with ❤️ by Team Butter Barbies during Yugastra Hackathon, 17 Feb 2026.*
