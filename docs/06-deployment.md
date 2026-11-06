# 6. Running and Deployment Guide

> Status: configuration files are provided, but **the project has not been deployed** and was not run by its author in the build environment (no network access there). Follow the steps below to run it yourself.

## 6.1 Run locally (without Docker)
Requirements: Node.js 18+, a running MongoDB (local or Atlas).

```bash
# Backend
cd backend
cp .env.example .env        # set MONGO_URI and a long random JWT_SECRET
npm install
npm run seed:admin          # creates the admin user + starter departments
npm run dev                 # http://localhost:5000  (health: /api/health)

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```
Default seeded admin (change in `.env` before seeding): `admin@example.com` / `Admin@12345`.

## 6.2 Run the tests
```bash
cd backend
npm install
npm test
```
Tests use `mongodb-memory-server` (downloads a MongoDB binary on first run, so internet is needed once).

## 6.3 Run everything with Docker
```bash
export JWT_SECRET=$(openssl rand -hex 32)
docker compose up --build
docker compose exec backend npm run seed:admin
```
Frontend: http://localhost:8080 · API: http://localhost:5000/api

## 6.4 Deploy to the cloud
| Part | Service | Notes |
|------|---------|-------|
| Database | MongoDB Atlas (free tier) | Create a cluster, a DB user, allow network access, copy the connection string |
| Backend | Render (uses `render.yaml`) or Railway | Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` |
| Frontend | Vercel or Netlify (`frontend/vercel.json` handles SPA routing) | Set `VITE_API_URL=https://<your-backend>/api` **before building** |

Order: Atlas → backend (note its URL) → frontend (set `VITE_API_URL`) → update backend `CLIENT_URL` to the frontend URL (CORS) → run `npm run seed:admin` once against the production database.

## 6.5 Production checklist
- Strong, unique `JWT_SECRET`; change the default admin password immediately.
- `CLIENT_URL` set to the exact frontend origin.
- HTTPS everywhere (Render/Vercel provide it).
- Atlas network access restricted where possible.
