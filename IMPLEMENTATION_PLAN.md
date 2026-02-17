# CampusShare — Implementation Plan

> **Team Butter Barbies | Yugastra Hackathon — Ramaiah University**
> Date: 17 Feb 2026

---

## Team Split

| Member              | Role                  | Branch Prefix  |
|--------------------|-----------------------|----------------|
| **PradeepArjunSam** | Frontend (React + UI) | `feat/fe-*`    |
| **hemantsaini404**   | Backend (Supabase + Prisma) | `feat/be-*` |

---

## Phase 0 — Setup (Both, 1 hour)

### Hemant (Backend)
- [ ] Create Supabase project at https://supabase.com
- [ ] Get project URL + anon key + service role key
- [ ] Set up Prisma with Supabase PostgreSQL connection string
- [ ] Create `.env` file with all keys, share with Pradeep
- [ ] Create `server/` folder structure

### Pradeep (Frontend)
- [ ] Scaffold React + Vite project: `npx -y create-vite@latest client -- --template react`
- [ ] Install TailwindCSS v3 in the project
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Set up folder structure under `client/src/`
- [ ] Create `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Set up React Router: `npm install react-router-dom`

### Shared .env Variables
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx  (backend only)
DATABASE_URL=postgresql://...      (for Prisma)
```

---

## Phase 1 — Auth + Database Schema (2 hours)

### Hemant (Backend) — Branch: `feat/be-auth`
- [ ] Define Prisma schema:
  ```prisma
  model User {
    id          String     @id @default(uuid())
    email       String     @unique
    name        String
    department  String?
    year        Int?
    resources   Resource[]
    downloads   Download[]
    createdAt   DateTime   @default(now())
  }

  model Resource {
    id            String       @id @default(uuid())
    title         String
    description   String?
    type          ResourceType
    subject       String
    semester      Int
    year          Int
    fileUrl       String
    fileName      String
    fileSize      Int
    downloadCount Int          @default(0)
    tags          String[]
    uploaderId    String
    uploader      User         @relation(fields: [uploaderId], references: [id])
    downloads     Download[]
    createdAt     DateTime     @default(now())

    @@index([subject, semester])
  }

  model Download {
    id           String   @id @default(uuid())
    userId       String
    user         User     @relation(fields: [userId], references: [id])
    resourceId   String
    resource     Resource @relation(fields: [resourceId], references: [id])
    downloadedAt DateTime @default(now())
  }

  enum ResourceType {
    NOTES
    PAST_PAPER
    REFERENCE_BOOK
    PROJECT_REPORT
    ASSIGNMENT
  }
  ```
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Enable Supabase Auth (email/password) in Supabase dashboard
- [ ] Create `supabaseClient.js` for server-side Supabase admin access
- [ ] Set up Row Level Security (RLS) policies on Supabase tables
- [ ] Write seed script with 5-10 dummy resources

### Pradeep (Frontend) — Branch: `feat/fe-auth`
- [ ] Create `supabaseClient.js` with Supabase browser client
  ```js
  import { createClient } from '@supabase/supabase-js'
  export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  ```
- [ ] Create `AuthContext.jsx` — provides user state globally
- [ ] Build `Login.jsx` page — email + password form, calls `supabase.auth.signInWithPassword()`
- [ ] Build `Register.jsx` page — name, email, password, department, year
- [ ] Build `Navbar.jsx` — logo, navigation links, login/logout button
- [ ] Set up React Router in `App.jsx` with routes:
  - `/` — Home
  - `/login` — Login
  - `/register` — Register
  - `/browse` — Browse resources
  - `/upload` — Upload (protected)
  - `/resource/:id` — Resource detail
  - `/profile` — Profile (protected)

---

## Phase 2 — Core Features: Upload + Browse + Download (3 hours)

### Hemant (Backend) — Branch: `feat/be-resources`
- [ ] Set up Supabase Storage bucket called `resources`
- [ ] Create upload API or Supabase Storage RLS policy to allow authenticated uploads
- [ ] Create resource insert logic:
  - Upload file to Supabase Storage
  - Insert resource record into DB via Prisma
  - Return file URL + resource ID
- [ ] Create GET `/resources` query with filters:
  - Filter by `subject`, `semester`, `type`
  - Sort by `createdAt` (newest), `downloadCount` (most downloaded)
  - Paginate (limit + offset)
- [ ] Create GET `/resources/:id` — single resource detail
- [ ] Create download tracking:
  - Increment `downloadCount` on resource
  - Insert `Download` record
  - Return signed URL for file download
- [ ] Create full-text search query on `title`, `description`, `tags`

### Pradeep (Frontend) — Branch: `feat/fe-resources`
- [ ] Build `Home.jsx` — hero section, featured/recent resources, call-to-action
- [ ] Build `Browse.jsx`:
  - Filter sidebar/bar: subject dropdown, semester dropdown, type dropdown
  - Sort dropdown: Newest / Most Downloaded
  - Resource grid showing `ResourceCard` components
  - Search bar at top
  - Pagination or "Load More"
- [ ] Build `ResourceCard.jsx` — title, subject, semester, type badge, download count, uploader name
- [ ] Build `Upload.jsx` (protected route):
  - Form: title, description, subject, semester, type, tags, file picker
  - File upload progress bar
  - Calls Supabase Storage + inserts resource record
- [ ] Build `ResourceDetail.jsx`:
  - Full resource info
  - Download button (triggers download tracking)
  - PDF preview (if file is PDF) using `<iframe>` or `react-pdf`
  - Uploader info

---

## Phase 3 — Profile + Polish (2 hours)

### Hemant (Backend) — Branch: `feat/be-profile`
- [ ] Create GET `/users/:id/profile` — user info + their uploaded resources
- [ ] Create GET `/users/:id/downloads` — user's download history
- [ ] Add seed data: 3 users, 10+ resources with varied subjects/semesters
- [ ] Test all APIs with Postman, fix edge cases
- [ ] Set up proper error responses (400, 401, 404, 500)

### Pradeep (Frontend) — Branch: `feat/fe-profile`
- [ ] Build `Profile.jsx`:
  - User info card (name, department, year, join date)
  - Tab: "My Uploads" — grid of their uploaded resources
  - Tab: "My Downloads" — list of downloaded resources
- [ ] Add loading skeletons / spinners for all data-fetching pages
- [ ] Add empty states ("No resources found", "Upload your first resource")
- [ ] Add error toasts/notifications for failed operations
- [ ] Responsive design — test on mobile, tablet, desktop
- [ ] Dark mode toggle (if time permits)

---

## Phase 4 — Deploy + Demo Prep (1 hour)

### Hemant
- [ ] Verify all Supabase RLS policies are correct for production
- [ ] Run seed data on production Supabase DB
- [ ] Test all flows on production: register, login, upload, browse, download
- [ ] Fix any CORS / env variable issues

### Pradeep
- [ ] Deploy frontend to Vercel:
  - Connect GitHub repo
  - Set env variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - Deploy
- [ ] Smoke test all pages on live URL
- [ ] Prepare demo story:
  1. **Contributor Flow**: Log in as "Priya" -> Upload DS notes -> Resource appears in catalog
  2. **Seeker Flow**: Log in as "Rahul" -> Search "data structures" -> Filter Sem 4 -> Download
  3. **Why it matters**: "Resources are no longer siloed. Every student benefits."

---

## Folder Structure

```
butter-barbies/
  client/                     # Pradeep owns this
    src/
      components/
        Navbar.jsx
        ResourceCard.jsx
        UploadForm.jsx
        SearchBar.jsx
        FilterBar.jsx
      pages/
        Home.jsx
        Browse.jsx
        ResourceDetail.jsx
        Upload.jsx
        Profile.jsx
        Login.jsx
        Register.jsx
      hooks/
        useAuth.js
        useResources.js
      context/
        AuthContext.jsx
      lib/
        supabaseClient.js
      App.jsx
      main.jsx
    package.json

  server/                     # Hemant owns this
    prisma/
      schema.prisma
      seed.js
    src/
      supabaseAdmin.js
    .env
    package.json

  README.md
  IMPLEMENTATION_PLAN.md
  campus-platform-strategy.html
```

---

## Git Workflow

1. Always work on feature branches (`feat/fe-auth`, `feat/be-resources`, etc.)
2. Push to your branch, create a Pull Request
3. Quick review by the other person, then merge to `main`
4. Pull `main` before starting new work
5. Sync every 2-3 hours — quick standup on what's done and blockers

---

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth | Supabase Auth | No custom auth code needed, handles sessions/tokens |
| Database | Supabase PostgreSQL + Prisma | Type-safe queries, easy migrations, hosted DB |
| File Storage | Supabase Storage | Same platform, free tier, signed URLs for downloads |
| Frontend Deploy | Vercel | Free, instant deploys from GitHub |
| Backend | Supabase (serverless) | No separate server to deploy, client SDK handles most things |

---

**Good luck Butter Barbies. Ship it.**
