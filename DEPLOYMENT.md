# SkillSwap — Production Deployment & Project Demonstration Guide

> **Course:** CS3301 Full Stack Development  
> **Institution:** RV University — School of Computer Science & Engineering (5th Semester)  
> **Team Members:**
> - **Hemanth B Y** (1RUA24SCS0041)
> - **C Namith Jain** (1RUA24SCS0021)
> - **N Gnana Prakash** (1RUA24SCS0062)

---

## 🌐 1. Live Deployment Architecture

SkillSwap is architected for zero-cost, high-availability cloud deployment:
- **Frontend:** Vercel (or Render Static Site) with client-side SPA routing rewrites
- **Backend API:** Render Web Service (or Railway / AWS EC2) running Express.js
- **Database:** MongoDB Atlas (Cloud Mongoose Cluster) or containerized MongoDB instance
- **Containerization:** Ready for Docker / Docker Compose (`docker-compose up`)

---

## 🚀 2. Step-by-Step Deployment Instructions

### A. Deploy Backend on Render (Free Tier)
1. Fork or push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name:** `skillswap-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `<any-strong-random-key>`
   - `MONGODB_URI` = `<your-mongodb-atlas-uri>` (Optional: if omitted, server seamlessly uses Mongoose Schema Engine + Persistent Fallback Store).
6. Click **Deploy Web Service**. Your backend API will be live at `https://skillswap-api.onrender.com`.

### B. Deploy Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your SkillSwap GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy! Vercel automatically honors `client/vercel.json` for SPA URL rewrites.

### C. Containerized Docker Deployment
If deploying to a VPS (DigitalOcean, AWS, Linode) or local presentation environment:
```bash
# Clone the repository
git clone https://github.com/your-username/skillswap.git
cd skillswap

# Launch full-stack app + MongoDB with a single command
docker-compose up --build -d
```

---

## 🧪 3. Verification & Testing Suite Commands

Run the automated test scripts to verify all requirements:

```bash
# Run Database Verification (Mongoose schemas, validations, constraints, foreign keys)
npm run test:db

# Run Security & Auth Verification (Bcrypt hashing, JWT HMAC-SHA256, tampered token rejection)
npm run test:security

# Run All Tests Simultaneously
npm run test:all
```

---

## 🎬 4. Examination Demonstration Script (Step-by-Step Walkthrough)

When demonstrating to the evaluators:

1. **Step 1: System Overview & Architecture (`/about`)**
   - Present the 3-tier decoupled architecture diagram (matching Slide 6).
   - Show the 8 database schemas (matching Slide 8).
   - Highlight the 12 React criteria compliance matrix.

2. **Step 2: Database & Security Verification Center (`/demo`)**
   - Navigate to the **Verification & Demo Center** tab in the navigation bar.
   - Click **Run Database Verification Tests** to show live schema checks, rating boundary constraints (1-5), and relational integrity checks with green passing badges.
   - Click **Run Security Tests** to show live bcrypt hashing, JWT token signature validation, and tampered token interception.

3. **Step 3: Authentication & Role Switching (`/login` or Navbar)**
   - Click **Sign In** or use the **1-Click Student Switcher** to authenticate as **Hemanth B Y** (or register a new student account with validation).
   - Note the real JWT token generated and stored in `localStorage`.

4. **Step 4: Skill Matchmaking Engine (`/explore`)**
   - Demonstrate the intelligent matching algorithm comparing teach vs. learn lists.
   - Highlight the **98% Mutual Match (Two-Way Swap)** between Hemanth B Y and Priya Nair.
   - Filter by categories (*Programming*, *Music & Arts*, *Design*).

5. **Step 5: Live Calendar with Real-Time Slot Locking (`/booking`)**
   - Select Priya Nair's calendar.
   - Click an available slot: show the **active 60-second lock** and live countdown timer.
   - Explain how this guarantees **no double-booking under concurrent campus access**.
   - Complete the booking form with meeting format and agenda goals.

6. **Step 6: In-App Coordination Chat (`/chat`)**
   - Open chat with Priya Nair.
   - Send messages to coordinate the campus meetup room or Google Meet link.
   - Show real-time message history and quick proposal topics.

7. **Step 7: Verification & Feedback Submission (`/sessions`)**
   - View confirmed sessions.
   - Click **Mark Complete**.
   - Fill out the **Peer Review & Rating Modal Form** (interactive 1-5 stars + written feedback).
   - Show the teacher's average rating update in real-time.
