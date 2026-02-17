# Butter Barbies — CampusShare Platform

> **Hackathon Project for Ramaiah University Fest — Yugastra**

## Introduction

**Butter Barbies** is the team behind **CampusShare** — a community-driven academic resource sharing platform built for **Yugastra**, the annual university fest of **Ramaiah University**. This hackathon project tackles the problem of siloed study materials on campus.

Students spend hours hunting for notes, past papers, and solved assignments that already exist somewhere. CampusShare changes that by creating a **trusted, searchable, campus-specific repository** where contributors are rewarded and seekers find what they need — fast.

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
- User registration & login (JWT)
- Upload resources with metadata (subject, semester, type)
- Browse & filter by subject / semester / type
- Download resources
- Keyword search
- Contributor points & recognition
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
| **Backend**    | Node.js + Express                 |
| **Database**   | PostgreSQL + Prisma ORM           |
| **File Storage** | Cloudinary (free tier)          |
| **Auth**       | JWT + bcrypt                      |
| **Search**     | PostgreSQL Full-Text Search       |
| **Deployment** | Render.com / Railway.app          |

---

## Architecture

```
+------------------------------+
|    Browser / React SPA       |
+-------------+----------------+
              |
              v
+------------------------------+
|     Express API Server       |
+-------------+----------------+
              |
              v
+----------+----------+--------+
| Auth     | Upload   | Search |
| Service  | Service  | Service|
+----------+----------+--------+
              |
              v
+-------------+----------------+
| PostgreSQL  |   Cloudinary   |
|  (Prisma)   | File Storage   |
+-------------+----------------+
```

---

## Points System

| Action                          | Points |
|--------------------------------|--------|
| Upload a resource              | +10    |
| Per download of your resource  | +2     |

---

## Team — Butter Barbies

Built for **Yugastra — Ramaiah University Fest**

---

## License

This project was created as part of a hackathon and is open for academic and educational purposes.
