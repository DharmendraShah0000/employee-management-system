# EMS Backend
Express + MongoDB REST API (JWT auth, role-based access).

```bash
cp .env.example .env     # set MONGO_URI and JWT_SECRET
npm install
npm run seed:admin       # first admin + starter departments
npm run dev              # http://localhost:5000
npm test                 # Jest + Supertest (mongodb-memory-server)
```
Endpoints: see `../docs/04-api-specification.md`.
