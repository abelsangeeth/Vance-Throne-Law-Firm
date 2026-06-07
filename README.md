# VANCE & THORNE — Elite Corporate Law Counsel Platform

**VANCE & THORNE** is a premium, production-grade corporate law firm template built with **Node.js**, **TypeScript**, and **Fastify**. It features an enterprise-grade backend architecture combined with a sleek, dark-themed, glassmorphic client-facing portal.

---

## 🏛️ Architecture & Core Features

The project is structured around a decoupled **Layered Architecture** split across:
1. **Controllers**: Parse input structures, validate schemas with Zod, and return JSON responses.
2. **Services**: Contain business validation rules, manage token hashing, query repositories, and trigger background worker queues.
3. **Repositories**: Query abstract model records via a mock data interface.

### Premium Capabilities:
- **Strict TypeScript Validation**: Strict compiler settings ensuring maximum code safety.
- **Auto API Documentation**: Gorgeous, interactive Swagger/OpenAPI docs exposed at `/docs`.
- **Sub-100ms Redis Caching**: Simulated Redis-like caching for high-read partner lists, demonstrating sub-5ms cache hits vs 150ms database hits.
- **Asynchronous Task Queue**: Background job queue simulator (similar to BullMQ) tracking notifications delivery.
- **JWT & Cookie Security**: Session authentication utilizing HTTP-only secure cookies, access tokens, and refresh tokens.
- **Deluxe Front-End**: Glassmorphic dark panel styles accented by champagne gold, floating interactive background orbs, and staggered entrance transitions.

---

## 📂 Project Folder Layout

```
├── api/                    # Vercel Serverless wrapper
├── directives/             # Guidelines & project instructions
├── public/                 # Static frontend files
│   ├── assets/             # Attorney headshot images
│   ├── css/
│   │   └── style.css       # Premium dark/gold CSS layout
│   ├── js/
│   │   └── app.js          # Client-side router & portal sync
│   └── index.html          # Core single-page layout
├── src/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Security & authorization checks
│   ├── repositories/       # In-memory database query wrappers
│   ├── routes/             # Route mapping endpoints
│   ├── services/           # Business logic layers
│   ├── utils/              # Cache, logger, and queue helpers
│   ├── app.ts              # Core Fastify plugin configurations
│   └── index.ts            # Entrypoint listener
├── tsconfig.json           # TS Compiler rules
├── vercel.json             # Vercel routing configurations
└── package.json            # Scripts & project dependencies
```

---

## ⚙️ Quickstart Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and assign JWT keys:
```bash
cp .env.example .env
```

### 3. Launch Development Server
```bash
npm run dev
```
The server will start locally at **`http://127.0.0.1:3001`**.

---

## 🔑 Default Credentials

Sign in to the Client Portal Dashboard to test various roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lawfirm.com` | `admin123` | View all bookings & system metrics |
| **Attorney** | `vance@lawfirm.com` | `vance123` | View assigned court cases & inquiries |
| **Client** | `sterling@lawfirm.com` | `sterling123` | Request consultations & track case progress |

---

## 🚀 Vercel Deployment

This project is optimized for serverless deployments out of the box. Simply import this repository into your Vercel Dashboard, assign the environment keys, and click **Deploy**.
