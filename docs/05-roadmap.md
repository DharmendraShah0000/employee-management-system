# 5. Development Roadmap

| Phase | Goal | Deliverables | Status |
|-------|------|--------------|--------|
| 0 | Analysis and architecture ✅ | This documentation, folder skeleton | Done |
| 1 | Backend foundation | Express app, MongoDB connection, models, error handler, admin seed script | Code written |
| 2 | Authentication | Register, login, JWT middleware, role middleware | Code written |
| 3 | Employee and department APIs | CRUD, search, filter, pagination, validation | Code written |
| 4 | Dashboard API | Aggregated stats endpoint | Code written |
| 5 | Frontend foundation | Vite + React + Tailwind, routing, layout, Auth context, Axios | Code written |
| 6 | Frontend features | Login/Register, employee list and forms, My Profile, admin dashboard with charts | Code written |
| 7 | Integration and polish | Responsive pass, error and loading states, route guards | Partly (responsive layouts, loading/error states, route guards written; not browser-tested) |
| 8 | Testing and deployment | API tests (Jest + Supertest), manual QA, deploy to Atlas / Render / Vercel | Tests and deploy configs written; tests not yet run, not deployed |

## Definition of Done (per feature)
Works on mobile and desktop · validated on client and server · protected by correct role · errors handled · documented.

## Future Enhancements
Profile photos, password reset by email, audit log, leave and attendance, CSV export, manager role.
