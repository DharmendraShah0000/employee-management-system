# Employee Management System (EMS)

A responsive full-stack MERN application for managing employee records with role-based access.

**Stack:** React (Vite) · Tailwind CSS · Node.js + Express · MongoDB (Mongoose) · JWT · Jest + Supertest

## Features
- Employee registration and login (JWT, bcrypt)
- Role-based authorization: `admin` and `employee`
- Employee CRUD with search, filters, sorting and pagination; soft delete
- Department management
- Admin dashboard with totals and charts
- Employee "My Profile" page (limited self-editing)
- Responsive UI (table on desktop, cards on mobile, collapsible sidebar)

## Quick start
```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run seed:admin && npm run dev
# Frontend (new terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```
Open http://localhost:5173 and sign in with the seeded admin (`admin@example.com` / `Admin@12345`, set in `backend/.env`).
Full instructions, Docker and cloud deployment: `docs/06-deployment.md`.

## Documentation
| File | Contents |
|------|----------|
| `PROJECT_REPORT.md` | Technologies used, challenges, deployment status |
| `docs/01-requirements-analysis.md` | Requirements, actors, user stories, risks |
| `docs/02-modules.md` | Backend and frontend modules |
| `docs/03-architecture.md` | Architecture, data model, auth flow, security |
| `docs/04-api-specification.md` | REST endpoints and access rules |
| `docs/05-roadmap.md` | Development phases and status |
| `docs/06-deployment.md` | Run locally, test, Docker, cloud deployment |

## Layout
```
backend/   Express API (models, services, controllers, routes, middleware, tests)
frontend/  React SPA (pages, components, context, api)
docs/      Analysis and design documents
docker-compose.yml · render.yaml · .github/workflows/ci.yml
```

## Status
All code is written. It has been syntax-checked, but dependencies were not installed and the test suite was not executed in the environment where it was authored. See `PROJECT_REPORT.md`.
