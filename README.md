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


/username/eventSlug

2. Selects a date from calendar
3. Enters name & email
4. Booking is stored in PostgreSQL
5. User is redirected after confirmation
6. Dashboard updates automatically


## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/calendly-scheduling.git
cd calendly-scheduling

Install dependencies
npm install

3️⃣ Environment variables

Create a .env.local file:

DATABASE_URL=postgresql://user:password@host/db
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

4️⃣ Prisma setup
npx prisma generate
npx prisma migrate dev

5️⃣ Run the app
npm run dev


Open 👉 http://localhost:3000

🧠 Key Learnings

Advanced usage of Next.js App Router

Handling dynamic routes in production

Database-driven scheduling logic

Prisma constraints & conflict resolution

Deploying full-stack apps on Vercel

📌 Future Enhancements

Email notifications for bookings

Cancel & reschedule functionality

Google Calendar integration

Timezone support

Admin analytics dashboard

👨‍💻 Author

Raj Sharma
Frontend / Full-Stack Developer

GitHub: https://github.com/rajsh7

LinkedIn: https://www.linkedin.com/in/raj-sharma-1523032ba/

⭐ If you like this project

Give it a ⭐ on GitHub — it really helps!