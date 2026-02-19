# Event Ticketing System

An end-to-end event ticketing platform built with Node.js, Express, NeonDB (PostgreSQL), Prisma, and React.

## Features

- User registration and JWT-based authentication
- Event browsing with filters (city, category)
- Interactive seat selection with real-time availability
- Concurrent booking with race condition prevention (optimistic locking)
- QR code generation for each ticket
- Email confirmations via Nodemailer
- Mock payment processing

## Tech Stack

**Backend:** Node.js, Express, Prisma ORM, NeonDB (PostgreSQL), JWT, bcryptjs, qrcode, nodemailer

**Frontend:** React, Vite, React Router, Axios

## Architecture

```
backend/src/
├── config/        # DB connection (Singleton)
├── repositories/  # Data access layer
├── services/      # Business logic
├── controllers/   # Request handlers
├── middleware/    # Auth, error handling
└── routes/        # Express routers
```

## Getting Started

```bash
# Backend
cd backend
cp .env.example .env   # fill in your NeonDB URL and JWT secret
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
