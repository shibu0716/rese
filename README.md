# PlaySim Arena

PlaySim Arena is a **virtual coin-only** sports trading and mini-games web platform. It contains no real-money payments, deposits, or withdrawals.

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Axios, Socket.io client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt
- **Security:** Rate limiting, auth middleware, input validation, CORS

## Features

### User System
- Register/login with JWT
- Password hashing with bcrypt
- Starting balance: **1000 demo coins**
- Profile + transaction history

### Sports Trading Simulation
- Live match cards
- Owner-controlled Socket.io odds update rate
- Place virtual predictions
- Auto settlement engine with randomized results
- Bet history and wallet updates

### Mini Games
- Coin Flip with owner-controlled payout rate
- Dice with owner-controlled payout rate
- Crash simulation with owner-controlled max multiplier

### Owner Panel
- `/owner` dashboard for platform owners
- Live score, active users, open bets, coin-in/coin-out, and wallet totals
- Controls for game rates, stake limits, API request rate, socket update timing, target concurrent users, score weights, and maintenance mode
- Owner-only API routes under `/api/owner`

### Scaling and Safety
- Atomic wallet balance updates prevent concurrent overspending
- MongoDB indexes on users, bets, matches, and transactions
- Tunable MongoDB connection pool for live traffic
- Dynamic API rate limiting and bounded request body size
- Optimized bulk odds updates for many connected Socket.io clients

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `GET /api/user/history`
- `GET /api/matches`
- `POST /api/bet`
- `POST /api/game/coinflip`
- `POST /api/game/dice`
- `POST /api/game/crash`
- `GET /api/owner/panel` owner only
- `PUT /api/owner/settings` owner only

## Local Setup

### 1) Install dependencies

```bash
npm install
npm install -w server
npm install -w client
```

### 2) Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

Set:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `OWNER_SETUP_CODE` for the first owner account
- `MONGO_MAX_POOL_SIZE=100` or higher for larger deployments

### 3) Create the owner account

Register once with `ownerSetupCode` matching `OWNER_SETUP_CODE`. The first matching account becomes `owner` and can access `/owner`.

### 4) Run MongoDB locally

Ensure MongoDB is running on your machine or use a hosted MongoDB URI.

### 5) Run development servers

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Production Notes

- Uses env vars for all sensitive/runtime config
- CORS restricted via `CLIENT_URL`
- JWT-protected private routes
- Input guards prevent negative/invalid staking
- For 1000 live users, run behind a process manager, use a hosted MongoDB cluster, set `MONGO_MAX_POOL_SIZE`, and load test with your expected traffic mix before launch

## Important Compliance

This project is strictly a **simulation platform** with **virtual/demo coins only**.
It intentionally excludes real money, payment rails, and cash-out systems.
