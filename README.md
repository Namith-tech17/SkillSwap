# SkillSwap – Real-Time Peer Learning & Mentorship Platform

**Course:** CS3301 – Full Stack Development  
**Institution:** RV University – School of Computer Science & Engineering  
**Semester:** 5th Semester

### Team Members

| Name | USN |
|---|---|
| Hemanth B Y | 1RUA24SCS0041 |
| C Namith Jain | 1RUA24SCS0021 |
| N Gnana Prakash | 1RUA24SCS0062 |

---

## 1. Project Overview

SkillSwap is a real-time peer learning and mentorship platform designed to help university students exchange skills, knowledge, and practical experience.

Students can register, list the skills they can teach, identify the skills they want to learn, and discover compatible learning partners through an intelligent matching system.

The platform also provides availability management, session booking, peer-to-peer messaging, session completion, and feedback.

Its live calendar includes temporary slot locking to help prevent double-booking and make scheduling more reliable.

## 2. Key Features

- **Student Authentication:** Student registration and login with password hashing and JWT-based authentication.
- **Student Profiles:** Manage personal information, academic details, biography, teaching skills, and learning interests.
- **Skill Management:** Add and manage skills with proficiency levels and learning priorities.
- **Match Engine:** Discover compatible students based on teaching and learning interests.
- **Live Calendar:** Create and view availability slots.
- **Slot Locking:** Temporarily lock available slots during the booking process.
- **Session Booking:** Schedule peer-learning sessions and manage their status.
- **Peer Chat:** Exchange messages with other students.
- **Feedback and Ratings:** Submit reviews and ratings after completed sessions.
- **Statistics Dashboard:** View platform statistics.
- **Demo & Verification Center:** Explore the application and run database and security verification checks.
- **Architecture Page:** Understand the application's architecture and technical implementation.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| API Communication | REST API |
| Development | Visual Studio Code, npm |
| Deployment Configuration | Vercel, Render, Docker |

## 4. System Architecture

SkillSwap follows a client-server architecture.

```text
             STUDENT / USER
                    |
                    v
          REACT FRONTEND (VITE)
                    |
                    v
             REST API REQUESTS
                    |
                    v
          NODE.JS + EXPRESS SERVER
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Routes   Middleware   Services
          |
          v
       MONGOOSE ODM
          |
          v
       MONGODB ATLAS
          |
          v
    PERSISTENT DATABASE
```

### Main Application Modules

**Frontend (`client/`)**

- `components/` – Reusable UI components.
- `context/` – Authentication and notification state management.
- `pages/` – Main application screens.
- `services/api.js` – Frontend API communication.
- `App.jsx` – Application structure and navigation.

**Backend (`server/`)**

- `config/` – Database configuration.
- `middleware/` – Authentication and request middleware.
- `models/` – Mongoose database schemas.
- `routes/` – REST API endpoints.
- `scripts/` – Database and security verification scripts.
- `server.js` – Express application entry point.

## 5. Database Design

The application uses MongoDB Atlas with Mongoose ODM.

Six primary database models are implemented:

| Model | Purpose |
|---|---|
| User | Student profiles, credentials, and skill preferences |
| Skill | Skill information and categories |
| Session | Peer-learning session details and status |
| Slot | Student availability and booking locks |
| Message | Peer-to-peer chat messages |
| Feedback | Session reviews and ratings |

### Database Validation

The implementation includes:

- Email format validation.
- Unique USN constraints.
- Skill proficiency-level validation.
- Rating boundary validation (1–5).
- Referential integrity checks between users and sessions.
- Validation of database records through automated verification scripts.

### Database Verification

The application provides a database verification endpoint:

`GET /api/database/verify`

It checks database connectivity, schema validation, constraint enforcement, rating boundaries, and relational integrity.

## 6. Authentication and Security

SkillSwap implements authentication and security mechanisms using:

- **bcryptjs:** Password hashing with 10 salt rounds.
- **JWT:** Token-based authentication using HMAC-SHA256.
- **Token Expiration:** Authentication tokens expire after 24 hours.
- **Authentication Middleware:** Validates JWT Bearer tokens.
- **Ownership Checks:** Protects resources through ownership verification.
- **Security Tests:** Tests for tampered tokens, token expiration, and validation constraints.

## 7. React Technical Requirements

The following React concepts are implemented in the application.

| No. | Concept | Implementation |
|---:|---|---|
| 1 | Components | Reusable components with individual responsibilities |
| 2 | Class Components | Lifecycle methods, state, and `setState()` |
| 3 | Functional Components | Main application pages and interactive views |
| 4 | Parent–Child Components | Component composition and data passing |
| 5 | Props | Dynamic data and event-handler communication |
| 6 | useState | State management for forms and interactions |
| 7 | useEffect | API calls, timers, and side effects |
| 8 | Event Handling | Click, change, submit, and keyboard events |
| 9 | Form Handling | Authentication, profile, booking, and feedback forms |
| 10 | Client-Side Routing | React Router-based navigation |
| 11 | Responsive UI | CSS Grid, Flexbox, and responsive layouts |
| 12 | Backend Integration | Express REST API and MongoDB persistence |

## 8. Project Folder Structure

```text
FSD SEE/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── render.yaml
```

## 9. Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Visual Studio Code or another code editor
- Git

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd "FSD SEE"
```

### Step 2: Install Dependencies

Install root, frontend, and backend dependencies:

```bash
npm run install:all
```

### Step 3: Configure Environment Variables

Configure the required environment variables using the supplied `.env.example` file.

Create the appropriate local environment configuration for the backend and provide your MongoDB Atlas connection string and authentication secret.

**Important:** Never commit `.env` files, database credentials, or JWT secrets to GitHub.

### Step 4: Start the Application

Run both frontend and backend together:

```bash
npm run dev
```

Alternatively, run them separately using two terminals.

**Backend:**

```bash
npm run server
```

**Frontend:**

```bash
npm run client
```

### Step 5: Access the Application

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Demo & Verification | http://localhost:5173/demo |
| Database Verification | http://localhost:5000/api/database/verify |

## 10. Testing and Verification

SkillSwap includes automated database and security verification scripts.

### Database Tests

```bash
npm run test:db
```

### Security Tests

```bash
npm run test:security
```

### Run All Tests

```bash
npm run test:all
```

### Verification Results

The database verification endpoint checks four primary conditions:

| Test ID | Verification |
|---|---|
| DB-01 | User Schema Validation |
| DB-02 | Validation Constraint Enforcement |
| DB-03 | Rating Boundary Constraint (1–5) |
| DB-04 | Relational Integrity Check |

The project was tested with MongoDB Atlas connected, and all four database verification checks returned **PASSED** during the final regression test.

The application was also manually tested