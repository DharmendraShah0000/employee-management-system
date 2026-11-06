# 1. Requirement Analysis

## 1.1 Project Goal
Build a responsive web application that lets an organisation register employees, authenticate users, manage employee records (CRUD), and give administrators a dashboard with an overview of the workforce. Access to features must depend on the user's role.

## 1.2 Actors
| Actor | Description |
|-------|-------------|
| **Visitor** | Not logged in. Can register or log in. |
| **Employee** | Authenticated standard user. Can view and edit limited fields of their own profile. |
| **Admin** | Authenticated privileged user. Full control over employee records, users, and the dashboard. |

## 1.3 Requirement Breakdown

### R1. Responsive Employee Management System
- UI works on mobile (≥360px), tablet, and desktop.
- Tables collapse into cards or scroll horizontally on small screens.
- Navigation becomes a collapsible sidebar / hamburger menu on mobile.

### R2. Employee Registration and Login
- Registration form: name, email, password, confirm password.
- Login with email and password; server returns a JWT.
- Client-side and server-side validation (email format, password strength, unique email).
- Logout clears the client session.
- Self-registered users receive the `employee` role. Admin accounts are created only by a seed script or by an existing admin (prevents privilege escalation).

### R3. CRUD Operations for Employee Records
| Operation | Rule |
|-----------|------|
| Create | Admin only |
| Read (list) | Admin only; with search, filter, sort, pagination |
| Read (one) | Admin: any record. Employee: own record only |
| Update | Admin: all fields. Employee: limited fields (phone, address) on own record |
| Delete | Admin only (soft delete recommended: `status = inactive`) |

### R4. Admin Dashboard
- Summary cards: total employees, active, inactive, new this month.
- Charts: employees per department, hires over time.
- Recent activity: latest added employees.
- Quick links to add or manage employees.

### R5. Authentication and Authorization
- Authentication: JWT issued at login, sent as `Authorization: Bearer <token>`.
- Passwords hashed with bcrypt.
- Authorization: role-based access control (RBAC) in backend middleware and in frontend route guards.
- Token expiry handled gracefully (redirect to login).

### R6. Frontend, Backend, and Database Integration
- React talks to the Express REST API through a central Axios instance.
- Express persists data in MongoDB through Mongoose.
- Environment-based configuration for URLs and secrets.
- Consistent JSON response and error format.

## 1.4 Non-Functional Requirements
| Category | Requirement |
|----------|-------------|
| Security | bcrypt hashing, JWT secret in env, input validation, rate limiting on auth routes, Helmet, CORS whitelist, no sensitive fields in responses |
| Performance | Server-side pagination, indexed fields (email, employeeId, department) |
| Usability | Clear form errors, loading and empty states, toast notifications, confirmation before delete |
| Maintainability | Layered backend (routes → controllers → services → models), reusable React components |
| Reliability | Centralised error handler, validation before DB writes |
| Compatibility | Latest Chrome, Firefox, Safari, Edge |

## 1.5 Key User Stories
1. As a visitor, I can register an account so I can access the system.
2. As a user, I can log in and stay logged in until my token expires.
3. As an admin, I can add a new employee with their job details.
4. As an admin, I can search, filter, edit, and deactivate employees.
5. As an admin, I can see workforce statistics on a dashboard.
6. As an employee, I can view my own profile and update my contact details.
7. As any user, I am blocked from pages and API calls my role does not allow.

## 1.6 Assumptions (please confirm)
- Two roles are enough for this version: `admin` and `employee`. (A `manager`/`hr` role can be added later.)
- A user account and an employee record are linked one-to-one.
- Deleting an employee is a soft delete so history is preserved.
- No file upload (profile photos) in the first version; listed as a future enhancement.
- Single organisation (no multi-tenancy).

## 1.7 Out of Scope (for now)
Payroll, attendance, leave management, email verification, password reset by email, profile photo upload, audit logs. Listed as future enhancements.

## 1.8 Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| Privilege escalation through registration | Role is never accepted from the registration payload |
| JWT stored in localStorage is exposed to XSS | Sanitise input, use short expiry, consider httpOnly cookie as upgrade |
| Large employee lists slow the UI | Pagination and indexes |
| Inconsistent validation between client and server | Server is the source of truth; client validation is for UX |
