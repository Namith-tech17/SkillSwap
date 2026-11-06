# SkillSwap — Real-Time Peer Learning & Mentorship Platform

> **Course:** CS3301 Full Stack Development  
> **Institution:** RV University — School of Computer Science & Engineering (5th Semester)  
> **Team Members:**
> - **Hemanth B Y** (`1RUA24SCS0041`)
> - **C Namith Jain** (`1RUA24SCS0021`)
> - **N Gnana Prakash** (`1RUA24SCS0062`)

---

## 🌟 Project Overview
College students possess valuable skills — coding, music, UI/UX design, photography, public speaking — that often go untapped because options are fragmented across WhatsApp groups and word-of-mouth with no scheduling, accountability, or session verification.

**SkillSwap** solves this with a structured, real-time platform where students list what they can teach and what they want to learn, get matched instantly through a compatibility matrix, and book sessions using a live calendar that **locks slots in real time to prevent double-booking**.

---

## 🏆 Evaluation Rubrics Compliance

### 3. Database Design & Integration
> **Rubric Target:** *Well-designed schema integrated correctly with the backend. Database verification and testing.*
- **Mongoose ODM & Schemas:** Defined 6 production Mongoose schemas (`User`, `Skill`, `Session`, `Slot`, `Message`, `Feedback`) matching Slide 8.
- **Relational Integrity:** Foreign key checks linking Sessions & Slots to Users with zero orphaned records.
- **Data Validation Constraints:** Enforced email regex (`^\S+@\S+\.\S+$`), USN uniqueness, 1-5 rating boundaries, and skill proficiency enums.
- **Automated Verification Test Suite:** Run `npm run test:db` or inspect live via `GET /api/database/verify` and UI `/demo`.

### 4. Authentication & Security
> **Rubric Target:** *Secure authentication with validation and authorization mechanisms. Security review and testing.*
- **Password Hashing:** 10-round salted **bcrypt** password hashing protecting all credentials.
- **Cryptographic JWT:** HMAC-SHA256 tokens issued with 24h expiration on login and registration.
- **Protected Endpoints:** JWT Bearer authentication middleware (`authenticateToken`) and resource ownership enforcement (`requireOwnership`).
- **Security Defenses:** Tampered token rejection defense, token timeout enforcement, and injection prevention.
- **Automated Security Test Suite:** Run `npm run test:security` or inspect live via `GET /api/auth/verify` and UI `/demo`.

### 5. Deployment & Project Demonstration
> **Rubric Target:** *Successfully deployed application with professional demonstration and documentation. Live deployment, GitHub repository, project demo.*
- **Deployment Infrastructure:** Configured for Vercel (`client/vercel.json`), Render (`render.yaml`), and Docker Compose (`Dockerfile` + `docker-compose.yml`).
- **Documentation:** Detailed step-by-step cloud deployment walkthrough in [`DEPLOYMENT.md`](./DEPLOYMENT.md).
- **Interactive In-App Demo & Verification Center (`/demo`):**
  - **Tab 1: Interactive Guided Tour** (5-step end-to-end evaluation walkthrough).
  - **Tab 2: Database Schema & Integrity Inspector** (Live interactive verification runner).
  - **Tab 3: Authentication & Security Review Suite** (Live bcrypt & JWT test runner).
  - **Tab 4: Deployment & CLI Verification** (Infrastructure & CLI guide).

---

## 📋 Minimum Technical Requirements Compliance Matrix (All 12 Criteria Met)

| Sl. No. | React Concept / Requirement | Implementation in SkillSwap | Source Files |
|:---:|:---|:---|:---|
| **1** | **Components** | Divided into modular, reusable components with single responsibilities | `Navbar.jsx`, `Footer.jsx`, `PeerCard.jsx`, `SkillBadge.jsx`, `SlotLockTimer.jsx`, `RatingStars.jsx`, `LiveMatchTicker.jsx`, `AuthModal.jsx` |
| **2** | **Class Component** | Demonstrated with lifecycle methods (`componentDidMount`, `componentWillUnmount`, `componentDidUpdate`), `this.state`, and `this.setState()` | `ClassActivityFeed.jsx` & `ErrorBoundary.jsx` |
| **3** | **Functional Components** | Used for all primary pages and interactive UI views | `HomePage.jsx`, `ExploreMatchesPage.jsx`, `LiveCalendarPage.jsx`, `ChatPage.jsx`, `ProfilePage.jsx`, `SessionsPage.jsx`, `DemoPage.jsx`, `AboutArchitecturePage.jsx` |
| **4** | **Parent–Child Components** | Structured data passing down and action callbacks passed up | `ExploreMatchesPage` ➔ `PeerCard` ➔ `SkillBadge`; `SessionsPage` ➔ `RatingStars` |
| **5** | **Props** | Props passed for dynamic data, configuration, variants, and event handlers | `SkillBadge` (`name`, `category`, `level`, `type`, `onRemove`); `SlotLockTimer` (`initialSeconds`, `onExpire`) |
| **6** | **useState** | Dynamic state management across all user interactions | Managed for search queries, match filters, locked calendar slots, chat messages, form inputs, feedback reviews |
| **7** | **useEffect** | Side effects for API communication and timers | Data fetching from Express REST API, 60s slot locking countdown intervals, chat auto-scroll & polling cleanup |
| **8** | **Event Handling** | Comprehensive event listeners across the application | `onClick` (slot locking, filters, tabs), `onChange` (form inputs, selects), `onSubmit` (forms), `onKeyDown` (send chat on Enter) |
| **9** | **Form Handling** | Multiple functional forms with field validation | 1. **Session Booking Form**<br>2. **Profile & Skill Registration Form**<br>3. **Peer Review & Rating Modal Form**<br>4. **Student Sign In & Registration Form** |
| **10** | **Client-Side Routing** | Multi-page SPA navigation using React Router | `react-router-dom` v6 with routes: `/`, `/explore`, `/booking`, `/chat`, `/profile`, `/sessions`, `/demo`, `/about` |
| **11** | **Responsive UI** | Mobile-first and desktop responsive design | CSS Grid & Flexbox, Space Grotesk & Work Sans typography, modern card layout matching PPT design specs |
| **12** | **Backend Server Handling** | Express.js REST API with CORS, middleware, and real-time endpoints | `server/server.js` with routes for auth, skills, users, matches, slots locking, sessions, chat, feedback, and stats |

---

## 🚀 How to Run the Project Locally

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Verification Test Suites
```bash
# Run Database Schema & Constraint Tests
npm run test:db

# Run Security & Bcrypt/JWT Tests
npm run test:security

# Run All Verification Tests
npm run test:all
```

### 3. Start Frontend & Backend
```bash
npm run dev
```

- **Frontend React App:** [http://localhost:5173](http://localhost:5173)
- **Backend Express API:** [http://localhost:5000](http://localhost:5000)
- **Verification & Demo Center:** [http://localhost:5173/demo](http://localhost:5173/demo)
