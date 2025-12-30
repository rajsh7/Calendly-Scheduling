![alt text](image.png)

# 📅 Calendly Scheduling Clone

A full-stack **Calendly-style scheduling application** built with **Next.js (App Router)** and **PostgreSQL**, allowing users to create public booking links, manage availability, and schedule meetings seamlessly.

🔗 **Live Demo:** https://calendly-scheduling.vercel.app  
🛠 **Tech Stack:** Next.js · PostgreSQL · Prisma · Tailwind · NextAuth


## ✨ Features

### 🔗 Public Booking Pages
- Dynamic booking URLs: `/:username/:eventSlug`
- Calendar-based date selection
- Real-time availability handling
- Secure meeting booking flow

![alt text](image-1.png)

### 📊 User Dashboard
- Create & edit event types
- Define weekly availability
- View total bookings and recent activity
- Conflict-safe scheduling logic

### 🧠 Smart Booking Logic
- Database-level conflict prevention
- Graceful handling of duplicate bookings (HTTP 409)
- Production-safe error handling (no crashes)

![alt text](image-2.png)

### 🔐 Authentication
- Secure login with **NextAuth**
- Protected dashboard routes
- User-specific data isolation


## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js (App Router), React |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth |
| Deployment | Vercel |

---

## 🗂 Project Structure

