# PlaySim Arena

PlaySim Arena is a **virtual coin-only** sports trading and mini-games web platform. It contains no real-money payments, deposits, or withdrawals.

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Axios, Socket.io client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt
- **Security:** Rate limiting, auth middleware, input validation, CORS

## Project Structure

```
playsim-arena/
├─ client/
│  ├─ src/
│  │  ├─ app/                # Pages (dashboard, auth, games, wallet, match detail)
│  │  ├─ components/
│  │  ├─ contexts/
│  │  └─ lib/                # Axios + Socket client
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  └─ sockets/
└─ README.md
```

## Features

### User System
- Register/login with JWT
- Password hashing with bcrypt
- Starting balance: **1000 demo coins**
- Profile + transaction history

### Sports Trading Simulation
- Live match cards
- Odds update every 3 seconds over Socket.io
- Place virtual predictions
- Auto settlement engine with randomized results
- Bet history and wallet updates

### Mini Games
- Coin Flip (2x)
- Dice (5x)
- Crash simulation with cash-out multiplier

### Wallet
- Unified balance across all modules
- Transaction logs for all wins/losses

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

### 3) Run MongoDB locally

Ensure MongoDB is running on your machine (or use a hosted MongoDB URI).

### 4) Run development servers

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
- Basic API rate limiting enabled

## Important Compliance

This project is strictly a **simulation platform** with **virtual/demo coins only**.
It intentionally excludes real money, payment rails, and cash-out systems.
