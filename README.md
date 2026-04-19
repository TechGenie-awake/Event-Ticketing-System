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
npx prisma db seed     # seeds test users + 4 sample events
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Test Login

After running the seed, you can log in with:

| Role  | Email            | Password   |
|-------|------------------|------------|
| Admin | admin@test.com   | admin123   |
| User  | user@test.com    | user123    |
