# 2. Main Modules

## Backend Modules
| # | Module | Responsibility |
|---|--------|----------------|
| B1 | **Auth** | Register, login, current-user endpoint, password hashing, JWT creation |
| B2 | **User** | User account model, role management |
| B3 | **Employee** | CRUD, search, filter, sort, pagination, soft delete |
| B4 | **Department** | Department list used by employee forms and dashboard grouping |
| B5 | **Dashboard / Stats** | Aggregation queries for the admin dashboard |
| B6 | **Middleware** | `authenticate` (verify JWT), `authorize(...roles)`, validation, error handler, rate limiter |
| B7 | **Config / Utils** | DB connection, env loading, async wrapper, API error class, seed script |

## Frontend Modules
| # | Module | Responsibility |
|---|--------|----------------|
| F1 | **Auth pages** | Login and Register forms with validation |
| F2 | **Auth context** | Stores user and token, exposes `login`, `logout`, `isAdmin` |
| F3 | **Route protection** | `ProtectedRoute` and `RoleRoute` components |
| F4 | **Layout** | Responsive navbar, sidebar, page container |
| F5 | **Admin dashboard** | Stat cards, charts, recent employees |
| F6 | **Employee management** | List with search, filter, pagination; add/edit form; detail view; delete confirmation |
| F7 | **My Profile** | Employee views and edits own limited profile |
| F8 | **Shared UI** | Button, Input, Modal, Table, Pagination, Toast, Spinner, EmptyState |
| F9 | **API service layer** | Axios instance with token interceptor and 401 handling |

## Module Interaction (summary)
```
F1 → F2 → F9 → B1 → B2
F5 → F9 → B5 → B3, B4
F6 → F9 → B3 (guarded by B6)
F7 → F9 → B3 (own record only)
```
