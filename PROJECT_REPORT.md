# Project Report: Employee Management System

## 1. Overview
A responsive MERN-stack Employee Management System with registration and login, JWT authentication, role-based authorization (admin / employee), employee CRUD, department management, and an admin dashboard.

**Honest status in one line:** all planned code is written and syntax-checked, but it has **not been executed, tested or deployed** by its author, because the build environment had no internet access (see sections 3 and 4).

## 2. Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend framework | React 18 with Vite | Single-page application and fast dev/build tooling |
| Routing | React Router 6 | Public, protected and role-restricted routes |
| Styling | Tailwind CSS 3 | Responsive, utility-first styling |
| HTTP client | Axios | Central instance with token interceptor and 401 handling |
| UI feedback | react-hot-toast | Success and error notifications |
| Charts | Recharts | Dashboard bar and line charts |
| Backend runtime | Node.js 20 + Express 4 | REST API |
| Database | MongoDB with Mongoose 8 | Users, employees, departments, ID counter |
| Authentication | JSON Web Tokens (jsonwebtoken) + bcryptjs | Stateless login, password hashing |
| Validation | express-validator | Server-side input validation |
| Security | Helmet, CORS whitelist, express-rate-limit, input sanitiser | Headers, origin control, brute-force limiting, `$`-operator stripping |
| Testing | Jest, Supertest, mongodb-memory-server | 21 API tests written (auth, RBAC, CRUD, departments, dashboard) |
| DevOps | Docker, docker-compose, Nginx, GitHub Actions, Render and Vercel configs | Containerisation, CI, deployment |

### Key features (code written)
- Registration (role always forced to `employee`) and login, with a generic "Invalid credentials" message
- JWT middleware, `authorize('admin')` role middleware, and frontend route guards
- Employee CRUD with auto-generated IDs (`EMP-0001`), search, department and status filters, sorting, pagination
- Employees can view their own record and edit only `phone` and `address`; admins can edit all fields
- Soft delete: record kept as `inactive` and the linked login account is blocked
- Department CRUD (a department in use cannot be deleted)
- Admin dashboard: totals, employees per department, hires over the last 6 months, recently added
- Responsive layout: sidebar drawer on mobile, table on desktop and cards on mobile

## 3. Challenges Faced During Development

### Real challenges in this build
1. **No network access in the build environment.** Packages could not be installed, so the server could not be started, the 21 tests could not be run, the frontend could not be built or opened in a browser, and nothing could be deployed. *How it was handled:* every backend file was checked with `node --check`, every frontend file was parsed with esbuild, and tests, Docker files and a CI workflow were written so the full verification can be done with one command on a normal machine.
2. **A scaffolding bug in the first zip.** The initial folder skeleton was created with shell brace expansion that did not run, producing folders literally named like `{config,controllers,...}`. It was caught by listing the zip contents and fixed before the final delivery.

### Design challenges solved in the code
| Challenge | Solution |
|-----------|----------|
| Users registering themselves as admin | Role is never read from the request; admins come only from the seed script |
| Unique, sequential employee IDs under concurrent requests | Atomic counter collection (`findOneAndUpdate` with `$inc`) |
| Keeping the User and Employee records consistent | Linked one-to-one; if user creation fails, the new employee record is deleted (manual rollback, since standalone MongoDB has no transactions) |
| Employees must not edit salary, department or status | Field whitelist per role in the service layer, not just in the UI |
| Deactivated employees still holding valid tokens | `authenticate` re-loads the user on every request and rejects inactive accounts |
| `/employees/me` colliding with `/employees/:id` | Route declared before the `:id` route |
| Regex injection in search | User input escaped before building the regex |
| Tables unreadable on phones | Card layout below the `md` breakpoint |

### Known limitations
- Token is stored in `localStorage` (exposed to XSS); no refresh tokens
- No email verification or password reset; no UI to change a password or promote a user to admin
- No profile photos, audit log, leave or attendance
- The NoSQL sanitiser is basic; no automated frontend tests
- Rollback on partial failure is manual, not transactional

## 4. Deployment Status

| Question | Answer |
|----------|--------|
| Deployed to the internet? | **No.** |
| Running locally? | **No, not run by the author.** No server was started in the build environment. |
| Is it ready to run? | Yes, on a machine with Node 18+ and MongoDB: `npm install`, `npm run seed:admin`, `npm run dev` in each folder (full steps in `docs/06-deployment.md`). |
| Deployment assets included | `docker-compose.yml`, Dockerfiles, `nginx.conf`, `render.yaml`, `frontend/vercel.json`, `.github/workflows/ci.yml` |

### Verification actually performed
| Check | Result |
|-------|--------|
| Backend syntax (`node --check`, all source and test files) | Passed |
| Frontend syntax (esbuild parse, all `.js` / `.jsx` files) | Passed |
| `npm install` | **Not run** (no network) |
| Backend tests (21) | **Not run** |
| Frontend build (`vite build`) | **Not run** |
| Manual test in a browser | **Not done** |
| Docker build | **Not run** |
| Cloud deployment | **Not done** |

### Before you submit or present this
Run `npm test` in `backend/` and `npm run build` in `frontend/`, start both servers and click through the main flows. If anything fails, send me the error and I will fix it. After that, update this section with your real results (deployed URL, or "running locally").
