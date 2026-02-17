# Butter Barbies — CampusShare Platform

> **Hackathon Project for Ramaiah University Fest — Yugastra**

## Introduction

**Butter Barbies** is the team behind **CampusShare** — a community-driven academic resource sharing platform built for **Yugastra**, the annual university fest of **Ramaiah University**. This hackathon project tackles the problem of siloed study materials on campus.

Students spend hours hunting for notes, past papers, and solved assignments that already exist somewhere. CampusShare changes that by creating a **trusted, searchable, campus-specific repository** where seekers find what they need — fast.

---

## Problem Statement

Academic resources on campus are fragmented:
- **WhatsApp groups** have no search
- **Google Drive** links expire
- **Library systems** are bureaucratic
- **Existing platforms** (StudyLib, Scribd) aren't campus-specific and lack community trust

**CampusShare** bridges this gap with a platform built *by students, for students*.

---

## Key Features

### Must-Have (Core MVP)
- User registration & login (Supabase Auth)
- Upload resources with metadata (subject, semester, type)
- Browse & filter by subject / semester / type
- Download resources
- Keyword search
- Resource detail pages

### Should-Have (High Value)
- User profile page with upload history
- Sort by: newest / most downloaded
- Preview PDF in-browser
- File type filter (PDF, DOCX, etc.)

### Nice-to-Have
- Bookmarking / saved resources
- Comment threads on resources
- Share via link / QR code

---

## Tech Stack

| Layer          | Technology                          |
|---------------|-------------------------------------|
| **Frontend**   | React + Vite + TailwindCSS        |
| **Backend**    | Supabase (BaaS)                   |
| **ORM**        | Prisma ORM                        |
| **Database**   | Supabase PostgreSQL               |
| **File Storage** | Supabase Storage                |
| **Auth**       | Supabase Auth                     |
| **Search**     | PostgreSQL Full-Text Search       |
| **Deployment** | Vercel (Frontend) + Supabase (Backend) |

---

## Architecture

```
+------------------------------+
|    Browser / React SPA       |
+-------------+----------------+
              |
              v
+------------------------------+
|   Supabase Client SDK        |
+-------------+----------------+
              |
              v
+----------+----------+--------+
| Auth     | Storage  | Search |
| Service  | Service  | (DB)   |
+----------+----------+--------+
              |
              v
+------------------------------+
|   Supabase PostgreSQL        |
|       (Prisma ORM)           |
+------------------------------+
```

---

## Team — Butter Barbies

- **PradeepArjunSam** — Frontend & UI
- **hemantsaini404** — Backend & Database

Built for **Yugastra — Ramaiah University Fest**

---

## License

This project was created as part of a hackathon and is open for academic and educational purposes.
